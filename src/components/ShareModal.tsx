/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { MenuItem, Reservation } from '../types';
import { X, Copy, Check, Download, Share2, Sparkles, Calendar, Users, Clock, Flame, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: MenuItem | null;
  reservation?: Reservation | null;
}

export default function ShareModal({ isOpen, onClose, menuItem, reservation }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState('');

  // Generate real deep link URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (menuItem) {
        setDeepLink(`${origin}/?shareType=menuItem&shareId=${menuItem.id}`);
      } else if (reservation) {
        setDeepLink(`${origin}/?shareType=reservation&shareId=${reservation.id}`);
      }
    }
  }, [menuItem, reservation]);

  // Handle Clipboard Copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate Social Media Sharing with premium neomorphic overlay
  const handleSharePlatform = (platform: string) => {
    setActivePlatform(platform);
    setTimeout(() => {
      setActivePlatform(null);
    }, 2500);
  };

  // Render Premium Social Snippet Image on Canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImage = new Image();
    bgImage.referrerPolicy = 'no-referrer';
    bgImage.src = '/src/assets/images/zaviya_share_bg_1782549975579.jpg';

    bgImage.onload = () => {
      // Base canvas size designed for 16:9 high-definition social preview (1200 x 675)
      canvas.width = 1200;
      canvas.height = 675;

      // Draw background
      ctx.drawImage(bgImage, 0, 0, 1200, 675);

      // Create translucent dark overlay for contrast
      ctx.fillStyle = 'rgba(19, 19, 19, 0.85)';
      ctx.fillRect(40, 40, 1120, 595);

      // Draw thin luxury gold border
      ctx.strokeStyle = 'rgba(242, 202, 80, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, 1100, 575);
      ctx.strokeStyle = 'rgba(242, 202, 80, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 60, 1080, 555);

      // --- BRAND HEADER ---
      ctx.fillStyle = '#f2ca50';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Z A V I Y A', 600, 110);

      ctx.fillStyle = 'rgba(229, 226, 225, 0.6)';
      ctx.font = 'normal 13px "Inter", sans-serif';
      ctx.fillText('AN EMBASSY OF NEOMORPHIC LUXURY CULINARY', 600, 135);

      // Draw separator line
      ctx.strokeStyle = 'rgba(242, 202, 80, 0.15)';
      ctx.beginPath();
      ctx.moveTo(450, 160);
      ctx.lineTo(750, 160);
      ctx.stroke();

      if (menuItem) {
        // --- MENU ITEM LAYOUT ---
        // Signature tag
        if (menuItem.signature) {
          ctx.fillStyle = 'rgba(242, 202, 80, 0.15)';
          ctx.beginPath();
          ctx.roundRect(500, 190, 200, 32, 8);
          ctx.fill();
          ctx.strokeStyle = 'rgba(242, 202, 80, 0.4)';
          ctx.stroke();

          ctx.fillStyle = '#f2ca50';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.fillText('✦ SIGNATURE DISH', 600, 210);
        }

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "Playfair Display", "Inter", serif';
        ctx.fillText(menuItem.title, 600, 280);

        // Category
        ctx.fillStyle = '#f2ca50';
        ctx.font = '600 14px "Inter", sans-serif';
        ctx.fillText(menuItem.category.toUpperCase(), 600, 315);

        // Description (Wrap text)
        ctx.fillStyle = '#bab8b7';
        ctx.font = '16px "Inter", sans-serif';
        const words = menuItem.description.split(' ');
        let line = '';
        let y = 370;
        const maxWidth = 750;
        const lineHeight = 28;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, 600, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 600, y);

        // Price Badge
        ctx.fillStyle = 'rgba(242, 202, 80, 0.1)';
        ctx.beginPath();
        ctx.roundRect(480, 485, 240, 52, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(242, 202, 80, 0.3)';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.fillText(menuItem.price, 600, 518);
      } else if (reservation) {
        // --- RESERVATION LAYOUT ---
        ctx.fillStyle = 'rgba(242, 202, 80, 0.15)';
        ctx.beginPath();
        ctx.roundRect(470, 190, 260, 32, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(242, 202, 80, 0.4)';
        ctx.stroke();

        ctx.fillStyle = '#f2ca50';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText('🎟️ OFFICIAL INVITATION PASS', 600, 210);

        // Guest Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px "Playfair Display", "Inter", serif';
        ctx.fillText(reservation.name, 600, 275);

        // VIP Tier Label
        ctx.fillStyle = '#f2ca50';
        ctx.font = 'bold 13px "Inter", sans-serif';
        const tier = reservation.experience === 'chef' ? "CHEF'S SPECIAL EXPERIENCE" : "STANDARD LUXURY DINING";
        ctx.fillText(tier, 600, 310);

        // Details Grid Mockup
        ctx.fillStyle = '#e5e2e1';
        ctx.font = '600 16px "Inter", sans-serif';
        ctx.fillText(`Date: ${reservation.date}   |   Time: ${reservation.time || '19:00'}`, 600, 370);
        ctx.fillText(`Guests: ${reservation.guests} Persons   |   Audio Loop: ${reservation.soundscape}`, 600, 405);

        if (reservation.interestedDishes && reservation.interestedDishes.length > 0) {
          ctx.fillStyle = '#bab8b7';
          ctx.font = 'italic 14px "Inter", sans-serif';
          ctx.fillText(`Preferred Selections: ${reservation.interestedDishes.join(', ')}`, 600, 445);
        }

        // Reservation Confirmation Stamp
        ctx.fillStyle = 'rgba(242, 202, 80, 0.08)';
        ctx.beginPath();
        ctx.roundRect(400, 485, 400, 52, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(242, 202, 80, 0.25)';
        ctx.stroke();

        ctx.fillStyle = '#f2ca50';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillText(`RESERVATION ID: ${reservation.id.toUpperCase()}`, 600, 517);
      }

      // --- FOOTER BADGES ---
      ctx.fillStyle = 'rgba(229, 226, 225, 0.4)';
      ctx.font = 'normal 11px "Inter", sans-serif';
      ctx.fillText('zaviya.culinary.pk  •  Islamabad, Pakistan', 600, 585);
    };

    // Fallback if image fails to load
    bgImage.onerror = () => {
      canvas.width = 1200;
      canvas.height = 675;
      ctx.fillStyle = '#131313';
      ctx.fillRect(0, 0, 1200, 675);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Zaviya Luxury Culinary', 600, 300);
    };
  }, [isOpen, menuItem, reservation]);

  // Download JPEG Action
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = menuItem
      ? `zaviya_${menuItem.title.toLowerCase().replace(/\s+/g, '_')}_share.jpg`
      : `zaviya_reservation_${reservation?.id || 'pass'}.jpg`;
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl rounded-[2.5rem] bg-[#1a1a19] border border-white/5 shadow-2xl p-6 md:p-10 text-left overflow-hidden z-10 space-y-8"
        >
          {/* Top Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#f2ca50]/10 rounded-xl text-[#f2ca50]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl text-white font-bold">
                  {menuItem ? 'Share culinary dish' : 'Share confirmed reservation'}
                </h3>
                <p className="font-sans text-[10px] text-[#bab8b7]/50 uppercase tracking-widest font-bold">
                  Elegant social sharing toolkit
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3.5 rounded-full neo-convex text-[#bab8b7] hover:text-[#f2ca50] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Canvas Preview */}
            <div className="lg:col-span-7 space-y-3">
              <span className="font-sans text-[9px] text-[#bab8b7]/50 uppercase tracking-widest font-extrabold block">
                Social Snippet Canvas Preview (16:9 HD Card)
              </span>

              <div className="neo-concave rounded-[1.5rem] bg-[#131313] border border-white/5 p-3 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto rounded-xl border border-white/5 shadow-inner"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-sans text-[#bab8b7]/40 font-bold px-2">
                <span>✦ Embedded gold texture background</span>
                <span>1200 x 675 high-fidelity JPEG</span>
              </div>
            </div>

            {/* Right Column: Platform triggers & Deep Links */}
            <div className="lg:col-span-5 space-y-6">
              {/* Deep Link URL copy tool */}
              <div className="space-y-3">
                <span className="font-sans text-[9px] text-[#bab8b7]/50 uppercase tracking-widest font-extrabold block">
                  Generated Deep-Link URL
                </span>

                <div className="neo-concave rounded-xl px-4 py-3 flex items-center bg-[#131313] border border-white/5 text-xs font-sans gap-3">
                  <input
                    type="text"
                    value={deepLink}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-[11px] text-[#e5e2e1] w-full font-mono font-semibold truncate select-all cursor-pointer"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg neo-convex hover:text-[#f2ca50] hover:scale-105 transition-all text-[#bab8b7] cursor-pointer shrink-0"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Share actions */}
              <div className="space-y-3">
                <span className="font-sans text-[9px] text-[#bab8b7]/50 uppercase tracking-widest font-extrabold block">
                  Share To Social Platforms
                </span>

                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => handleSharePlatform('WhatsApp')}
                    className="neo-convex p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] transition-colors cursor-pointer text-center group"
                  >
                    <span className="text-[10px] font-sans font-bold tracking-wider uppercase group-hover:text-white">
                      WhatsApp
                    </span>
                    <span className="text-[8px] font-sans text-[#bab8b7]/40 block">Send private invite</span>
                  </button>

                  <button
                    onClick={() => handleSharePlatform('X (Twitter)')}
                    className="neo-convex p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] transition-colors cursor-pointer text-center group"
                  >
                    <span className="text-[10px] font-sans font-bold tracking-wider uppercase group-hover:text-white">
                      X / Twitter
                    </span>
                    <span className="text-[8px] font-sans text-[#bab8b7]/40 block">Tweet menu spotlight</span>
                  </button>

                  <button
                    onClick={() => handleSharePlatform('Facebook')}
                    className="neo-convex p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] transition-colors cursor-pointer text-center group"
                  >
                    <span className="text-[10px] font-sans font-bold tracking-wider uppercase group-hover:text-white">
                      Facebook
                    </span>
                    <span className="text-[8px] font-sans text-[#bab8b7]/40 block">Post culinary status</span>
                  </button>

                  <button
                    onClick={() => handleSharePlatform('Pinterest')}
                    className="neo-convex p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-white/5 text-[#bab8b7] hover:text-[#f2ca50] transition-colors cursor-pointer text-center group"
                  >
                    <span className="text-[10px] font-sans font-bold tracking-wider uppercase group-hover:text-white">
                      Pinterest
                    </span>
                    <span className="text-[8px] font-sans text-[#bab8b7]/40 block">Pin luxury platter</span>
                  </button>
                </div>
              </div>

              {/* Snippet Download button */}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={handleDownloadImage}
                  className="neo-convex w-full py-4 rounded-xl bg-[#f2ca50] text-[#131313] hover:bg-[#e0bb42] hover:scale-[1.02] active:scale-[0.98] transition-all font-sans font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD SNIPPET IMAGE
                </button>
              </div>
            </div>
          </div>

          {/* Toast / Status Simulation Dialog for Social Shares */}
          <AnimatePresence>
            {activePlatform && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-6 left-6 right-6 neo-convex p-4 rounded-2xl bg-[#f2ca50] text-[#131313] flex items-center justify-between border border-[#e0bb42] shadow-xl font-sans"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#131313]/10 rounded-lg">
                    <Sparkles className="w-4 h-4 animate-spin text-[#131313]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-wider">Broadcasting Link</p>
                    <p className="text-[10px] text-[#131313]/75 font-semibold">
                      Successfully formatted deep-link snippet for {activePlatform}.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] bg-[#131313] text-[#f2ca50] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">
                  POSTED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
