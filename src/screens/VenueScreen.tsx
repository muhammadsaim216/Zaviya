/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageId, VenueSpace } from '../types';
import { Sun, Music, SlidersHorizontal, Activity, Users, MapPin, Eye, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VenueScreenProps {
  onPageChange: (page: PageId) => void;
  ambientLight: number;
  setAmbientLight: (light: number) => void;
  soundscape: string;
  setSoundscape: (sound: string) => void;
  venueSpaces: VenueSpace[];
}

export default function VenueScreen({
  onPageChange,
  ambientLight,
  setAmbientLight,
  soundscape,
  setSoundscape,
  venueSpaces
}: VenueScreenProps) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const soundscapes = [
    { name: 'Traditional Flute', icon: Music },
    { name: 'Soft Wind', icon: Volume2 },
    { name: 'Deep Calm', icon: Activity }
  ];

  const handleCalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibrationProgress(0);

    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCalibrating(false);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-20 max-w-7xl mx-auto px-6 md:px-16 py-12 text-left"
    >
      {/* Screen Header */}
      <div className="text-center space-y-4">
        <span className="font-sans font-semibold text-xs text-[#f2ca50] tracking-[0.4em] uppercase block">
          OUR VENUE
        </span>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight">
          Elegant Dining <br />
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#f2ca50] to-[#d4af37]">
            Spaces
          </span>
        </h1>
        <p className="font-sans text-[#bab8b7] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Explore Zaviya's unique dining rooms, designed to offer cozy private spaces or beautiful celebratory halls.
        </p>
      </div>

      {/* Spaces Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {venueSpaces.map((space) => (
          <div
            key={space.id}
            className="neo-convex rounded-[2rem] p-5 bg-[#20201f] border border-white/5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Image Frame */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-[1.2s] hover:scale-105"
                  referrerPolicy="no-referrer"
                  src={space.image}
                  alt={space.name}
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-[#131313]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    (space.status || 'Available') === 'Available'
                      ? 'bg-green-500 animate-pulse'
                      : (space.status || 'Available') === 'Reserved'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`} />
                  <span className="font-sans text-[8px] font-bold text-[#e5e2e1] uppercase tracking-widest">
                    {space.status || 'Available'}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-[#131313]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#f2ca50]" />
                  <span className="font-sans text-[9px] font-bold text-[#e5e2e1] uppercase tracking-wider">
                    {space.capacity}
                  </span>
                </div>
              </div>

              {/* Text Frame */}
              <div className="space-y-2 px-1">
                <span className="font-sans text-[10px] text-[#f2ca50] tracking-widest uppercase font-semibold">
                  {space.subtitle}
                </span>
                <h3 className="font-display text-2xl text-white font-bold">{space.name}</h3>
                <p className="font-sans text-xs text-[#bab8b7] leading-relaxed">
                  {space.description}
                </p>
              </div>
            </div>

            {/* Bottom features array */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-6 px-1">
              {space.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="neo-concave text-[9px] text-[#bab8b7]/70 font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Sensorial Control Panel */}
      <div className="neo-convex rounded-3xl p-8 md:p-12 bg-[#20201f] border border-white/5 max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1.5">
            <span className="font-sans text-[10px] text-[#f2ca50] tracking-[0.3em] uppercase font-bold block">
              CUSTOMIZE ATMOSPHERE
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Table Atmosphere Settings</h2>
          </div>
          <p className="font-sans text-xs text-[#bab8b7] max-w-sm leading-relaxed">
            Adjust the ambient light level and background music of your table to match your personal preference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Light Controls */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-sans text-xs font-semibold text-white tracking-widest uppercase flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#f2ca50]" />
                Table Lighting
              </span>
              <span className="font-mono text-xs font-bold text-[#f2ca50]">{ambientLight}%</span>
            </div>
            <div className="neo-concave p-4 rounded-2xl bg-[#131313] border border-white/5">
              <input
                type="range"
                min="10"
                max="100"
                value={ambientLight}
                onChange={(e) => setAmbientLight(Number(e.target.value))}
                className="w-full h-1 bg-[#1a1a19] rounded-lg appearance-none cursor-pointer accent-[#f2ca50] focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-[#bab8b7]/40 tracking-wider font-semibold uppercase pt-3">
                <span>10% Low Glow</span>
                <span>Bright Light</span>
              </div>
            </div>
          </div>

          {/* Soundscape Controls */}
          <div className="space-y-6">
            <span className="font-sans text-xs font-semibold text-white tracking-widest uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#f2ca50]" />
              Background Music
            </span>

            <div className="grid grid-cols-3 gap-3">
              {soundscapes.map((sound) => {
                const SoundIcon = sound.icon;
                const isActive = soundscape === sound.name;
                return (
                  <button
                    key={sound.name}
                    onClick={() => setSoundscape(sound.name)}
                    className={`neo-convex p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${
                      isActive
                        ? 'neo-pressed active-pill text-[#f2ca50]'
                        : 'text-[#bab8b7] hover:text-[#f2ca50]'
                    }`}
                  >
                    <SoundIcon className="w-5 h-5" />
                    <span className="font-sans text-[8px] tracking-widest uppercase font-bold leading-tight">
                      {sound.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calibration pulsing action */}
        <div className="flex flex-col items-center justify-center pt-4">
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className={`neo-convex px-10 py-5 rounded-xl font-sans font-semibold text-xs text-[#f2ca50] tracking-widest uppercase hover:scale-105 active:shadow-inner transition-transform duration-300 flex items-center gap-3 ${
              isCalibrating ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            <Activity className={`w-4 h-4 text-[#f2ca50] ${isCalibrating ? 'animate-pulse' : ''}`} />
            {isCalibrating ? 'ADJUSTING LIGHTS & MUSIC...' : 'TEST ATMOSPHERE SETTINGS'}
          </button>

          <AnimatePresence>
            {isCalibrating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 w-full max-w-md text-center space-y-2"
              >
                <div className="neo-concave w-full h-1.5 bg-[#131313] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calibrationProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#f2ca50] to-[#d4af37]"
                  />
                </div>
                <p className="font-mono text-[9px] text-[#f2ca50] tracking-widest uppercase">
                  Setting light intensity and background music... {calibrationProgress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
