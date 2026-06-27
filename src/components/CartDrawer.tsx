/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, MapPin, CreditCard, Lock, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, UserProfile, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (menuItemId: string, delta: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onClearCart: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  onPageChange: (page: 'profile' | 'menu') => void;
}

type DrawerView = 'cart' | 'checkout' | 'success';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  profile,
  onUpdateProfile,
  onPlaceOrder,
  onPageChange
}: CartDrawerProps) {
  const [view, setView] = useState<DrawerView>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  
  // Checkout address editing state if they want to modify it during checkout
  const [checkoutAddress, setCheckoutAddress] = useState<UserProfile>({ ...profile });
  const [isPlacing, setIsPlacing] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  // Sync profile to local checkoutAddress when view shifts to checkout
  React.useEffect(() => {
    if (view === 'checkout') {
      setCheckoutAddress({ ...profile });
    }
  }, [view, profile]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cart.reduce((acc, it) => {
    // Parse price e.g. "Rs. 1,250" or "Rs. 950" to number
    const numericPrice = parseInt(it.menuItem.price.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + numericPrice * it.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.10); // 10% Luxury luxury GST
  const deliveryFee = subtotal > 0 ? 250 : 0; // delivery fee
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrderClick = () => {
    // Validation
    if (!checkoutAddress.name || !checkoutAddress.phone || !checkoutAddress.streetAddress || !checkoutAddress.city) {
      alert('Please fill out all required contact and delivery details first!');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        alert('Please complete the luxury card details to process your premium order.');
        return;
      }
    }

    setIsPlacing(true);

    // Save edited profile if they completed checkout
    onUpdateProfile(checkoutAddress);

    setTimeout(() => {
      const generatedId = `ord-${Math.floor(100000 + Math.random() * 900000)}`;
      setNewOrderId(generatedId);

      onPlaceOrder({
        customerName: checkoutAddress.name,
        customerEmail: checkoutAddress.email,
        customerPhone: checkoutAddress.phone,
        deliveryAddress: `${checkoutAddress.streetAddress}${
          checkoutAddress.apartmentSuite ? `, ${checkoutAddress.apartmentSuite}` : ''
        }, ${checkoutAddress.city}`,
        items: [...cart],
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod
      });

      setIsPlacing(false);
      setView('success');
      onClearCart();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-[#131313] border-l border-white/5 flex flex-col shadow-2xl z-10 text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1c1c1b]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#f2ca50]" />
                <h3 className="font-display text-xl text-white font-bold">
                  {view === 'cart' ? 'Your Culinary Bag' : view === 'checkout' ? 'Premium Checkout' : 'Order Placed!'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="neo-convex p-2 rounded-full text-[#bab8b7] hover:text-[#f2ca50] active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content View: Cart List */}
            {view === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-[60%] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#20201f] border border-white/5 flex items-center justify-center text-[#bab8b7]/20">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-lg text-white font-bold">Your Bag is Empty</h4>
                        <p className="font-sans text-xs text-[#bab8b7]/60 max-w-xs mx-auto leading-relaxed">
                          Add our handcrafted modern heritage recipes to your cart and treat your palate to rich Pakistani cuisine.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onPageChange('menu');
                          onClose();
                        }}
                        className="neo-convex bg-[#f2ca50] text-[#131313] px-6 py-2.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider hover:bg-[#d4af37] transition-all"
                      >
                        Browse Gourmet Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((it) => {
                        return (
                          <div
                            key={it.menuItem.id}
                            className="neo-convex p-4 rounded-2xl bg-[#20201f] border border-white/5 flex gap-4 items-center"
                          >
                            {/* Icon / Image */}
                            {it.menuItem.image ? (
                              <img
                                src={it.menuItem.image}
                                alt={it.menuItem.title}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/5"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-[#131313] border border-white/5 flex items-center justify-center text-[#f2ca50] shrink-0 font-display text-xl font-bold">
                                Z
                              </div>
                            )}

                            {/* Item details */}
                            <div className="flex-grow space-y-1">
                              <h4 className="font-display text-sm text-white font-bold">{it.menuItem.title}</h4>
                              <p className="font-sans text-[10px] text-[#bab8b7]/50">{it.menuItem.category}</p>
                              <p className="font-mono text-xs text-[#f2ca50] font-semibold">{it.menuItem.price}</p>
                              
                              {/* Option notes */}
                              <input
                                type="text"
                                placeholder="Add kitchen instructions (e.g., spice level)..."
                                value={it.notes || ''}
                                onChange={(e) => {
                                  // Update item notes inline
                                  it.notes = e.target.value;
                                  // Trigger a re-render by updating state
                                  onUpdateQuantity(it.menuItem.id, 0); 
                                }}
                                className="bg-transparent border-none p-0 focus:ring-0 text-[9px] text-[#bab8b7]/50 placeholder:text-[#bab8b7]/30 italic w-full focus:text-white"
                              />
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-end gap-3 justify-between shrink-0 h-full min-h-[70px]">
                              <button
                                onClick={() => onRemoveItem(it.menuItem.id)}
                                className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="neo-concave rounded-lg bg-[#131313] border border-white/5 flex items-center p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(it.menuItem.id, -1)}
                                  className="p-1 text-[#bab8b7] hover:text-[#f2ca50] hover:bg-white/5 rounded"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-mono text-xs text-white font-bold">{it.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(it.menuItem.id, 1)}
                                  className="p-1 text-[#bab8b7] hover:text-[#f2ca50] hover:bg-white/5 rounded"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer calculations */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 bg-[#1c1c1b] space-y-4">
                    <div className="space-y-2 text-xs font-sans text-[#bab8b7]">
                      <div className="flex justify-between">
                        <span>Gastronomy Subtotal</span>
                        <span className="font-mono text-white">Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5">
                          Luxury Service GST <span className="text-[9px] bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-1.5 py-0.2 rounded-md text-[#f2ca50] font-bold">10%</span>
                        </span>
                        <span className="font-mono text-white">Rs. {tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Royal Delivery &amp; Shield</span>
                        <span className="font-mono text-white">Rs. {deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-white/5 pt-3 flex justify-between text-base font-display text-white font-bold">
                        <span>Aggregate Total</span>
                        <span className="font-mono text-[#f2ca50]">Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setView('checkout')}
                      className="neo-convex w-full bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] py-4 rounded-xl font-sans font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Premium Checkout</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Content View: Checkout View */}
            {view === 'checkout' && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Delivery Location & Credentials */}
                  <div className="neo-convex p-5 rounded-2xl bg-[#20201f] border border-white/5 space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="font-display text-sm text-white font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#f2ca50]" />
                        Delivery Credentials
                      </span>
                      <span className="text-[9px] text-[#bab8b7]/40 uppercase font-bold">Auto-Syncs</span>
                    </div>

                    <div className="space-y-4">
                      {/* Name & Phone */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">Recipient Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Recipient Name"
                            value={checkoutAddress.name}
                            onChange={(e) => setCheckoutAddress({ ...checkoutAddress, name: e.target.value })}
                            className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">Mobile Phone</label>
                          <input
                            type="tel"
                            required
                            placeholder="+92 333 1234567"
                            value={checkoutAddress.phone}
                            onChange={(e) => setCheckoutAddress({ ...checkoutAddress, phone: e.target.value })}
                            className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="recipient@example.com"
                          value={checkoutAddress.email}
                          onChange={(e) => setCheckoutAddress({ ...checkoutAddress, email: e.target.value })}
                          className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none"
                        />
                      </div>

                      {/* Street Address */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">Street Address / House #</label>
                        <input
                          type="text"
                          required
                          placeholder="House #, Street name, Sector/Block..."
                          value={checkoutAddress.streetAddress}
                          onChange={(e) => setCheckoutAddress({ ...checkoutAddress, streetAddress: e.target.value })}
                          className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none"
                        />
                      </div>

                      {/* Apartment / Suite */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">Apt / Floor (Optional)</label>
                          <input
                            type="text"
                            placeholder="Apt, Floor etc."
                            value={checkoutAddress.apartmentSuite || ''}
                            onChange={(e) => setCheckoutAddress({ ...checkoutAddress, apartmentSuite: e.target.value })}
                            className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-[#bab8b7]/50 font-bold uppercase tracking-wider">City</label>
                          <input
                            type="text"
                            required
                            placeholder="Islamabad"
                            value={checkoutAddress.city}
                            onChange={(e) => setCheckoutAddress({ ...checkoutAddress, city: e.target.value })}
                            className="w-full rounded-xl px-3.5 py-2.5 bg-[#131313] text-xs text-white border border-white/5 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="neo-convex p-5 rounded-2xl bg-[#20201f] border border-white/5 space-y-4 text-xs font-sans">
                    <span className="font-display text-sm text-white font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                      <CreditCard className="w-4 h-4 text-[#f2ca50]" />
                      Payment Modality
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-4 rounded-xl border font-sans font-bold text-[10px] uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50]'
                            : 'bg-[#131313] border-white/5 text-[#bab8b7]/50 hover:text-[#bab8b7]'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Cash on Delivery
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border font-sans font-bold text-[10px] uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50]'
                            : 'bg-[#131313] border-white/5 text-[#bab8b7]/50 hover:text-[#bab8b7]'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        Luxury Metal Card
                      </button>
                    </div>

                    {/* Premium Credit Card form */}
                    {paymentMethod === 'card' && (
                      <div className="p-4 rounded-2xl bg-[#131313] border border-[#f2ca50]/25 space-y-4 mt-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2ca50]/5 rounded-full blur-2xl pointer-events-none" />
                        <span className="text-[9px] text-[#f2ca50] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-3 h-3" />
                          Secure Premium Checkout Gate
                        </span>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-[#bab8b7]/50 font-bold uppercase">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="SARMAD IQBAL"
                              value={cardData.name}
                              onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                              className="w-full bg-[#1c1c1b] border border-white/5 rounded-xl px-3 py-2 text-xs text-white uppercase font-sans placeholder:opacity-20"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-[#bab8b7]/50 font-bold uppercase">Card Number</label>
                            <input
                              type="text"
                              maxLength={19}
                              placeholder="4000 1234 5678 9010"
                              value={cardData.number}
                              onChange={(e) => {
                                // Simple auto space formatting
                                const val = e.target.value.replace(/\s?/g, '').replace(/[^0-9]/g, '');
                                let formatted = '';
                                for (let i = 0; i < val.length; i++) {
                                  if (i > 0 && i % 4 === 0) formatted += ' ';
                                  formatted += val[i];
                                }
                                setCardData({ ...cardData, number: formatted });
                              }}
                              className="w-full bg-[#1c1c1b] border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:opacity-20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] text-[#bab8b7]/50 font-bold uppercase">Expiration Date</label>
                              <input
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/[^0-9]/g, '');
                                  if (val.length > 2) {
                                    val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                  }
                                  setCardData({ ...cardData, expiry: val });
                                }}
                                className="w-full bg-[#1c1c1b] border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:opacity-20 text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-[#bab8b7]/50 font-bold uppercase">Security Code (CVV)</label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="***"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                                className="w-full bg-[#1c1c1b] border border-white/5 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:opacity-20 text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and place order */}
                <div className="p-6 border-t border-white/5 bg-[#1c1c1b] space-y-4">
                  <div className="space-y-2 text-xs font-sans text-[#bab8b7]">
                    <div className="flex justify-between font-display text-base text-white font-bold">
                      <span>Total Amount due</span>
                      <span className="font-mono text-[#f2ca50]">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setView('cart')}
                      className="px-4 py-3.5 border border-white/10 hover:border-white/20 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider text-[#bab8b7] hover:text-white transition-all text-center"
                    >
                      Back to Cart
                    </button>
                    <button
                      onClick={handlePlaceOrderClick}
                      disabled={isPlacing}
                      className="neo-convex bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] py-3.5 rounded-xl font-sans font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      {isPlacing ? <span>Placing...</span> : <span>Place Premium Order</span>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Content View: Success screen */}
            {view === 'success' && (
              <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#f2ca50]/2 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shadow-[0_0_20px_rgba(242,202,80,0.15)]"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>

                <div className="space-y-2.5 max-w-sm">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#f2ca50] tracking-[0.3em]">CONGRATULATIONS</span>
                  <h3 className="font-display text-2xl text-white font-bold leading-tight">Your Gastronomy Order is Secured!</h3>
                  <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                    Order ID <span className="font-mono font-bold text-white uppercase">{newOrderId.substring(4)}</span> has been registered and dispatched to Zaviya chefs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#20201f] border border-white/5 w-full text-left font-sans text-[11px] text-[#bab8b7] leading-relaxed space-y-1.5 max-w-sm">
                  <span className="font-bold text-white block uppercase text-[9px] tracking-wider mb-1 text-[#f2ca50]">WHAT TO EXPECT NEXT</span>
                  <p>• Our kitchen supervisor is wrapping up spices and validating ingredients.</p>
                  <p>• Your premium order is viewable live on your Guest profile tab.</p>
                  <p>• Tracking progress updates directly dynamically inside the order dashboard.</p>
                </div>

                <button
                  onClick={() => {
                    setView('cart');
                    onPageChange('profile');
                    onClose();
                  }}
                  className="neo-convex w-full max-w-sm bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] py-4 rounded-xl font-sans font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Track Live Order</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
