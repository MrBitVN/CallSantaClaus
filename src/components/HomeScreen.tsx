import React from 'react';
import { Settings, User, Phone, Video, MessageSquare } from 'lucide-react';
import type { ChildProfile, AppSettings } from '../types';
import { MessageFromSantaLogo } from './MessageFromSantaLogo';

interface HomeScreenProps {
  profile: ChildProfile;
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
  onOpenVoicemail: () => void;
  onOpenChat: () => void;
  onOpenGetACall: () => void;
  onOpenVideoMessages: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  settings,
  onOpenSettings,
  onOpenAccount,
  onOpenVoicemail,
  onOpenChat,
  onOpenGetACall,
  onOpenVideoMessages,
}) => {

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden text-white">
      
      {/* Top Header Bar: Settings (Left) & My Account (Right) */}
      <div className="w-full flex items-center justify-between z-20 pt-2 px-1">
        {/* Settings Gear Button */}
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-full border-2 border-white/80 bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shadow-md backdrop-blur-sm"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* My Account Profile Button */}
        {!settings.hideMyAccount && (
          <button
            onClick={onOpenAccount}
            title={profile.name}
            className="w-11 h-11 rounded-full border-2 border-white/80 bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shadow-md backdrop-blur-sm"
            aria-label="My Account"
          >
            <User className="w-6 h-6 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Horizontal Dark Red Ribbon Stripe across the middle */}
      <div className="absolute left-0 right-0 top-[31%] h-24 bg-[#32060b]/90 border-y border-red-900/50 -z-0 pointer-events-none" />

      {/* Center Section: Santa Portrait + Name + North Pole */}
      <div className="flex flex-col items-center justify-center z-10 my-auto py-2">
        {/* Santa Circular Avatar with Thick White Border */}
        <div className="relative">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-[5px] border-white shadow-[0_12px_28px_rgba(0,0,0,0.65)] overflow-hidden bg-[#165b2d] flex items-center justify-center ring-2 ring-black/20">
            <img
              src="/images/santa_avatar.jpg"
              alt="Santa Claus"
              className="w-full h-full object-cover object-top scale-125 transform translate-y-1 hover:scale-130 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Santa Claus Name */}
        <h1 className="font-slab font-bold text-4xl sm:text-5xl text-white text-center mt-3 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
          Santa Claus
        </h1>

        {/* North Pole Subtitle */}
        <p className="font-slab font-bold text-amber-300 text-sm sm:text-base text-center mt-0.5 tracking-wider drop-shadow">
          North Pole
        </p>
      </div>

      {/* 4 Big Action Circular Buttons */}
      <div className="w-full max-w-md mx-auto z-10 py-4">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 place-items-center">
          
          {/* 1. Voicemail (Red) */}
          <div className="flex flex-col items-center gap-1.5 group">
            <button
              onClick={onOpenVoicemail}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#db2b27] hover:bg-[#eb332f] active:scale-95 border-4 border-white shadow-[0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center text-white transition-all"
              aria-label="Voicemail"
            >
              {/* Voicemail tape cassette icon */}
              <svg viewBox="0 0 24 24" className="w-9 h-9 sm:w-11 sm:h-11 fill-current stroke-none">
                <circle cx="6.5" cy="12" r="3.5" />
                <circle cx="17.5" cy="12" r="3.5" />
                <path d="M6.5 15.5 L17.5 15.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            <span className="font-slab font-bold text-xs sm:text-sm text-white text-center tracking-wide drop-shadow">
              Voicemail
            </span>
          </div>

          {/* 2. Get a Call (Green) */}
          {!settings.hideGetACall && (
            <div className="flex flex-col items-center gap-1.5 group">
              <button
                onClick={onOpenGetACall}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2ea836] hover:bg-[#34bd3d] active:scale-95 border-4 border-white shadow-[0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center text-white transition-all"
                aria-label="Get a Call"
              >
                <Phone className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              </button>
              <span className="font-slab font-bold text-xs sm:text-sm text-white text-center tracking-wide drop-shadow">
                Get a Call
              </span>
            </div>
          )}

          {/* 3. Messages (Blue) */}
          <div className="flex flex-col items-center gap-1.5 group">
            <button
              onClick={onOpenChat}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#18a2e0] hover:bg-[#25aff0] active:scale-95 border-4 border-white shadow-[0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center text-white transition-all"
              aria-label="Messages"
            >
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            </button>
              <span className="font-slab font-bold text-xs sm:text-sm text-white text-center tracking-wide drop-shadow">
                Messages
              </span>
          </div>

          {/* 4. Video (Magenta) */}
          {!settings.hideVideo && (
            <div className="flex flex-col items-center gap-1.5 group">
              <button
                onClick={onOpenVideoMessages}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ce1888] hover:bg-[#de2095] active:scale-95 border-4 border-white shadow-[0_6px_16px_rgba(0,0,0,0.4)] flex items-center justify-center text-white transition-all"
                aria-label="Video"
              >
                <Video className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              </button>
              <span className="font-slab font-bold text-xs sm:text-sm text-white text-center tracking-wide drop-shadow">
                Video
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Section: Logo "Message from Santa" */}
      {!settings.hideLogo && (
        <div className="w-full flex justify-center z-10 pb-2 pt-2">
          <MessageFromSantaLogo className="h-16" />
        </div>
      )}

    </div>
  );
};
