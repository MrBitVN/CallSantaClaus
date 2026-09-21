import React, { useState, useRef } from 'react';
import { Mic, PhoneCall, CheckCircle, Sparkles, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ChildProfile, VoicemailItem } from '../types';
import { soundManager } from '../utils/audio';
import { storage } from '../utils/storage';

interface VoicemailScreenProps {
  profile: ChildProfile;
  onBack?: () => void;
  onOpenParent: () => void;
}

export const VoicemailScreen: React.FC<VoicemailScreenProps> = ({ profile, onBack, onOpenParent }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const initialIvr = 'Welcome to the North Pole 1800-SANTA Hotline! Press 1 to record your wishlist, 2 to check the Nice List, 3 for the elves song, 4 to hear Rudolph the reindeer.';

  const [ivrMessage, setIvrMessage] = useState<string>(initialIvr);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedSuccess, setRecordedSuccess] = useState(false);

  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleKeyPress = (digit: string) => {
    setPressedKey(digit);
    soundManager.playDTMF(digit);
    setTimeout(() => setPressedKey(null), 200);

    if (digit === '1') {
      startRecordingFlow();
    } else if (digit === '2') {
      const isNice = profile.behaviorStatus === 'nice';
      const msg = isNice
        ? `Ding! Official North Pole records confirm: ${profile.name} is on the CERTIFIED NICE LIST! Your dream gift ${profile.dreamGift} is being prepared by the elves!`
        : `Notice from Santa: ${profile.name} needs a little extra effort with ${profile.badHabit || 'listening'} to receive ${profile.dreamGift}! You can do it!`;
      setIvrMessage(msg);
      soundManager.speakSanta(msg);
      if (isNice) confetti({ particleCount: 50, spread: 60 });
    } else if (digit === '3') {
      const msg = 'Ho! Ho! Ho! The cheerful elves are singing: Jingle bells, jingle bells, jingle all the way! May your holiday be warm and full of joy!';
      setIvrMessage(msg);
      soundManager.speakSanta(msg);
    } else if (digit === '4') {
      const msg = 'Ho! Ho! Rudolph and the 8 reindeer are munching sweet carrots and jingling their harness bells happily for you!';
      setIvrMessage(msg);
      soundManager.speakSanta(msg);
    } else {
      const msg = `You pressed ${digit}. Please press 1 to record your Christmas wishlist for Santa!`;
      setIvrMessage(msg);
    }
  };

  const startRecordingFlow = async () => {
    setRecordedSuccess(false);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    const prompt = `Ho! Ho! Ho! Hello ${profile.name}! After the tone, tell Santa loudly what special gifts you wish for this Christmas!`;
    
    setIvrMessage(prompt);
    soundManager.speakSanta(prompt, undefined, async () => {
      // Beep sound
      soundManager.playBell(1000, 0.4, 'sine', 0.3);
      soundManager.triggerVibrate();
      setIsRecording(true);

      // Start microphone recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          saveRecordingToStorage();
        };

        mediaRecorder.start();
      } catch (err) {
        console.warn('Microphone permission denied, using simulated timer:', err);
      }

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    });
  };

  const stopRecordingFlow = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      saveRecordingToStorage();
    }
  };

  const saveRecordingToStorage = () => {
    let blobUrl: string | undefined;
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      blobUrl = URL.createObjectURL(audioBlob);
    }

    const preview = `Voice wishlist from ${profile.name} (${recordingSeconds || 5}s) - Wish: ${profile.dreamGift}`;

    const newVoicemail: VoicemailItem = {
      id: `vm-${Date.now()}`,
      childName: profile.name,
      timestamp: Date.now(),
      duration: Math.max(1, recordingSeconds),
      audioBlobUrl: blobUrl,
      messagePreview: preview,
      isListened: false
    };

    storage.saveVoicemail(newVoicemail);
    setRecordedSuccess(true);
    confetti({ particleCount: 60, spread: 70 });

    const santaEnd = `Ho! Ho! Ho! Wonderful, ${profile.name}! Your wish has been recorded directly to the North Pole! Santa and your family have received it!`;
    
    setIvrMessage(santaEnd);
    soundManager.speakSanta(santaEnd);
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col select-none text-white animate-fade-in">
      
      {/* Red Header Bar with Back Button */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-gradient-to-r from-[#99131d] via-[#750e17] to-[#590910] border-b border-white/20 shadow-md flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border-2 border-white/90 bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shadow-sm"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <h1 className="font-slab font-bold text-2xl text-white tracking-wide text-center drop-shadow-sm">
          Santa Voicemail
        </h1>

        <div className="w-10" />
      </div>

      <div className="max-w-md mx-auto p-3 sm:p-4 space-y-5 flex-1 w-full">
      
      {/* Hotline Header Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/60 border border-red-700/60 text-xs font-semibold text-amber-300">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>North Pole 1800-SANTA Hotline</span>
        </div>
        <h2 className="text-2xl font-black text-amber-200 font-serif">
          Santa Voicemail
        </h2>
        <p className="text-xs text-stone-300 max-w-xs mx-auto">
          Leave a wish message or press keys to interact with Santa's magical workshop!
        </p>
      </div>

      {/* Voice Assistant / IVR Display Output */}
      <div className="relative p-4 rounded-3xl bg-gradient-to-b from-stone-900 via-neutral-900 to-black border-2 border-amber-500/40 shadow-xl overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow">
            <img src="/images/santa_avatar.jpg" alt="Santa" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1 text-left flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                Santa Claus Operator
              </span>
              {isRecording && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-red-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  REC {recordingSeconds}s
                </span>
              )}
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-sans min-h-[44px]">
              {ivrMessage}
            </p>
          </div>
        </div>

        {/* Recording active banner */}
        {isRecording && (
          <div className="mt-3 p-3 rounded-2xl bg-red-950/80 border border-red-600 flex flex-col items-center gap-2 animate-pulse">
            <span className="text-xs text-red-200 font-bold">
              Recording in progress... speak into your microphone!
            </span>
            <button
              onClick={stopRecordingFlow}
              className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg active:scale-95"
            >
              Finish Recording ✓
            </button>
          </div>
        )}

        {/* Success Confirmation */}
        {recordedSuccess && (
          <div className="mt-3 p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Message saved successfully to North Pole!</span>
            </div>
            <button
              onClick={onOpenParent}
              className="underline text-[11px] font-semibold text-amber-300 hover:text-amber-200"
            >
              Parents Listen
            </button>
          </div>
        )}
      </div>

      {/* Quick Recording Bar */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecordingFlow}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 border border-red-400/40 active:scale-98 transition-all"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>Record Wish Message</span>
          </button>
        ) : (
          <button
            onClick={stopRecordingFlow}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 border border-emerald-400 active:scale-98 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Finish Recording</span>
          </button>
        )}
      </div>

      {/* Interactive Dialpad */}
      <div className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: '1', sub: 'Wishlist' },
            { k: '2', sub: 'Nice List' },
            { k: '3', sub: 'Song' },
            { k: '4', sub: 'Reindeer' },
            { k: '5', sub: 'JKL' },
            { k: '6', sub: 'MNO' },
            { k: '7', sub: 'PQRS' },
            { k: '8', sub: 'TUV' },
            { k: '9', sub: 'WXYZ' },
            { k: '*', sub: '🎁' },
            { k: '0', sub: '+' },
            { k: '#', sub: '❄️' },
          ].map(({ k, sub }) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 border active:scale-95 ${
                pressedKey === k
                  ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-lg scale-95'
                  : 'bg-stone-800/90 hover:bg-stone-700/90 text-stone-100 border-stone-700/70 hover:border-amber-400/40'
              }`}
            >
              <span className="text-xl font-bold font-mono leading-none">{k}</span>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide mt-0.5">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tip for parents */}
      <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Parents can listen to recorded voicemails in Parental Zone</span>
      </div>

      </div>
    </div>
  );
};
