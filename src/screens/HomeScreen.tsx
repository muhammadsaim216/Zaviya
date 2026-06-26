/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PageId } from '../types';
import { Play, Leaf, ChefHat, Sparkles, ArrowRight, Calendar, Flame, Wine } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeScreenProps {
  onPageChange: (page: PageId) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function HomeScreen({ onPageChange, selectedDate, setSelectedDate }: HomeScreenProps) {
  const handleQuickBook = () => {
    onPageChange('reservations');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-4 md:px-16 py-12">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
          {/* Left Text */}
          <div className="space-y-8 text-left">
            <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
              AUTHENTIC MODERNISM
            </span>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.1] tracking-tight">
              A Fusion of <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f2ca50] to-[#d4af37]">
                Traditional Spices
              </span>
            </h1>
            <p className="font-sans text-[#bab8b7] text-base md:text-lg max-w-md leading-relaxed">
              Where heritage meets modern taste. Experience authentic Pakistani and international dishes crafted with care for a premium dining experience.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button
                onClick={() => onPageChange('menu')}
                className="neo-convex neo-glint px-10 py-4 rounded-xl bg-[#2a2a2a] font-sans font-semibold text-xs text-[#f2ca50] tracking-widest uppercase hover:scale-105 transition-all duration-300 active:shadow-inner"
              >
                VIEW MENU
              </button>
              <button
                onClick={() => onPageChange('venue')}
                className="flex items-center gap-3 font-sans font-semibold text-xs text-[#d0c5af] hover:text-[#f2ca50] tracking-widest uppercase transition-colors group"
              >
                <span className="neo-convex p-3.5 rounded-full group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-[#f2ca50] fill-[#f2ca50]/20" />
                </span>
                OUR STORY
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative">
            <div className="neo-convex rounded-[2rem] p-4 bg-[#20201f] overflow-hidden group">
              <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyNj87JvRcywrh1U_ND-9AMJwhvzl4NkKalVLdjRoSfJN6tH5CxAcngKiH0qF_-Z6aVB_s4vbVmTdufflOC35-f5jDT7uMhKuBopowIjWb0Z8e_ceOyEO-kyYepj738tISij-hhDpOm1x6iZVch4fV49Wnb33QEDu1P4xIH2UZQZSCEEeiPEKDFTDZuFse0Q1OPzp79q0Z7qq_cOILU1a4wL3lc3Efoa36TtFhZDWxbsoyd0dibJB9khDulDoLMu1BjrdPjJFILIg"
                  alt="A majestic biryani luxury dish"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/90 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 neo-convex p-6 md:p-8 bg-[#2a2a2a] rounded-2xl border border-white/5 max-w-[220px]">
                <p className="font-display text-lg text-[#f2ca50] mb-1 font-semibold leading-tight">Chef's Select</p>
                <p className="font-sans font-semibold text-[10px] text-[#bab8b7] tracking-widest uppercase">
                  SMOKY LAMB SHANK
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Philosophy Section */}
      <section id="philosophy-section" className="px-6 md:px-16 py-20 bg-[#0e0e0e]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="max-w-2xl text-left">
              <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase mb-4 block">
                PHILOSOPHY
              </span>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                Honoring Tradition <br />
                Through Innovation
              </h2>
            </div>
            <div className="lg:w-1/3 neo-concave p-8 rounded-2xl bg-[#131313]/40 text-left border border-white/5">
              <p className="font-sans text-sm md:text-base text-[#bab8b7] italic leading-relaxed">
                "Food is the true language of our culture. At Zaviya, we bring classic, authentic recipes to life with rich and memorable flavors."
              </p>
            </div>
          </div>

          {/* Philosophy Bento cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl neo-convex flex items-center justify-center text-[#f2ca50] bg-[#20201f] border border-white/5">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#e5e2e1]">Sourced Heritage</h3>
              <p className="font-sans text-sm text-[#bab8b7] leading-relaxed">
                Rare spices selected from the best sources, keeping the authentic taste of traditional cooking alive.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl neo-convex flex items-center justify-center text-[#f2ca50] bg-[#20201f] border border-white/5">
                <ChefHat className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#e5e2e1]">Expert Chefs</h3>
              <p className="font-sans text-sm text-[#bab8b7] leading-relaxed">
                Using high-quality ingredients and modern techniques to bring out rich aroma and classic flavor.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl neo-convex flex items-center justify-center text-[#f2ca50] bg-[#20201f] border border-white/5">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#e5e2e1]">Premium Dining</h3>
              <p className="font-sans text-sm text-[#bab8b7] leading-relaxed">
                A beautiful, comfortable dining space designed to let you enjoy your food and conversation in style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Masterpieces (Bento Grid) */}
      <section id="signature-collection" className="px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase mb-4 block">
              THE COLLECTION
            </span>
            <h2 className="font-display text-4xl md:text-5xl">Our Featured Dishes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Platter - Large Grid Card (span-8) */}
            <div className="md:col-span-8 md:row-span-2 neo-convex rounded-3xl overflow-hidden relative group p-6 md:p-10 flex flex-col justify-end min-h-[450px]">
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5QIkaeQt1Gbihrs7YirBU1B41INQM2yc2QPxuRiP5Fvt4iAcmjZksUoLTMMvh-wmMkHou7fHTu0qoNbYjPt1xfIQttnS2gbo3432QwVvdRrrmexgqMV4JL1GU5lmgx4nqzR4kN3OeGXlnGXX_KBge93Yrw2T8jRuMsQN0nCY8xN8YVtf_iHMjGQb1i3ujggwWxzsUMSVEo8R67p4hTqfcSNBJCqXfFt1gHhNK_HTzkYflLWGfVtf20hxmvDTk0TSnDM_tQTYxmNo"
                  alt="The Royal Platter south asian feast"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent"></div>
              </div>
              <div className="relative z-10 text-left space-y-3">
                <p className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.3em] uppercase">
                  CHEF'S SPECIAL
                </p>
                <h4 className="font-display text-3xl md:text-4xl text-white font-bold">The Royal Platter</h4>
                <p className="font-sans text-sm text-[#bab8b7] max-w-md">
                  A generous, traditional platter featuring seven of our best grilled meats and aromatic golden rice.
                </p>
              </div>
            </div>

            {/* Sizzler - Smoked Grid Card (span-4) */}
            <div className="md:col-span-4 neo-convex rounded-3xl bg-[#20201f] p-8 flex flex-col justify-between border border-white/5 text-left">
              <div className="flex justify-between items-start">
                <Flame className="w-10 h-10 text-[#f2ca50]" />
                <span className="font-sans font-semibold text-[10px] text-[#d0c5af] tracking-widest uppercase bg-[#131313] px-3 py-1.5 rounded-full border border-white/5">
                  NEW ARRIVAL
                </span>
              </div>
              <div className="space-y-2 pt-8">
                <h4 className="font-display text-2xl text-white font-semibold">Smoked Sizzler</h4>
                <p className="font-sans text-sm text-[#bab8b7] leading-relaxed">
                  Infused with applewood, sweet basil, and mountain wild peppers.
                </p>
              </div>
            </div>

            {/* Tikka - Image Grid Card (span-4) */}
            <div className="md:col-span-4 neo-convex rounded-3xl overflow-hidden relative group min-h-[220px]">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTo_Uz6Z3um866-5XRuE1gSIJHjL4PWB4jueajldE9rt14C84y9cwQZHIS_Epn8xWYOxkj1_a_U_GsWaVuKsBQFDEh47h7WwTZAoGKQBg6hDc0KMcpH2_Ix-R0Y9tE065a9VQGHwq0Smna_o2xC0Crt9cSlw7ma3Yi0rOuYNlsx0w8Pfml7CKNJ4YpRjlzO7CM9SvnBtJqgKC7iHmAYJkaBQdsg7OAkZIie3Y_rwJKLyxuOOxCDw5jRKXAne1_6JfrE3xi_yzL5GM"
                alt="Fire-Kissed Tikka"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 text-left">
                <h4 className="font-display text-xl text-white font-semibold">Fire-Kissed Tikka</h4>
              </div>
            </div>

            {/* Interactive Link - Explore Full Menu (span-4) */}
            <div
              onClick={() => onPageChange('menu')}
              className="md:col-span-4 neo-convex rounded-3xl bg-[#20201f] p-8 border border-white/5 group cursor-pointer hover:border-[#f2ca50]/20 transition-all text-left flex items-center"
            >
              <div className="flex items-center justify-between w-full">
                <div className="space-y-2">
                  <h4 className="font-display text-xl text-white font-semibold group-hover:text-[#f2ca50] transition-colors">
                    Explore Full Menu
                  </h4>
                  <p className="font-sans font-semibold text-[10px] text-[#d0c5af] tracking-widest uppercase">
                    120+ DELICIOUS DISHES
                  </p>
                </div>
                <span className="neo-convex p-3.5 rounded-full text-[#f2ca50] group-hover:translate-x-1.5 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Sommelier Selection - Wide bottom (span-8) */}
            <div className="md:col-span-8 neo-convex rounded-3xl bg-[#20201f] flex flex-col md:flex-row overflow-hidden border border-white/5 text-left">
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center space-y-4">
                <div className="w-10 h-10 rounded-xl neo-convex flex items-center justify-center text-[#f2ca50] bg-[#131313] border border-white/5">
                  <Wine className="w-5 h-5" />
                </div>
                <h4 className="font-display text-2xl text-white font-semibold">Specialty Drinks</h4>
                <p className="font-sans text-sm text-[#bab8b7] leading-relaxed">
                  A special selection of fresh mocktails, traditional coolers, and herbal drinks prepared fresh to match your meal.
                </p>
                <button
                  onClick={() => onPageChange('menu')}
                  className="text-[#f2ca50] font-sans font-semibold text-xs tracking-widest uppercase border-b border-[#f2ca50]/20 w-max pb-1 hover:border-[#f2ca50] transition-all"
                >
                  DISCOVER DRINKS
                </button>
              </div>
              <div className="flex-1 min-h-[220px] bg-[#2a2a2a]/40 neo-concave m-4 rounded-2xl relative overflow-hidden">
                <img
                  className="w-full h-full object-cover filter grayscale opacity-40 hover:opacity-60 transition-all duration-[1s]"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD43ICgbfLXY5CjOJD-9XgaVUYEZyGp2JR5gY3gZsAhyH347NjrLu1tRsHJ-eOS594Kl63IPv9ByZzgmCOxUWIoh-sPrALOmouHrsS6x0vFghRa84I6CaJBwr7nVdLCwuy89oPsjxSbdVbQTfZYvCu7Ks2E4xyzOx73IbH-Sl6q0Q8foL19qXM1Q43_LvLR--vwAMf-SIc8D-j6bKFEvILJHQEpKjmCYoUOlJI7SpTDVmDMeHgHkK0xNkXWemQJ__YRhLzk-zawCw4"
                  alt="Wine selection cellar close-up"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation CTA banner */}
      <section className="px-6 md:px-16 py-12">
        <div className="max-w-5xl mx-auto neo-convex rounded-[3rem] p-12 md:p-16 text-center bg-[#20201f] border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1f1f1f]/20 via-transparent to-[#0a0a0a]/20 pointer-events-none"></div>
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-white">Reserve Your Table</h2>
            <p className="font-sans text-[#bab8b7] text-sm md:text-base leading-relaxed">
              Our tables fill up quickly. Book your table in advance for a wonderful dining experience with family and friends.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
              <div className="neo-concave rounded-xl px-6 py-4 flex items-center gap-4 bg-[#131313] w-full md:w-auto border border-white/5">
                <Calendar className="w-5 h-5 text-[#f2ca50]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-[#e5e2e1] font-sans font-semibold text-xs tracking-widest uppercase cursor-pointer"
                />
              </div>
              <button
                onClick={handleQuickBook}
                className="neo-convex neo-convex-active px-10 py-5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all w-full md:w-auto"
              >
                BOOK A TABLE
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
