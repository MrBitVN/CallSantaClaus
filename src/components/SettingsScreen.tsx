import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Mic, 
  PhoneCall, 
  Award, 
  Compass, 
  KeyRound,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import type { AppSettings, ChildProfile, VoicemailItem, CallType } from '../types';
import { CallScheduleModal } from './CallScheduleModal';
import { storage } from '../utils/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  profile: ChildProfile;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
  onOpenCertificate: () => void;
  onOpenTracker: () => void;
  onTriggerCall: (type: CallType, scenarioId: string, delaySeconds: number) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  profile,
  onUpdateSettings,
  onBack,
  onOpenCertificate,
  onOpenTracker,
  onTriggerCall,
}) => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [recordingsOpen, setRecordingsOpen] = useState(false);
  const [voicemails, setVoicemails] = useState<VoicemailItem[]>(() => storage.getVoicemails());
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggle = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
  };

  const handlePlayAudio = (item: VoicemailItem) => {
    if (playingAudioId === item.id) {
      audioElem?.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioElem) {
      audioElem.pause();
    }

    if (item.audioBlobUrl) {
      const audio = new Audio(item.audioBlobUrl);
      audio.onended = () => setPlayingAudioId(null);
      audio.play().catch(console.error);
      setAudioElem(audio);
      setPlayingAudioId(item.id);
    } else {
      showToast('No audio recording found');
    }
  };

  const handleDeleteVoicemail = (id: string) => {
    storage.deleteVoicemail(id);
    setVoicemails(storage.getVoicemails());
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      storage.saveParentPin(newPin);
      showToast('PIN changed successfully!');
      setPinChangeOpen(false);
      setNewPin('');
    }
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col select-none text-white animate-fade-in">
      
      {/* Header Bar */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-gradient-to-r from-[#99131d] via-[#750e17] to-[#590910] border-b border-white/20 shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="font-slab font-bold text-2xl text-white tracking-wide text-center drop-shadow-sm">
          Settings
        </h1>

        <div className="w-10" />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 inset-x-4 z-50 max-w-sm mx-auto bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-2xl text-xs text-center shadow-2xl animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Settings Content Rows (iOS Grouped Style) */}
      <div className="flex-1 max-w-lg mx-auto w-full divide-y divide-white/20 bg-black/20 backdrop-blur-sm border-y border-white/20 my-2">
        
        {/* SECTION: FOR PARENTS */}
        <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-white/80 uppercase">
          FOR PARENTS
        </div>

        {/* 1. Require passcode to enter Settings */}
        <div className="px-5 py-3.5 bg-white/5 flex items-center justify-between gap-3">
          <span className="font-slab font-bold text-base text-white flex-1">
            Require passcode to enter Settings
          </span>
          <button
            onClick={() => handleToggle('requirePasscode')}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out relative flex items-center shrink-0 ${
              settings.requirePasscode ? 'bg-emerald-500' : 'bg-stone-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                settings.requirePasscode ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-stone-800" />
            </div>
          </button>
        </div>

        {/* 2. Black screen after received call */}
        <div className="px-5 py-3.5 bg-white/5 flex items-center justify-between gap-3">
          <span className="font-slab font-bold text-base text-white flex-1">
            Black screen after received call
          </span>
          <button
            onClick={() => handleToggle('blackScreenAfterCall')}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out relative flex items-center shrink-0 ${
              settings.blackScreenAfterCall ? 'bg-emerald-500' : 'bg-stone-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                settings.blackScreenAfterCall ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-stone-800" />
            </div>
          </button>
        </div>

        {/* PARENTAL TOOLS & FEATURES SECTION */}
        <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-amber-300 uppercase">
          SANTA PARENT TOOLS
        </div>

        {/* Wishlist Recordings */}
        <button
          onClick={() => {
            setVoicemails(storage.getVoicemails());
            setRecordingsOpen(!recordingsOpen);
          }}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <Mic className="w-6 h-6 text-rose-400" />
            <div>
              <span className="font-slab font-bold text-base text-white block">
                Wishlist Voicemails
              </span>
              <span className="text-xs text-white/60 font-sans">
                {voicemails.length} wish recordings
              </span>
            </div>
          </div>
          <ChevronRight className={`w-6 h-6 stroke-[2.5] text-white/80 transition-transform ${recordingsOpen ? 'rotate-90' : ''}`} />
        </button>

        {/* Collapsible Voicemails List */}
        {recordingsOpen && (
          <div className="px-5 py-3 bg-black/40 space-y-2.5">
            {voicemails.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-3">
                No recorded wishes from child yet
              </p>
            ) : (
              voicemails.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayAudio(item)}
                    className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0"
                  >
                    {playingAudioId === item.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-white">{item.childName}</div>
                    <div className="text-[10px] text-stone-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.duration}s
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteVoicemail(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Schedule a Call */}
        <button
          onClick={() => setScheduleModalOpen(true)}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
            <span className="font-slab font-bold text-base text-white">
              Schedule a Call
            </span>
          </div>
          <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80" />
        </button>

        {/* Nice List Certificate */}
        <button
          onClick={onOpenCertificate}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span className="font-slab font-bold text-base text-white">
              Nice List Certificate
            </span>
          </div>
          <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80" />
        </button>

        {/* Santa Tracker */}
        <button
          onClick={onOpenTracker}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
        >
          <div className="flex items-center gap-3.5">
            <Compass className="w-6 h-6 text-teal-400" />
            <span className="font-slab font-bold text-base text-white">
              Santa Tracker
            </span>
          </div>
          <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80" />
        </button>

        {/* Change Passcode PIN */}
        <div className="bg-white/5">
          <button
            onClick={() => setPinChangeOpen(!pinChangeOpen)}
            className="w-full px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-white/10 active:bg-white/15 transition-all text-left"
          >
            <div className="flex items-center gap-3.5">
              <KeyRound className="w-6 h-6 text-yellow-300" />
              <span className="font-slab font-bold text-base text-white">
                Change Parent PIN
              </span>
            </div>
            <ChevronRight className={`w-6 h-6 stroke-[2.5] text-white/80 transition-transform ${pinChangeOpen ? 'rotate-90' : ''}`} />
          </button>

          {pinChangeOpen && (
            <form onSubmit={handleSavePin} className="px-5 py-3 bg-black/40 space-y-2">
              <p className="text-xs text-stone-300">
                Enter new 4-digit PIN:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1225"
                  className="w-32 px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-center font-bold tracking-widest text-base focus:border-amber-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Call Schedule Modal */}
      <CallScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        profile={profile}
        onTriggerCall={(type, scenarioId, delay) => {
          onTriggerCall(type, scenarioId, delay);
          showToast(`Call scheduled (${delay === 0 ? 'Immediately' : `${delay}s`})!`);
        }}
      />

    </div>
  );
};
