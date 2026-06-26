/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PageId, ReservationState, Reservation, MenuItem, VenueSpace, ContactMessage } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import VenueScreen from './screens/VenueScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import AdminScreen from './screens/AdminScreen';
import ContactScreen from './screens/ContactScreen';
import { MENU_ITEMS, VENUE_SPACES } from './data';
import { AnimatePresence, motion } from 'motion/react';

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
  
  // Sensorial Calibration State
  const [ambientLight, setAmbientLight] = useState<number>(50);
  const [soundscape, setSoundscape] = useState<string>('Traditional Flute');

  // Dynamic entities managed by Admin but available to all pages
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('zaviya_menu_items');
    return saved ? JSON.parse(saved) : MENU_ITEMS;
  });

  const [venueSpaces, setVenueSpaces] = useState<VenueSpace[]>(() => {
    const saved = localStorage.getItem('zaviya_venue_spaces');
    return saved ? JSON.parse(saved) : VENUE_SPACES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('zaviya_reservations');
    return saved ? JSON.parse(saved) : DEFAULT_RESERVATIONS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('zaviya_contact_messages');
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zaviya_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('zaviya_venue_spaces', JSON.stringify(venueSpaces));
  }, [venueSpaces]);

  useEffect(() => {
    localStorage.setItem('zaviya_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('zaviya_contact_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  const handleSendContactMessage = (newMessage: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const msg: ContactMessage = {
      ...newMessage,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContactMessages((prev) => [msg, ...prev]);
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
            setReservations={setReservations}
          />
        );
      case 'admin':
        return (
          <AdminScreen
            reservations={reservations}
            setReservations={setReservations}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            venueSpaces={venueSpaces}
            setVenueSpaces={setVenueSpaces}
            contactMessages={contactMessages}
            setContactMessages={setContactMessages}
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
        <Header activePage={activePage} onPageChange={setActivePage} />

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
      <Footer onPageChange={setActivePage} />
    </div>
  );
}
