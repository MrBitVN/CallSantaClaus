import React, { useEffect } from 'react';
import { Phone, PhoneOff, Video, Volume2, ChevronRight } from 'lucide-react';
import type { CallType, ChildProfile } from '../types';
import { soundManager } from '../utils/audio';

interface IncomingCallModalProps {
  isOpen: boolean;
  callType: CallType;
  profile: ChildProfile;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  callType,
  profile,
  onAccept,
  onDecline,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.startChristmasRingtone();
    } else {
      soundManager.stopRingtone();
    }
    return () => {
      soundManager.stopRingtone();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccept = () => {
    soundManager.stopAllAudio();
    onAccept();
  };

  const handleDecline = () => {
    soundManager.stopAllAudio();
    onDecline();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-xl p-3 sm:p-4 animate-fade-in select-none">
      {/* Smartphone Inbound Call Container */}
      <div className="relative w-full max-w-sm h-[690px] max-h-[94vh] rounded-[48px] bg-gradient-to-b from-stone-900 via-neutral-900 to-black border-4 border-stone-700/70 shadow-2xl flex flex-col items-center justify-between p-6 sm:p-7 text-white overflow-hidden">
        
        {/* Top Status Bar simulation */}
        <div className="w-full flex justify-between items-center text-xs text-stone-400 pt-1 px-3">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="w-24 h-5 bg-black rounded-full border border-stone-800 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
          </div>
          <span className="flex items-center gap-1 font-mono">5G 📶 100%</span>
        </div>

        {/* Santa Caller Info */}
        <div className="flex flex-col items-center text-center mt-5 space-y-3 z-10 w-full">
          <div className="relative">
            {/* Animated ringing pulse circles */}
            <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping opacity-80 duration-1000 scale-125" />
            <div className="absolute -inset-3 rounded-full bg-amber-400/20 animate-pulse duration-700" />
            
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl ring-4 ring-red-600/50">
              <img
                src="/images/santa_avatar.jpg"
                alt="Santa Claus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-wide text-amber-200 font-serif drop-shadow">
              Santa Claus
            </h2>
            <p className="text-sm font-medium text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Incoming call from North Pole...</span>
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-stone-800/90 border border-stone-700 text-xs text-stone-200">
              {callType === 'video' ? (
                <>
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>FaceTime Video Call</span>
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>North Pole Audio Call</span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-amber-300/90 px-4 py-1.5 rounded-xl bg-amber-950/50 border border-amber-800/40 font-medium">
            Special message for {profile.name} (Age {profile.age})
          </p>
        </div>

        {/* Ringing Sound Indicator */}
        <div className="flex items-center gap-2 text-xs text-stone-300 animate-pulse">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>Santa's phone is ringing...</span>
        </div>

        {/* Bottom Call Actions: Accept / Decline & Slide To Answer */}
        <div className="w-full space-y-5 mb-3 z-10">
          
          {/* iOS Slide to Answer Bar */}
          <div className="relative w-full h-14 rounded-full bg-stone-800/80 border border-stone-700 overflow-hidden flex items-center px-2">
            <div 
              onClick={handleAccept}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/60 cursor-pointer animate-pulse transition-transform active:scale-95"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <span 
              onClick={handleAccept}
              className="flex-1 text-center text-xs font-bold text-emerald-300 cursor-pointer tracking-wider uppercase animate-pulse"
            >
              Slide or Tap to Answer
            </span>
          </div>

          {/* Quick Decline / Accept Circular Buttons */}
          <div className="flex justify-between items-center px-5">
            {/* Decline */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={handleDecline}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 flex items-center justify-center shadow-lg shadow-red-900/60 transition-all group"
                aria-label="Decline Call"
              >
                <PhoneOff className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              </button>
              <span className="text-[11px] text-stone-300 font-medium">
                Decline
              </span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={handleAccept}
                className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-90 flex items-center justify-center shadow-lg shadow-emerald-900/60 transition-all"
                aria-label="Accept Call"
              >
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50 pointer-events-none" />
                {callType === 'video' ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <Phone className="w-6 h-6 text-white" />
                )}
              </button>
              <span className="text-[11px] text-emerald-300 font-bold">
                Answer
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
