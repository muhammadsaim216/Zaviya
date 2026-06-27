/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  runTransaction, 
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

// ==========================================
// 1. RELATIONAL DATABASE SCHEMA DEFINITIONS
// ==========================================

export interface Category {
  id: string; // Primary Key
  name: string;
  displayOrder: number;
}

export interface MenuItemRelational {
  id: string; // Primary Key
  categoryId: string; // Foreign Key pointing to Category.id
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image?: string; // Optional UI reference
  signature?: boolean; // Optional visual cue
}

export interface Profile {
  uid: string; // Primary Key (matching Firebase Auth UID)
  name: string;
  phone: string;
  savedAddresses: string[];
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string; // Foreign Key pointing to MenuItemRelational.id
  quantity: number;
  notes?: string;
}

export interface OrderRelational {
  id: string; // Primary Key
  userId: string; // Foreign Key pointing to Profile.uid (or 'guest' for unauthenticated)
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: 'cod' | 'card';
  createdAt: string;
}

export interface ReservationRelational {
  id: string; // Primary Key
  userId: string; // Foreign Key pointing to Profile.uid (or 'guest')
  guestName: string;
  guestCount: number;
  dateTime: string; // Combined ISO Date-Time
  specialRequests: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
}

export interface Inquiry {
  id: string; // Primary Key
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

// ==========================================
// 2. DATA ACCESS & MUTATION LAYER (CRUD)
// ==========================================

/**
 * A. MENU & CATEGORIES APIS (Read-Only Queries)
 */

export async function fetchCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'categories');
    return [];
  }
}

export async function fetchAvailableMenuItemsByCategoryId(categoryId: string): Promise<MenuItemRelational[]> {
  try {
    const q = query(
      collection(db, 'menu_items'), 
      where('categoryId', '==', categoryId),
      where('isAvailable', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MenuItemRelational));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `menu_items?categoryId=${categoryId}`);
    return [];
  }
}

/**
 * B. GUEST PROFILE APIS (Full CRUD)
 */

export async function getProfile(uid: string): Promise<Profile | null> {
  try {
    const docRef = doc(db, 'profiles', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `profiles/${uid}`);
    return null;
  }
}

export async function createProfile(uid: string, profile: Omit<Profile, 'uid' | 'createdAt'>): Promise<Profile> {
  const newProfile: Profile = {
    uid,
    ...profile,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'profiles', uid), newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `profiles/${uid}`);
    throw error;
  }
}

export async function updateProfileDetails(uid: string, name: string, phone: string): Promise<void> {
  try {
    const docRef = doc(db, 'profiles', uid);
    await updateDoc(docRef, { name, phone });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `profiles/${uid}`);
  }
}

export async function addSavedAddress(uid: string, address: string): Promise<void> {
  try {
    const docRef = doc(db, 'profiles', uid);
    await updateDoc(docRef, {
      savedAddresses: arrayUnion(address)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `profiles/${uid}/savedAddresses`);
  }
}

export async function removeSavedAddress(uid: string, address: string): Promise<void> {
  try {
    const docRef = doc(db, 'profiles', uid);
    await updateDoc(docRef, {
      savedAddresses: arrayRemove(address)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `profiles/${uid}/savedAddresses`);
  }
}

/**
 * C. CHECKOUT & ORDERING (Atomic Transaction)
 */

export async function placeOrderRelational(
  userId: string,
  items: OrderItem[],
  deliveryAddress: string,
  paymentMethod: 'cod' | 'card'
): Promise<string> {
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const orderRef = doc(db, 'orders', orderId);

  try {
    // Run an atomic transaction to read available items, compute real prices, read address if needed, and write order.
    await runTransaction(db, async (transaction) => {
      let computedTotal = 0;

      // 1. Double check and compute prices directly from menu_items source of truth
      for (const item of items) {
        const itemRef = doc(db, 'menu_items', item.menuItemId);
        const itemSnap = await transaction.get(itemRef);
        
        if (!itemSnap.exists()) {
          throw new Error(`Menu item with ID ${item.menuItemId} does not exist.`);
        }
        
        const itemData = itemSnap.data() as MenuItemRelational;
        if (!itemData.isAvailable) {
          throw new Error(`Menu item '${itemData.name}' is currently unavailable.`);
        }
        
        computedTotal += itemData.price * item.quantity;
      }

      // Add a small 10% premium luxury tax + flat delivery fee (e.g. 350 PKR)
      const tax = Math.round(computedTotal * 0.10);
      const deliveryFee = 350;
      const finalTotal = computedTotal + tax + deliveryFee;

      // 2. Assemble relational order payload
      const relationalOrder: OrderRelational = {
        id: orderId,
        userId,
        items,
        total: finalTotal,
        status: 'pending',
        deliveryAddress,
        paymentMethod,
        createdAt: new Date().toISOString()
      };

      // 3. Write Order document atomically
      transaction.set(orderRef, relationalOrder);
    });

    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    throw error;
  }
}

/**
 * D. RESERVATIONS & INQUIRIES PAGES (Create/Write)
 */

export async function createReservationRelational(
  userId: string,
  guestName: string,
  guestCount: number,
  dateTime: string,
  specialRequests: string
): Promise<string> {
  const reservationId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
  const reservation: ReservationRelational = {
    id: reservationId,
    userId,
    guestName,
    guestCount,
    dateTime,
    specialRequests,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'reservations', reservationId), reservation);
    return reservationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `reservations/${reservationId}`);
    throw error;
  }
}

export async function createInquiry(
  name: string,
  email: string,
  message: string
): Promise<string> {
  const id = 'INQ-' + Math.floor(10000 + Math.random() * 90000);
  const inquiry: Inquiry = {
    id,
    name,
    email,
    message,
    status: 'unread',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'inquiries', id), inquiry);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
    throw error;
  }
}

/**
 * E. MANAGER ADMIN DASHBOARD CRUD & LIVE MONITORS
 */

// Categories Management
export async function addCategory(category: Category): Promise<void> {
  try {
    await setDoc(doc(db, 'categories', category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `categories/${category.id}`);
  }
}

export async function updateCategory(category: Category): Promise<void> {
  try {
    await updateDoc(doc(db, 'categories', category.id), {
      name: category.name,
      displayOrder: category.displayOrder
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `categories/${category.id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
  }
}

// Menu Items Management
export async function addMenuItemRelational(item: MenuItemRelational): Promise<void> {
  try {
    await setDoc(doc(db, 'menu_items', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `menu_items/${item.id}`);
  }
}

export async function updateMenuItemRelational(item: MenuItemRelational): Promise<void> {
  try {
    await setDoc(doc(db, 'menu_items', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `menu_items/${item.id}`);
  }
}

export async function deleteMenuItemRelational(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'menu_items', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `menu_items/${id}`);
  }
}

// Live Status Mutations
export async function updateOrderStatusRelational(orderId: string, status: OrderRelational['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
  }
}

export async function updateReservationStatusRelational(resId: string, status: ReservationRelational['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'reservations', resId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `reservations/${resId}`);
  }
}

export async function resolveInquiry(id: string, status: Inquiry['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'inquiries', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
  }
}


// ==========================================
// 3. REACT HOOKS FOR REAL-TIME PAGE BINDINGS
// ==========================================

/**
 * Hook for: A. MENU PAGE & CATEGORIES (Read-Only)
 */
export function useMenuAndCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRelational[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Subscribe to categories
    const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder', 'asc'));
    const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(cats);
    }, (err) => {
      console.error("Categories subscription failed: ", err);
      setError(err.message);
    });

    // 2. Subscribe to available menu items
    const itemsQuery = query(collection(db, 'menu_items'), where('isAvailable', '==', true));
    const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
      const items: MenuItemRelational[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItemRelational);
      });
      setMenuItems(items);
      setLoading(false);
    }, (err) => {
      console.error("Menu items subscription failed: ", err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubCategories();
      unsubItems();
    };
  }, []);

  // Helper to group available items by categoryId
  const getGroupedItems = useCallback(() => {
    const groups: { [categoryId: string]: MenuItemRelational[] } = {};
    categories.forEach(cat => {
      groups[cat.id] = menuItems.filter(item => item.categoryId === cat.id);
    });
    return groups;
  }, [categories, menuItems]);

  return { categories, menuItems, groupedItems: getGroupedItems(), loading, error };
}

/**
 * Hook for: B. GUEST PROFILE PAGE (Full CRUD)
 */
export function useUserProfileRelational(uid: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }
    
    setLoading(true);
    // Real-time listener for user profile document
    const unsub = onSnapshot(doc(db, 'profiles', uid), async (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as Profile);
        setLoading(false);
      } else {
        // Document does not exist, initialize it!
        try {
          const initialData: Omit<Profile, 'uid' | 'createdAt'> = {
            name: auth.currentUser?.displayName || 'Honored Guest',
            phone: '',
            savedAddresses: []
          };
          const created = await createProfile(uid, initialData);
          setProfile(created);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }, (err) => {
      console.error("Profile subscription failed: ", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const updateProfile = async (name: string, phone: string) => {
    if (!uid) return;
    try {
      setError(null);
      await updateProfileDetails(uid, name, phone);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const pushAddress = async (address: string) => {
    if (!uid) return;
    try {
      setError(null);
      await addSavedAddress(uid, address);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeAddress = async (address: string) => {
    if (!uid) return;
    try {
      setError(null);
      await removeSavedAddress(uid, address);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile, pushAddress, removeAddress };
}

/**
 * Hook for: C. CHECKOUT & ORDERING (Create/Write)
 */
export function useCheckoutAndOrdering() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (
    userId: string,
    items: OrderItem[],
    deliveryAddress: string,
    paymentMethod: 'cod' | 'card'
  ): Promise<string> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const orderId = await placeOrderRelational(userId, items, deliveryAddress, paymentMethod);
      setIsSubmitting(false);
      return orderId;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      throw err;
    }
  };

  return { checkout, isSubmitting, error };
}

/**
 * Hook for: D. RESERVATIONS & INQUIRIES PAGES (Create/Write)
 */
export function useReservationsAndInquiries() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookTable = async (
    userId: string,
    guestName: string,
    guestCount: number,
    dateTime: string,
    specialRequests: string
  ): Promise<string> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const resId = await createReservationRelational(userId, guestName, guestCount, dateTime, specialRequests);
      setIsSubmitting(false);
      return resId;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      throw err;
    }
  };

  const submitInquiry = async (
    name: string,
    email: string,
    message: string
  ): Promise<string> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const inquiryId = await createInquiry(name, email, message);
      setIsSubmitting(false);
      return inquiryId;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      throw err;
    }
  };

  return { bookTable, submitInquiry, isSubmitting, error };
}

/**
 * Hook for: E. MANAGER ADMIN DASHBOARD (Complete Master Control)
 */
export function useAdminControl() {
  const [orders, setOrders] = useState<OrderRelational[]>([]);
  const [reservations, setReservations] = useState<ReservationRelational[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemRelational[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Live Orders snapstream sorted by date
    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const ords: OrderRelational[] = [];
        snapshot.forEach(doc => {
          ords.push({ id: doc.id, ...doc.data() } as OrderRelational);
        });
        setOrders(ords);
      },
      (err) => console.error("Admin order stream failed: ", err)
    );

    // 2. Live Reservations snapstream
    const unsubReservations = onSnapshot(
      query(collection(db, 'reservations'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const res: ReservationRelational[] = [];
        snapshot.forEach(doc => {
          res.push({ id: doc.id, ...doc.data() } as ReservationRelational);
        });
        setReservations(res);
      },
      (err) => console.error("Admin reservations stream failed: ", err)
    );

    // 3. Live Inquiries snapstream
    const unsubInquiries = onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const inqs: Inquiry[] = [];
        snapshot.forEach(doc => {
          inqs.push({ id: doc.id, ...doc.data() } as Inquiry);
        });
        setInquiries(inqs);
      },
      (err) => console.error("Admin inquiries stream failed: ", err)
    );

    // 4. Live Categories snapstream
    const unsubCategories = onSnapshot(
      query(collection(db, 'categories'), orderBy('displayOrder', 'asc')),
      (snapshot) => {
        const cats: Category[] = [];
        snapshot.forEach(doc => {
          cats.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(cats);
      },
      (err) => console.error("Admin categories stream failed: ", err)
    );

    // 5. Live Menu Items snapstream
    const unsubItems = onSnapshot(
      collection(db, 'menu_items'),
      (snapshot) => {
        const items: MenuItemRelational[] = [];
        snapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() } as MenuItemRelational);
        });
        setMenuItems(items);
        setLoading(false);
      },
      (err) => {
        console.error("Admin menu_items stream failed: ", err);
        setLoading(false);
      }
    );

    return () => {
      unsubOrders();
      unsubReservations();
      unsubInquiries();
      unsubCategories();
      unsubItems();
    };
  }, []);

  // Category mutations
  const handleAddCategory = async (cat: Category) => {
    await addCategory(cat);
  };
  const handleUpdateCategory = async (cat: Category) => {
    await updateCategory(cat);
  };
  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
  };

  // Menu item mutations
  const handleAddMenuItem = async (item: MenuItemRelational) => {
    await addMenuItemRelational(item);
  };
  const handleUpdateMenuItem = async (item: MenuItemRelational) => {
    await updateMenuItemRelational(item);
  };
  const handleDeleteMenuItem = async (id: string) => {
    await deleteMenuItemRelational(id);
  };

  // Status transitions
  const changeOrderStatus = async (orderId: string, status: OrderRelational['status']) => {
    await updateOrderStatusRelational(orderId, status);
  };
  const changeReservationStatus = async (resId: string, status: ReservationRelational['status']) => {
    await updateReservationStatusRelational(resId, status);
  };
  const markInquiryResolved = async (inqId: string, status: Inquiry['status']) => {
    await resolveInquiry(inqId, status);
  };

  return {
    orders,
    reservations,
    inquiries,
    categories,
    menuItems,
    loading,
    error,
    // CRUD Functions
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    changeOrderStatus,
    changeReservationStatus,
    markInquiryResolved
  };
}

// Seeding helper to pre-populate relational collections if empty
export async function seedRelationalDatabaseIfEmpty() {
  try {
    // 1. Seed Categories
    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty) {
      console.log('Seeding relational categories...');
      const batch = writeBatch(db);
      const defaultCategories: Category[] = [
        { id: 'cat-1', name: 'Gastronomy', displayOrder: 1 },
        { id: 'cat-2', name: 'Shinwari', displayOrder: 2 },
        { id: 'cat-3', name: 'BBQ', displayOrder: 3 },
        { id: 'cat-4', name: 'International', displayOrder: 4 },
        { id: 'cat-5', name: 'Patisserie', displayOrder: 5 }
      ];
      for (const cat of defaultCategories) {
        batch.set(doc(db, 'categories', cat.id), cat);
      }
      await batch.commit();
    }

    // 2. Seed Menu Items
    const menuSnap = await getDocs(collection(db, 'menu_items'));
    if (menuSnap.empty) {
      console.log('Seeding relational menu items...');
      const batch = writeBatch(db);
      const defaultItems: MenuItemRelational[] = [
        {
          id: 'heritage-platter',
          categoryId: 'cat-1',
          name: 'The Heritage Club Platter',
          description: 'A delicious platter of four fresh club sandwiches, layered with tender charcoal-grilled chicken breast, fresh lettuce, and our special garlic mayo, served with crispy french fries.',
          price: 7800,
          isAvailable: true,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu2LV7OtGMooVHXa7iJwvrUkB_XM886Dtk4jiwD775aYOLx1mTqRSAlnlDacAwlOnFC-A3252mVZITNIbeJ2j3Jrf6G60IwnafXqRUAyNloGSDFsq-eVwPGiOnnLwXmBsAs6zyJQjweX5Nvl5Um8xNjIDypVtHER4LW5damVHWKmfnqYTbtvK_UdBr3OwIH-S1w73s7EAZiSZmaV67RPpLDib2dlUQDybhW9OYRtkyWkrj23MQD8GGNSjD1Rtyb2fqDoRJCRfr42w',
          signature: true
        },
        {
          id: 'saffron-rice',
          categoryId: 'cat-1',
          name: 'Imperial Saffron Rice',
          description: 'Fragrant long-grain basmati tossed with fire-roasted chicken chunks and local scallions.',
          price: 5100,
          isAvailable: true,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqv0xphv18nn8xsemRrSkt3DtNBT0gs_qZR9hyxUvVy8_BdYYKrm6O0AfEm-h5zAWjUAAnH98f9dLxpFxUZz3gwa9qnG4xXkUCxHa8bmjCVfNqdYtBAJhkZqG5TXQlnT_ScfdvHt8VNqORzVzcW1M3Kqd1m6nocqEs05OxOpojM-M7W_qr0xvJaJndO1zGdbU1X4ZUTdBYYaRGojF7ZpINFXkEY0EgxuQQ88fOUrFe5g2sMhL4Sl4aPEDtfV8s39dFXAZMDDRDAPA'
        },
        {
          id: 'lamb-karahi',
          categoryId: 'cat-2',
          name: 'Shinwari Lamb Karahi',
          description: 'Slow-cooked in a traditional iron wok with ginger, black pepper, and fresh tomatoes. Classic Shinwari style.',
          price: 9500,
          isAvailable: true
        },
        {
          id: 'ganache-sphere',
          categoryId: 'cat-5',
          name: 'Noir Ganache Sphere',
          description: '70% dark cocoa with gold leaf.',
          price: 3300,
          isAvailable: true,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD43ICgbfLXY5CjOJD-9XgaVUYEZyGp2JR5gY3gZsAhyH347NjrLu1tRsHJ-eOS594Kl63IPv9ByZzgmCOxUWIoh-sPrALOmouHrsS6x0vFghRa84I6CaJBwr7nVdLCwuy89oPsjxSbdVbQTfZYvCu7Ks2E4xyzOx73IbH-Sl6q0Q8foL19qXM1Q43_LvLR--vwAMf-SIc8D-j6bKFEvILJHQEpKjmCYoUOlJI7SpTDVmDMeHgHkK0xNkXWemQJ__YRhLzk-zawCw4'
        },
        {
          id: 'smoked-sizzler',
          categoryId: 'cat-3',
          name: 'Smoked Sizzler',
          description: 'Infused with applewood and wild peppers, cooked slowly on open flame.',
          price: 7200,
          isAvailable: true
        },
        {
          id: 'fire-tikka',
          categoryId: 'cat-3',
          name: 'Fire-Kissed Tikka',
          description: 'A close-up of a sizzling plate of chicken tikka, with vibrant bell peppers and onions charred to perfection.',
          price: 6700,
          isAvailable: true,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTo_Uz6Z3um866-5XRuE1gSIJHjL4PWB4jueajldE9rt14C84y9cwQZHIS_Epn8xWYOxkj1_a_U_GsWaVuKsBQFDEh47h7WwTZAoGKQBg6hDc0KMcpH2_Ix-R0Y9tE065a9VQGHwq0Smna_o2xC0Crt9cSlw7ma3Yi0rOuYNlsx0w8Pfml7CKNJ4YpRjlzO7CM9SvnBtJqgKC7iHmAYJkaBQdsg7OAkZIie3Y_rwJKLyxuOOxCDw5jRKXAne1_6JfrE3xi_yzL5GM'
        },
        {
          id: 'royal-platter',
          categoryId: 'cat-4',
          name: 'The Royal Platter',
          description: 'A large premium platter featuring seven of our signature grilled meats served with aromatic rice.',
          price: 23600,
          isAvailable: true,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QIkaeQt1Gbihrs7YirBU1B41INQM2yc2QPxuRiP5Fvt4iAcmjZksUoLTMMvh-wmMkHou7fHTu0qoNbYjPt1xfIQttnS2gbo3432QwVvdRrrmexgqMV4JL1GU5lmgx4nqzR4kN3OeGXlnGXX_KBge93Yrw2T8jRuMsQN0nCY8xN8YVtf_iHMjGQb1i3ujggwWxzsUMSVEo8R67p4hTqfcSNBJCqXfFt1gHhNK_HTzkYflLWGfVtf20hxmvDTk0TSnDM_tQTYxmNo'
        },
        {
          id: 'truffle-ribeye',
          categoryId: 'cat-4',
          name: 'Truffle Wagyu Ribeye',
          description: 'Pan-seared premium Wagyu beef glazed with rich truffle butter and premium sea salt.',
          price: 20000,
          isAvailable: true
        }
      ];
      for (const item of defaultItems) {
        batch.set(doc(db, 'menu_items', item.id), item);
      }
      await batch.commit();
    }
  } catch (error) {
    console.error('Failed to seed relational collections:', error);
  }
}

// Automatically run seed relational database
seedRelationalDatabaseIfEmpty();

