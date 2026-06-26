/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Send, CheckCircle2, User, MessageSquare, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactScreenProps {
  onSendMessage?: (message: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => void;
}

export default function ContactScreen({ onSendMessage }: ContactScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate premium API request
    setTimeout(() => {
      if (onSendMessage) {
        onSendMessage({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message
        });
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      // Clear success after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20 text-left"
    >
      {/* Page Title Header */}
      <div className="text-center space-y-4 mb-16">
        <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
          CONNECT WITH US
        </span>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white">
          Get in{' '}
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f2ca50] to-[#d4af37]">
            Touch
          </span>
        </h1>
        <p className="font-sans text-[#bab8b7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Have an inquiry, hosting a grand celebration, or want to share feedback? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Column (Left) */}
        <div className="lg:col-span-7 neo-convex p-8 md:p-10 rounded-[2.5rem] bg-[#20201f] border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-[#f2ca50]" />
            <h2 className="font-display text-2xl text-white font-bold">Send Us a Message</h2>
          </div>
          
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] text-xs font-sans flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#f2ca50]" />
                <span className="font-medium">Thank you! Your message has been received successfully. We will get back to you shortly.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2.5">
              <label htmlFor="contact-name" className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#f2ca50]/80" />
                Name
              </label>
              <div className="neo-concave rounded-xl px-4 py-3.5 flex items-center bg-[#131313] border border-white/5">
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-sans font-semibold tracking-wide w-full"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label htmlFor="contact-email" className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f2ca50]/80" />
                Email Address
              </label>
              <div className="neo-concave rounded-xl px-4 py-3.5 flex items-center bg-[#131313] border border-white/5">
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-sans font-semibold tracking-wide w-full"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2.5">
              <label htmlFor="contact-phone" className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f2ca50]/80" />
                Phone Number <span className="text-[#bab8b7]/40 font-normal lowercase">(optional)</span>
              </label>
              <div className="neo-concave rounded-xl px-4 py-3.5 flex items-center bg-[#131313] border border-white/5">
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+92 333 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-mono font-medium tracking-wide w-full"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2.5">
              <label htmlFor="contact-subject" className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f2ca50]/80" />
                Subject
              </label>
              <div className="neo-concave rounded-xl px-4 py-3.5 flex items-center bg-[#131313] border border-white/5">
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Inquiry Topic"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-sans font-semibold tracking-wide w-full"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2.5">
              <label htmlFor="contact-message" className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#f2ca50]/80" />
                Message
              </label>
              <div className="neo-concave rounded-xl px-4 py-3.5 flex items-center bg-[#131313] border border-white/5">
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder="Tell us what we can help you with..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-sans font-semibold tracking-wide w-full resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-convex w-full bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] py-4 rounded-xl font-sans font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Column (Right) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visit Us Card */}
          <div className="neo-convex p-8 rounded-[2.5rem] bg-[#20201f] border border-white/5 flex gap-6 items-start min-h-[180px] hover:border-[#f2ca50]/20 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-full bg-[#131313] border border-white/10 flex items-center justify-center text-[#f2ca50] shrink-0 group-hover:scale-110 transition-all duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-white font-bold">Visit Us</h3>
              <p className="font-sans text-[#bab8b7] text-sm leading-relaxed">
                <a 
                  href="https://maps.google.com/?q=Malik+Haroon+Street,+Opp.+NUST+Gate+2,+Srinagar+Hwy.,+H-13,+Islamabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e5e2e1] hover:text-[#f2ca50] font-semibold transition-colors flex flex-col gap-0.5 border-b border-[#bab8b7]/10 hover:border-[#f2ca50]/40 pb-0.5"
                >
                  <span>Malik Haroon Street, Opp.</span>
                  <span>NUST Gate 2, Srinagar Hwy.,</span>
                  <span>H-13, Islamabad</span>
                </a>
              </p>
            </div>
          </div>

          {/* Email Us Card */}
          <div className="neo-convex p-8 rounded-[2.5rem] bg-[#20201f] border border-white/5 flex gap-6 items-start min-h-[180px] hover:border-[#f2ca50]/20 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-full bg-[#131313] border border-white/10 flex items-center justify-center text-[#f2ca50] shrink-0 group-hover:scale-110 transition-all duration-300">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-2xl text-white font-bold">Email Us</h3>
              <p className="font-sans text-sm leading-relaxed">
                <a 
                  href="mailto:hello@zaviyarestaurant.com"
                  className="text-[#e5e2e1] hover:text-[#f2ca50] font-semibold transition-colors border-b border-[#bab8b7]/10 hover:border-[#f2ca50]/40 pb-0.5"
                >
                  hello@zaviyarestaurant.com
                </a>
              </p>
            </div>
          </div>

          {/* Give Us a Call Card - Seamlessly matching the high-end dark template with gold accents */}
          <div className="neo-convex p-8 rounded-[2.5rem] bg-gradient-to-br from-[#20201f] to-[#1a1a19] border border-[#f2ca50]/20 flex gap-6 items-start min-h-[180px] hover:border-[#f2ca50]/40 transition-all duration-300 group relative overflow-hidden">
            {/* Subtle premium gold glow effect in the background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="w-14 h-14 rounded-full bg-[#131313] border border-[#f2ca50]/20 flex items-center justify-center text-[#f2ca50] shrink-0 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(242,202,80,0.1)] relative">
              <span className="absolute inset-0 rounded-full border border-[#f2ca50]/30 animate-ping opacity-25 scale-105" />
              <Phone className="w-6 h-6" />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="font-display text-2xl text-white font-bold flex items-center gap-2">
                Give Us a Call
              </h3>
              <p className="font-sans leading-relaxed">
                <a 
                  href="tel:+923335476222"
                  className="text-[#f2ca50] hover:text-[#e8a855] font-mono font-bold text-lg transition-colors border-b border-[#f2ca50]/20 hover:border-[#f2ca50]/60 pb-0.5"
                >
                  +92 333 547 6222
                </a>
              </p>
            </div>
          </div>

          {/* Social Channels Badge Grid */}
          <div className="flex justify-center gap-5 pt-4">
            <a 
              href="https://facebook.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#20201f] border border-white/5 hover:border-[#f2ca50]/30 flex items-center justify-center text-[#bab8b7] hover:text-[#f2ca50] hover:scale-115 active:scale-95 transition-all duration-300 shadow-md group"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
            <a 
              href="https://instagram.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#20201f] border border-white/5 hover:border-[#f2ca50]/30 flex items-center justify-center text-[#bab8b7] hover:text-[#f2ca50] hover:scale-115 active:scale-95 transition-all duration-300 shadow-md group"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
            <a 
              href="https://youtube.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#20201f] border border-white/5 hover:border-[#f2ca50]/30 flex items-center justify-center text-[#bab8b7] hover:text-[#f2ca50] hover:scale-115 active:scale-95 transition-all duration-300 shadow-md group"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
