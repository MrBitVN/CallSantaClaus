import React from 'react';

export const MessageFromSantaLogo: React.FC<{ className?: string }> = ({ className = 'h-16' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <div className="flex items-center gap-3">
        {/* Megaphone with Santa Hat */}
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {/* Santa Hat atop megaphone */}
            <path
              d="M38 48 C42 16, 76 22, 90 32 C78 40, 60 46, 50 48 Z"
              fill="#d32f2f"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* White fluffy hat trim */}
            <ellipse cx="48" cy="48" rx="16" ry="6" fill="#ffffff" />
            {/* Hat pom-pom */}
            <circle cx="92" cy="33" r="7" fill="#ffffff" />

            {/* Megaphone body */}
            <path
              d="M26 62 L52 48 L52 88 L26 74 Z"
              fill="#e52b2b"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Megaphone horn cone */}
            <path
              d="M52 48 Q78 34, 86 28 L86 108 Q78 102, 52 88 Z"
              fill="#c61b1b"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Sound opening rim */}
            <ellipse cx="86" cy="68" rx="4" ry="40" fill="#a01212" stroke="#ffffff" strokeWidth="4" />

            {/* Megaphone handle */}
            <path
              d="M32 74 L32 96 C32 99, 44 99, 44 96 L44 70 Z"
              fill="#ffffff"
              stroke="#d32f2f"
              strokeWidth="2"
            />

            {/* Radiating sound lines */}
            <line x1="94" y1="46" x2="108" y2="38" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <line x1="96" y1="68" x2="114" y2="68" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <line x1="94" y1="90" x2="108" y2="98" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col text-left leading-none">
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-black tracking-widest text-white uppercase drop-shadow">
              MESSAGE
            </span>
            <span className="text-[9px] font-extrabold tracking-wider text-white/90 uppercase -mt-0.5 ml-3">
              FROM
            </span>
          </div>
          <div className="relative -mt-1">
            <span 
              className="text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              style={{
                fontFamily: "'Brush Script MT', 'Caveat', 'Segoe Script', 'Great Vibes', cursive, serif",
                textShadow: '0 2px 0 #8b0000, 0 3px 6px rgba(0,0,0,0.8)'
              }}
            >
              Santa
            </span>
            <span className="text-[7px] text-white/80 font-bold ml-1 align-top">TM</span>
            {/* Dynamic underline curve */}
            <svg viewBox="0 0 100 12" className="w-24 h-2 -mt-1 text-white stroke-current fill-none">
              <path d="M2 3 Q 50 11, 98 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
