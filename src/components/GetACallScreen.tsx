import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, Check } from 'lucide-react';
import type { ChildProfile, CallType } from '../types';
import { DEFAULT_SCENARIOS } from '../data/scenarios';
import { ChildProfileModal } from './ChildProfileModal';

interface GetACallScreenProps {
  profile: ChildProfile;
  onBack: () => void;
  onUpdateProfile: (profile: ChildProfile) => void;
  onScheduleCall: (type: CallType, scenarioId: string, delaySeconds: number) => void;
}

export const GetACallScreen: React.FC<GetACallScreenProps> = ({
  profile,
  onBack,
  onUpdateProfile,
  onScheduleCall,
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [whenModalOpen, setWhenModalOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEFAULT_SCENARIOS[3].id); // gentle_discipline
  const [delaySeconds, setDelaySeconds] = useState<number>(0); // 0 = Immediately
  const [callType, setCallType] = useState<CallType>('audio');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentScenario = DEFAULT_SCENARIOS.find(s => s.id === selectedScenarioId) || DEFAULT_SCENARIOS[0];

  const whenOptions = [
    { label: 'Immediately', seconds: 0 },
    { label: 'In 10 seconds', seconds: 10 },
    { label: 'In 30 seconds', seconds: 30 },
    { label: 'In 1 minute', seconds: 60 },
  ];

  const currentWhenLabel = whenOptions.find(w => w.seconds === delaySeconds)?.label || 'Immediately';

  const handleStartSchedule = () => {
    onScheduleCall(callType, selectedScenarioId, delaySeconds);
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col justify-between select-none text-white animate-fade-in relative">
      
      {/* Top Header Bar */}
      <div>
        <div className="sticky top-0 z-30 px-4 py-3 bg-gradient-to-r from-[#99131d] via-[#750e17] to-[#590910] border-b border-white/20 shadow-md flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <h1 className="font-slab font-bold text-2xl text-white tracking-wide text-center drop-shadow-sm">
            Get a Call
          </h1>

          <div className="w-10" />
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-16 inset-x-4 z-50 max-w-sm mx-auto bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-2xl text-xs text-center shadow-2xl animate-bounce">
            {toastMsg}
          </div>
        )}

        {/* Form Sections (iOS Grouped Style) */}
        <div className="max-w-lg mx-auto w-full divide-y divide-white/20 bg-black/20 backdrop-blur-sm border-b border-white/20">
          
          {/* SECTION: SELECT A RECIPIENT */}
          <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-white/80 uppercase">
            SELECT A RECIPIENT:
          </div>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
          >
            <span className="font-slab font-bold text-lg text-white">
              {profile.name}
            </span>
            <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80" />
          </button>

          {/* SECTION: REASON FOR CALL */}
          <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-white/80 uppercase">
            REASON FOR CALL:
          </div>

          <button
            onClick={() => setReasonModalOpen(true)}
            className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
          >
            <div className="flex-1 pr-2">
              <span className="font-slab font-bold text-base text-white block leading-snug">
                {currentScenario.title}
              </span>
              <span className="text-xs text-stone-300 font-sans mt-0.5 block line-clamp-1">
                {selectedScenarioId === 'gentle_discipline'
                  ? (profile.badHabit || "Didn't clean room")
                  : (profile.goodHabit || currentScenario.description)}
              </span>
            </div>
            <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80 shrink-0" />
          </button>

          <div className="px-5 py-2 bg-black/20 text-[11px] text-white/70 font-sans leading-relaxed">
            We recommend to first test the call while alone. When you are satisfied with the things being said, reschedule the call and let a child answer it.
          </div>

          {/* SECTION: WHEN */}
          <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-white/80 uppercase">
            WHEN:
          </div>

          <button
            onClick={() => setWhenModalOpen(true)}
            className="w-full px-5 py-3.5 flex items-center justify-between gap-3 bg-white/5 hover:bg-white/15 active:bg-white/20 transition-all text-left"
          >
            <span className="font-slab font-bold text-base text-white">
              {currentWhenLabel}
            </span>
            <ChevronRight className="w-6 h-6 stroke-[2.5] text-white/80" />
          </button>

          {/* SECTION: CALL TYPE */}
          <div className="px-5 py-2.5 bg-black/40 font-slab font-bold text-xs tracking-wider text-white/80 uppercase">
            CALL TYPE:
          </div>

          <div className="px-5 py-3 bg-white/5 flex items-center gap-3">
            <button
              onClick={() => setCallType('audio')}
              className={`flex-1 py-2 rounded-xl font-slab font-bold text-xs transition-all border ${
                callType === 'audio'
                  ? 'bg-emerald-600/40 border-emerald-400 text-emerald-200 shadow-md'
                  : 'bg-black/30 border-stone-800 text-stone-400'
              }`}
            >
              📞 Voice Call
            </button>
            <button
              onClick={() => setCallType('video')}
              className={`flex-1 py-2 rounded-xl font-slab font-bold text-xs transition-all border ${
                callType === 'video'
                  ? 'bg-rose-600/40 border-rose-400 text-rose-200 shadow-md'
                  : 'bg-black/30 border-stone-800 text-stone-400'
              }`}
            >
              📹 Video Call
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM STICKY BUTTON: Schedule Call */}
      <div className="sticky bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-40 max-w-lg mx-auto w-full">
        <button
          onClick={handleStartSchedule}
          className="w-full py-4 rounded-xl bg-[#00c818] hover:bg-[#00db1b] active:scale-98 text-white font-slab font-bold text-xl shadow-[0_6px_20px_rgba(0,200,24,0.4)] flex items-center justify-center gap-3 transition-all tracking-wide"
        >
          <Phone className="w-6 h-6 fill-current" />
          <span>Schedule Call</span>
        </button>
      </div>

      {/* Recipient Profile Modal */}
      <ChildProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSave={(updated) => {
          onUpdateProfile(updated);
          showToast('Recipient profile updated!');
        }}
      />

      {/* Reason for Call Selector Modal */}
      {reasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-white">
          <div className="bg-[#2a060a] border-2 border-red-700/80 rounded-3xl max-w-md w-full p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="font-slab font-bold text-lg text-white">
                Select Reason for Call
              </h3>
              <button
                onClick={() => setReasonModalOpen(false)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 py-3 scrollbar-none flex-1">
              {DEFAULT_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioId(sc.id);
                    setReasonModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                    selectedScenarioId === sc.id
                      ? 'bg-amber-500/25 border-amber-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-200'
                  }`}
                >
                  <div>
                    <div className="font-slab font-bold text-sm text-white">
                      {sc.title}
                    </div>
                    <div className="text-xs text-stone-400 font-sans line-clamp-1 mt-0.5">
                      {sc.description}
                    </div>
                  </div>
                  {selectedScenarioId === sc.id && (
                    <Check className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* When Selector Modal */}
      {whenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none text-white">
          <div className="bg-[#2a060a] border-2 border-red-700/80 rounded-3xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="font-slab font-bold text-lg text-white">
                Select Ring Time
              </h3>
              <button
                onClick={() => setWhenModalOpen(false)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 py-3">
              {whenOptions.map((opt) => (
                <button
                  key={opt.seconds}
                  onClick={() => {
                    setDelaySeconds(opt.seconds);
                    setWhenModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    delaySeconds === opt.seconds
                      ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-200'
                  }`}
                >
                  <span className="font-slab text-sm">
                    {opt.label}
                  </span>
                  {delaySeconds === opt.seconds && (
                    <Check className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
