/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
}

export default function Header({ activePage, onPageChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMobileNav = (page: PageId, scrollTarget?: string) => {
    onPageChange(page);
    setIsOpen(false);
    if (scrollTarget) {
      setTimeout(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-16 py-6 sticky top-0 z-50 bg-[#131313]/95 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Brand logo */}
      <div
        className="font-display text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#f2ca50] cursor-pointer hover:opacity-90 active:scale-95 transition-all z-50"
        onClick={() => handleMobileNav('home')}
      >
        ZAVIYA
      </div>

      {/* Navigation list - Desktop */}
      <nav className="hidden md:flex items-center gap-10">
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 ${
            activePage === 'menu' ? 'text-[#f2ca50] border-b border-[#f2ca50]/40 pb-1' : 'text-[#d0c5af] hover:text-[#f2ca50]'
          }`}
          onClick={() => onPageChange('menu')}
        >
          Menu
        </button>
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 ${
            activePage === 'venue' ? 'text-[#f2ca50] border-b border-[#f2ca50]/40 pb-1' : 'text-[#d0c5af] hover:text-[#f2ca50]'
          }`}
          onClick={() => onPageChange('venue')}
        >
          Venue
        </button>
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 text-[#d0c5af] hover:text-[#f2ca50]`}
          onClick={() => {
            onPageChange('home');
            setTimeout(() => {
              document.getElementById('signature-collection')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          Featured Dishes
        </button>
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 text-[#d0c5af] hover:text-[#f2ca50]`}
          onClick={() => {
            onPageChange('home');
            setTimeout(() => {
              document.getElementById('philosophy-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          About Us
        </button>
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 ${
            activePage === 'contact' ? 'text-[#f2ca50] border-b border-[#f2ca50]/40 pb-1' : 'text-[#d0c5af] hover:text-[#f2ca50]'
          }`}
          onClick={() => onPageChange('contact')}
        >
          Contact
        </button>
        <button
          className={`font-sans font-semibold tracking-widest text-xs uppercase transition-colors duration-300 flex items-center gap-1.5 ${
            activePage === 'admin' ? 'text-[#f2ca50] border-b border-[#f2ca50]/40 pb-1' : 'text-[#d0c5af] hover:text-[#f2ca50]'
          }`}
          onClick={() => onPageChange('admin')}
        >
          <Shield className="w-3 h-3 text-[#f2ca50]" />
          Admin
        </button>
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Tactile booking action */}
        <button
          className={`neo-convex neo-glint px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[#f2ca50] font-sans font-semibold text-[10px] md:text-xs tracking-widest uppercase hover:scale-105 active:shadow-[inset_-2px_-2px_5px_#1f1f1f,inset_2px_2px_5px_#0a0a0a] transition-all duration-200 ${
            activePage === 'reservations' ? 'neo-pressed active-pill' : ''
          }`}
          onClick={() => onPageChange('reservations')}
        >
          Reserve
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden neo-convex p-2.5 rounded-full text-[#d0c5af] hover:text-[#f2ca50] active:scale-95 transition-all z-50"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full bg-[#131313] border-b border-white/5 shadow-2xl z-40 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-8 space-y-6 text-center">
              <button
                className={`font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 rounded-xl transition-all ${
                  activePage === 'menu' ? 'neo-pressed text-[#f2ca50] active-pill' : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
                onClick={() => handleMobileNav('menu')}
              >
                Menu
              </button>
              <button
                className={`font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 rounded-xl transition-all ${
                  activePage === 'venue' ? 'neo-pressed text-[#f2ca50] active-pill' : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
                onClick={() => handleMobileNav('venue')}
              >
                Venue
              </button>
              <button
                className="font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 text-[#d0c5af] hover:text-[#f2ca50]"
                onClick={() => handleMobileNav('home', 'signature-collection')}
              >
                Featured Dishes
              </button>
              <button
                className="font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 text-[#d0c5af] hover:text-[#f2ca50]"
                onClick={() => handleMobileNav('home', 'philosophy-section')}
              >
                About Us
              </button>
              <button
                className={`font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 rounded-xl transition-all ${
                  activePage === 'contact' ? 'neo-pressed text-[#f2ca50] active-pill' : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
                onClick={() => handleMobileNav('contact')}
              >
                Contact
              </button>
              <button
                className={`font-sans font-bold tracking-[0.2em] text-sm uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activePage === 'admin' ? 'neo-pressed text-[#f2ca50] active-pill' : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
                onClick={() => handleMobileNav('admin')}
              >
                <Shield className="w-4 h-4 text-[#f2ca50]" />
                Admin Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
