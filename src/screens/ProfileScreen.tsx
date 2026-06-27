/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, Truck, ChefHat, Sparkles, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Order, PageId } from '../types';
import { signInWithGoogle, logOut, subscribeToSingleOrder } from '../lib/firebase';
import { User } from 'firebase/auth';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  orders: Order[];
  onPageChange: (page: PageId) => void;
  currentUser: User | null;
}

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  orders,
  onPageChange,
  currentUser
}: ProfileScreenProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Sync formData with profile prop updates (e.g., when signing in loads profile from DB)
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  // Real-time listener for the active selected order being tracked
  useEffect(() => {
    if (!selectedOrder) return;
    const unsub = subscribeToSingleOrder(selectedOrder.id, (updatedOrder) => {
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    });
    return () => {
      unsub();
    };
  }, [selectedOrder ? selectedOrder.id : null]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 1000);
  };

  // Status Stepper helpers
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Received', desc: 'Order confirmed by kitchen', icon: Package },
    { label: 'Preparing', desc: 'Chef is crafting your spices', icon: ChefHat },
    { label: 'In Transit', desc: 'Out for premium delivery', icon: Truck },
    { label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 }
  ];

  const currentStep = selectedOrder ? getStatusStep(selectedOrder.status) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20 text-left"
    >
      {/* Page Title */}
      <div className="text-center space-y-4 mb-16">
        <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
          MEMBERSHIP CLUB
        </span>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white">
          Your{' '}
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f2ca50] to-[#d4af37]">
            Guest Profile
          </span>
        </h1>
        <p className="font-sans text-[#bab8b7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Manage your luxury delivery credentials, saved locations, and track your active master culinary orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Edit Profile details (5 cols) */}
        <div className="lg:col-span-5 neo-convex p-8 md:p-10 rounded-[2.5rem] bg-[#20201f] border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#f2ca50]" />
            <h2 className="font-display text-2xl text-white font-bold">Account Settings</h2>
          </div>

          {/* Authentication Status Header */}
          <div className="space-y-4">
            {!currentUser ? (
              <div className="p-5 rounded-2xl bg-[#ffb000]/5 border border-[#ffb000]/10 text-xs font-sans space-y-3">
                <div className="flex justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#ffb000] uppercase tracking-wider block text-[9px]">Unauthenticated Guest</span>
                    <p className="text-[#bab8b7]/60 leading-relaxed">Login to synchronize your credentials and past culinary orders across sessions.</p>
                  </div>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="neo-convex bg-[#f2ca50] text-[#131313] hover:bg-[#d4af37] px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Connect
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10 text-xs font-sans space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-green-500/20 shrink-0" alt="Avatar" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-green-400 uppercase tracking-wider block text-[9px]">Verified Member</span>
                      <p className="text-white font-semibold truncate text-[11px]">{currentUser.displayName || currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => logOut()}
                    className="neo-convex bg-red-500/10 border border-red-500/20 hover:border-red-500/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-sans flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-semibold">Your delivery credentials have been updated successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#f2ca50]" />
                Full Name
              </label>
              <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarmad Iqbal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-sans"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f2ca50]" />
                Email Address
              </label>
              <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                <input
                  type="email"
                  required
                  placeholder="sarmad@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-sans"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f2ca50]" />
                Mobile Contact
              </label>
              <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                <input
                  type="tel"
                  required
                  placeholder="+92 333 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-mono"
                />
              </div>
            </div>

            {/* Delivery Street Address */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f2ca50]" />
                Delivery Street Address
              </label>
              <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                <input
                  type="text"
                  required
                  placeholder="House #, Street name, Block / Area..."
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-sans"
                />
              </div>
            </div>

            {/* Apartment/Suite/Floor */}
            <div className="space-y-2.5">
              <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider">
                Apartment / Suite / Floor <span className="text-[#bab8b7]/40 font-normal lowercase">(optional)</span>
              </label>
              <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                <input
                  type="text"
                  placeholder="Apartment B4, 3rd Floor..."
                  value={formData.apartmentSuite || ''}
                  onChange={(e) => setFormData({ ...formData, apartmentSuite: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-sans"
                />
              </div>
            </div>

            {/* City & Zip Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider">City</label>
                <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                  <input
                    type="text"
                    required
                    placeholder="Islamabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-sans"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider">Postal Code</label>
                <div className="neo-concave rounded-xl px-4 py-3 bg-[#131313] border border-white/5">
                  <input
                    type="text"
                    placeholder="44000"
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white font-semibold tracking-wide w-full font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="neo-convex w-full bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] py-4 rounded-xl font-sans font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? <span>Saving Credentials...</span> : <span>Save Address Details</span>}
            </button>
          </form>
        </div>

        {/* Right Column: Order History and Tracking Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active / Selected Order Tracking Stepper */}
          {selectedOrder && (
            <div className="neo-convex rounded-[2.5rem] p-8 bg-[#20201f] border border-[#f2ca50]/20 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#f2ca50] font-bold uppercase tracking-wider">Active Track</span>
                  <h3 className="font-display text-xl text-white font-bold">Order #{selectedOrder.id.substring(4, 10).toUpperCase()}</h3>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="text-xs text-[#bab8b7] hover:text-[#f2ca50] border border-white/10 hover:border-[#f2ca50]/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Close Tracker
                </button>
              </div>

              {/* Status Stepper */}
              {selectedOrder.status === 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans text-center">
                  This culinary order has been cancelled.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 relative z-10">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    const isDone = idx <= currentStep;
                    const isActive = idx === currentStep;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center space-y-3 relative group">
                        {/* Stepper Dot */}
                        <div
                          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                            isDone
                              ? 'bg-[#f2ca50] border-[#f2ca50] text-[#131313] shadow-[0_0_15px_rgba(242,202,80,0.3)]'
                              : 'bg-[#131313] border-white/10 text-[#bab8b7]/40'
                          } ${isActive ? 'scale-110 animate-pulse' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <p className={`font-display text-xs font-bold ${isDone ? 'text-[#f2ca50]' : 'text-[#bab8b7]/40'}`}>
                            {st.label}
                          </p>
                          <p className="font-sans text-[9px] text-[#bab8b7]/50 max-w-[120px] mx-auto leading-tight">
                            {st.desc}
                          </p>
                        </div>

                        {/* Connector Line (Desktop) */}
                        {idx < 3 && (
                          <div className="hidden md:block absolute left-[calc(50%+1.5rem)] top-6 w-[calc(100%-3rem)] h-[2px] bg-white/5 -z-10">
                            <div
                              className="h-full bg-[#f2ca50] transition-all duration-1000"
                              style={{ width: idx < currentStep ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order Details list */}
              <div className="border-t border-white/5 pt-6 space-y-4 text-xs font-sans">
                <h4 className="font-display text-base text-white font-bold">Items Placed</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#131313]/40 p-3 rounded-xl border border-white/5">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold">{it.menuItem.title}</span>
                        {it.notes && <p className="text-[10px] text-[#bab8b7]/50 italic">Notes: {it.notes}</p>}
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-[#bab8b7] text-[10px] font-semibold">Qty: {it.quantity}</span>
                        <span className="text-[#f2ca50] font-mono font-bold">{it.menuItem.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#bab8b7]/60 uppercase tracking-wider block font-bold">Destination</span>
                    <p className="text-white text-[11px] leading-relaxed font-semibold">{selectedOrder.deliveryAddress}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-[#bab8b7]/60 uppercase tracking-wider block font-bold">Paid Total</span>
                    <p className="text-[#f2ca50] text-lg font-mono font-bold">Rs. {selectedOrder.total.toLocaleString()}</p>
                    <span className="text-[9px] text-[#bab8b7]/50 uppercase tracking-widest block font-bold">
                      {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid luxury Card'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Orders Card */}
          <div className="neo-convex p-8 rounded-[2.5rem] bg-[#20201f] border border-white/5 space-y-6">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#f2ca50]" />
                <h2 className="font-display text-2xl text-white font-bold">Your Orders ({orders.length})</h2>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#131313] border border-white/5 flex items-center justify-center text-[#bab8b7]/20 mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg text-white font-bold">No Cuisine Placed Yet</p>
                  <p className="font-sans text-xs text-[#bab8b7]/60 max-w-xs mx-auto leading-relaxed">
                    Explore our modern Pakistani menu filled with heritage recipes and order premium delivery.
                  </p>
                </div>
                <button
                  onClick={() => onPageChange('menu')}
                  className="neo-convex bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] px-6 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider transition-all"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {orders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  const totalItems = ord.items.reduce((acc, current) => acc + current.quantity, 0);

                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`neo-convex rounded-2xl p-5 bg-[#131313]/50 border cursor-pointer hover:border-[#f2ca50]/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isSelected ? 'border-[#f2ca50]/30 bg-[#20201f]' : 'border-white/5'
                      }`}
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs text-[#f2ca50] font-bold">
                            #{ord.id.substring(4, 10).toUpperCase()}
                          </span>
                          <span className="text-[10px] text-[#bab8b7]/40 font-semibold">•</span>
                          <span className="text-[10px] font-sans text-[#bab8b7]/60 font-semibold uppercase tracking-wider bg-[#131313] px-2.5 py-0.5 rounded-md border border-white/5">
                            {ord.createdAt}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#e5e2e1] font-semibold">
                          {totalItems} item{totalItems > 1 ? 's' : ''} •{' '}
                          <span className="text-[#bab8b7] font-normal italic">
                            {ord.items.map((i) => i.menuItem.title).join(', ')}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-white/5 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="text-[#f2ca50] font-mono text-sm font-bold block">
                            Rs. {ord.total.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-[#bab8b7]/40 block uppercase tracking-wider font-semibold">
                            {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid Card'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
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
                          <ChevronRight className="w-4 h-4 text-[#bab8b7]/30" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
