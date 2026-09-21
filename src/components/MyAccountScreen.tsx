import React, { useState, useEffect } from 'react';
import { ChevronLeft, Award, AlertTriangle, Save } from 'lucide-react';
import type { ChildProfile } from '../types';

interface MyAccountScreenProps {
  profile: ChildProfile;
  onUpdateProfile: (profile: ChildProfile) => void;
  onBack: () => void;
}

export const MyAccountScreen: React.FC<MyAccountScreenProps> = ({
  profile,
  onUpdateProfile,
  onBack,
}) => {
  const [formData, setFormData] = useState<Omit<ChildProfile, 'age'> & { age: number | '' }>(profile);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...formData,
      age: Number(formData.age) || 5,
    });
    showToast('Child profile saved successfully!');
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col select-none text-white animate-fade-in">
      
      {/* Red Header Bar with Back Button */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-gradient-to-r from-[#99131d] via-[#750e17] to-[#590910] border-b border-white/20 shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="font-slab font-bold text-2xl text-white tracking-wide text-center drop-shadow-sm">
          Child's Profile
        </h1>

        <div className="w-10" />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 inset-x-4 z-50 max-w-sm mx-auto bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-2xl text-xs text-center shadow-2xl animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-lg mx-auto w-full p-4 space-y-4">
        
        {/* Name & Age */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-semibold text-stone-300">
              Child's Name:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-sm"
              placeholder="e.g. Tommy"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-300">
              Age:
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
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-300">
            Gender:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'boy' })}
              className={`py-2 rounded-xl font-medium text-xs transition-all border ${
                formData.gender === 'boy'
                  ? 'bg-blue-600/40 border-blue-400 text-blue-200 shadow-md'
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
                  ? 'bg-rose-600/40 border-rose-400 text-rose-200 shadow-md'
                  : 'bg-black/30 border-stone-800 text-stone-400'
              }`}
            >
              👧 Girl
            </button>
          </div>
        </div>

        {/* Hobbies */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-300">
            Hobbies & Interests:
          </label>
          <input
            type="text"
            value={formData.hobby}
            onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
            placeholder="e.g. building Lego sets, drawing, soccer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
          />
        </div>

        {/* Favorite Food */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-300">
            Favorite Food / Treats:
          </label>
          <input
            type="text"
            value={formData.favoriteFood}
            onChange={(e) => setFormData({ ...formData, favoriteFood: e.target.value })}
            placeholder="e.g. chocolate chip cookies, mac and cheese"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
          />
        </div>

        {/* Good Habit */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span>⭐</span>
            <span>Good Habit (What Santa praises):</span>
          </label>
          <textarea
            rows={2}
            value={formData.goodHabit}
            onChange={(e) => setFormData({ ...formData, goodHabit: e.target.value })}
            placeholder="e.g. always cleaning up toys and being polite to elders"
            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-emerald-400 focus:outline-none text-white text-xs resize-none"
          />
        </div>

        {/* Bad Habit */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-amber-400 flex items-center gap-1">
            <span>⚠️</span>
            <span>Habit to Improve (Gentle reminder):</span>
          </label>
          <textarea
            rows={2}
            value={formData.badHabit}
            onChange={(e) => setFormData({ ...formData, badHabit: e.target.value })}
            placeholder="e.g. going to bed on time and eating green vegetables"
            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs resize-none"
          />
        </div>

        {/* Dream Gift */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-rose-300 flex items-center gap-1">
            <span>🎁</span>
            <span>Dream Wishlist Gift:</span>
          </label>
          <input
            type="text"
            value={formData.dreamGift}
            onChange={(e) => setFormData({ ...formData, dreamGift: e.target.value })}
            placeholder="e.g. a remote-controlled race car"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-red-900/80 focus:border-amber-400 focus:outline-none text-white text-xs"
          />
        </div>

        {/* Behavior Status */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-stone-300">
            Santa's Golden List Status:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, behaviorStatus: 'nice' })}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                formData.behaviorStatus === 'nice'
                  ? 'bg-amber-600/40 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-black/30 border-stone-800 text-stone-400'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certified Nice List</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, behaviorStatus: 'warning' })}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                formData.behaviorStatus === 'warning'
                  ? 'bg-rose-600/40 border-rose-400 text-rose-200 shadow-md'
                  : 'bg-black/30 border-stone-800 text-stone-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Needs Improvement</span>
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-slab font-bold text-base shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Save Child Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};
