/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, ReservationState, Reservation, MenuItem, VenueSpace, ContactMessage, CartItem, UserProfile, Order, KitchenCabinetMember } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import VenueScreen from './screens/VenueScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import CabinetScreen from './screens/CabinetScreen';
import ContactScreen from './screens/ContactScreen';
import ProfileScreen from './screens/ProfileScreen';
import CartDrawer from './components/CartDrawer';
import ShareModal from './components/ShareModal';
import { MENU_ITEMS, VENUE_SPACES } from './data';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, ShoppingBag, Calendar, Users, Clock, Award } from 'lucide-react';
import {
  auth,
  seedDatabaseIfEmpty,
  subscribeToMenuItems,
  subscribeToVenueSpaces,
  subscribeToReservations,
  subscribeToOrders,
  subscribeToUserOrders,
  subscribeToUserProfile,
  updateUserProfileInDb,
  subscribeToContactMessages,
  addReservationInDb,
  deleteReservationFromDb,
  addMenuItemInDb,
  deleteMenuItemFromDb,
  addVenueSpaceInDb,
  addContactMessageInDb,
  deleteContactMessageFromDb,
  addOrderInDb,
  deleteOrderFromDb,
  subscribeToKitchenCabinet,
  addKitchenCabinetMemberInDb,
  deleteKitchenCabinetMemberFromDb
} from './lib/firebase';

// Seeding realistic starting data for the messages
const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarmad Iqbal',
    email: 'sarmad.iqbal@example.com',
    phone: '+92 321 4567890',
    subject: 'Corporate Booking Inquiry',
    message: 'We are planning an annual corporate dinner for 50 guests in mid-July. Do you offer buffet options for corporate gatherings or are we limited to the preset platters? Please let us know the pricing options.',
    status: 'unread',
    createdAt: '2026-06-25'
  },
  {
    id: 'msg-2',
    name: 'Fatima Malik',
    email: 'fatima.m@example.com',
    phone: '+92 333 9876543',
    subject: 'Outdoor Event Catering',
    message: 'We would love to know if Zaviya offers external catering for a private lawn event in Islamabad. The event will have approximately 80 people. Please share your catering menus.',
    status: 'read',
    createdAt: '2026-06-24'
  }
];

// Seeding realistic starting data for the reservation dashboard
const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    name: 'Bilal Khan',
    email: 'bilal.khan@example.com',
    date: '2026-06-28',
    time: '19:00',
    guests: '4',
    experience: 'chef',
    specialRequests: 'Celebrating our wedding anniversary, please arrange a quiet table with a view of the lawn.',
    status: 'approved',
    createdAt: '2026-06-25',
    ambientLight: 60,
    soundscape: 'Traditional Flute',
    interestedDishes: ['The Royal Platter']
  },
  {
    id: 'res-2',
    name: 'Ayesha Ahmed',
    email: 'ayesha.ahmed@example.com',
    date: '2026-06-29',
    time: '20:30',
    guests: '2',
    experience: 'standard',
    specialRequests: 'Allergic to gluten, please flag this for the kitchen team.',
    status: 'pending',
    createdAt: '2026-06-26',
    ambientLight: 40,
    soundscape: 'Deep Calm',
    interestedDishes: ['Shinwari Lamb Karahi', 'Truffle Wagyu Ribeye']
  },
  {
    id: 'res-3',
    name: 'Zainab Malik',
    email: 'zainab.m@example.com',
    date: '2026-06-30',
    time: '18:30',
    guests: '6',
    experience: 'standard',
    specialRequests: 'Grandmother\'s 80th birthday dinner, requires easy wheelchair access.',
    status: 'approved',
    createdAt: '2026-06-24',
    ambientLight: 50,
    soundscape: 'Traditional Flute',
    interestedDishes: ['The Heritage Club Platter']
  },
  {
    id: 'res-4',
    name: 'Hamza Yusuf',
    email: 'hamza.y@example.com',
    date: '2026-07-01',
    time: '21:00',
    guests: '8',
    experience: 'chef',
    specialRequests: 'VIP guests from overseas, require high privacy seating.',
    status: 'pending',
    createdAt: '2026-06-26',
    ambientLight: 70,
    soundscape: 'Soft Wind',
    interestedDishes: ['The Royal Platter', 'Truffle Wagyu Ribeye']
  },
  {
    id: 'res-5',
    name: 'Maria Farooq',
    email: 'maria.f@example.com',
    date: '2026-06-27',
    time: '19:00',
    guests: '2',
    experience: 'standard',
    specialRequests: 'Window seat if available.',
    status: 'cancelled',
    createdAt: '2026-06-23',
    ambientLight: 30,
    soundscape: 'Deep Calm',
    interestedDishes: []
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [interestedDishes, setInterestedDishes] = useState<string[]>([]);
  
  // Online Ordering & Customer Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zaviya_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zaviya_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Mian Hamza',
      email: 'mian.hamza@example.com',
      phone: '+92 300 1234567',
      streetAddress: 'House 42, Margalla Road, Sector F-6/3',
      city: 'Islamabad',
      postalCode: '44000',
      apartmentSuite: ''
    };
  });

  const [cabinetMembers, setCabinetMembers] = useState<KitchenCabinetMember[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Social Share & Deep Linking States
  const [shareMenuItem, setShareMenuItem] = useState<MenuItem | null>(null);
  const [shareReservation, setShareReservation] = useState<Reservation | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [deepLinkMenuItem, setDeepLinkMenuItem] = useState<MenuItem | null>(null);
  const [deepLinkReservation, setDeepLinkReservation] = useState<Reservation | null>(null);
  const [showDeepLinkSpotlight, setShowDeepLinkSpotlight] = useState(false);
  
  // Sensorial Calibration State
  const [ambientLight, setAmbientLight] = useState<number>(50);
  const [soundscape, setSoundscape] = useState<string>('Traditional Flute');

  // Dynamic entities managed by Admin but available to all pages
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [venueSpaces, setVenueSpaces] = useState<VenueSpace[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zaviya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zaviya_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const isCabinet = !!(currentUser && (
    currentUser.email === 'howsaim216@gmail.com' ||
    cabinetMembers.some(m => m.uid === currentUser.uid || m.email === currentUser.email)
  ));

  // Access control guard: redirect to home if a non-admin tries to access the cabinet
  useEffect(() => {
    if (activePage === 'cabinet' && !isCabinet) {
      setActivePage('home');
    }
  }, [activePage, isCabinet]);

  // Synchronize public Firestore collections
  useEffect(() => {
    let active = true;
    let unsubMenu: (() => void) | undefined;
    let unsubVenue: (() => void) | undefined;

    const initPublicDb = async () => {
      await seedDatabaseIfEmpty();
      if (!active) return;
      
      unsubMenu = subscribeToMenuItems((items) => {
        if (active) setMenuItems(items);
      });
      unsubVenue = subscribeToVenueSpaces((spaces) => {
        if (active) setVenueSpaces(spaces);
      });
    };

    initPublicDb();

    return () => {
      active = false;
      if (unsubMenu) unsubMenu();
      if (unsubVenue) unsubVenue();
    };
  }, []);

  // Listen to Authentication State and user-specific Profile & Cabinet Members list
  useEffect(() => {
    let active = true;
    let unsubProfile: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubCabinet: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!active) return;
      
      // Clean up previous user-specific subscriptions first to prevent unauthorized reads upon logout
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }
      if (unsubOrders) {
        unsubOrders();
        unsubOrders = undefined;
      }
      if (unsubCabinet) {
        unsubCabinet();
        unsubCabinet = undefined;
      }

      setCurrentUser(user);
      
      if (user) {
        // Logged-in user: Subscribe to user profile in Firestore
        unsubProfile = subscribeToUserProfile(user.uid, (profile) => {
          if (!active) return;
          if (profile) {
            setUserProfile(profile);
          } else {
            // Seed a fresh profile for the user in Firestore if not found
            const newProfile: UserProfile = {
              name: user.displayName || 'Honored Guest',
              email: user.email || '',
              phone: '',
              streetAddress: '',
              city: 'Islamabad',
              postalCode: '',
              apartmentSuite: ''
            };
            updateUserProfileInDb(user.uid, newProfile);
            setUserProfile(newProfile);
          }
        });

        // Subscribe to user-specific orders
        unsubOrders = subscribeToUserOrders(user.email || '', (ords) => {
          if (active) setUserOrders(ords);
        });

        // Any authenticated user can read the kitchen_cabinet members list to verify privileges
        unsubCabinet = subscribeToKitchenCabinet((members) => {
          if (active) setCabinetMembers(members);
        });
      } else {
        // Guest mode: Clear state, no subscription to cabinet or user orders
        setCabinetMembers([]);
        setUserOrders([]);
      }
    });

    return () => {
      active = false;
      unsubscribeAuth();
      if (unsubProfile) unsubProfile();
      if (unsubOrders) unsubOrders();
      if (unsubCabinet) unsubCabinet();
    };
  }, []);

  // Dynamic admin-only subscriptions activated when an authorized Cabinet Member is logged in
  useEffect(() => {
    if (!currentUser) {
      setReservations([]);
      setAllOrders([]);
      setContactMessages([]);
      return;
    }

    const isCabinet = currentUser.email === 'howsaim216@gmail.com' || 
      cabinetMembers.some(m => m.uid === currentUser.uid);

    if (!isCabinet) {
      setReservations([]);
      setAllOrders([]);
      setContactMessages([]);
      return;
    }

    let active = true;
    console.log('User is an authorized Cabinet Member. Activating administrative subscriptions...');
    
    const unsubRes = subscribeToReservations((res) => {
      if (active) setReservations(res);
    });
    const unsubOrders = subscribeToOrders((ords) => {
      if (active) setAllOrders(ords);
    });
    const unsubMsgs = subscribeToContactMessages((msgs) => {
      if (active) setContactMessages(msgs);
    });

    return () => {
      active = false;
      unsubRes();
      unsubOrders();
      unsubMsgs();
    };
  }, [currentUser, cabinetMembers]);

  // Wrapped state setters for Admin and other screens to sync state mutations to Firestore
  const handleSetMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>> = async (action) => {
    const nextItems = typeof action === 'function' ? (action as Function)(menuItems) : action;
    
    // Sync additions and edits
    for (const item of nextItems) {
      const existing = menuItems.find(i => i.id === item.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(item)) {
        await addMenuItemInDb(item);
      }
    }
    // Sync deletions
    for (const item of menuItems) {
      if (!nextItems.some(i => i.id === item.id)) {
        await deleteMenuItemFromDb(item.id);
      }
    }
  };

  const handleSetVenueSpaces: React.Dispatch<React.SetStateAction<VenueSpace[]>> = async (action) => {
    const nextSpaces = typeof action === 'function' ? (action as Function)(venueSpaces) : action;
    for (const space of nextSpaces) {
      const existing = venueSpaces.find(s => s.id === space.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(space)) {
        await addVenueSpaceInDb(space);
      }
    }
  };

  const handleSetReservations: React.Dispatch<React.SetStateAction<Reservation[]>> = async (action) => {
    const nextReservations = typeof action === 'function' ? (action as Function)(reservations) : action;
    for (const res of nextReservations) {
      const existing = reservations.find(r => r.id === res.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(res)) {
        await addReservationInDb(res);
      }
    }
    for (const res of reservations) {
      if (!nextReservations.some(r => r.id === res.id)) {
        await deleteReservationFromDb(res.id);
      }
    }
  };

  const handleSetContactMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>> = async (action) => {
    const nextMsgs = typeof action === 'function' ? (action as Function)(contactMessages) : action;
    for (const msg of nextMsgs) {
      const existing = contactMessages.find(m => m.id === msg.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(msg)) {
        await addContactMessageInDb(msg);
      }
    }
    for (const msg of contactMessages) {
      if (!nextMsgs.some(m => m.id === msg.id)) {
        await deleteContactMessageFromDb(msg.id);
      }
    }
  };

  const handleAddCabinetMember = async (member: KitchenCabinetMember) => {
    await addKitchenCabinetMemberInDb(member);
  };

  const handleDeleteCabinetMember = async (uid: string) => {
    await deleteKitchenCabinetMemberFromDb(uid);
  };

  const handleSetOrders: React.Dispatch<React.SetStateAction<Order[]>> = async (action) => {
    const nextOrders = typeof action === 'function' ? (action as Function)(allOrders) : action;
    for (const order of nextOrders) {
      const existing = allOrders.find(o => o.id === order.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(order)) {
        await addOrderInDb(order);
      }
    }
    for (const order of allOrders) {
      if (!nextOrders.some(o => o.id === order.id)) {
        await deleteOrderFromDb(order.id);
      }
    }
  };

  // Deep Link Detection on Page Load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shareType = params.get('shareType');
      const shareId = params.get('shareId');

      if (shareType === 'menuItem' && shareId) {
        const item = menuItems.find((m) => m.id === shareId);
        if (item) {
          setDeepLinkMenuItem(item);
          setShowDeepLinkSpotlight(true);
        }
      } else if (shareType === 'reservation' && shareId) {
        const res = reservations.find((r) => r.id === shareId);
        if (res) {
          setDeepLinkReservation(res);
          setShowDeepLinkSpotlight(true);
        } else {
          // Fallback mockup invitation if shared from other browser profile
          const mockRes: Reservation = {
            id: shareId,
            name: 'Elite Guest',
            email: 'vip.guest@zaviya.culinary',
            date: '2026-07-02',
            time: '19:30',
            guests: '4',
            experience: 'chef',
            specialRequests: 'Exclusive shared invitation pass.',
            status: 'approved',
            createdAt: '2026-06-27',
            ambientLight: 65,
            soundscape: 'Sitar Melody',
            interestedDishes: ['The Royal Platter']
          };
          setDeepLinkReservation(mockRes);
          setShowDeepLinkSpotlight(true);
        }
      }
    }
  }, [menuItems, reservations]);

  const handleAddToCart = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItem, quantity: 1, notes: '' }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.menuItem.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    if (currentUser) {
      await updateUserProfileInDb(currentUser.uid, updated);
    }
  };

  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().substring(8)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'received'
    };
    await addOrderInDb(newOrder);
    setCart([]);
  };

  const handleSendContactMessage = async (newMessage: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const msg: ContactMessage = {
      ...newMessage,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString().split('T')[0]
    };
    await addContactMessageInDb(msg);
  };

  // Reservation Dossier State
  const [reservation, setReservation] = useState<ReservationState>({
    guests: '2',
    date: '',
    time: '19:00',
    experience: 'standard',
    name: '',
    email: '',
    specialRequests: ''
  });

  const handleToggleInterest = (dishTitle: string) => {
    setInterestedDishes((prev) =>
      prev.includes(dishTitle)
        ? prev.filter((title) => title !== dishTitle)
        : [...prev, dishTitle]
    );
  };

  const handleSetSelectedDate = (date: string) => {
    setReservation((prev) => ({ ...prev, date }));
  };

  // Render active screen with smooth transitions
  const renderScreen = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeScreen
            onPageChange={setActivePage}
            selectedDate={reservation.date}
            setSelectedDate={handleSetSelectedDate}
          />
        );
      case 'menu':
        return (
          <MenuScreen
            onPageChange={setActivePage}
            interestedDishes={interestedDishes}
            onToggleInterest={handleToggleInterest}
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            cart={cart}
            onShareMenuItem={(item) => {
              setShareMenuItem(item);
              setShareReservation(null);
              setIsShareOpen(true);
            }}
          />
        );
      case 'venue':
        return (
          <VenueScreen
            onPageChange={setActivePage}
            ambientLight={ambientLight}
            setAmbientLight={setAmbientLight}
            soundscape={soundscape}
            setSoundscape={setSoundscape}
            venueSpaces={venueSpaces}
          />
        );
      case 'reservations':
        return (
          <ReservationsScreen
            reservation={reservation}
            setReservation={setReservation}
            interestedDishes={interestedDishes}
            ambientLight={ambientLight}
            soundscape={soundscape}
            setReservations={handleSetReservations}
            onShareReservation={(res) => {
              setShareReservation(res);
              setShareMenuItem(null);
              setIsShareOpen(true);
            }}
          />
        );
      case 'cabinet':
        return (
          <CabinetScreen
            reservations={reservations}
            setReservations={handleSetReservations}
            menuItems={menuItems}
            setMenuItems={handleSetMenuItems}
            venueSpaces={venueSpaces}
            setVenueSpaces={handleSetVenueSpaces}
            contactMessages={contactMessages}
            setContactMessages={handleSetContactMessages}
            orders={allOrders}
            setOrders={handleSetOrders}
            currentUser={currentUser}
            cabinetMembers={cabinetMembers}
            onAddCabinetMember={handleAddCabinetMember}
            onDeleteCabinetMember={handleDeleteCabinetMember}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            orders={userOrders}
            onPageChange={setActivePage}
            currentUser={currentUser}
          />
        );
      case 'contact':
        return (
          <ContactScreen onSendMessage={handleSendContactMessage} />
        );
      default:
        return (
          <HomeScreen
            onPageChange={setActivePage}
            selectedDate={reservation.date}
            setSelectedDate={handleSetSelectedDate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans flex flex-col justify-between selection:bg-[#f2ca50]/20 selection:text-[#f2ca50]">
      <div className="flex-grow">
        {/* Global Luxury Header */}
        <Header
          activePage={activePage}
          onPageChange={setActivePage}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onCartOpen={() => setIsCartOpen(true)}
          isAdmin={isCabinet}
        />

        {/* Dynamic Route Screen Frame */}
        <main className="w-full pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Luxury Footer */}
      <Footer onPageChange={setActivePage} isAdmin={isCabinet} />

      {/* Culinary Shopping Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        profile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onPlaceOrder={handlePlaceOrder}
        onPageChange={setActivePage}
      />

      {/* Luxury Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        menuItem={shareMenuItem}
        reservation={shareReservation}
      />

      {/* Deep Link Invitation/Spotlight Overlay */}
      <AnimatePresence>
        {showDeepLinkSpotlight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeepLinkSpotlight(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] bg-[#1a1a19] border border-white/5 shadow-2xl p-8 md:p-12 text-center z-10 space-y-8 overflow-hidden"
            >
              {/* Gold glint decorative effects */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent" />
              
              <div className="space-y-2">
                <span className="font-sans font-bold text-[9px] text-[#f2ca50] tracking-[0.4em] uppercase block">
                  SHARED CULINARY CONNECTION
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-white font-bold">
                  {deepLinkMenuItem ? 'Shared Culinary Spotlight' : 'Shared VIP Dining Invitation'}
                </h3>
                <p className="font-sans text-xs text-[#bab8b7]/60">
                  You landed on a high-fidelity deep-link shared with you
                </p>
              </div>

              {deepLinkMenuItem && (
                <div className="neo-concave rounded-3xl p-6 md:p-8 bg-[#131313] border border-white/5 text-left flex flex-col md:flex-row gap-6 items-center">
                  {deepLinkMenuItem.image && (
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-white/5 shadow-inner">
                      <img
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        src={deepLinkMenuItem.image}
                        alt={deepLinkMenuItem.title}
                      />
                    </div>
                  )}
                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-display text-xl text-white font-bold flex items-center gap-2">
                          {deepLinkMenuItem.title}
                          {deepLinkMenuItem.signature && <Award className="w-4 h-4 text-[#f2ca50]" />}
                        </h4>
                        <span className="text-[9px] font-sans font-bold text-[#f2ca50] uppercase tracking-wider">
                          {deepLinkMenuItem.category}
                        </span>
                      </div>
                      <span className="neo-convex px-3 py-1.5 rounded-xl font-mono text-xs text-[#f2ca50] font-bold border border-white/5">
                        {deepLinkMenuItem.price}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                      {deepLinkMenuItem.description}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          handleAddToCart(deepLinkMenuItem);
                          setShowDeepLinkSpotlight(false);
                        }}
                        className="neo-convex px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-sans font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        ADD TO ORDER BAG
                      </button>
                      <button
                        onClick={() => {
                          setActivePage('menu');
                          setShowDeepLinkSpotlight(false);
                        }}
                        className="neo-convex px-4 py-2.5 rounded-xl text-[#bab8b7] hover:text-[#f2ca50] font-sans font-semibold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        EXPLORE FULL MENU
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deepLinkReservation && (
                <div className="neo-concave rounded-3xl p-6 md:p-8 bg-[#131313] border border-white/5 text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <span className="font-sans text-[8px] text-[#f2ca50] tracking-widest font-extrabold uppercase">
                        VIP DINING PASS
                      </span>
                      <h4 className="font-display text-xl text-white font-bold">{deepLinkReservation.name}</h4>
                    </div>
                    <span className="neo-convex px-3 py-1 rounded-lg text-[9px] text-[#f2ca50] font-extrabold font-mono tracking-wider uppercase bg-[#f2ca50]/5 border border-[#f2ca50]/15">
                      {deepLinkReservation.experience === 'chef' ? "Chef's Table" : "Regular table"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-[#bab8b7]/40 text-[9px] uppercase tracking-wider block">Schedule</span>
                      <span className="text-[#e5e2e1] font-semibold">{deepLinkReservation.date} @ {deepLinkReservation.time || '19:00'}</span>
                    </div>
                    <div>
                      <span className="text-[#bab8b7]/40 text-[9px] uppercase tracking-wider block">Party Size</span>
                      <span className="text-[#e5e2e1] font-semibold">{deepLinkReservation.guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-[#bab8b7]/40 text-[9px] uppercase tracking-wider block">Acoustic Loop</span>
                      <span className="text-[#e5e2e1] font-semibold">{deepLinkReservation.soundscape}</span>
                    </div>
                    <div>
                      <span className="text-[#bab8b7]/40 text-[9px] uppercase tracking-wider block">Light Intensity</span>
                      <span className="text-[#e5e2e1] font-semibold">{deepLinkReservation.ambientLight}% intensity</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        setActivePage('reservations');
                        setShowDeepLinkSpotlight(false);
                      }}
                      className="neo-convex px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-sans font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      BOOK YOUR OWN TABLE
                    </button>
                    <button
                      onClick={() => setShowDeepLinkSpotlight(false)}
                      className="neo-convex px-4 py-2.5 rounded-xl text-[#bab8b7] hover:text-[#f2ca50] font-sans font-semibold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      DISMISS PASS
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setShowDeepLinkSpotlight(false)}
                  className="neo-convex px-6 py-3 rounded-full text-[10px] text-[#bab8b7] hover:text-[#f2ca50] font-sans font-bold tracking-widest uppercase cursor-pointer"
                >
                  ENTER ZAVIYA EXPERIENCE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
