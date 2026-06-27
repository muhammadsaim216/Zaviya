/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MenuItem, VenueSpace, Reservation, ContactMessage, Order, KitchenCabinetMember } from '../types';
import {
  TrendingUp,
  Users,
  Utensils,
  Calendar,
  Check,
  X,
  Plus,
  Trash2,
  Edit2,
  Search,
  Sliders,
  Sun,
  Volume2,
  Filter,
  Sparkles,
  Award,
  Clock,
  Mail,
  Shield,
  Briefcase,
  AlertTriangle,
  MessageSquare,
  ShoppingBag,
  Truck,
  ChefHat,
  MapPin,
  CreditCard,
  ShieldAlert,
  LogIn,
  LogOut,
  Key,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

interface CabinetScreenProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  venueSpaces: VenueSpace[];
  setVenueSpaces: React.Dispatch<React.SetStateAction<VenueSpace[]>>;
  contactMessages: ContactMessage[];
  setContactMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentUser: User | null;
  cabinetMembers: KitchenCabinetMember[];
  onAddCabinetMember: (member: KitchenCabinetMember) => Promise<void>;
  onDeleteCabinetMember: (uid: string) => Promise<void>;
}

type AdminTab = 'dashboard' | 'reservations' | 'menu' | 'venue' | 'messages' | 'orders' | 'registry';

export default function CabinetScreen({
  reservations,
  setReservations,
  menuItems,
  setMenuItems,
  venueSpaces,
  setVenueSpaces,
  contactMessages,
  setContactMessages,
  orders,
  setOrders,
  currentUser,
  cabinetMembers,
  onAddCabinetMember,
  onDeleteCabinetMember
}: CabinetScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationFilter, setReservationFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  
  // Staff registry manager state
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffUid, setNewStaffUid] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Chef de Cuisine');
  const [registryError, setRegistryError] = useState('');
  const [registrySuccess, setRegistrySuccess] = useState('');

  const isAuthorized = currentUser && (
    currentUser.email === 'howsaim216@gmail.com' ||
    cabinetMembers.some(m => m.uid === currentUser.uid || m.email === currentUser.email)
  );

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Failed to log in:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Failed to sign out:', err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-8">
        <div className="neo-convex p-8 rounded-3xl bg-[#131313] border border-white/5 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f2ca50]/10 flex items-center justify-center border border-[#f2ca50]/20 text-[#f2ca50]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display text-2xl text-white font-bold tracking-tight">
              Protected Culinary Registry
            </h1>
            <p className="font-sans text-[#bab8b7]/60 text-xs tracking-widest uppercase">
              Kitchen Cabinet Entry Only
            </p>
          </div>

          <p className="font-sans text-[#bab8b7] text-sm leading-relaxed">
            This registry is reserved exclusively for authorized members of the Zaviya restaurant staff (Maitre D', Chef de Cuisine, and Administration).
          </p>

          {!currentUser ? (
            <div className="space-y-4 pt-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-4 px-6 bg-[#f2ca50] text-[#131313] rounded-2xl font-sans text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer neo-convex border-0"
              >
                <LogIn className="w-4 h-4" />
                Staff Authenticate
              </button>
              <p className="font-sans text-[10px] text-[#bab8b7]/40">
                Log in with your pre-authorized staff Google account.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2 bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
              <p className="font-sans text-xs text-red-400 font-medium">
                Access Denied: Account not pre-registered.
              </p>
              <div className="font-sans text-xs text-[#bab8b7] space-y-1 bg-[#131313] p-3 rounded-xl border border-white/5 text-left">
                <div><span className="text-[#bab8b7]/40">Authenticated:</span> {currentUser.email}</div>
                <div><span className="text-[#bab8b7]/40">UID:</span> <span className="font-mono text-[10px]">{currentUser.uid}</span></div>
              </div>
              <p className="font-sans text-[11px] text-[#bab8b7]/60">
                To request access, please contact the Chef de Cuisine with your UID.
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-[#bab8b7] hover:text-white rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Switch Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Menu Manager State
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<string>('All');
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Orders Filter/Search State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'received' | 'preparing' | 'delivery' | 'delivered' | 'cancelled'>('all');

  // New Dish Form State
  const [dishForm, setDishForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Gastronomy',
    signature: false,
    image: '',
    tags: ''
  });

  // Manual Reservation Form State
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [manualResForm, setManualResForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '19:00',
    guests: '2',
    experience: 'standard' as 'standard' | 'chef',
    specialRequests: '',
    assignedTable: ''
  });

  // Reservation Editing State
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [editResForm, setEditResForm] = useState({
    guests: '2',
    date: '',
    time: '19:00',
    experience: 'standard' as 'standard' | 'chef',
    assignedTable: '',
    staffNotes: ''
  });

  // Messaging / Inquiries State
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const categories = ['All', 'Gastronomy', 'BBQ', 'Shinwari', 'Patisserie', 'International', 'Drinks'];

  // Handle message status updates
  const handleUpdateMessageStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    setContactMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
    );
  };

  // Handle message deletion
  const handleDeleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this customer message?')) {
      setContactMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (replyingMessageId === id) {
        setReplyingMessageId(null);
        setReplyText('');
      }
    }
  };

  // Handle message reply submission
  const handleSendReply = (id: string) => {
    if (!replyText.trim()) {
      alert('Please enter a response message.');
      return;
    }
    // Update message status to replied and append inline response if desired
    setContactMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              status: 'replied',
              message: `${msg.message}\n\n--- Staff Response ---\n${replyText}`
            }
          : msg
      )
    );
    setReplyingMessageId(null);
    setReplyText('');
    alert('Response sent successfully! (Simulated response sent via email)');
  };

  // Handle Reservation status updates
  const handleUpdateStatus = (id: string, status: 'approved' | 'cancelled') => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status } : res))
    );
  };

  // Delete Reservation
  const handleDeleteReservation = (id: string) => {
    if (confirm('Are you sure you want to delete this reservation record?')) {
      setReservations((prev) => prev.filter((res) => res.id !== id));
    }
  };

  // Add Manual Reservation
  const handleAddManualReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualResForm.name || !manualResForm.email || !manualResForm.date) {
      alert('Please fill out Name, Email, and Reservation Date.');
      return;
    }

    const newRes: Reservation = {
      id: 'res-' + Date.now(),
      name: manualResForm.name,
      email: manualResForm.email,
      date: manualResForm.date,
      time: manualResForm.time,
      guests: manualResForm.guests,
      experience: manualResForm.experience,
      specialRequests: manualResForm.specialRequests,
      status: 'approved', // Manual reservations are approved by default
      createdAt: new Date().toISOString().split('T')[0],
      ambientLight: 50,
      soundscape: 'Traditional Flute',
      interestedDishes: [],
      assignedTable: manualResForm.assignedTable || undefined
    };

    setReservations((prev) => [newRes, ...prev]);
    setIsAddingReservation(false);
    setManualResForm({
      name: '',
      email: '',
      date: '',
      time: '19:00',
      guests: '2',
      experience: 'standard',
      specialRequests: '',
      assignedTable: ''
    });
  };

  // Edit Reservation
  const startEditingReservation = (res: Reservation) => {
    setEditingResId(res.id);
    setEditResForm({
      guests: res.guests,
      date: res.date,
      time: res.time,
      experience: res.experience,
      assignedTable: res.assignedTable || '',
      staffNotes: res.staffNotes || ''
    });
  };

  const handleSaveResEdit = (id: string) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id
          ? {
              ...res,
              guests: editResForm.guests,
              date: editResForm.date,
              time: editResForm.time,
              experience: editResForm.experience,
              assignedTable: editResForm.assignedTable || undefined,
              staffNotes: editResForm.staffNotes || undefined
            }
          : res
      )
    );
    setEditingResId(null);
  };

  // Handle Dish Addition/Editing
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.title || !dishForm.description || !dishForm.price) {
      alert('Please provide a title, description, and price.');
      return;
    }

    // Ensure price contains Rs. prefix or standard format
    let formattedPrice = dishForm.price.trim();
    if (!formattedPrice.toLowerCase().startsWith('rs') && !formattedPrice.startsWith('Rs.')) {
      formattedPrice = `Rs. ${formattedPrice}`;
    }

    const parsedTags = dishForm.tags
      ? dishForm.tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
      : [];

    if (editingDishId) {
      // Edit mode
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingDishId
            ? {
                ...item,
                title: dishForm.title,
                description: dishForm.description,
                price: formattedPrice,
                category: dishForm.category,
                signature: dishForm.signature,
                image: dishForm.image || undefined,
                tags: parsedTags.length > 0 ? parsedTags : undefined
              }
            : item
        )
      );
      setEditingDishId(null);
    } else {
      // Add mode
      const newDish: MenuItem = {
        id: 'dish-' + Date.now(),
        title: dishForm.title,
        description: dishForm.description,
        price: formattedPrice,
        category: dishForm.category,
        signature: dishForm.signature,
        image: dishForm.image || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined
      };
      setMenuItems((prev) => [...prev, newDish]);
    }

    // Reset Form
    setDishForm({
      title: '',
      description: '',
      price: '',
      category: 'Gastronomy',
      signature: false,
      image: '',
      tags: ''
    });
    setIsAddingDish(false);
  };

  // Start Edit Dish
  const startEditingDish = (item: MenuItem) => {
    setEditingDishId(item.id);
    setDishForm({
      title: item.title,
      description: item.description,
      price: item.price.replace('Rs. ', '').replace('Rs.', ''),
      category: item.category,
      signature: !!item.signature,
      image: item.image || '',
      tags: item.tags ? item.tags.join(', ') : ''
    });
    setIsAddingDish(true);
  };

  // Delete Dish
  const handleDeleteDish = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Update Venue Space Status
  const handleUpdateSpaceStatus = (id: string, status: 'Available' | 'Reserved' | 'Under Maintenance') => {
    setVenueSpaces((prev) =>
      prev.map((space) => (space.id === id ? { ...space, status } : space))
    );
  };

  // Update Venue Space Capacity
  const handleUpdateSpaceCapacity = (id: string, capacity: string) => {
    setVenueSpaces((prev) =>
      prev.map((space) => (space.id === id ? { ...space, capacity } : space))
    );
  };

  // Metrics Calculations
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      res.email.toLowerCase().includes(reservationSearch.toLowerCase());
    const matchesFilter = reservationFilter === 'all' || res.status === reservationFilter;
    return matchesSearch && matchesFilter;
  });

  const approvedReservations = reservations.filter((r) => r.status === 'approved');
  const pendingReservations = reservations.filter((r) => r.status === 'pending');

  // Estimate total seats based on approved guest counts
  const totalSeatsApproved = approvedReservations.reduce((acc, r) => {
    const count = parseInt(r.guests) || 2;
    return acc + count;
  }, 0);

  // Revenue estimation: 
  // Let's assume Standard Dining Rs. 4,000 per head, Chef tasting Rs. 8,500 per head.
  const estimatedRevenue = approvedReservations.reduce((acc, r) => {
    const heads = parseInt(r.guests) || 2;
    const pricePerHead = r.experience === 'chef' ? 8500 : 4000;
    return acc + (heads * pricePerHead);
  }, 0);

  // Soundscape distribution for the metrics chart
  const soundscapeCounts = reservations.reduce((acc: Record<string, number>, r) => {
    const sound = r.soundscape || 'Traditional Flute';
    acc[sound] = (acc[sound] || 0) + 1;
    return acc;
  }, {});

  // Timeslot distribution
  const timeslotCounts = reservations.reduce((acc: Record<string, number>, r) => {
    acc[r.time] = (acc[r.time] || 0) + 1;
    return acc;
  }, {});

  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'unread').length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 text-left space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#f2ca50]">
            <ChefHat className="w-5 h-5" />
            <span className="font-sans font-bold text-xs tracking-[0.3em] uppercase">
              Culinary Registry
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tight">
            Kitchen Cabinet
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 font-sans text-[#bab8b7] text-sm">
            <p className="leading-relaxed">
              Administer menu items, seating spaces, reservations, orders, customer inquiries, and staff privileges in real-time.
            </p>
            {currentUser && (
              <span className="shrink-0 bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-2 py-1 rounded text-[#f2ca50] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                {currentUser.email}
              </span>
            )}
          </div>
        </div>

        {/* Staff Actions / Switch */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/5 hover:bg-white/5 text-[#bab8b7] hover:text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab Switcher Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="neo-concave p-1.5 rounded-2xl bg-[#131313] border border-white/5 flex flex-wrap gap-2 w-full lg:w-auto">
          {(['dashboard', 'reservations', 'menu', 'venue', 'messages', 'orders', 'registry'] as AdminTab[]).map((tab) => {
            const isMsg = tab === 'messages';
            const isOrders = tab === 'orders';
            const isRegistry = tab === 'registry';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'neo-convex active-pill text-[#f2ca50]'
                    : 'text-[#bab8b7]/60 hover:text-[#bab8b7]'
                }`}
              >
                <span>{isMsg ? 'Inquiries' : isRegistry ? 'Cabinet Registry' : tab}</span>
                {isMsg && unreadMessagesCount > 0 && (
                  <span className="bg-[#f2ca50] text-[#131313] text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 min-w-[18px] text-center">
                    {unreadMessagesCount}
                  </span>
                )}
                {isOrders && activeOrdersCount > 0 && (
                  <span className="bg-[#f2ca50] text-[#131313] text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 min-w-[18px] text-center">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Total Bookings */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Total Requests
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-[#f2ca50] bg-[#131313]/50">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-white font-bold">{reservations.length}</h3>
                  <p className="text-[10px] text-green-400 font-sans tracking-wide">
                    {pendingReservations.length} Pending Approval
                  </p>
                </div>
              </div>

              {/* Total Approved Seats */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Approved Seats
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-[#f2ca50] bg-[#131313]/50">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-white font-bold">{totalSeatsApproved}</h3>
                  <p className="text-[10px] text-[#bab8b7]/50 font-sans tracking-wide">
                    Confirmed Diners Scheduled
                  </p>
                </div>
              </div>

              {/* Estimated Sales Revenue */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Estimated Revenue
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-green-400 bg-[#131313]/50">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-green-400 font-bold">
                    Rs. {estimatedRevenue.toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-[#bab8b7]/50 font-sans tracking-wide">
                    Based on Confirmed Bookings
                  </p>
                </div>
              </div>

              {/* Menu Catalog items count */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Menu Items
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-[#f2ca50] bg-[#131313]/50">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-white font-bold">{menuItems.filter(item => item.id !== 'placeholder-item').length}</h3>
                  <p className="text-[10px] text-[#bab8b7]/50 font-sans tracking-wide">
                    Active Catalog Dishes
                  </p>
                </div>
              </div>

              {/* Customer Inquiries Count */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Inquiries
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-[#f2ca50] bg-[#131313]/50">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-white font-bold">{contactMessages.length}</h3>
                  <p className="text-[10px] text-[#bab8b7] font-sans tracking-wide">
                    <span className="text-amber-400 font-bold">{unreadMessagesCount} unread</span> inquiries
                  </p>
                </div>
              </div>

              {/* Online Orders Count */}
              <div className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-[#f2ca50]/15 space-y-4 hover:border-[#f2ca50]/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[#bab8b7]/60 text-xs font-bold tracking-wider uppercase">
                    Online Orders
                  </span>
                  <div className="p-2.5 rounded-xl neo-concave text-[#f2ca50] bg-[#131313]/50">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-display text-white font-bold">{orders.length}</h3>
                  <p className="text-[10px] text-[#bab8b7] font-sans tracking-wide">
                    <span className="text-amber-400 font-bold">{activeOrdersCount} in progress</span> deliveries
                  </p>
                </div>
              </div>
            </div>

            {/* Graphics and Visual Analytics Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seating Time Allocation Chart */}
              <div className="neo-convex p-6 md:p-8 rounded-[2.5rem] bg-[#20201f] border border-white/5 space-y-6">
                <div className="space-y-1">
                  <h4 className="font-display text-xl text-white font-bold">Reservations by Time Slot</h4>
                  <p className="text-xs text-[#bab8b7] leading-relaxed">
                    Visual layout of table preferences across active dining windows.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {['18:30', '19:00', '20:30', '21:00'].map((time) => {
                    const count = timeslotCounts[time] || 0;
                    const maxCount = Math.max(...Object.values(timeslotCounts), 1);
                    const percentage = (count / maxCount) * 100;

                    return (
                      <div key={time} className="space-y-2">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="text-white font-semibold flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#f2ca50]" />
                            {time}
                          </span>
                          <span className="text-[#bab8b7] font-bold">
                            {count} {count === 1 ? 'Booking' : 'Bookings'}
                          </span>
                        </div>
                        <div className="w-full bg-[#131313] h-3.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-r from-[#f2ca50] to-[#d4af37] h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Soundscape and Ambience Preferences Distribution */}
              <div className="neo-convex p-6 md:p-8 rounded-[2.5rem] bg-[#20201f] border border-white/5 space-y-6">
                <div className="space-y-1">
                  <h4 className="font-display text-xl text-white font-bold">Soundscape Preferences</h4>
                  <p className="text-xs text-[#bab8b7] leading-relaxed">
                    Dinings selections for custom ambient sound environments.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {['Traditional Flute', 'Soft Wind', 'Deep Calm'].map((sound) => {
                    const count = soundscapeCounts[sound] || 0;
                    const maxCount = Math.max(...Object.values(soundscapeCounts), 1);
                    const percentage = (count / maxCount) * 100;

                    return (
                      <div key={sound} className="space-y-2">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="text-white font-semibold flex items-center gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-[#f2ca50]" />
                            {sound}
                          </span>
                          <span className="text-[#bab8b7] font-bold">
                            {count} {count === 1 ? 'Choice' : 'Choices'}
                          </span>
                        </div>
                        <div className="w-full bg-[#131313] h-3.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-r from-[#8e7629] to-[#f2ca50] h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reservations' && (
          <motion.div
            key="reservations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Table Control Panel - Filters & Searches */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Search input */}
                <div className="neo-concave rounded-xl px-4 py-2.5 flex items-center bg-[#131313] border border-white/5 w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#bab8b7]/40 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={reservationSearch}
                    onChange={(e) => setReservationSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/40 font-sans tracking-wide w-full"
                  />
                </div>

                {/* Filter Selector */}
                <div className="flex rounded-xl bg-[#131313] p-1 border border-white/5">
                  {(['all', 'pending', 'approved', 'cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setReservationFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-widest uppercase transition-colors ${
                        reservationFilter === filter
                          ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/20 text-[#f2ca50]'
                          : 'text-[#bab8b7]/40 hover:text-[#bab8b7]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Add Trigger */}
              <button
                onClick={() => setIsAddingReservation(!isAddingReservation)}
                className="neo-convex px-5 py-2.5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all ml-auto lg:ml-0"
              >
                <Plus className="w-4 h-4" />
                Add Walk-in
              </button>
            </div>

            {/* Inline Reservation Add Form */}
            {isAddingReservation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-6 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#f2ca50]" />
                    Register Walk-In Guest
                  </h4>
                  <button onClick={() => setIsAddingReservation(false)} className="text-[#bab8b7] hover:text-[#f2ca50]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddManualReservation} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Guest Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Bilal Ahmed"
                      value={manualResForm.name}
                      onChange={(e) => setManualResForm({ ...manualResForm, name: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="bilal@example.com"
                      value={manualResForm.email}
                      onChange={(e) => setManualResForm({ ...manualResForm, email: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Reservation Date</label>
                    <input
                      type="date"
                      required
                      value={manualResForm.date}
                      onChange={(e) => setManualResForm({ ...manualResForm, date: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Seating Time</label>
                    <select
                      value={manualResForm.time}
                      onChange={(e) => setManualResForm({ ...manualResForm, time: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    >
                      <option value="18:30">18:30</option>
                      <option value="19:00">19:00</option>
                      <option value="20:30">20:30</option>
                      <option value="21:00">21:00</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Guest Size</label>
                    <select
                      value={manualResForm.guests}
                      onChange={(e) => setManualResForm({ ...manualResForm, guests: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    >
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8 Guests</option>
                      <option value="12+">12+ Guests</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Dining Tier</label>
                    <select
                      value={manualResForm.experience}
                      onChange={(e) => setManualResForm({ ...manualResForm, experience: e.target.value as 'standard' | 'chef' })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    >
                      <option value="standard">Standard Dining</option>
                      <option value="chef">Chef's Special Tasting</option>
                    </select>
                  </div>

                   <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Assign Table (Optional)</label>
                    <select
                      value={manualResForm.assignedTable}
                      onChange={(e) => setManualResForm({ ...manualResForm, assignedTable: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-[#f2ca50] border border-white/5 w-full focus:outline-none font-sans font-bold"
                    >
                      <option value="">Unassigned</option>
                      <option value="Table 1 (Indoor)">Table 1 (Indoor)</option>
                      <option value="Table 2 (Indoor)">Table 2 (Indoor)</option>
                      <option value="Table 3 (Indoor)">Table 3 (Indoor)</option>
                      <option value="Lawn Cabana A">Lawn Cabana A</option>
                      <option value="Lawn Cabana B">Lawn Cabana B</option>
                      <option value="Chef's Table (VIP)">Chef's Table (VIP)</option>
                      <option value="Terrace Canopy 1">Terrace Canopy 1</option>
                      <option value="Terrace Canopy 2">Terrace Canopy 2</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Special Notes / Requests</label>
                    <input
                      type="text"
                      placeholder="e.g., Birthday celebration, require a cozy booth near the center"
                      value={manualResForm.specialRequests}
                      onChange={(e) => setManualResForm({ ...manualResForm, specialRequests: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingReservation(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/5 text-[#bab8b7] font-sans text-xs uppercase tracking-wider font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="neo-convex px-5 py-2.5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans text-xs uppercase tracking-wider font-bold"
                    >
                      Book & Approve
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Main Reservations Table / Cards */}
            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <div className="neo-convex p-12 rounded-[2rem] bg-[#20201f] text-center border border-white/5 text-[#bab8b7]/40 font-sans text-xs">
                  No matching reservations found.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredReservations.map((res) => {
                    const isEditing = editingResId === res.id;

                    return (
                      <motion.div
                        layout
                        key={res.id}
                        className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                      >
                        {/* Guest Main Data */}
                        <div className="space-y-4 max-w-xl flex-grow">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="font-display text-lg text-white font-bold">{res.name}</h4>
                            <span className="neo-concave px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-[#bab8b7]">
                              ID: {res.id.replace('res-', '')}
                            </span>
                            
                            {/* Status badge */}
                            <span
                              className={`text-[8px] font-sans font-bold tracking-widest px-2.5 py-1 rounded-md uppercase ${
                                res.status === 'approved'
                                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                  : res.status === 'cancelled'
                                  ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              }`}
                            >
                              {res.status}
                            </span>

                            {/* Assigned table badge */}
                            {res.assignedTable && (
                              <span className="bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] text-[9px] font-sans font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                                {res.assignedTable}
                              </span>
                            )}
                          </div>

                          {/* Editable details inline */}
                          {isEditing ? (
                            <div className="space-y-4 p-4 rounded-2xl bg-[#131313]/60 border border-white/5">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Guests</span>
                                  <select
                                    value={editResForm.guests}
                                    onChange={(e) => setEditResForm({ ...editResForm, guests: e.target.value })}
                                    className="bg-transparent text-xs text-[#f2ca50] font-sans font-bold border-none p-0 focus:ring-0 cursor-pointer"
                                  >
                                    <option value="2">2</option>
                                    <option value="4">4</option>
                                    <option value="6">6</option>
                                    <option value="8">8</option>
                                    <option value="12+">12+</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Date</span>
                                  <input
                                    type="date"
                                    value={editResForm.date}
                                    onChange={(e) => setEditResForm({ ...editResForm, date: e.target.value })}
                                    className="bg-transparent text-xs text-[#f2ca50] font-sans font-bold border-none p-0 focus:ring-0 cursor-pointer w-full"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Time</span>
                                  <select
                                    value={editResForm.time}
                                    onChange={(e) => setEditResForm({ ...editResForm, time: e.target.value })}
                                    className="bg-transparent text-xs text-[#f2ca50] font-sans font-bold border-none p-0 focus:ring-0 cursor-pointer"
                                  >
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="20:30">20:30</option>
                                    <option value="21:00">21:00</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Tier</span>
                                  <select
                                    value={editResForm.experience}
                                    onChange={(e) => setEditResForm({ ...editResForm, experience: e.target.value as 'standard' | 'chef' })}
                                    className="bg-transparent text-xs text-[#f2ca50] font-sans font-bold border-none p-0 focus:ring-0 cursor-pointer"
                                  >
                                    <option value="standard">Standard</option>
                                    <option value="chef">Chef tasting</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Assigned Table</span>
                                  <select
                                    value={editResForm.assignedTable}
                                    onChange={(e) => setEditResForm({ ...editResForm, assignedTable: e.target.value })}
                                    className="bg-[#131313] text-xs text-[#f2ca50] font-sans font-bold border border-white/5 px-2 py-1.5 rounded-xl focus:ring-0 cursor-pointer w-full"
                                  >
                                    <option value="">Unassigned</option>
                                    <option value="Table 1 (Indoor)">Table 1 (Indoor)</option>
                                    <option value="Table 2 (Indoor)">Table 2 (Indoor)</option>
                                    <option value="Table 3 (Indoor)">Table 3 (Indoor)</option>
                                    <option value="Lawn Cabana A">Lawn Cabana A</option>
                                    <option value="Lawn Cabana B">Lawn Cabana B</option>
                                    <option value="Chef's Table (VIP)">Chef's Table (VIP)</option>
                                    <option value="Terrace Canopy 1">Terrace Canopy 1</option>
                                    <option value="Terrace Canopy 2">Terrace Canopy 2</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[8px] text-[#bab8b7]/60 uppercase tracking-widest block font-bold">Internal Staff Notes</span>
                                  <input
                                    type="text"
                                    placeholder="Add notes for service staff..."
                                    value={editResForm.staffNotes}
                                    onChange={(e) => setEditResForm({ ...editResForm, staffNotes: e.target.value })}
                                    className="bg-[#131313] text-xs text-white border border-white/5 px-3 py-2 rounded-xl focus:ring-0 w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans text-[#bab8b7]">
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[#bab8b7]/40 uppercase tracking-widest block font-bold">Email</span>
                                <span className="text-white font-medium flex items-center gap-1.5 break-all">
                                  <Mail className="w-3.5 h-3.5 text-[#bab8b7]/40 shrink-0" />
                                  {res.email}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[#bab8b7]/40 uppercase tracking-widest block font-bold">Guest Size & Tier</span>
                                <span className="text-[#f2ca50] font-semibold uppercase tracking-wider text-[10px]">
                                  {res.guests} G • {res.experience === 'chef' ? 'Chef tasting' : 'Standard'}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[#bab8b7]/40 uppercase tracking-widest block font-bold">Date & Time</span>
                                <span className="text-white font-medium flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#f2ca50]/70" />
                                  {res.date} at {res.time}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[#bab8b7]/40 uppercase tracking-widest block font-bold">Created On</span>
                                <span className="text-[#bab8b7]/70 font-medium">
                                  {res.createdAt}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Extra info - preferences and notes */}
                          <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                              {/* Light and music assignment */}
                              <span className="flex items-center gap-1.5 text-xs text-[#bab8b7]">
                                <Sun className="w-3.5 h-3.5 text-amber-400/80" />
                                Light: <strong className="text-white font-semibold">{res.ambientLight}%</strong>
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-[#bab8b7]">
                                <Volume2 className="w-3.5 h-3.5 text-[#f2ca50]/80" />
                                Music: <strong className="text-white font-semibold">{res.soundscape}</strong>
                              </span>
                            </div>

                            {/* Dishes of interest */}
                            {res.interestedDishes && res.interestedDishes.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1 items-center">
                                <span className="text-[8px] text-[#bab8b7]/40 uppercase tracking-widest font-bold mr-1">Interests:</span>
                                {res.interestedDishes.map((dish, i) => (
                                  <span key={i} className="neo-concave text-[9px] text-[#f2ca50] font-bold px-2 py-0.5 rounded border border-white/5">
                                    {dish}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Special instructions */}
                            {res.specialRequests && (
                              <div className="p-3 rounded-xl bg-[#131313]/40 border border-white/5 text-[11px] text-[#bab8b7] leading-relaxed italic">
                                <span className="font-sans font-bold text-[8px] uppercase tracking-wider text-[#bab8b7]/40 block mb-1 not-italic">Guest Notes:</span>
                                "{res.specialRequests}"
                              </div>
                            )}

                            {/* Staff Notes */}
                            {res.staffNotes && (
                              <div className="p-3 rounded-xl bg-[#f2ca50]/5 border border-[#f2ca50]/10 text-[11px] text-[#e5e2e1] leading-relaxed">
                                <span className="font-sans font-bold text-[8px] uppercase tracking-wider text-[#f2ca50] flex items-center gap-1.5 mb-1">
                                  <Shield className="w-3.5 h-3.5" />
                                  Staff Internal Notes:
                                </span>
                                {res.staffNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions control panel */}
                        <div className="flex flex-row lg:flex-col items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveResEdit(res.id)}
                                className="neo-convex p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 active:scale-95 transition-all text-xs font-sans font-bold uppercase flex items-center gap-1.5 px-4 w-full justify-center"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingResId(null)}
                                className="px-4 py-3 rounded-xl border border-white/5 text-[#bab8b7] hover:text-white text-xs font-sans font-semibold uppercase w-full text-center"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="flex gap-2.5 w-full">
                                {res.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateStatus(res.id, 'approved')}
                                    className="neo-convex p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:text-green-300 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase"
                                    title="Approve Reservation"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                )}

                                {res.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                                    className="neo-convex p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase"
                                    title="Cancel Reservation"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Cancel
                                  </button>
                                )}

                                {res.status === 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateStatus(res.id, 'approved')}
                                    className="neo-convex p-2.5 rounded-xl bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] hover:bg-[#f2ca50]/20 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase"
                                    title="Reopen Reservation"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Reopen
                                  </button>
                                )}
                              </div>

                              <div className="flex gap-2.5 w-full">
                                <button
                                  onClick={() => startEditingReservation(res)}
                                  className="neo-convex p-2.5 rounded-xl bg-[#131313] border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] hover:border-[#f2ca50]/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-[10px] font-sans font-bold uppercase flex-grow"
                                  title="Edit Reservation Date/Time"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Edit Date
                                </button>

                                <button
                                  onClick={() => handleDeleteReservation(res.id)}
                                  className="neo-convex p-2.5 rounded-xl bg-red-950/20 border border-red-500/10 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center"
                                  title="Permanently Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Menu Header Tools */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search Menu */}
                <div className="neo-concave rounded-xl px-4 py-2.5 flex items-center bg-[#131313] border border-white/5 w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#bab8b7]/40 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu title..."
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/40 font-sans tracking-wide w-full"
                  />
                </div>

                {/* Filter Selector */}
                <div className="flex rounded-xl bg-[#131313] p-1 border border-white/5 overflow-x-auto max-w-full custom-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMenuFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-widest uppercase transition-colors shrink-0 ${
                        menuFilter === cat
                          ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/20 text-[#f2ca50]'
                          : 'text-[#bab8b7]/40 hover:text-[#bab8b7]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add menu item */}
              <button
                onClick={() => {
                  setEditingDishId(null);
                  setDishForm({
                    title: '',
                    description: '',
                    price: '',
                    category: 'Gastronomy',
                    signature: false,
                    image: '',
                    tags: ''
                  });
                  setIsAddingDish(!isAddingDish);
                }}
                className="neo-convex px-5 py-2.5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans font-bold text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all ml-auto md:ml-0"
              >
                <Plus className="w-4 h-4" />
                Add Dish
              </button>
            </div>

            {/* Expandable Add/Edit Dish Form */}
            {isAddingDish && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="neo-convex p-6 rounded-3xl bg-[#20201f] border border-white/5 space-y-6 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    {editingDishId ? (
                      <>
                        <Edit2 className="w-5 h-5 text-[#f2ca50]" />
                        Edit Dish Info
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-[#f2ca50]" />
                        Create New Menu Dish
                      </>
                    )}
                  </h4>
                  <button onClick={() => setIsAddingDish(false)} className="text-[#bab8b7] hover:text-[#f2ca50]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveDish} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Dish Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Imperial Saffron Rice"
                      value={dishForm.title}
                      onChange={(e) => setDishForm({ ...dishForm, title: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Price (PKR, e.g. 5,100)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5,100"
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Menu Category</label>
                    <select
                      value={dishForm.category}
                      onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none cursor-pointer"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="TRADITIONAL, HOT, SPICY"
                      value={dishForm.tags}
                      onChange={(e) => setDishForm({ ...dishForm, tags: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={dishForm.image}
                      onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                      className="neo-concave rounded-xl px-4 py-3 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#bab8b7] font-semibold">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide details about standard ingredients, preparation method, and size..."
                      value={dishForm.description}
                      onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                      className="neo-concave rounded-xl p-4 bg-[#131313] text-xs text-white border border-white/5 w-full focus:outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="signature-checkbox"
                      checked={dishForm.signature}
                      onChange={(e) => setDishForm({ ...dishForm, signature: e.target.checked })}
                      className="w-4 h-4 accent-[#f2ca50] bg-[#131313] border-white/10 rounded cursor-pointer"
                    />
                    <label htmlFor="signature-checkbox" className="text-xs text-[#e5e2e1] font-sans cursor-pointer flex items-center gap-1.5 select-none">
                      <Award className="w-4 h-4 text-[#f2ca50]" />
                      Mark as Chef's Signature Masterpiece
                    </label>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDish(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/5 text-[#bab8b7] font-sans text-xs uppercase tracking-wider font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="neo-convex px-5 py-2.5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans text-xs uppercase tracking-wider font-bold"
                    >
                      {editingDishId ? 'Save Changes' : 'Create Dish'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Menu Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => {
                  const hasRealItems = menuItems.some(i => i.id !== 'placeholder-item');
                  if (hasRealItems && item.id === 'placeholder-item') {
                    return false;
                  }
                  const matchesSearch = item.title.toLowerCase().includes(menuSearch.toLowerCase());
                  const matchesFilter = menuFilter === 'All' || item.category === menuFilter;
                  return matchesSearch && matchesFilter;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="neo-convex p-5 rounded-3xl bg-[#20201f] border border-white/5 flex gap-5 relative group"
                  >
                    {/* Dish image or dummy */}
                    {item.image ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-[#131313] border border-white/5 flex flex-col items-center justify-center text-[#bab8b7]/10 shrink-0">
                        <Utensils className="w-8 h-8 text-[#f2ca50]/30" />
                        <span className="text-[8px] font-sans tracking-wide font-bold uppercase mt-1">Recipe</span>
                      </div>
                    )}

                    <div className="flex-grow flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display text-base text-white font-bold leading-tight flex items-center gap-1.5 flex-wrap">
                            {item.title}
                            {item.signature && <Award className="w-3.5 h-3.5 text-[#f2ca50]" />}
                          </h4>
                          <span className="neo-concave px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-[#f2ca50] border border-white/5 shrink-0">
                            {item.price}
                          </span>
                        </div>
                        <p className="font-sans text-[#bab8b7]/80 text-[11px] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                        
                        {/* Tags list */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] font-sans font-bold tracking-widest text-[#f2ca50]/90 bg-[#f2ca50]/5 border border-[#f2ca50]/15 px-2 py-0.5 rounded uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px]">
                        <span className="font-sans font-semibold uppercase tracking-widest text-[#bab8b7]/40">
                          {item.category}
                        </span>
                        
                        {/* Admin Action buttons for dish */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingDish(item)}
                            className="neo-convex p-2 rounded-lg bg-[#131313] border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] transition-colors"
                            title="Edit Dish"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(item.id)}
                            className="neo-convex p-2 rounded-lg bg-red-950/20 border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'venue' && (
          <motion.div
            key="venue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Warning alert */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-amber-400 text-xs font-sans flex gap-3 items-start leading-relaxed max-w-2xl">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#f2ca50]" />
              <div>
                <strong>Capacity & Status Lock:</strong> Toggling the active statuses of dining areas immediately updates table reservation restrictions and availability flags across customer portals.
              </div>
            </div>

            {/* Venue Spaces Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {venueSpaces.map((space) => {
                // Ensure default status is assigned
                const currentStatus = space.status || 'Available';

                return (
                  <div
                    key={space.id}
                    className="neo-convex rounded-[2rem] bg-[#20201f] border border-white/5 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Visual Panel */}
                    <div className="h-44 relative overflow-hidden">
                      <img src={space.image} alt={space.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#20201f] via-[#20201f]/35 to-transparent"></div>
                      
                      {/* Active Status Ribbon */}
                      <span
                        className={`absolute top-4 right-4 text-[9px] font-sans font-bold tracking-widest px-2.5 py-1 rounded-md uppercase ${
                          currentStatus === 'Available'
                            ? 'bg-green-500/15 border border-green-500/20 text-green-400'
                            : currentStatus === 'Reserved'
                            ? 'bg-amber-500/15 border border-amber-500/20 text-amber-400'
                            : 'bg-red-500/15 border border-red-500/20 text-red-400'
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    {/* Description Details */}
                    <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="font-sans text-[8px] text-[#f2ca50] tracking-[0.3em] uppercase font-bold block">
                          {space.subtitle}
                        </span>
                        <h4 className="font-display text-xl text-white font-bold">{space.name}</h4>
                        <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                          {space.description}
                        </p>
                      </div>

                      {/* Controls and settings panel */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        {/* Interactive status toggler */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-[#bab8b7]/40 font-bold block">
                            Area Status
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['Available', 'Reserved', 'Under Maintenance'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateSpaceStatus(space.id, status)}
                                className={`px-2 py-1.5 rounded-lg text-[8px] font-sans font-bold tracking-wider uppercase border transition-all text-center ${
                                  currentStatus === status
                                    ? status === 'Available'
                                      ? 'bg-green-500/10 border-green-500/25 text-green-400'
                                      : status === 'Reserved'
                                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                      : 'bg-red-500/10 border-red-500/25 text-red-400'
                                    : 'bg-[#131313] border-white/5 text-[#bab8b7]/40 hover:text-[#bab8b7]'
                                }`}
                              >
                                {status === 'Under Maintenance' ? 'Maint.' : status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive capacity controller */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-[#bab8b7]/40 font-bold block">
                            Seating Capacity
                          </label>
                          <div className="neo-concave rounded-xl px-3 py-2 flex items-center bg-[#131313] border border-white/5 text-xs font-sans">
                            <input
                              type="text"
                              value={space.capacity}
                              onChange={(e) => handleUpdateSpaceCapacity(space.id, e.target.value)}
                              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-[#f2ca50] w-full"
                              placeholder="e.g. 12 Guests"
                            />
                          </div>
                        </div>

                        {/* Features display */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9px] uppercase tracking-widest text-[#bab8b7]/40 font-bold block">
                            Featured Amenities
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {space.features.map((feat) => (
                              <span
                                key={feat}
                                className="text-[8px] font-sans font-semibold tracking-wider text-[#bab8b7]/80 bg-[#131313] border border-white/5 px-2 py-1 rounded"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header info / Search and filter bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Search */}
              <div className="neo-concave rounded-xl px-4 py-2.5 flex items-center bg-[#131313] border border-white/5 text-xs font-sans w-full md:max-w-md gap-3">
                <Search className="w-4 h-4 text-[#bab8b7]/40" />
                <input
                  type="text"
                  placeholder="Search inquiries by name, email, subject..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white w-full font-semibold placeholder:text-[#bab8b7]/30"
                />
                {messageSearch && (
                  <button onClick={() => setMessageSearch('')} className="text-[#bab8b7]/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'unread', 'read', 'replied'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMessageFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-sans font-bold tracking-wider uppercase border transition-all ${
                      messageFilter === filter
                        ? 'bg-[#f2ca50]/15 border-[#f2ca50]/35 text-[#f2ca50] shadow-sm'
                        : 'bg-[#131313] border-white/5 text-[#bab8b7]/50 hover:text-[#bab8b7]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries list */}
            <div className="space-y-6">
              {(() => {
                const filteredMessages = contactMessages.filter((msg) => {
                  const matchesSearch =
                    msg.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                    msg.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
                    msg.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                    msg.message.toLowerCase().includes(messageSearch.toLowerCase());
                  const matchesFilter = messageFilter === 'all' || msg.status === messageFilter;
                  return matchesSearch && matchesFilter;
                });

                if (filteredMessages.length === 0) {
                  return (
                    <div className="neo-convex p-12 rounded-[2rem] bg-[#20201f] border border-white/5 text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-full bg-[#131313] border border-white/5 flex items-center justify-center text-[#bab8b7]/40 mx-auto">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display text-xl text-white font-bold">No Inquiries Found</h3>
                        <p className="font-sans text-xs text-[#bab8b7]/60 leading-relaxed">
                          {messageSearch || messageFilter !== 'all'
                            ? 'No messages match your active search terms or filters.'
                            : 'Your guest messaging inbox is currently clear.'}
                        </p>
                      </div>
                      {(messageSearch || messageFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setMessageSearch('');
                            setMessageFilter('all');
                          }}
                          className="neo-convex bg-[#f2ca50] text-[#131313] px-5 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#d4af37] transition-all"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredMessages.map((msg) => {
                      const hasResponse = msg.message.includes('\n\n--- Staff Response ---\n');
                      let originalMessage = msg.message;
                      let staffResponse = '';

                      if (hasResponse) {
                        const parts = msg.message.split('\n\n--- Staff Response ---\n');
                        originalMessage = parts[0];
                        staffResponse = parts[1];
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`neo-convex rounded-[2rem] p-6 md:p-8 bg-[#20201f] border transition-all ${
                            msg.status === 'unread' ? 'border-[#f2ca50]/20 shadow-[0_0_15px_rgba(242,202,80,0.02)]' : 'border-white/5'
                          }`}
                        >
                          {/* Top Metadata */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                            <div className="space-y-1">
                              <span className="font-sans text-[9px] text-[#bab8b7]/60 tracking-wider block font-bold uppercase">
                                Sender
                              </span>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <h4 className="font-display text-lg text-white font-bold">{msg.name}</h4>
                                <span className="font-sans text-xs text-[#bab8b7]">({msg.email})</span>
                              </div>
                              {msg.phone && (
                                <p className="font-mono text-[10px] text-[#bab8b7]/60">{msg.phone}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5">
                              {/* Date */}
                              <span className="font-sans text-[10px] text-[#bab8b7]/50 font-bold bg-[#131313] px-3 py-1 rounded-md border border-white/5 uppercase tracking-wide">
                                {msg.createdAt}
                              </span>
                              
                              {/* Status badge */}
                              <span
                                className={`text-[9px] font-sans font-bold tracking-widest px-2.5 py-1 rounded-md uppercase border ${
                                  msg.status === 'unread'
                                    ? 'bg-[#f2ca50]/15 border-[#f2ca50]/20 text-[#f2ca50]'
                                    : msg.status === 'replied'
                                    ? 'bg-green-500/15 border-green-500/20 text-green-400'
                                    : 'bg-white/5 border-white/10 text-[#bab8b7]'
                                }`}
                              >
                                {msg.status}
                              </span>
                            </div>
                          </div>

                          {/* Subject and content */}
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <span className="font-sans text-[9px] text-[#bab8b7]/60 tracking-wider block font-bold uppercase">
                                Subject
                              </span>
                              <h3 className="font-display text-lg text-white font-bold">{msg.subject}</h3>
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-sans text-[9px] text-[#bab8b7]/60 tracking-wider block font-bold uppercase">
                                Inquiry Details
                              </span>
                              <div className="p-4 rounded-2xl bg-[#131313]/60 border border-white/5 font-sans text-xs text-[#e5e2e1] leading-relaxed whitespace-pre-wrap italic">
                                "{originalMessage}"
                              </div>
                            </div>

                            {/* Staff Response block if it exists */}
                            {hasResponse && (
                              <div className="space-y-1.5">
                                <span className="font-sans text-[9px] text-[#f2ca50] tracking-wider block font-bold uppercase flex items-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5" />
                                  Official Staff Response
                                </span>
                                <div className="p-4 rounded-2xl bg-[#f2ca50]/5 border border-[#f2ca50]/10 font-sans text-xs text-[#e5e2e1] leading-relaxed whitespace-pre-wrap">
                                  {staffResponse}
                                </div>
                              </div>
                            )}

                            {/* Quick replies block */}
                            {replyingMessageId === msg.id && (
                              <div className="pt-4 border-t border-white/5 space-y-3">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase tracking-wider text-[#f2ca50] font-bold">Draft Official Response</label>
                                  <textarea
                                    rows={4}
                                    placeholder="Type your response to send to the guest..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full rounded-2xl px-4 py-3 bg-[#131313] text-xs text-[#e5e2e1] border border-white/5 focus:outline-none focus:ring-0 resize-none font-sans"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => {
                                      setReplyingMessageId(null);
                                      setReplyText('');
                                    }}
                                    className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-sans font-bold tracking-wider uppercase text-[#bab8b7] hover:text-white hover:border-white/20 transition-all"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSendReply(msg.id)}
                                    className="neo-convex px-4 py-2 bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] rounded-xl text-[10px] font-sans font-bold tracking-wider uppercase transition-all"
                                  >
                                    Send Response
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Action Controls Footer */}
                            {replyingMessageId !== msg.id && (
                              <div className="flex flex-wrap justify-between items-center pt-4 border-t border-white/5 gap-4">
                                {/* Left actions */}
                                <div className="flex gap-3">
                                  {msg.status === 'unread' ? (
                                    <button
                                      onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                                      className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase text-[#bab8b7] hover:text-white transition-all flex items-center gap-1.5"
                                    >
                                      <Check className="w-3.5 h-3.5 text-green-400" />
                                      Mark Read
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdateMessageStatus(msg.id, 'unread')}
                                      className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase text-[#bab8b7] hover:text-white transition-all flex items-center gap-1.5"
                                    >
                                      <Clock className="w-3.5 h-3.5 text-[#f2ca50]" />
                                      Mark Unread
                                    </button>
                                  )}

                                  {msg.status !== 'replied' && (
                                    <button
                                      onClick={() => {
                                        setReplyingMessageId(msg.id);
                                        setReplyText('');
                                      }}
                                      className="px-4 py-2 bg-[#f2ca50]/10 border border-[#f2ca50]/10 hover:border-[#f2ca50]/20 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase text-[#f2ca50] hover:text-[#f2ca50] transition-all flex items-center gap-1.5"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      Reply
                                    </button>
                                  )}
                                </div>

                                {/* Right delete */}
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="px-3 py-2 bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
                                  title="Delete inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header info / Search and filter bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Search */}
              <div className="neo-concave rounded-xl px-4 py-2.5 flex items-center bg-[#131313] border border-white/5 text-xs font-sans w-full md:max-w-md gap-3">
                <Search className="w-4 h-4 text-[#bab8b7]/40" />
                <input
                  type="text"
                  placeholder="Search orders by ID, name, city, address..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white w-full font-semibold placeholder:text-[#bab8b7]/30"
                />
                {orderSearch && (
                  <button onClick={() => setOrderSearch('')} className="text-[#bab8b7]/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'received', 'preparing', 'delivery', 'delivered', 'cancelled'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-sans font-bold tracking-wider uppercase border transition-all ${
                      orderFilter === filter
                        ? 'bg-[#f2ca50]/15 border-[#f2ca50]/35 text-[#f2ca50] shadow-sm'
                        : 'bg-[#131313] border-white/5 text-[#bab8b7]/50 hover:text-[#bab8b7]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-6">
              {(() => {
                const filteredOrders = orders.filter((ord) => {
                  const matchesSearch =
                    ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    ord.deliveryAddress.toLowerCase().includes(orderSearch.toLowerCase());
                  const matchesFilter = orderFilter === 'all' || ord.status === orderFilter;
                  return matchesSearch && matchesFilter;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="neo-convex p-12 rounded-[2rem] bg-[#20201f] border border-white/5 text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-full bg-[#131313] border border-white/5 flex items-center justify-center text-[#bab8b7]/40 mx-auto">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display text-xl text-white font-bold">No Orders Found</h3>
                        <p className="font-sans text-xs text-[#bab8b7]/60 leading-relaxed">
                          {orderSearch || orderFilter !== 'all'
                            ? 'No online orders match your active search terms or filters.'
                            : 'No customer orders have been placed yet.'}
                        </p>
                      </div>
                      {(orderSearch || orderFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setOrderSearch('');
                            setOrderFilter('all');
                          }}
                          className="neo-convex bg-[#f2ca50] text-[#131313] px-5 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#d4af37] transition-all"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((ord) => {
                      return (
                        <div
                          key={ord.id}
                          className={`neo-convex rounded-[2rem] p-6 md:p-8 bg-[#20201f] border transition-all ${
                            ord.status === 'received' ? 'border-[#f2ca50]/20 shadow-[0_0_15px_rgba(242,202,80,0.02)]' : 'border-white/5'
                          }`}
                        >
                          {/* Top Metadata */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                            <div className="space-y-1">
                              <span className="font-sans text-[9px] text-[#bab8b7]/60 tracking-wider block font-bold uppercase">
                                Customer
                              </span>
                              <div className="flex items-baseline gap-2 flex-wrap text-left">
                                <h4 className="font-display text-lg text-white font-bold">{ord.customerName}</h4>
                                <span className="font-sans text-xs text-[#bab8b7]">({ord.customerEmail})</span>
                              </div>
                              <p className="font-mono text-[10px] text-[#bab8b7]/60">Contact: {ord.customerPhone}</p>
                            </div>

                            <div className="flex items-center gap-2.5">
                              {/* Date */}
                              <span className="font-sans text-[10px] text-[#bab8b7]/50 font-bold bg-[#131313] px-3 py-1 rounded-md border border-white/5 uppercase tracking-wide">
                                {ord.createdAt}
                              </span>
                              
                              {/* Status badge */}
                              <span
                                className={`text-[9px] font-sans font-bold tracking-widest px-2.5 py-1 rounded-md uppercase border ${
                                  ord.status === 'received'
                                    ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                                    : ord.status === 'preparing'
                                    ? 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400'
                                    : ord.status === 'delivery'
                                    ? 'bg-blue-500/15 border-blue-500/20 text-blue-400'
                                    : ord.status === 'delivered'
                                    ? 'bg-green-500/15 border-green-500/20 text-green-400'
                                    : 'bg-red-500/15 border-red-500/20 text-red-400'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                          </div>

                          {/* Order Details Body */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left side: Items lists */}
                            <div className="lg:col-span-7 space-y-4 text-left">
                              <div className="space-y-2">
                                <span className="font-sans text-[9px] text-[#bab8b7]/60 tracking-wider block font-bold uppercase">
                                  Ordered Culinary Selection
                                </span>
                                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
                                  {ord.items.map((it, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-[#131313]/50 p-3 rounded-xl border border-white/5">
                                      <div className="space-y-0.5">
                                        <p className="text-white text-xs font-bold font-display">{it.menuItem.title}</p>
                                        <p className="text-[10px] text-[#bab8b7]/50">{it.menuItem.category}</p>
                                        {it.notes && (
                                          <p className="text-[10px] text-[#f2ca50]/70 italic font-medium">Notes: {it.notes}</p>
                                        )}
                                      </div>
                                      <div className="flex gap-4 items-center shrink-0 font-sans">
                                        <span className="text-[10px] text-[#bab8b7]/50 font-bold">Qty: {it.quantity}</span>
                                        <span className="text-white font-mono font-bold text-xs">{it.menuItem.price}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right side: Address and financial sums */}
                            <div className="lg:col-span-5 bg-[#131313]/30 p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 text-xs font-sans text-left">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <span className="text-[9px] text-[#bab8b7]/60 uppercase tracking-wider block font-bold">Delivery Location</span>
                                  <p className="text-[#e5e2e1] font-semibold leading-relaxed">{ord.deliveryAddress}</p>
                                </div>

                                <div className="space-y-1.5 border-t border-white/5 pt-2.5 text-[#bab8b7]">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-white">Rs. {ord.subtotal.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>GST Tax (10%)</span>
                                    <span className="font-mono text-white">Rs. {ord.tax.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-mono text-white">Rs. {ord.deliveryFee.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                                <span className="font-bold text-[#f2ca50] uppercase text-[9px] tracking-wider font-sans">Paid Total ({ord.paymentMethod.toUpperCase()})</span>
                                <span className="text-[#f2ca50] font-mono text-base font-bold">Rs. {ord.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Controls Footer */}
                          <div className="flex flex-wrap justify-between items-center pt-4 border-t border-white/5 gap-4 mt-6">
                            {/* Status Stepping Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {ord.status === 'received' && (
                                <button
                                  onClick={() => {
                                    setOrders((prev) =>
                                      prev.map((o) => (o.id === ord.id ? { ...o, status: 'preparing' } : o))
                                    );
                                  }}
                                  className="px-4 py-2 bg-[#f2ca50]/10 border border-[#f2ca50]/15 hover:border-[#f2ca50]/30 text-[#f2ca50] rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ChefHat className="w-3.5 h-3.5" />
                                  Start Preparing
                                </button>
                              )}

                              {ord.status === 'preparing' && (
                                <button
                                  onClick={() => {
                                    setOrders((prev) =>
                                      prev.map((o) => (o.id === ord.id ? { ...o, status: 'delivery' } : o))
                                    );
                                  }}
                                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 text-blue-400 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  Dispatch for Delivery
                                </button>
                              )}

                              {ord.status === 'delivery' && (
                                <button
                                  onClick={() => {
                                    setOrders((prev) =>
                                      prev.map((o) => (o.id === ord.id ? { ...o, status: 'delivered' } : o))
                                    );
                                  }}
                                  className="px-4 py-2 bg-green-500/10 border border-green-500/10 hover:border-green-500/20 text-green-400 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Complete Delivery
                                </button>
                              )}

                              {/* Direct Status dropdown override for quick adjustments */}
                              <div className="flex items-center gap-1 font-sans">
                                <span className="text-[8px] uppercase tracking-wider text-[#bab8b7]/40 font-bold mr-1">Status Override:</span>
                                <select
                                  value={ord.status}
                                  onChange={(e) => {
                                    const val = e.target.value as Order['status'];
                                    setOrders((prev) =>
                                      prev.map((o) => (o.id === ord.id ? { ...o, status: val } : o))
                                    );
                                  }}
                                  className="bg-[#131313] text-[#f2ca50] border border-white/5 rounded-lg px-2 py-1 text-[9px] uppercase font-bold focus:outline-none"
                                >
                                  <option value="received">Received</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="delivery">In Transit</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Right delete */}
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to permanently delete this order record?')) {
                                  setOrders((prev) => prev.filter((o) => o.id !== ord.id));
                                }
                              }}
                              className="px-3 py-2 bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-[9px] font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Record
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {activeTab === 'registry' && (
          <motion.div
            key="registry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="neo-convex p-8 rounded-3xl bg-[#131313] border border-white/5 space-y-2">
              <h2 className="font-display text-2xl text-white font-bold tracking-tight">
                Cabinet Staff Registry
              </h2>
              <p className="font-sans text-[#bab8b7] text-sm leading-relaxed">
                Add and manage staff credentials for the Kitchen Cabinet. Members listed here gain secure administrative clearance to customize menus, oversee orders, and moderate luxury table bookings.
              </p>
            </div>

            {/* Quick staff addition card */}
            <div className="neo-convex p-8 rounded-3xl bg-[#131313] border border-white/5 space-y-6">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Add Staff Member</h3>
              </div>

              {registryError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans">
                  {registryError}
                </div>
              )}
              {registrySuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl font-sans">
                  {registrySuccess}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRegistryError('');
                  setRegistrySuccess('');

                  if (!newStaffUid.trim()) {
                    setRegistryError('User UID is required.');
                    return;
                  }
                  if (!newStaffEmail.trim()) {
                    setRegistryError('Staff Google Email is required.');
                    return;
                  }
                  if (!newStaffName.trim()) {
                    setRegistryError('Staff Full Name is required.');
                    return;
                  }

                  try {
                    await onAddCabinetMember({
                      uid: newStaffUid.trim(),
                      email: newStaffEmail.trim().toLowerCase(),
                      name: newStaffName.trim(),
                      role: newStaffRole,
                      addedAt: new Date().toISOString().split('T')[0]
                    });
                    setRegistrySuccess(`Successfully inducted ${newStaffName} into the Kitchen Cabinet!`);
                    setNewStaffUid('');
                    setNewStaffEmail('');
                    setNewStaffName('');
                  } catch (err: any) {
                    setRegistryError(`Failed to add member: ${err.message || err}`);
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2 text-left">
                  <label className="font-sans text-xs font-bold text-[#bab8b7]/60 uppercase tracking-wider">
                    Staff Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sardar Usman"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl px-4 py-3 font-sans text-xs text-white focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="font-sans text-xs font-bold text-[#bab8b7]/60 uppercase tracking-wider">
                    Google Account Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. usman@gmail.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl px-4 py-3 font-sans text-xs text-white focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="font-sans text-xs font-bold text-[#bab8b7]/60 uppercase tracking-wider flex items-center gap-1.5">
                    User UID
                    <span className="text-[10px] lowercase text-[#bab8b7]/40 normal-case">(Obtained from user's Profile screen)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. o7XyZ29vS..."
                    value={newStaffUid}
                    onChange={(e) => setNewStaffUid(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl px-4 py-3 font-sans text-xs text-white focus:outline-none focus:border-[#f2ca50]/50 transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="font-sans text-xs font-bold text-[#bab8b7]/60 uppercase tracking-wider">
                    Culinary Role
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl px-4 py-3 font-sans text-xs text-white focus:outline-none focus:border-[#f2ca50]/50 transition-colors cursor-pointer"
                  >
                    <option value="Chef de Cuisine">Chef de Cuisine (Director)</option>
                    <option value="Maitre D'">Maitre D' (General Manager)</option>
                    <option value="Sous Chef">Sous Chef (Editor)</option>
                    <option value="Sommelier">Sommelier (Staff)</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-[#f2ca50] text-[#131313] font-sans text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-white hover:text-black transition-all cursor-pointer neo-convex flex items-center justify-center gap-2 border-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    Induct Staff Member
                  </button>
                </div>
              </form>
            </div>

            {/* List of members */}
            <div className="neo-convex p-8 rounded-3xl bg-[#131313] border border-white/5 space-y-6 text-left">
              <h3 className="font-display text-lg text-white font-bold tracking-tight">
                Current Kitchen Cabinet ({cabinetMembers.length + 1})
              </h3>

              <div className="divide-y divide-white/5">
                {/* Always render root owner */}
                <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm text-white font-medium">Zaviya Restaurant Owner</span>
                      <span className="px-2 py-0.5 rounded bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] text-[8px] font-sans uppercase font-bold tracking-wider">
                        Root Creator
                      </span>
                    </div>
                    <div className="font-sans text-xs text-[#bab8b7]/60">howsaim216@gmail.com</div>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-xs font-bold text-[#bab8b7]/40 uppercase tracking-wider">SYSTEM ROOT</span>
                  </div>
                </div>

                {cabinetMembers.map((member) => (
                  <div key={member.uid} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-white font-medium">{member.name}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 text-[8px] font-sans uppercase font-bold tracking-wider">
                          {member.role}
                        </span>
                      </div>
                      <div className="font-sans text-xs text-[#bab8b7]/60 flex items-center gap-2">
                        <span>{member.email}</span>
                        <span className="text-[#bab8b7]/20">•</span>
                        <span className="font-mono text-[10px] text-[#bab8b7]/30">{member.uid}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-[10px] text-[#bab8b7]/40 uppercase tracking-wider">
                        Inducted {member.addedAt}
                      </span>
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to remove ${member.name} from the Kitchen Cabinet?`)) {
                            try {
                              await onDeleteCabinetMember(member.uid);
                            } catch (err: any) {
                              alert(`Failed to delete member: ${err.message || err}`);
                            }
                          }
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                        title="Revoke Credentials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
