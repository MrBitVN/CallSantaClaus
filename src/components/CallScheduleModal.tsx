import React, { useState } from 'react';
import { X, Phone, Video, Clock, Sparkles } from 'lucide-react';
import type { ChildProfile, CallType } from '../types';
import { DEFAULT_SCENARIOS } from '../data/scenarios';

interface CallScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  onTriggerCall: (type: CallType, scenarioId: string, delaySeconds: number) => void;
}

export const CallScheduleModal: React.FC<CallScheduleModalProps> = ({
  isOpen,
  onClose,
  profile,
  onTriggerCall,
}) => {
  const [selectedType, setSelectedType] = useState<CallType>('audio');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEFAULT_SCENARIOS[0].id);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);

  if (!isOpen) return null;

  const handleStart = () => {
    onTriggerCall(selectedType, selectedScenarioId, delaySeconds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#2a060a] border-2 border-red-700/60 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#8b1420] via-[#5c0b14] to-[#3a060c] border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📞</span>
            <h2 className="font-slab font-bold text-lg text-white">
              Get a Call from Santa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1 scrollbar-none">
          
          {/* Call Type: Audio vs Video */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Select Call Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('audio')}
                className={`py-2.5 px-3 rounded-2xl font-slab font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                  selectedType === 'audio'
                    ? 'bg-emerald-600/40 border-emerald-400 text-emerald-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Voice Call</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('video')}
                className={`py-2.5 px-3 rounded-2xl font-slab font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                  selectedType === 'video'
                    ? 'bg-rose-600/40 border-rose-400 text-rose-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Select Reason for Call
            </label>
            <div className="space-y-2">
              {DEFAULT_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                    selectedScenarioId === sc.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                      : 'bg-black/30 border-stone-800/80 text-stone-300 hover:bg-black/50'
                  }`}
                >
                  <div>
                    <div className="font-slab font-bold text-xs text-white">
                      {sc.title}
                    </div>
                    <div className="text-[11px] text-stone-400 font-sans line-clamp-1">
                      {sc.description}
                    </div>
                  </div>
                  {selectedScenarioId === sc.id && (
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Time Delay */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              When Should Santa Call?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDelaySeconds(0)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  delaySeconds === 0
                    ? 'bg-red-600/50 border-red-400 text-white font-bold'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                ⚡ Immediately
              </button>
              <button
                type="button"
                onClick={() => setDelaySeconds(10)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  delaySeconds === 10
                    ? 'bg-amber-600/50 border-amber-400 text-white font-bold'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                ⏱️ In 10s
              </button>
              <button
                type="button"
                onClick={() => setDelaySeconds(30)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                  delaySeconds === 30
                    ? 'bg-amber-600/50 border-amber-400 text-white font-bold'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                ⏱️ In 30s
              </button>
            </div>
            <p className="text-[11px] text-stone-400 font-sans italic pt-1 leading-normal">
              Tip: Set a timer, leave the phone on the table, and let {profile.name} see Santa calling!
            </p>
          </div>

          {/* Start Call Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-slab font-bold text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Clock className="w-5 h-5" />
              <span>
                {delaySeconds === 0
                  ? 'Start Call Immediately'
                  : `Schedule Call (in ${delaySeconds}s)`}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
