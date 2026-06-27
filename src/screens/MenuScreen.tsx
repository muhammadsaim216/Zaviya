/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageId, MenuItem, CartItem } from '../types';
import { Search, Star, Sparkles, Check, Utensils, Award, ShoppingBag, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuScreenProps {
  onPageChange: (page: PageId) => void;
  interestedDishes: string[];
  onToggleInterest: (dishTitle: string) => void;
  menuItems: MenuItem[];
  onAddToCart?: (menuItem: MenuItem) => void;
  cart?: CartItem[];
  onShareMenuItem?: (menuItem: MenuItem) => void;
}

export default function MenuScreen({
  onPageChange,
  interestedDishes,
  onToggleInterest,
  menuItems,
  onAddToCart,
  cart = [],
  onShareMenuItem
}: MenuScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Gastronomy', 'Shinwari', 'BBQ', 'International', 'Patisserie'];

  const filteredItems = menuItems.filter((item) => {
    const hasRealItems = menuItems.some(i => i.id !== 'placeholder-item');
    if (hasRealItems && item.id === 'placeholder-item') {
      return false;
    }
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-16 max-w-7xl mx-auto px-6 md:px-16 py-12"
    >
      {/* Page Header */}
      <div className="text-center space-y-4">
        <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
          OUR MENU
        </span>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight">
          Explore Our{' '}
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f2ca50] to-[#d4af37]">
            Delicious Dishes
          </span>
        </h1>
        <p className="font-sans text-[#bab8b7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          A beautiful selection of traditional Pakistani dishes, BBQ specialties, and international favorites. Select your favorite items below.
        </p>
      </div>

      {/* Search and Category Control Bar */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between border-y border-white/5 py-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-sans font-semibold text-[10px] tracking-widest uppercase px-6 py-3 rounded-full transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'neo-pressed active-pill text-[#f2ca50]'
                  : 'neo-convex text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="neo-concave rounded-xl flex items-center px-4 py-3 bg-[#131313] w-full lg:max-w-sm border border-white/5 relative">
          <Search className="w-4 h-4 text-[#f2ca50]/70 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/40 font-sans tracking-wide w-full"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const isInterested = interestedDishes.includes(item.title);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="neo-convex rounded-3xl p-6 bg-[#20201f] border border-white/5 flex flex-col sm:flex-row gap-6 relative group"
              >
                {/* Product Image Panel (if image exist) */}
                {item.image ? (
                  <div className="w-full sm:w-40 h-48 sm:h-40 rounded-2xl overflow-hidden relative flex-shrink-0">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      src={item.image}
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-full sm:w-40 h-48 sm:h-40 rounded-2xl bg-[#1a1a19] neo-concave flex flex-col items-center justify-center text-[#bab8b7]/20 flex-shrink-0 border border-white/5">
                    <Utensils className="w-10 h-10 mb-2 text-[#f2ca50]/40" />
                    <span className="font-sans text-[10px] tracking-wider uppercase font-semibold">House Recipe</span>
                  </div>
                )}

                {/* Card Details */}
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-2">
                      <h3 className="font-display text-lg md:text-xl text-white font-bold leading-tight flex flex-wrap items-center gap-2">
                        {item.title}
                        {item.signature && <Award className="w-4 h-4 text-[#f2ca50] inline-block shrink-0" />}
                      </h3>
                      <span className="neo-concave px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#f2ca50] border border-white/5 w-fit shrink-0">
                        {item.price}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags list */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-sans font-bold tracking-widest text-[#f2ca50]/90 bg-[#f2ca50]/5 border border-[#f2ca50]/15 px-2.5 py-0.5 rounded-md uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5 gap-2">
                    <span className="font-sans text-[10px] text-[#f2ca50]/70 tracking-widest uppercase font-semibold">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Share Button */}
                      <button
                        onClick={() => onShareMenuItem && onShareMenuItem(item)}
                        className="neo-convex rounded-xl p-2 flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        title="Share dynamic luxury preview card"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Interested Selection button */}
                      <button
                        onClick={() => onToggleInterest(item.title)}
                        className={`neo-convex rounded-xl px-3 py-2 flex items-center gap-1.5 text-[9px] tracking-widest uppercase font-sans font-bold transition-all duration-300 cursor-pointer ${
                          isInterested
                            ? 'neo-pressed active-pill text-[#f2ca50]'
                            : 'text-[#d0c5af] hover:text-[#f2ca50]'
                        }`}
                        title="Show interest for booking"
                      >
                        {isInterested ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#f2ca50]" />
                            Interested
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5" />
                            Interested
                          </>
                        )}
                      </button>

                      {/* Add to Online Order button */}
                      {(() => {
                        const cartItem = cart.find((it) => it.menuItem.id === item.id);
                        const isInCart = !!cartItem;
                        const cartQuantity = cartItem ? cartItem.quantity : 0;

                        return (
                          <button
                            onClick={() => onAddToCart && onAddToCart(item)}
                            className={`neo-convex rounded-xl px-3 py-2 flex items-center gap-1.5 text-[9px] tracking-widest uppercase font-sans font-bold transition-all duration-300 cursor-pointer ${
                              isInCart
                                ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/30 text-[#f2ca50]'
                                : 'text-[#d0c5af] hover:text-[#f2ca50]'
                            }`}
                            title="Add to online order bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isInCart ? `In Bag (${cartQuantity})` : 'Order'}</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty Fallback */}
      {filteredItems.length === 0 && (
        <div className="text-center py-24 neo-concave rounded-3xl max-w-xl mx-auto p-12 space-y-4">
          <Utensils className="w-12 h-12 text-[#bab8b7]/30 mx-auto" />
          <h3 className="font-display text-xl text-[#bab8b7] font-semibold">No Masterpieces Found</h3>
          <p className="font-sans text-xs text-[#bab8b7]/60 max-w-xs mx-auto">
            Our library is dynamic. Try searching with different terms or selecting another category above.
          </p>
        </div>
      )}

      {/* Floating Interest Cart Banner */}
      {interestedDishes.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 neo-convex bg-[#20201f] border border-[#f2ca50]/20 rounded-2xl px-8 py-4 flex items-center justify-between gap-8 max-w-md w-[90%] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <div className="neo-concave p-2 rounded-lg text-[#f2ca50]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-display text-sm font-semibold text-white">
                {interestedDishes.length} Selected Spices
              </p>
              <p className="font-sans text-[10px] text-[#bab8b7]">Synced with reservation form</p>
            </div>
          </div>
          <button
            onClick={() => onPageChange('reservations')}
            className="neo-convex px-5 py-2 rounded-xl text-[10px] text-[#f2ca50] font-sans font-bold uppercase tracking-widest hover:brightness-110"
          >
            Book Table
          </button>
        </div>
      )}
    </motion.div>
  );
}
