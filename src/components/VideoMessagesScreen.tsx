import React, { useState } from 'react';
import { 
  ChevronLeft, Sparkles, Film, Wand2, Play, Trash2, 
  Star, Gift, Moon, Bell, Edit3
} from 'lucide-react';
import type { ChildProfile, GeneratedVideoMessage, VideoSceneOption } from '../types';
import { DEFAULT_SCENARIOS, interpolateScript } from '../data/scenarios';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { VideoMessagePlayerModal } from './VideoMessagePlayerModal';

interface VideoMessagesScreenProps {
  profile: ChildProfile;
  onBack: () => void;
}

const SCENE_OPTIONS: VideoSceneOption[] = [
  {
    id: 'fireside',
    name: "Santa's Fireside & Golden Book",
    description: 'Santa in his cozy festive room checking the golden Nice List and smiling',
    videoSrc: '/videos/video_nicebook.mp4',
    posterSrc: '/images/video_nicebook.jpg',
    durationBadge: '0:13',
  },
  {
    id: 'workshop',
    name: 'North Pole Workshop & Wishlist',
    description: 'Santa with glasses closely reading the handwritten snowman wishlist letter',
    videoSrc: '/videos/video_letter.mp4',
    posterSrc: '/images/video_letter.jpg',
    durationBadge: '0:15',
  },
  {
    id: 'sleigh',
    name: 'Flying Sleigh & Starry Sky',
    description: 'Cinematic flight through golden Christmas trees and floating presents',
    videoSrc: '/videos/video_sleigh.mp4',
    posterSrc: '/images/santa_videocall.jpg',
    durationBadge: '0:16',
  },
  {
    id: 'birthday',
    name: 'North Pole Birthday Gala',
    description: 'Festive montage of gifts, joy, and Santa laughing warmly with hearty smiles',
    videoSrc: '/videos/video_birthday.mp4',
    posterSrc: '/images/video_birthday.jpg',
    durationBadge: '0:18',
  },
  {
    id: 'studio',
    name: "Santa's North Pole Desk",
    description: 'Santa speaking directly from his North Pole room with festive lights',
    videoSrc: '/videos/santa_videocall_loop.mp4',
    posterSrc: '/images/santa_avatar.jpg',
    durationBadge: '0:14',
  }
];

export const VideoMessagesScreen: React.FC<VideoMessagesScreenProps> = ({
  profile,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [savedVideos, setSavedVideos] = useState<GeneratedVideoMessage[]>(() => storage.getSavedVideos());

  // Form State for Creating Video from Script
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEFAULT_SCENARIOS[0].id);
  const [isCustomScript, setIsCustomScript] = useState(false);
  const [customTitle, setCustomTitle] = useState('A Special Message from Santa');
  const [customScriptContent, setCustomScriptContent] = useState(
    'Ho ho ho! Hello {name}! Santa is sending you all my love from the North Pole! Remember to keep being kind, cheerful, and helpful every single day! Merry Christmas!'
  );
  const [selectedSceneId, setSelectedSceneId] = useState<string>('fireside');

  // Personalized Form Overrides
  const [childName, setChildName] = useState(profile.name || 'Tommy');
  const [childAge, setChildAge] = useState<number | ''>(profile.age || 6);
  const [goodHabit, setGoodHabit] = useState(profile.goodHabit || 'cleaning up toys and being polite');
  const [badHabit, setBadHabit] = useState(profile.badHabit || 'going to bed on time and eating veggies');
  const [dreamGift, setDreamGift] = useState(profile.dreamGift || 'a remote-controlled race car');
  const [specialNote, setSpecialNote] = useState('');

  // Generation Modal & Progress Simulation
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStepIndex, setGenStepIndex] = useState(0);

  // Active Video Modal for Player
  const [activeVideoModal, setActiveVideoModal] = useState<GeneratedVideoMessage | null>(null);

  const selectedScenario = DEFAULT_SCENARIOS.find(s => s.id === selectedScenarioId) || DEFAULT_SCENARIOS[0];
  const selectedScene = SCENE_OPTIONS.find(s => s.id === selectedSceneId) || SCENE_OPTIONS[0];

  // Compute live interpolated script text
  const currentInterpolatedScript = React.useMemo(() => {
    const rawTemplate = isCustomScript ? customScriptContent : selectedScenario.script;
    const tempProfile: ChildProfile = {
      ...profile,
      name: childName.trim() || 'little one',
      age: Number(childAge) || 6,
      goodHabit: goodHabit.trim() || 'being kind and polite',
      badHabit: badHabit.trim() || 'listening to parents',
      dreamGift: dreamGift.trim() || 'your wonderful present',
    };
    let text = interpolateScript(rawTemplate, tempProfile);
    if (specialNote.trim()) {
      text += ` And one more thing: ${specialNote.trim()}!`;
    }
    return text;
  }, [
    isCustomScript, customScriptContent, selectedScenario, profile,
    childName, childAge, goodHabit, badHabit, dreamGift, specialNote
  ]);

  const generationSteps = [
    { title: '1/4. Analyzing script & dialogue...', desc: `Personalizing script for ${childName}` },
    { title: '2/4. Synthesizing authentic Santa speech...', desc: 'Applying deep North Pole baritone resonance' },
    { title: '3/4. Lip-syncing & adding magic snow...', desc: 'Rendering holiday lighting & atmospheric flakes' },
    { title: '4/4. Encoding 1080p North Pole dispatch...', desc: 'Finalizing crystal clear Santa video' },
  ];

  // Start Generation Flow
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenProgress(5);
    setGenStepIndex(0);
    soundManager.playMagicChime();

    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const next = prev + Math.floor(Math.random() * 14) + 8;
        if (next >= 75) setGenStepIndex(3);
        else if (next >= 50) setGenStepIndex(2);
        else if (next >= 25) setGenStepIndex(1);
        return Math.min(next, 95);
      });
    }, 380);

    // Complete after ~2.8 seconds
    setTimeout(() => {
      clearInterval(interval);
      setGenProgress(100);
      soundManager.playMagicChime();

      const newVideo: GeneratedVideoMessage = {
        id: `gen-video-${Date.now()}`,
        title: isCustomScript ? customTitle : selectedScenario.title,
        scenarioId: isCustomScript ? 'custom' : selectedScenario.id,
        script: isCustomScript ? customScriptContent : selectedScenario.script,
        interpolatedScript: currentInterpolatedScript,
        childName: childName.trim() || 'My Sweet Child',
        recipientAge: Number(childAge) || 6,
        sceneThemeId: selectedScene.id,
        videoSrc: selectedScene.videoSrc,
        posterSrc: selectedScene.posterSrc,
        durationBadge: selectedScene.durationBadge,
        createdAt: Date.now(),
        customNote: specialNote.trim() || undefined,
      };

      // Save to local storage
      storage.saveGeneratedVideo(newVideo);
      setSavedVideos(storage.getSavedVideos());

      // Close generator modal and launch video player
      setTimeout(() => {
        setIsGenerating(false);
        setActiveVideoModal(newVideo);
      }, 500);
    }, 2800);
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this video message from your library?')) {
      storage.deleteSavedVideo(id);
      setSavedVideos(storage.getSavedVideos());
    }
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gift': return <Gift className="w-4 h-4 text-emerald-300" />;
      case 'Moon': return <Moon className="w-4 h-4 text-indigo-300" />;
      case 'Bell': return <Bell className="w-4 h-4 text-yellow-300" />;
      case 'Star': return <Star className="w-4 h-4 text-amber-300" />;
      default: return <Sparkles className="w-4 h-4 text-rose-300" />;
    }
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col select-none text-white animate-fade-in">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-gradient-to-r from-[#8f121b] via-[#6f0e16] to-[#52090f] border-b border-white/20 shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-slab font-bold text-xl sm:text-2xl text-white tracking-wide text-center drop-shadow-sm flex items-center gap-1.5">
            <span>Santa Video Studio</span>
          </h1>
          <span className="text-[10px] text-amber-300/90 font-mono">Create Video from Script</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Gold & Green Holiday Accent Strip */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-red-600 shadow-sm" />

      {/* Tab Switcher: Create Video vs Saved Library */}
      <div className="max-w-lg mx-auto w-full p-4 pb-1">
        <div className="p-1 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2.5 px-3 rounded-xl font-slab font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border border-amber-400/40'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Create from Script</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-2.5 px-3 rounded-xl font-slab font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg border border-amber-400/40'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4 text-emerald-300" />
            <span>My Videos ({savedVideos.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CREATE VIDEO FROM SCRIPT */}
      {activeTab === 'create' && (
        <div className="flex-1 max-w-lg mx-auto w-full p-4 space-y-6">

          {/* STEP 1: CHOOSE SCRIPT / SCENARIO */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 border border-amber-400 flex items-center justify-center font-slab font-bold text-xs">
                  1
                </span>
                <h2 className="font-slab font-bold text-base text-amber-200">
                  Select Holiday Script:
                </h2>
              </div>

              <button
                onClick={() => setIsCustomScript(!isCustomScript)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 font-sans ${
                  isCustomScript
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-300'
                    : 'bg-white/10 text-stone-200 border-white/20 hover:bg-white/20'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{isCustomScript ? 'Use Presets' : 'Custom Script'}</span>
              </button>
            </div>

            {/* Presets List */}
            {!isCustomScript ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEFAULT_SCENARIOS.map((sc) => {
                  const isSelected = selectedScenarioId === sc.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenarioId(sc.id);
                        // Auto match best scene for selected scenario
                        if (sc.id === 'happy_birthday') setSelectedSceneId('birthday');
                        else if (sc.id === 'received_letter') setSelectedSceneId('workshop');
                        else if (sc.id === 'christmas_eve_flight') setSelectedSceneId('sleigh');
                        else setSelectedSceneId('fireside');
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#40080e] border-amber-400 shadow-lg scale-[1.01]'
                          : 'bg-black/30 border-white/15 hover:bg-black/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-white/10 shrink-0">
                          {getScenarioIcon(sc.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-slab font-bold text-sm text-white leading-tight">
                            {sc.title}
                          </h4>
                          <p className="text-[11px] text-stone-300 font-sans mt-0.5 line-clamp-2">
                            {sc.description}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Custom Script Text Box */
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/60 space-y-3">
                <div>
                  <label className="text-xs font-slab font-bold text-amber-200 block mb-1">
                    Video Title:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-slab text-sm focus:outline-none focus:border-amber-400"
                    placeholder="e.g. A Special Surprise from Santa"
                  />
                </div>
                <div>
                  <label className="text-xs font-slab font-bold text-amber-200 block mb-1">
                    Custom Script Content:
                  </label>
                  <textarea
                    value={customScriptContent}
                    onChange={(e) => setCustomScriptContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs sm:text-sm font-serif leading-relaxed focus:outline-none focus:border-amber-400"
                    placeholder="Type what Santa should say to your child..."
                  />
                  <span className="text-[10px] text-stone-400 block mt-1">
                    You can use variables: {'{name}'}, {'{age}'}, {'{goodHabit}'}, {'{dreamGift}'}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* STEP 2: PERSONALIZE RECIPIENT */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 border border-amber-400 flex items-center justify-center font-slab font-bold text-xs">
                2
              </span>
              <h2 className="font-slab font-bold text-base text-amber-200">
                Personalize Details for Recipient:
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-slab text-stone-300 block mb-1">
                    Child's Name:
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-slab text-sm focus:outline-none focus:border-amber-400"
                    placeholder="Tommy"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-slab text-stone-300 block mb-1">
                    Age:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={childAge}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChildAge(val === '' ? '' : parseInt(val, 10) || '');
                    }}
                    placeholder="6"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-slab text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-slab text-stone-300 block mb-1">
                  Good Habit or Accomplishment (to praise):
                </label>
                <input
                  type="text"
                  value={goodHabit}
                  onChange={(e) => setGoodHabit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. cleaning up toys and being kind"
                />
              </div>

              <div>
                <label className="text-[11px] font-slab text-stone-300 block mb-1">
                  Habit to improve / Secret promise with Santa:
                </label>
                <input
                  type="text"
                  value={badHabit}
                  onChange={(e) => setBadHabit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. going to bed on time and eating veggies"
                />
              </div>

              <div>
                <label className="text-[11px] font-slab text-stone-300 block mb-1">
                  Dream Gift on Christmas Wishlist:
                </label>
                <input
                  type="text"
                  value={dreamGift}
                  onChange={(e) => setDreamGift(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. a remote-controlled race car"
                />
              </div>

              <div>
                <label className="text-[11px] font-slab text-stone-300 block mb-1">
                  Optional Secret Note from Parents:
                </label>
                <input
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Santa will leave cookies near the chimney"
                />
              </div>
            </div>
          </section>

          {/* LIVE SCRIPT PREVIEW BOX */}
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs font-slab text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Script Preview (What Santa Will Say):</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Personalized Real-time</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#1e0306] border border-amber-500/40 text-xs sm:text-sm text-stone-200 font-serif leading-relaxed shadow-inner max-h-36 overflow-y-auto">
              <p className="italic">
                "{currentInterpolatedScript}"
              </p>
            </div>
          </section>

          {/* STEP 3: NORTH POLE SCENE & THEME */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 border border-amber-400 flex items-center justify-center font-slab font-bold text-xs">
                3
              </span>
              <h2 className="font-slab font-bold text-base text-amber-200">
                Select North Pole Scene & Setting:
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SCENE_OPTIONS.map((scene) => {
                const isSelected = selectedSceneId === scene.id;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedSceneId(scene.id)}
                    className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02] shadow-xl'
                        : 'border-white/20 bg-black/40 hover:border-white/40'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                      <img
                        src={scene.posterSrc}
                        alt={scene.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-amber-300 border border-white/20">
                        {scene.durationBadge}
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}

                      <div className="absolute bottom-1.5 left-2 right-2">
                        <span className="font-slab font-bold text-[11px] text-white block leading-tight line-clamp-1">
                          {scene.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 4: ACTION BUTTON TO CREATE VIDEO */}
          <div className="pt-2">
            <button
              onClick={handleStartGeneration}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-98 text-white font-slab font-bold text-lg sm:text-xl shadow-[0_8px_30px_rgba(219,43,39,0.5)] border-2 border-amber-300 flex items-center justify-center gap-3 transition-all"
            >
              <Wand2 className="w-6 h-6 animate-pulse text-amber-200" />
              <span>Generate Santa Video from Script</span>
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2 font-sans">
              ✨ Produces a personalized Santa video message with synchronized subtitles & North Pole seals.
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: SAVED VIDEO MESSAGES GALLERY */}
      {activeTab === 'gallery' && (
        <div className="flex-1 max-w-lg mx-auto w-full p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-slab font-bold text-lg text-amber-200">
              Personalized Video Messages:
            </h2>
            <button
              onClick={() => setActiveTab('create')}
              className="text-xs px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 font-slab font-bold text-white flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>+ Create New</span>
            </button>
          </div>

          {savedVideos.length === 0 ? (
            <div className="p-8 text-center bg-black/30 rounded-3xl border border-white/10 space-y-3">
              <Film className="w-12 h-12 text-stone-500 mx-auto" />
              <h3 className="font-slab font-bold text-base text-stone-300">
                No videos created yet
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Create your child's first personalized video message using our festive holiday scripts!
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-2 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-slab font-bold text-xs"
              >
                Create Video Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoModal(video)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-white/30 bg-[#250508] hover:border-amber-400 shadow-xl transition-all duration-300 active:scale-[0.98]"
                >
                  {/* Thumbnail Box */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={video.posterSrc}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                    {/* Title in Quotes */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-slab font-bold text-lg sm:text-xl text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                        "{video.title}"
                      </h3>
                      <p className="text-xs text-amber-300 font-sans font-medium mt-0.5">
                        For {video.childName} ({video.recipientAge} yrs)
                      </p>
                    </div>

                    {/* Top Right Duration & Play Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-white/20">
                        {video.durationBadge}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-red-600/90 border border-white/40 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Top Left HD Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-red-950/85 backdrop-blur-md text-[9px] font-sans font-bold text-amber-200 border border-red-500/40 tracking-wider">
                        AI SANTA HD
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="px-4 py-2.5 bg-[#170204] border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteVideo(video.id, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-900/60 text-stone-400 hover:text-red-300 transition-colors"
                        title="Delete video"
                        aria-label="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI VIDEO GENERATION MODAL PIPELINE */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none text-white">
          <div className="relative w-full max-w-md bg-[#240407] rounded-3xl p-6 sm:p-7 border-2 border-amber-400/80 shadow-2xl flex flex-col items-center text-center space-y-5">
            
            {/* Animated Magic Wand Spinner */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg">
                <Wand2 className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>
            </div>

            {/* Title & Step Description */}
            <div className="space-y-1.5">
              <h3 className="font-slab font-bold text-xl text-white">
                Generating Santa's Video...
              </h3>
              <p className="font-slab font-bold text-amber-300 text-sm">
                {generationSteps[genStepIndex]?.title}
              </p>
              <p className="text-xs text-stone-300 font-sans">
                {generationSteps[genStepIndex]?.desc}
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-1.5">
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${genProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-stone-400 px-1">
                <span>Rendering 1080p</span>
                <span>{genProgress}%</span>
              </div>
            </div>

            {/* Festive North Pole Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-stone-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>North Pole AI Video Engine</span>
            </div>

          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideoModal && (
        <VideoMessagePlayerModal
          isOpen={!!activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          videoMessage={activeVideoModal}
          onCreateNew={() => {
            setActiveVideoModal(null);
            setActiveTab('create');
          }}
        />
      )}

    </div>
  );
};
