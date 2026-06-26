/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Globe, Share2, Camera, Send } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: PageId) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#131313] shadow-[-1px_-1px_0px_#1f1f1f] mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 md:px-16 py-20 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="space-y-6">
          <div
            className="font-display text-2xl font-bold tracking-[0.2em] text-[#f2ca50] cursor-pointer hover:opacity-90"
            onClick={() => onPageChange('home')}
          >
            ZAVIYA
          </div>
          <p className="text-[#bab8b7] text-sm leading-relaxed max-w-xs">
            Bringing you the finest culinary experiences with authentic flavors, elegant designs, and warm hospitality.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h5 className="text-[#f2ca50] font-sans font-semibold text-xs tracking-widest uppercase">Explore</h5>
            <nav className="flex flex-col gap-2.5">
              <button
                onClick={() => onPageChange('menu')}
                className="text-left text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200"
              >
                Menu
              </button>
              <button
                onClick={() => onPageChange('venue')}
                className="text-left text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200"
              >
                Our Venue
              </button>
              <button
                onClick={() => onPageChange('reservations')}
                className="text-left text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200"
              >
                Reservations
              </button>
              <button
                onClick={() => onPageChange('contact')}
                className="text-left text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200"
              >
                Contact Us
              </button>
              <button
                onClick={() => onPageChange('admin')}
                className="text-left text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200"
              >
                Staff Portal
              </button>
            </nav>
          </div>
          <div className="space-y-4">
            <h5 className="text-[#f2ca50] font-sans font-semibold text-xs tracking-widest uppercase">Legal</h5>
            <nav className="flex flex-col gap-2.5">
              <a href="#" className="text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-[#bab8b7] hover:text-[#f2ca50] text-sm transition-colors duration-200">
                Sustainability
              </a>
            </nav>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-6">
          <h5 className="text-[#f2ca50] font-sans font-semibold text-xs tracking-widest uppercase">Newsletter</h5>
          <form onSubmit={handleSubscribe} className="neo-concave rounded-xl flex p-1 bg-[#131313] relative overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent border-none focus:outline-none focus:ring-0 flex-grow px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#bab8b7]/40 font-sans"
              required
            />
            <button
              type="submit"
              className="neo-convex px-6 py-2 rounded-lg text-xs text-[#f2ca50] font-bold uppercase tracking-wider hover:scale-105 active:shadow-inner transition-transform"
            >
              {subscribed ? 'Joined' : 'Join'}
            </button>
          </form>

          {/* Social Icons & Copyright */}
          <div className="flex gap-4">
            <div className="neo-convex w-10 h-10 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] cursor-pointer transition-all duration-300">
              <Globe className="w-4 h-4" />
            </div>
            <div className="neo-convex w-10 h-10 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] cursor-pointer transition-all duration-300">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="neo-convex w-10 h-10 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] cursor-pointer transition-all duration-300">
              <Camera className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#bab8b7] font-sans text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} ZAVIYA. All rights reserved. Authentic Taste, Elegant Experience.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[#bab8b7]/50 hover:text-[#f2ca50] text-[10px] tracking-widest uppercase transition-colors">
            Contact
          </a>
          <a href="#" className="text-[#bab8b7]/50 hover:text-[#f2ca50] text-[10px] tracking-widest uppercase transition-colors">
            London, UK
          </a>
        </div>
      </div>
    </footer>
  );
}
