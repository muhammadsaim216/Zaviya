/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReservationState, Reservation } from '../types';
import { Calendar, Users, Mail, User, Clock, CheckCircle2, Heart, Award, Sparkles, Sliders, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReservationsScreenProps {
  reservation: ReservationState;
  setReservation: React.Dispatch<React.SetStateAction<ReservationState>>;
  interestedDishes: string[];
  ambientLight: number;
  soundscape: string;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

export default function ReservationsScreen({
  reservation,
  setReservation,
  interestedDishes,
  ambientLight,
  soundscape,
  setReservations
}: ReservationsScreenProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guestOptions = ['2', '4', '6', '8', '12+'];
  const timeOptions = ['18:30', '19:00', '20:30', '21:00'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSelectGuests = (guests: string) => {
    setReservation((prev) => ({ ...prev, guests }));
  };

  const handleSelectTime = (time: string) => {
    setReservation((prev) => ({ ...prev, time }));
  };

  const handleSelectExperience = (experience: 'standard' | 'chef') => {
    setReservation((prev) => ({ ...prev, experience }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation.name || !reservation.email || !reservation.date) {
      setError('Please complete all fields (Name, Email, and Reservation Date) to submit your request.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const newRes: Reservation = {
      id: 'res-' + Date.now(),
      name: reservation.name,
      email: reservation.email,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      experience: reservation.experience,
      specialRequests: reservation.specialRequests,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      ambientLight,
      soundscape,
      interestedDishes: [...interestedDishes]
    };

    setTimeout(() => {
      setReservations((prev) => [newRes, ...prev]);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 md:px-16 py-12 text-left"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
                TABLE RESERVATION
              </span>
              <h1 className="font-display text-4xl md:text-6xl tracking-tight text-white">
                Book a Table
              </h1>
              <p className="font-sans text-[#bab8b7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Book your table in advance. Please fill out the simple form below to choose your seating options and preferences.
              </p>
            </div>

            {/* Main Tactile Form */}
            <form onSubmit={handleSubmit} className="neo-convex rounded-3xl p-8 md:p-12 bg-[#20201f] border border-white/5 space-y-10">
              {/* Part 1: Guests, Date, and Time */}
              <div className="space-y-6">
                <h4 className="font-sans text-xs font-bold text-[#f2ca50] tracking-[0.2em] uppercase">
                  1. Guests & Date
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Guest Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#f2ca50]" />
                      Number of Guests
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {guestOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleSelectGuests(opt)}
                          className={`neo-convex px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                            reservation.guests === opt
                              ? 'neo-pressed active-pill text-[#f2ca50]'
                              : 'text-[#bab8b7] hover:text-[#f2ca50]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-3">
                    <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#f2ca50]" />
                      Date of Reservation
                    </label>
                    <div className="neo-concave rounded-xl px-4 py-3 flex items-center bg-[#131313] border border-white/5">
                      <input
                        type="date"
                        name="date"
                        value={reservation.date}
                        onChange={handleInputChange}
                        required
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-sans font-semibold uppercase tracking-wider w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#f2ca50]" />
                    Preferred Seating Time
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {timeOptions.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleSelectTime(t)}
                        className={`neo-convex px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                          reservation.time === t
                            ? 'neo-pressed active-pill text-[#f2ca50]'
                            : 'text-[#bab8b7] hover:text-[#f2ca50]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                    {/* Manual time typing option */}
                    <div className="neo-concave rounded-xl px-4 py-2 flex items-center bg-[#131313] border border-white/5 max-w-[120px]">
                      <input
                        type="text"
                        name="time"
                        value={reservation.time}
                        onChange={handleInputChange}
                        placeholder="Other Time"
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] font-mono font-bold tracking-wider w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Experience Cards */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <h4 className="font-sans text-xs font-bold text-[#f2ca50] tracking-[0.2em] uppercase">
                  2. Choose Menu Experience
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Standard Experience */}
                  <div
                    onClick={() => handleSelectExperience('standard')}
                    className={`neo-convex rounded-2xl p-6 cursor-pointer border transition-all flex flex-col justify-between text-left space-y-4 ${
                      reservation.experience === 'standard'
                        ? 'border-[#f2ca50]/40 bg-[#252524]'
                        : 'border-white/5 bg-transparent hover:border-[#f2ca50]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <Sparkles className="w-8 h-8 text-[#f2ca50]/70" />
                      <span className="font-sans font-semibold text-[8px] tracking-widest uppercase text-[#bab8b7]/60">
                        REGULAR
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="font-display text-lg text-white font-bold">Standard Dining</h5>
                      <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                        Enjoy full access to our standard food and drinks menu in a beautiful neomorphic setting.
                      </p>
                    </div>
                  </div>

                  {/* Chef's Experience */}
                  <div
                    onClick={() => handleSelectExperience('chef')}
                    className={`neo-convex rounded-2xl p-6 cursor-pointer border transition-all flex flex-col justify-between text-left space-y-4 ${
                      reservation.experience === 'chef'
                        ? 'border-[#f2ca50]/40 bg-[#252524]'
                        : 'border-white/5 bg-transparent hover:border-[#f2ca50]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <Award className="w-8 h-8 text-[#f2ca50]" />
                      <span className="font-sans font-semibold text-[8px] tracking-widest uppercase text-[#f2ca50]">
                        PREMIUM
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="font-display text-lg text-white font-bold">Chef's Special Tasting</h5>
                      <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                        A personalized menu with special items, premium spices, and dedicated chef attention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 3: Scent & Sounds Synced from Venue */}
              {(ambientLight !== 50 || soundscape !== 'Ancestral Flute' || interestedDishes.length > 0) && (
                <div className="space-y-4 pt-4 border-t border-white/5 bg-[#171717]/40 p-6 rounded-2xl neo-concave border border-white/5">
                  <h5 className="font-sans text-[10px] font-bold text-[#f2ca50] tracking-[0.2em] uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    Table Atmosphere Preferences
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="text-left">
                      <span className="text-[#bab8b7]/60 block text-[9px] uppercase tracking-wider mb-1">Ambient Light</span>
                      <span className="text-[#e5e2e1] font-semibold">{ambientLight}% intensity</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[#bab8b7]/60 block text-[9px] uppercase tracking-wider mb-1">Sound Loop</span>
                      <span className="text-[#e5e2e1] font-semibold">{soundscape}</span>
                    </div>
                    {interestedDishes.length > 0 && (
                      <div className="text-left col-span-1 md:col-span-3 pt-2">
                        <span className="text-[#bab8b7]/60 block text-[9px] uppercase tracking-wider mb-1">Interested Dishes</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {interestedDishes.map((dish, i) => (
                            <span key={i} className="neo-convex px-2.5 py-1 rounded-lg text-[9px] text-[#f2ca50] font-semibold border border-[#f2ca50]/10">
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Part 4: Personal Dossier */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <h4 className="font-sans text-xs font-bold text-[#f2ca50] tracking-[0.2em] uppercase">
                  3. Contact Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name field */}
                  <div className="space-y-3">
                    <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-[#f2ca50]" />
                      Full Name
                    </label>
                    <div className="neo-concave rounded-xl px-4 py-3 flex items-center bg-[#131313] border border-white/5">
                      <input
                        type="text"
                        name="name"
                        value={reservation.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Sterling Archer"
                        required
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/20 font-sans tracking-wide w-full"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-3">
                    <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#f2ca50]" />
                      Email Address
                    </label>
                    <div className="neo-concave rounded-xl px-4 py-3 flex items-center bg-[#131313] border border-white/5">
                      <input
                        type="email"
                        name="email"
                        value={reservation.email}
                        onChange={handleInputChange}
                        placeholder="e.g. sterling@isis.org"
                        required
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/20 font-sans tracking-wide w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Special requests */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#f2ca50]" />
                    Special Requests / Food Allergies
                  </label>
                  <div className="neo-concave rounded-2xl p-4 bg-[#131313] border border-white/5">
                    <textarea
                      name="specialRequests"
                      value={reservation.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Please specify any food allergies, dietary restrictions, or special requests here..."
                      className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#e5e2e1] placeholder-[#bab8b7]/20 font-sans tracking-wide w-full resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/25 text-red-300 text-xs font-sans tracking-wide leading-relaxed">
                  {error}
                </div>
              )}

              {/* Submit trigger button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="neo-convex px-10 py-5 rounded-xl bg-[#f2ca50] text-[#3c2f00] font-sans font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#3c2f00] border-t-transparent rounded-full animate-spin" />
                      SUBMITTING RESERVATION...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      RESERVE TABLE
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Confirmation State View */
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="neo-convex rounded-3xl p-8 md:p-12 bg-[#20201f] border border-white/5 text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full neo-convex flex items-center justify-center text-[#f2ca50] mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
                RESERVATION SUBMITTED
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Reservation Requested</h2>
              <p className="font-sans text-xs md:text-sm text-[#bab8b7] max-w-lg mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{reservation.name}</span>. Your reservation request has been received. Our team will review your details and email you a confirmation within 24 hours.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="neo-concave rounded-2xl p-6 bg-[#131313] border border-white/5 max-w-xl mx-auto space-y-4 text-left font-sans text-xs">
              <h4 className="font-sans text-[10px] font-bold text-[#f2ca50] tracking-[0.2em] uppercase border-b border-white/5 pb-2">
                Reservation Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Guests</span>
                  <span className="text-[#e5e2e1] font-semibold">{reservation.guests} Guests</span>
                </div>
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Schedule</span>
                  <span className="text-[#e5e2e1] font-semibold">{reservation.date} @ {reservation.time || '18:30'}</span>
                </div>
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Experience</span>
                  <span className="text-[#e5e2e1] font-semibold uppercase tracking-wider text-[10px]">
                    {reservation.experience === 'chef' ? "Chef's Special Tasting" : "Standard Dining"}
                  </span>
                </div>
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Auditory Loop</span>
                  <span className="text-[#e5e2e1] font-semibold">{soundscape}</span>
                </div>
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Light Density</span>
                  <span className="text-[#e5e2e1] font-semibold">{ambientLight}% intensity</span>
                </div>
                <div>
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block">Contact Email</span>
                  <span className="text-[#e5e2e1] font-semibold">{reservation.email}</span>
                </div>
              </div>

              {/* Dishes in confirmation */}
              {interestedDishes.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-[#bab8b7]/50 uppercase tracking-widest text-[9px] block mb-2">Interested Dishes</span>
                  <div className="flex flex-wrap gap-2">
                    {interestedDishes.map((dish, i) => (
                      <span key={i} className="neo-convex px-2.5 py-1 rounded-lg text-[9px] text-[#f2ca50] font-semibold">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setReservation({
                  guests: '2',
                  date: '',
                  time: '19:00',
                  experience: 'standard',
                  name: '',
                  email: '',
                  specialRequests: ''
                });
              }}
              className="neo-convex px-8 py-4 rounded-xl text-xs text-[#d0c5af] hover:text-[#f2ca50] font-sans font-semibold tracking-widest uppercase flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              MAKE ANOTHER RESERVATION
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
