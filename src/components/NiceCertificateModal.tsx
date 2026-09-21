import React, { useRef, useEffect } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChildProfile } from '../types';

interface NiceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
}

export const NiceCertificateModal: React.FC<NiceCertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background parchment
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(0, 0, 1200, 850);

    // Outer border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#c99839';
    ctx.strokeRect(30, 30, 1140, 790);

    // Inner red border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8a1c14';
    ctx.strokeRect(48, 48, 1104, 754);

    // Inner dashed gold border
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#d4af37';
    ctx.strokeRect(58, 58, 1084, 734);
    ctx.setLineDash([]);

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8a1c14';
    ctx.font = 'bold 28px serif';
    ctx.fillText('❄️ OFFICIAL SANTA CLAUS NORTH POLE HEADQUARTERS ❄️', 600, 120);

    ctx.fillStyle = '#c99839';
    ctx.font = 'italic bold 20px serif';
    ctx.fillText('DEPARTMENT OF CHRISTMAS CHEER & GOOD DEEDS', 600, 155);

    // Title
    ctx.fillStyle = '#222';
    ctx.font = 'bold 48px serif';
    ctx.fillText('OFFICIAL NICE LIST CERTIFICATE', 600, 230);

    // Underline
    ctx.fillStyle = '#c99839';
    ctx.fillRect(380, 250, 440, 4);

    // Subtitle
    ctx.fillStyle = '#444';
    ctx.font = '20px serif';
    ctx.fillText('This prestigious award is proudly presented to:', 600, 300);

    // Child Name
    ctx.fillStyle = '#8a1c14';
    ctx.font = 'bold italic 56px serif';
    ctx.fillText(profile.name.toUpperCase(), 600, 380);

    // Commendation
    ctx.fillStyle = '#333';
    ctx.font = '22px serif';
    const line1 = `For outstanding good behavior throughout ${currentYear}, especially for ${profile.goodHabit || 'being kind, helpful, and polite'}!`;
    ctx.fillText(line1, 600, 440);

    const line2 = `Santa Claus and the elves hereby confirm you truly deserve: ${profile.dreamGift || 'your special Christmas surprise'}!`;
    ctx.fillText(line2, 600, 480);

    // Golden Wax Seal
    ctx.beginPath();
    ctx.arc(600, 600, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#9b1b1b';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('SANTA', 600, 595);
    ctx.fillText('APPROVED', 600, 615);

    // Left Date
    ctx.textAlign = 'left';
    ctx.fillStyle = '#444';
    ctx.font = '18px serif';
    ctx.fillText(`Awarded: December ${currentYear}`, 120, 680);
    ctx.fillText('North Pole HQ (90°00\'00"N)', 120, 710);

    // Right Signature
    ctx.textAlign = 'right';
    ctx.fillStyle = '#8a1c14';
    ctx.font = 'italic bold 36px cursive';
    ctx.fillText('Santa Claus 🎅', 1080, 680);
    ctx.fillStyle = '#444';
    ctx.font = '18px serif';
    ctx.fillText('Supreme Giver of Joy', 1080, 710);

    // Trigger Download
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Nice_List_Certificate_${profile.name}.png`;
    link.href = imageUri;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in text-stone-900 select-none">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-600 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Render Container */}
        <div
          ref={certificateRef}
          className="w-full border-4 border-amber-700/80 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50 shadow-inner space-y-3.5 relative"
        >
          <div className="text-xs uppercase tracking-widest text-amber-800 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>North Pole • Official Department of Good Deeds</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-red-800 font-serif tracking-wide">
            CERTIFIED NICE LIST
          </h2>
          <div className="w-32 h-1 bg-amber-600 mx-auto rounded-full" />

          <p className="text-xs sm:text-sm text-stone-600 italic">
            This certifies that
          </p>

          {/* Child Name */}
          <div className="py-2">
            <span className="text-3xl sm:text-5xl font-black text-amber-950 font-serif tracking-wider border-b-2 border-dashed border-amber-700 pb-1 px-4 inline-block">
              {profile.name}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
            Has shown exceptional goodness, helpfulness, and joy throughout {currentYear}, especially for {profile.goodHabit || 'being wonderful'}!
          </p>

          <p className="text-xs text-amber-800 font-medium max-w-md mx-auto">
            Officially approved to receive: {profile.dreamGift || 'a wonderful Christmas surprise'}!
          </p>

          {/* Official Seal & Signature */}
          <div className="pt-3 flex items-center justify-between px-3 sm:px-10 text-xs">
            <div className="text-left space-y-1">
              <p className="text-stone-500 font-mono text-[10px]">
                Date: December {currentYear}
              </p>
              <div className="w-13 h-13 rounded-full bg-red-800 border-2 border-amber-400 flex flex-col items-center justify-center text-amber-200 font-bold text-[9px] shadow-lg">
                <span>SANTA</span>
                <span>APPROVED</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="font-serif italic font-bold text-lg text-red-900 block">
                Santa Claus 🎅
              </span>
              <p className="text-[11px] text-stone-600">
                North Pole Headquarters
              </p>
            </div>
          </div>
        </div>

        {/* Download Action */}
        <div className="mt-5 flex items-center gap-3 w-full justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-950/40 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate (PNG)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
