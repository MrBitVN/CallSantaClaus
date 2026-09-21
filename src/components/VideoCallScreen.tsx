import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw, Smile, CheckCircle2 } from 'lucide-react';
import type { ChildProfile, CallScenario } from '../types';
import { soundManager } from '../utils/audio';

interface VideoCallScreenProps {
  scenario: CallScenario;
  profile: ChildProfile;
  onEndCall: () => void;
}

type CallStage =
  | 'santa_opening'      // Turn 1: Santa speaks master sample audio
  | 'listening_nice'     // Pause 1: Waiting for child to say naughty or nice
  | 'santa_gift_ask'     // Turn 2: Santa reacts and asks about dream gift
  | 'listening_gift'     // Pause 2: Waiting for child's gift wish
  | 'santa_cookie_ask'   // Turn 3: Santa promises gift and asks for cookies/milk
  | 'listening_cookie'   // Pause 3: Waiting for child promise
  | 'santa_farewell'     // Turn 4: Santa's warm goodbye & Merry Christmas
  | 'call_completed';    // Call finished

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
  scenario,
  profile,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [stage, setStage] = useState<CallStage>('santa_opening');
  const [isSantaSpeaking, setIsSantaSpeaking] = useState(false);
  const [hasHatFilter, setHasHatFilter] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [pauseCountdown, setPauseCountdown] = useState(5);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  // Request child webcam feed
  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 640 } },
          audio: false
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam permission denied or not available:', err);
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
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

  // Prevent double invocation
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
      if (scenario.id && scenario.id !== 'naughty_or_nice') {
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
      // QUÃNG NGHỈ 1: Santa listens for 5s (or child response)
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

  const getVideoBackground = (id: string) => {
    if (id === 'happy_birthday') return '/images/video_birthday.jpg';
    if (id === 'received_letter') return '/images/video_letter.jpg';
    if (id === 'naughty_or_nice') return '/images/video_nicebook.jpg';
    return '/images/santa_videocall.jpg';
  };

  const getVideoSource = (id: string) => {
    if (id === 'happy_birthday') return '/videos/video_birthday.mp4';
    if (id === 'received_letter') return '/videos/video_letter.mp4';
    if (id === 'naughty_or_nice') return '/videos/video_nicebook.mp4';
    return '/videos/santa_videocall_loop.mp4';
  };

  const isListeningStage = stage === 'listening_nice' || stage === 'listening_gift' || stage === 'listening_cookie';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-3 sm:p-4 select-none">
      <div className="relative w-full max-w-sm h-[740px] max-h-[96vh] rounded-[48px] bg-black border-4 border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
        
        {/* Main Video Stream Background: Santa Claus Live Stream */}
        <div className="absolute inset-0 z-0">
          <video
            src={getVideoSource(scenario.id)}
            poster={getVideoBackground(scenario.id)}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isSantaSpeaking ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Subtle warm vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Top Video Overlay: Status & Info */}
        <div className="relative z-10 p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span className={`w-2 h-2 rounded-full ${isListeningStage ? 'bg-emerald-400' : 'bg-red-500'} animate-ping`} />
            <span className="font-semibold text-amber-200">
              {isListeningStage ? `LISTENING (${pauseCountdown}s)` : 'LIVE • NORTH POLE'}
            </span>
            <span className="text-white/70 font-mono">• {formatTime(seconds)}</span>
          </div>

          <button
            onClick={() => setHasHatFilter(!hasHatFilter)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors backdrop-blur-md ${
              hasHatFilter
                ? 'bg-amber-500 text-amber-950 border-amber-300'
                : 'bg-black/60 text-white border-white/20'
            }`}
            title="AR Filter"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>AR Hat</span>
          </button>
        </div>

        {/* Santa Speech Floating Bubble */}
        <div className="relative z-10 px-4 mb-auto">
          {currentSubtitle && (
            <div className="max-w-[90%] bg-black/85 backdrop-blur-md border border-amber-400/60 p-3 rounded-2xl rounded-tl-sm text-left shadow-lg animate-fade-in">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-0.5">
                <span>🎅 {isSantaSpeaking ? 'Santa speaking:' : 'Santa asked:'}</span>
              </div>
              <p className="text-xs text-stone-100 leading-relaxed font-sans line-clamp-3 italic">
                "{currentSubtitle}"
              </p>
            </div>
          )}
        </div>

        {/* INTERACTIVE Q&A BUTTONS / LISTENING PROMPT */}
        <div className="relative z-20 px-4 py-2 w-full">
          {stage === 'listening_nice' && (
            <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-emerald-400/80 space-y-2 animate-fade-in shadow-2xl">
              <p className="text-xs text-emerald-300 font-bold text-center">
                Tell Santa: Naughty or Nice?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_gift_ask')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 flex items-center justify-center gap-1"
                >
                  <span>⭐ I've been Nice!</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_gift_ask')}
                  className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 flex items-center justify-center gap-1"
                >
                  <span>😇 Trying my best!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'listening_gift' && (
            <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-emerald-400/80 space-y-2 animate-fade-in shadow-2xl">
              <p className="text-xs text-emerald-300 font-bold text-center">
                Tell Santa what gift you wish for:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_cookie_ask')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 flex items-center justify-center gap-1 line-clamp-1"
                >
                  <span>🎁 {profile.dreamGift || 'My dream gift'}</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_cookie_ask')}
                  className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 flex items-center justify-center gap-1"
                >
                  <span>✨ A big surprise!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'listening_cookie' && (
            <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-emerald-400/80 space-y-2 animate-fade-in shadow-2xl">
              <p className="text-xs text-emerald-300 font-bold text-center">
                Promise Santa treats on Christmas Eve:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChildAnswer('santa_farewell')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md border border-emerald-400 flex items-center justify-center gap-1"
                >
                  <span>🍪 Yes! Cookies & Milk!</span>
                </button>
                <button
                  onClick={() => handleChildAnswer('santa_farewell')}
                  className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs shadow-md border border-amber-400 flex items-center justify-center gap-1"
                >
                  <span>🥕 Carrots for Rudolph!</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'call_completed' && (
            <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-center space-y-1 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Call Complete • Merry Christmas!</span>
              </div>
              <p className="text-[10px] text-stone-300 font-sans">
                🎅 Santa finished speaking. Hanging up automatically in 2s...
              </p>
            </div>
          )}
        </div>

        {/* Child Front Camera PiP (Picture-in-Picture) */}
        <div className="absolute right-4 bottom-24 z-20 w-28 h-36 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-stone-900 group">
          {isCameraOn && !cameraError ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
              {/* Santa Hat AR Filter Sticker */}
              {hasHatFilter && (
                <div className="absolute -top-1 inset-x-0 flex justify-center pointer-events-none drop-shadow-md animate-pulse">
                  <span className="text-2xl transform -rotate-12">🎅</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 p-2 text-center">
              <span className="text-3xl mb-1">👶</span>
              <span className="text-[10px] text-amber-300 font-bold">{profile.name}</span>
            </div>
          )}
          
          <div className="absolute bottom-1 inset-x-0 flex justify-center">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/70 text-white font-mono">
              {profile.name}
            </span>
          </div>
        </div>

        {/* Bottom Call Controls (FaceTime Style) */}
        <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 to-transparent">
          <div className="flex items-center justify-center gap-4">
            
            {/* Toggle Mic */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                isMuted ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Toggle Mic"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCallSafely}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 flex items-center justify-center shadow-lg shadow-red-900/60 transition-transform"
              title="End Call"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>

            {/* Replay speech */}
            <button
              onClick={handleReplay}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-amber-300 flex items-center justify-center transition-colors"
              title="Restart Call"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Toggle Child Camera */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                !isCameraOn ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Toggle Camera"
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
