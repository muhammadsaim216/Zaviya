/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  query,
  orderBy,
  where,
  Firestore,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { MenuItem, VenueSpace, Reservation, Order, ContactMessage, UserProfile, KitchenCabinetMember } from '../types';
import { MENU_ITEMS, VENUE_SPACES } from '../data';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId from config
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { db };

// --- Error Handling as per Skill requirements ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot to validate
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// --- Auth Methods ---
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Email sign-up failed:', error);
    throw error;
  }
}

export async function logInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email login failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out failed:', error);
    throw error;
  }
}

// --- User Profile API ---
export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const docRef = doc(db, 'profiles', uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `profiles/${uid}`);
  });
}

export async function updateUserProfileInDb(uid: string, profile: UserProfile) {
  const docRef = doc(db, 'profiles', uid);
  try {
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `profiles/${uid}`);
  }
}

// Seeding helper to pre-populate database if it is empty
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Menu Items
    const menuSnap = await getDocs(collection(db, 'menu_items'));
    const containsDefault = !menuSnap.empty && menuSnap.docs.some(d => d.id === 'heritage-platter');
    if (menuSnap.empty || containsDefault) {
      console.log('Resetting/seeding menu_items with placeholder...');
      const batch = writeBatch(db);
      
      // Delete old default ones if they exist
      if (containsDefault) {
        menuSnap.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
      }
      
      const placeholderItem: MenuItem = {
        id: 'placeholder-item',
        title: 'Premium Culinary Offering (Placeholder)',
        description: 'No custom menu items have been added by the kitchen administration yet. Log in to the Cabinet to add your official menu items.',
        price: 'Rs. 0',
        category: 'Gastronomy',
        signature: true
      };
      
      batch.set(doc(db, 'menu_items', placeholderItem.id), placeholderItem);
      await batch.commit();
    }

    // 2. Seed Venue Spaces
    const venueSnap = await getDocs(collection(db, 'venue_spaces'));
    if (venueSnap.empty) {
      console.log('Seeding venue_spaces to Firestore...');
      const batch = writeBatch(db);
      for (const space of VENUE_SPACES) {
        const docRef = doc(db, 'venue_spaces', space.id);
        batch.set(docRef, space);
      }
      await batch.commit();
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

// --- Menu Items API ---
export function subscribeToMenuItems(callback: (items: MenuItem[]) => void) {
  const q = query(collection(db, 'menu_items'));
  return onSnapshot(q, (snapshot) => {
    const items: MenuItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(items);
  });
}

export async function addMenuItemInDb(item: MenuItem) {
  const docRef = doc(db, 'menu_items', item.id);
  await setDoc(docRef, item);
}

export async function updateMenuItemInDb(item: MenuItem) {
  const docRef = doc(db, 'menu_items', item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function deleteMenuItemFromDb(id: string) {
  const docRef = doc(db, 'menu_items', id);
  await deleteDoc(docRef);
}

// --- Venue Spaces API ---
export function subscribeToVenueSpaces(callback: (spaces: VenueSpace[]) => void) {
  const q = query(collection(db, 'venue_spaces'));
  return onSnapshot(q, (snapshot) => {
    const spaces: VenueSpace[] = [];
    snapshot.forEach((doc) => {
      spaces.push({ id: doc.id, ...doc.data() } as VenueSpace);
    });
    callback(spaces);
  });
}

export async function addVenueSpaceInDb(space: VenueSpace) {
  const docRef = doc(db, 'venue_spaces', space.id);
  await setDoc(docRef, space);
}

// --- Reservations API ---
export function subscribeToReservations(callback: (reservations: Reservation[]) => void) {
  const q = query(collection(db, 'reserve'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reservations: Reservation[] = [];
    snapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() } as Reservation);
    });
    callback(reservations);
  }, (err) => {
    // If the index isn't ready or sorting fails, fall back to unsorted
    console.warn('Sorted query failed, falling back to unsorted reservations subscription', err);
    return onSnapshot(collection(db, 'reserve'), (snapshot) => {
      const reservations: Reservation[] = [];
      snapshot.forEach((doc) => {
        reservations.push({ id: doc.id, ...doc.data() } as Reservation);
      });
      // Sort in-memory as a fallback
      reservations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      callback(reservations);
    });
  });
}

export async function addReservationInDb(reservation: Reservation) {
  const docRef = doc(db, 'reserve', reservation.id);
  await setDoc(docRef, reservation);
}

export async function updateReservationStatusInDb(id: string, status: Reservation['status']) {
  const docRef = doc(db, 'reserve', id);
  await updateDoc(docRef, { status });
}

export async function deleteReservationFromDb(id: string) {
  const docRef = doc(db, 'reserve', id);
  await deleteDoc(docRef);
}

// --- Orders API ---
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    callback(orders);
  }, (err) => {
    console.warn('Sorted orders query failed, falling back to unsorted subscription', err);
    return onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      callback(orders);
    });
  });
}

export function subscribeToUserOrders(email: string, callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), where('customerEmail', '==', email));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    callback(orders);
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'orders');
  });
}

export function subscribeToSingleOrder(orderId: string, callback: (order: Order | null) => void) {
  const docRef = doc(db, 'orders', orderId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Order);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `orders/${orderId}`);
  });
}

export async function addOrderInDb(order: Order) {
  const docRef = doc(db, 'orders', order.id);
  await setDoc(docRef, order);
}

export async function updateOrderStatusInDb(id: string, status: Order['status']) {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status });
}

export async function deleteOrderFromDb(id: string) {
  const docRef = doc(db, 'orders', id);
  await deleteDoc(docRef);
}

// --- Contact Messages (Inquiries) API ---
export function subscribeToContactMessages(callback: (messages: ContactMessage[]) => void) {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages: ContactMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
    });
    callback(messages);
  }, (err) => {
    console.warn('Sorted inquiries query failed, falling back to unsorted subscription', err);
    return onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const messages: ContactMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      callback(messages);
    });
  });
}

export async function addContactMessageInDb(message: ContactMessage) {
  const docRef = doc(db, 'inquiries', message.id);
  await setDoc(docRef, message);
}

export async function replyToContactMessageInDb(id: string, replyText: string) {
  const docRef = doc(db, 'inquiries', id);
  await updateDoc(docRef, {
    replied: true,
    replyText
  });
}

export async function deleteContactMessageFromDb(id: string) {
  const docRef = doc(db, 'inquiries', id);
  await deleteDoc(docRef);
}

// --- Kitchen Cabinet (Admin Collection) API ---
export function subscribeToKitchenCabinet(callback: (members: KitchenCabinetMember[]) => void) {
  const q = query(collection(db, 'kitchen_cabinet'), orderBy('addedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const members: KitchenCabinetMember[] = [];
    snapshot.forEach((doc) => {
      members.push({ uid: doc.id, ...doc.data() } as KitchenCabinetMember);
    });
    callback(members);
  }, (err) => {
    console.warn('Sorted kitchen_cabinet query failed, falling back to unsorted', err);
    return onSnapshot(collection(db, 'kitchen_cabinet'), (snapshot) => {
      const members: KitchenCabinetMember[] = [];
      snapshot.forEach((doc) => {
        members.push({ uid: doc.id, ...doc.data() } as KitchenCabinetMember);
      });
      callback(members);
    });
  });
}

export async function addKitchenCabinetMemberInDb(member: KitchenCabinetMember) {
  const docRef = doc(db, 'kitchen_cabinet', member.uid);
  await setDoc(docRef, member);
}

export async function deleteKitchenCabinetMemberFromDb(uid: string) {
  const docRef = doc(db, 'kitchen_cabinet', uid);
  await deleteDoc(docRef);
}

