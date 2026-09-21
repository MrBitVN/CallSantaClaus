import React from 'react';

export const BokehBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none bg-[#3b080d]">
      {/* Base Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#4e0c14] via-[#3a070c] to-[#250306]"
      />

      {/* Bokeh Orbs */}
      {/* Top light */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-bokeh" />

      {/* Top right orb */}
      <div className="absolute top-12 -right-8 w-40 h-40 rounded-full bg-rose-500/25 blur-2xl" />

      {/* Center right warm orange orb */}
      <div className="absolute top-1/4 right-4 w-32 h-32 rounded-full bg-amber-600/30 blur-2xl" />

      {/* Left upper red orb */}
      <div className="absolute top-28 -left-10 w-48 h-48 rounded-full bg-red-700/35 blur-3xl" />

      {/* Center ambient glow behind Santa */}
      <div className="absolute top-44 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-red-500/15 blur-2xl" />

      {/* Mid-screen glowing orbs */}
      <div className="absolute top-1/2 left-6 w-28 h-28 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="absolute top-1/2 right-10 w-24 h-24 rounded-full bg-rose-400/25 blur-xl" />

      {/* Lower mid orbs */}
      <div className="absolute top-2/3 left-1/3 w-36 h-36 rounded-full bg-orange-600/20 blur-2xl" />
      <div className="absolute bottom-40 right-4 w-44 h-44 rounded-full bg-red-600/25 blur-3xl" />
      <div className="absolute bottom-28 left-6 w-32 h-32 rounded-full bg-amber-500/25 blur-2xl" />

      {/* Bottom subtle glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-red-800/30 blur-3xl" />
    </div>
  );
};
