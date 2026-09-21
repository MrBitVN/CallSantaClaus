import React, { useState, useEffect } from 'react';
import { X, Compass, Sparkles, Clock } from 'lucide-react';

interface SantaTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SantaTracker: React.FC<SantaTrackerProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let year = now.getFullYear();
      let eve = new Date(year, 11, 24, 20, 0, 0); // Dec 24 at 8:00 PM
      if (now.getTime() > eve.getTime()) {
        eve = new Date(year + 1, 11, 24, 20, 0, 0);
      }

      const diff = eve.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-4 animate-fade-in text-white select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-stone-900 via-neutral-900 to-black border-2 border-emerald-500/40 shadow-2xl p-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-xs font-bold text-emerald-400">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>NORTH POLE RADAR 360°</span>
          </div>
          <h2 className="text-2xl font-black text-amber-200 font-serif">
            Santa Tracker Live
          </h2>
          <p className="text-xs text-stone-400">
            Real-time GPS status from the North Pole Santa workshop
          </p>
        </div>

        {/* Countdown to Christmas Eve */}
        <div className="mt-5 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-center">
          <div className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Countdown to Christmas Eve Launch</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' },
            ].map(({ val, label }, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-xl sm:text-2xl font-black text-amber-200 font-mono block">
                  {val.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 font-sans">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live North Pole Status List */}
        <div className="mt-4 space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🦌</span>
              <div>
                <p className="font-bold text-stone-200">Rudolph & Reindeer Team</p>
                <p className="text-[10px] text-stone-400">Fed crisp carrots & fully rested</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/40 text-[10px]">
              Ready
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎁</span>
              <div>
                <p className="font-bold text-stone-200">Elf Workshop Packaging</p>
                <p className="text-[10px] text-stone-400">96% presents packed into Santa's sack</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">96%</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🛷</span>
              <div>
                <p className="font-bold text-stone-200">Magical Flying Sleigh</p>
                <p className="text-[10px] text-stone-400">Waxed runners & starlight navigation locked</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-600/40 text-[10px]">
              Inspected
            </span>
          </div>
        </div>

        {/* Santa North Pole Note */}
        <div className="mt-5 p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Santa is checking his golden ledger by the fireplace before departure!
          </span>
        </div>

      </div>
    </div>
  );
};
