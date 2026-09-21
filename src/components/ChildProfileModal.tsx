import React, { useState, useEffect } from 'react';
import { X, Check, Award, AlertTriangle } from 'lucide-react';
import type { ChildProfile } from '../types';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  onSave: (updated: ChildProfile) => void;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<ChildProfile, 'age'> & { age: number | '' }>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      age: Number(formData.age) || 5,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#2a060a] border-2 border-red-700/60 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#8b1420] via-[#5c0b14] to-[#3a060c] border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h2 className="font-slab font-bold text-lg text-white">
              Child Recipient Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-sm flex-1 scrollbar-none">
          
          {/* Name & Age */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Child's Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Age
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={formData.age}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    age: val === '' ? '' : parseInt(val, 10) || '',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-sm text-center"
                placeholder="5"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'boy' })}
                className={`py-2 rounded-xl font-medium text-xs transition-all border ${
                  formData.gender === 'boy'
                    ? 'bg-blue-600/40 border-blue-400 text-blue-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                👦 Boy
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'girl' })}
                className={`py-2 rounded-xl font-medium text-xs transition-all border ${
                  formData.gender === 'girl'
                    ? 'bg-rose-600/40 border-rose-400 text-rose-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                👧 Girl
              </button>
            </div>
          </div>

          {/* Hobbies */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Hobbies & Interests
            </label>
            <input
              type="text"
              value={formData.hobby}
              onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
              placeholder="e.g. Lego building, soccer, drawing..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
            />
          </div>

          {/* Favorite Food */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">
              Favorite Food / Treats
            </label>
            <input
              type="text"
              value={formData.favoriteFood}
              onChange={(e) => setFormData({ ...formData, favoriteFood: e.target.value })}
              placeholder="e.g. chocolate chip cookies, strawberries..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
            />
          </div>

          {/* Good Habit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span>⭐</span>
              <span>Good Behavior to Praise</span>
            </label>
            <textarea
              rows={2}
              value={formData.goodHabit}
              onChange={(e) => setFormData({ ...formData, goodHabit: e.target.value })}
              placeholder="e.g. Cleans up toys nicely, shares with sibling..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-emerald-400 focus:outline-none text-white text-xs resize-none"
            />
          </div>

          {/* Bad Habit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
              <span>⚠️</span>
              <span>Behavior Santa Needs to Encourage / Remind</span>
            </label>
            <textarea
              rows={2}
              value={formData.badHabit}
              onChange={(e) => setFormData({ ...formData, badHabit: e.target.value })}
              placeholder="e.g. Going to bed on time, eating vegetables..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs resize-none"
            />
          </div>

          {/* Dream Gift */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-rose-300 flex items-center gap-1">
              <span>🎁</span>
              <span>Christmas Dream Gift</span>
            </label>
            <input
              type="text"
              value={formData.dreamGift}
              onChange={(e) => setFormData({ ...formData, dreamGift: e.target.value })}
              placeholder="e.g. remote-controlled race car, dollhouse..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
            />
          </div>

          {/* Behavior Status */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-stone-300">
              Current Behavior Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, behaviorStatus: 'nice' })}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  formData.behaviorStatus === 'nice'
                    ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>⭐ Certified Nice List</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, behaviorStatus: 'warning' })}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  formData.behaviorStatus === 'warning'
                    ? 'bg-rose-600/40 border-rose-400 text-rose-200'
                    : 'bg-black/30 border-stone-800 text-stone-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>⚠️ Gentle Reminder</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-5 h-5" />
              <span>Save Recipient Profile</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
