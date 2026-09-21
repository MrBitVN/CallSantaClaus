import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Sparkles, RefreshCw, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { ChildProfile, CallScenario } from '../types';
import { soundManager } from '../utils/audio';

interface AudioCallScreenProps {
  scenario: CallScenario;
  profile: ChildProfile;
  onEndCall: () => void;
}

type CallStage =
  | 'santa_opening'      // Turn 1: Santa speaks user's uploaded master sample
  | 'listening_nice'     // Pause 1: Waiting for child to say naughty or nice
  | 'santa_gift_ask'     // Turn 2: Santa praises child and asks for dream gift
  | 'listening_gift'     // Pause 2: Waiting for child's gift wish
  | 'santa_cookie_ask'   // Turn 3: Santa confirms gift and asks for cookies/milk
  | 'listening_cookie'   // Pause 3: Waiting for child promise
  | 'santa_farewell'     // Turn 4: Santa's warm goodbye & Merry Christmas
  | 'call_completed';    // Call finished

export const AudioCallScreen: React.FC<AudioCallScreenProps> = ({
  scenario,
  profile,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [stage, setStage] = useState<CallStage>('santa_opening');
  const [isSantaSpeaking, setIsSantaSpeaking] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [pauseCountdown, setPauseCountdown] = useState(5);

  const pauseTimerRef = useRef<number | null>(null);
  const autoEndTimerRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const clearPauseTimer = () => {
    if (pauseTimerRef.current !== null) {
      clearInterval(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  const handleEndCallSafely = () => {
    if (autoEndTimerRef.current !== null) {
      clearTimeout(autoEndTimerRef.current);
      autoEndTimerRef.current = null;
    }
    clearPauseTimer();
    soundManager.stopAllAudio();
    onEndCall();
  };

  const triggerAutoEndCall = () => {
    if (autoEndTimerRef.current !== null) {
      clearTimeout(autoEndTimerRef.current);
    }
    // Automatically end call 2.2 seconds after Santa finishes speaking
    autoEndTimerRef.current = window.setTimeout(() => {
      handleEndCallSafely();
    }, 2200);
  };

  // Prevent double mount invocation in React
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    startStage('santa_opening');

    return () => {
      clearPauseTimer();
      if (autoEndTimerRef.current !== null) {
        clearTimeout(autoEndTimerRef.current);
      }
      soundManager.stopAllAudio();
    };
  }, []);

  const startStage = (targetStage: CallStage) => {
    clearPauseTimer();
    setStage(targetStage);

    if (targetStage === 'santa_opening') {
      // If a dedicated scenario is chosen (e.g. Birthday, Letter, Discipline, Sleigh)
      if (scenario && scenario.id && scenario.id !== 'naughty_or_nice') {
        const scenarioTexts: Record<string, string> = {
          happy_birthday: "Ho ho ho! A very special Happy Birthday to you! Mrs. Claus, the elves, and I are singing for you today! May your birthday be filled with sweet cake, laughter, and magical surprises! Happy Birthday!",
          received_letter: "Ho ho ho! Look what I have in my mittens! Your letter arrived safely at the North Pole! The reindeer loved hearing your sweet message, and the elves are working hard to make your Christmas magical!",
          gentle_discipline: "Ho ho ho! Hello my dear friend! Santa loves you very much. I know it can be tough sometimes, but I need you to listen to your parents and try your best. If you do your best, I will have a wonderful surprise for you on Christmas morning!",
          christmas_eve_flight: "Ho ho ho! The snow is falling and Rudolph's red nose is shining bright! The sleigh is packed to the brim with presents, and we are getting ready to take flight across the starry night sky! Merry Christmas Eve!"
        };

        const text = scenarioTexts[scenario.id] || scenario.script;
        setCurrentSubtitle(text);

        soundManager.playSantaScenario(
          scenario.id,
          () => setIsSantaSpeaking(true),
          () => {
            setIsSantaSpeaking(false);
            setStage('call_completed');
            triggerAutoEndCall();
          }
        );
        return;
      }

      // Default Interactive 4-Turn Call: Turn 1 with unified voice
      const text = "Ho ho ho! Merry Christmas to all! I'm making my list, and checking it twice. Now have you been naughty? Or have you been nice?";
      setCurrentSubtitle(text);

      soundManager.playSantaTurn(
        1,
        () => setIsSantaSpeaking(true),
        () => {
          setIsSantaSpeaking(false);
          startStage('listening_nice');
        }
      );
    } else if (targetStage === 'listening_nice') {
      // QUÃNG NGHỈ 1: Santa stops and listens (5s pause)
      setIsSantaSpeaking(false);
      setPauseCountdown(5);
      soundManager.triggerVibrate();

      let timeLeft = 5;
      pauseTimerRef.current = window.setInterval(() => {
        timeLeft -= 1;
        setPauseCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearPauseTimer();
          startStage('santa_gift_ask');
        }
      }, 1000);
    } else if (targetStage === 'santa_gift_ask') {
      // TURN 2: SANTA PRAISE & DREAM GIFT QUESTION (Unified Voice)
      const text = `Ho ho ho! Splendid! That is music to my ears! My golden Nice Book says you have been doing wonderful, helping out and being so kind! Now tell me, my dear child, what special gift do you wish for most this Christmas?`;
      setCurrentSubtitle(text);

      soundManager.playSantaTurn(
        2,
        () => setIsSantaSpeaking(true),
        () => {
          setIsSantaSpeaking(false);
          startStage('listening_gift');
        }
      );
    } else if (targetStage === 'listening_gift') {
      // QUÃNG NGHỈ 2: Santa listens for dream gift (5s pause)
      setIsSantaSpeaking(false);
      setPauseCountdown(5);
      soundManager.triggerVibrate();

      let timeLeft = 5;
      pauseTimerRef.current = window.setInterval(() => {
        timeLeft -= 1;
        setPauseCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearPauseTimer();
          startStage('santa_cookie_ask');
        }
      }, 1000);
    } else if (targetStage === 'santa_cookie_ask') {
      // TURN 3: SANTA CONFIRMS GIFT & ASKS FOR COOKIES (Unified Voice)
      const text = `Ho ho ho! What a wonderful wish! The elves in my North Pole workshop are tying a golden ribbon on it right now! Now tell me, will you leave some sweet chocolate chip cookies for Santa and crunchy carrots for Rudolph on Christmas Eve?`;
      setCurrentSubtitle(text);

      soundManager.playSantaTurn(
        3,
        () => setIsSantaSpeaking(true),
        () => {
          setIsSantaSpeaking(false);
          startStage('listening_cookie');
        }
      );
    } else if (targetStage === 'listening_cookie') {
      // QUÃNG NGHỈ 3: Santa listens for cookie promise (5s pause)
      setIsSantaSpeaking(false);
      setPauseCountdown(5);
      soundManager.triggerVibrate();

      let timeLeft = 5;
      pauseTimerRef.current = window.setInterval(() => {
        timeLeft -= 1;
        setPauseCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearPauseTimer();
          startStage('santa_farewell');
        }
      }, 1000);
    } else if (targetStage === 'santa_farewell') {
      // TURN 4: SANTA'S HEARTFELT GOODBYE (Unified Voice)
      const text = `Ho ho ho! That warms my old heart! Remember to go to bed early on Christmas Eve, close your eyes tight, and keep spreading love and joy! Merry Christmas to you and your family, and a very Happy New Year! Ho ho ho, goodbye!`;
      setCurrentSubtitle(text);

      soundManager.playSantaTurn(
        4,
        () => setIsSantaSpeaking(true),
        () => {
          setIsSantaSpeaking(false);
          setStage('call_completed');
          // AUTOMATICALLY END CALL AFTER SANTA FINISHES SPEAKING
          triggerAutoEndCall();
        }
      );
    }
  };

  const handleChildAnswer = (nextStage: CallStage) => {
    clearPauseTimer();
    soundManager.triggerVibrate();
    startStage(nextStage);
  };

  const handleReplay = () => {
    soundManager.stopAllAudio();
    clearPauseTimer();
    startStage('santa_opening');
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isListeningStage = stage === 'listening_nice' || stage === 'listening_gift' || stage === 'listening_cookie';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-3 sm:p-4 select-none">
      <div className="relative w-full max-w-sm h-[700px] max-h-[94vh] rounded-[48px] bg-gradient-to-b from-stone-950 via-red-950/40 to-black border-4 border-stone-800 shadow-2xl flex flex-col items-center justify-between p-5 sm:p-6 text-white overflow-hidden">
        
        {/* Top Header */}
        <div className="w-full flex justify-between items-center text-xs text-stone-400 pt-1 px-2">
          <span className="font-mono">{formatTime(seconds)}</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected • North Pole</span>
          </div>
          <span className="font-mono text-[10px] text-amber-300">HD AUDIO</span>
        </div>

        {/* Santa Avatar & Visualizer */}
        <div className="flex flex-col items-center text-center mt-2 space-y-2.5 z-10 w-full">
          <div className="relative">
            {/* Animated sound wave rings when Santa speaks */}
            {isSantaSpeaking && (
              <>
                <div className="absolute -inset-4 rounded-full border-2 border-amber-400/50 animate-ping duration-1000" />
                <div className="absolute -inset-8 rounded-full border border-red-500/30 animate-pulse duration-700" />
              </>
            )}

            {/* Glowing ring when Santa is listening */}
            {isListeningStage && (
              <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/80 animate-pulse" />
            )}

            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl ring-4 ring-amber-500/20">
              <img
                src="/images/santa_avatar.jpg"
                alt="Santa Claus"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isSantaSpeaking ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>

            {/* Speaking / Listening State Badge */}
            <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
              <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold shadow-md border ${
                isSantaSpeaking 
                  ? 'bg-amber-500 text-amber-950 border-amber-300 animate-pulse'
                  : isListeningStage
                  ? 'bg-emerald-600 text-white border-emerald-300 animate-bounce'
                  : 'bg-stone-800 text-stone-300 border-stone-700'
              }`}>
                {isSantaSpeaking && '🎅 Santa speaking...'}
                {stage === 'listening_nice' && `👂 Santa listening... (${pauseCountdown}s)`}
                {stage === 'listening_gift' && `👂 Santa listening... (${pauseCountdown}s)`}
                {stage === 'listening_cookie' && `👂 Santa listening... (${pauseCountdown}s)`}
                {stage === 'call_completed' && '✨ Call Complete'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h2 className="text-2xl font-black text-amber-200 font-serif">
              Santa Claus
            </h2>
            <p className="text-[11px] text-amber-300/80 font-medium">
              Call for: {profile.name} (Age {profile.age})
            </p>
          </div>

          {/* Audio Visualizer Waveform */}
          <div className="flex items-center justify-center gap-1 h-7 px-4 w-full">
            {[35, 65, 95, 55, 80, 100, 75, 45, 90, 60, 30].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSantaSpeaking
                    ? 'bg-gradient-to-t from-red-500 to-amber-400'
                    : isListeningStage
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                    : 'bg-stone-700'
                }`}
                style={{
                  height: isSantaSpeaking || isListeningStage
                    ? `${Math.max(20, Math.floor(h * (isListeningStage ? 0.7 : 1)))}%`
                    : '15%',
                  opacity: isSantaSpeaking || isListeningStage ? 0.9 : 0.2
                }}
              />
            ))}
          </div>

          {/* Subtitles box */}
          {showSubtitles && currentSubtitle && (
            <div className="w-full max-h-24 overflow-y-auto px-4 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-700/60 text-left shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-amber-400 mb-0.5 font-semibold">
                <span>Santa Claus:</span>
                <button
                  onClick={() => setShowSubtitles(false)}
                  className="text-stone-400 hover:text-stone-200 text-[10px]"
                >
                  Hide
                </button>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed italic line-clamp-3">
                "{currentSubtitle}"
              </p>
            </div>
          )}
        </div>

        {/* INTERACTIVE Q&A / QUÃNG NGHỈ BUTTONS */}
        <div className="w-full flex flex-col items-center gap-2 z-10 px-2 min-h-[76px] justify-center">
          {stage === 'listening_nice' && (
            <div className="w-full space-y-1.5 animate-fade-in">
              <p className="text-[11px] text-emerald-300 font-bold text-center">
                Tell Santa: Naughty or Nice?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_gift_ask')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 transition-all flex items-center justify-center gap-1"
                >
                  <span>⭐ I've been Nice!</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_gift_ask')}
                  className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 transition-all flex items-center justify-center gap-1"
                >
                  <span>😇 Trying my best!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'listening_gift' && (
            <div className="w-full space-y-1.5 animate-fade-in">
              <p className="text-[11px] text-emerald-300 font-bold text-center">
                Tell Santa what gift you want:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_cookie_ask')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 transition-all flex items-center justify-center gap-1 line-clamp-1"
                >
                  <span>🎁 {profile.dreamGift || 'My dream gift'}</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_cookie_ask')}
                  className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 transition-all flex items-center justify-center gap-1"
                >
                  <span>✨ A big surprise!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'listening_cookie' && (
            <div className="w-full space-y-1.5 animate-fade-in">
              <p className="text-[11px] text-emerald-300 font-bold text-center">
                Promise Santa treats on Christmas Eve:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_farewell')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 transition-all flex items-center justify-center gap-1"
                >
                  <span>🍪 Yes! Cookies & Milk!</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_farewell')}
                  className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 transition-all flex items-center justify-center gap-1"
                >
                  <span>🥕 Carrots for Rudolph!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'call_completed' && (
            <div className="w-full text-center space-y-1.5 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500 text-xs font-bold text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Call Complete • Merry Christmas!</span>
              </div>
              <p className="text-[10px] text-stone-300 font-sans">
                🎅 Santa finished speaking. Hanging up automatically in 2s...
              </p>
            </div>
          )}

          {isSantaSpeaking && (
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Santa is speaking to {profile.name}...</span>
            </div>
          )}
        </div>

        {/* In-Call Controls Grid */}
        <div className="w-full space-y-4 mb-2 z-10">
          <div className="grid grid-cols-3 gap-4 px-6 text-center">
            {/* Mute */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <span className="text-[10px] text-stone-300">Mute</span>
            </div>

            {/* Replay */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleReplay}
                className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 flex items-center justify-center transition-colors"
                title="Restart Call"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-stone-300">Restart</span>
            </div>

            {/* Subtitles toggle */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  showSubtitles ? 'bg-amber-600/60 text-amber-200 border border-amber-400' : 'bg-neutral-800 text-stone-300'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-stone-300">Subtitles</span>
            </div>
          </div>

          {/* End Call Button */}
          <div className="flex justify-center">
            <button
              onClick={handleEndCallSafely}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 flex items-center justify-center shadow-lg shadow-red-900/60 transition-all group"
              aria-label="End Call"
            >
              <PhoneOff className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
