import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Download, Share2, Volume2, VolumeX, Sparkles, Film, Check, Maximize2 } from 'lucide-react';
import type { GeneratedVideoMessage } from '../types';
import { soundManager } from '../utils/audio';

interface VideoMessagePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoMessage: GeneratedVideoMessage;
  onCreateNew?: () => void;
}

export const VideoMessagePlayerModal: React.FC<VideoMessagePlayerModalProps> = ({
  isOpen,
  onClose,
  videoMessage,
  onCreateNew,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const scriptText = videoMessage.interpolatedScript || videoMessage.script;

  // Split script into sentence segments for progressive subtitle display
  const sentences = React.useMemo(() => {
    return scriptText
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  }, [scriptText]);

  // Determine current active sentence based on video progress
  const activeSentenceIndex = React.useMemo(() => {
    if (!duration || duration <= 0 || sentences.length === 0) return 0;
    const progress = Math.min(1, Math.max(0, currentTime / duration));
    const index = Math.floor(progress * sentences.length);
    return Math.min(index, sentences.length - 1);
  }, [currentTime, duration, sentences.length]);

  useEffect(() => {
    if (isOpen) {
      soundManager.stopAllAudio();
      setIsEnded(false);
      setCurrentTime(0);

      // Play Santa magic sound when opening modal
      soundManager.playMagicChime();

      // Autoplay video
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay blocked by browser policy, user can click play
                setIsPlaying(false);
              });
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      soundManager.stopAllAudio();
    }
  }, [isOpen, videoMessage.id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isEnded) {
        videoRef.current.currentTime = 0;
        setIsEnded(false);
      }
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setIsEnded(false);
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = videoMessage.videoSrc;
      link.download = `Santa_Video_${videoMessage.childName.replace(/\s+/g, '_')}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(videoMessage.videoSrc, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Personalized Santa Video for ${videoMessage.childName}`,
      text: `🎅 Watch this special personalized video message from Santa Claus for ${videoMessage.childName}!\n"${videoMessage.title}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled or not supported
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch {
        // ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none text-white">
      <div className="relative w-full max-w-lg bg-[#1f0407] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_16px_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[96vh]">
        
        {/* Top Floating Close Button */}
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            soundManager.stopAllAudio();
            onClose();
          }}
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/40 flex items-center justify-center text-white transition-all backdrop-blur-md shadow-lg active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Copy Toast Alert */}
        {copiedToast && (
          <div className="absolute top-16 inset-x-4 z-40 max-w-xs mx-auto bg-emerald-600 border border-emerald-400 text-white font-slab text-xs py-2 px-3 rounded-full text-center shadow-2xl flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>Copied Santa video link to share!</span>
          </div>
        )}

        {/* Video Screen Container */}
        <div 
          ref={videoContainerRef}
          className="relative aspect-[16/9] w-full bg-black overflow-hidden flex items-center justify-center group"
        >
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoMessage.videoSrc}
            poster={videoMessage.posterSrc}
            playsInline
            loop={false}
            webkit-playsinline="true"
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onClick={handleTogglePlay}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

          {/* Top Left Festive Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/90 border border-amber-400/60 backdrop-blur-md text-[10px] font-slab font-bold text-amber-200 shadow-md">
              <Film className="w-3.5 h-3.5 text-amber-300" />
              <span>North Pole Official Video</span>
            </span>
          </div>

          {/* Center Play / Replay Button Overlay when Paused or Ended */}
          {(!isPlaying || isEnded) && (
            <div 
              onClick={handleTogglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity backdrop-blur-[2px]"
            >
              <button 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-2 border-amber-300 shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Play"
              >
                {isEnded ? (
                  <RotateCcw className="w-8 h-8 stroke-[2.5]" />
                ) : (
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                )}
              </button>
            </div>
          )}

          {/* Bottom Video Progress Bar and Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-3 py-2 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-1">
            {/* Scrubber Range */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* Time Display */}
                <span className="font-mono text-[11px] text-amber-200">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-[9px] font-mono text-emerald-300">
                  1080P HD
                </span>
                <button
                  onClick={handleFullscreen}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Message Details & Dynamic Subtitles */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#250508] via-[#1a0205] to-[#120103]">
          
          {/* Header Title & Recipient Tag */}
          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[11px] font-slab font-bold text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Scripted for: {videoMessage.childName}</span>
              </div>

              <span className="text-[10px] font-mono text-stone-400">
                {new Date(videoMessage.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-slab font-bold text-lg sm:text-xl text-white tracking-wide drop-shadow-sm">
              "{videoMessage.title}"
            </h3>
          </div>

          {/* Synchronized Subtitles Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-slab text-amber-200/90 uppercase tracking-wider">
              <span>📜 Santa's Message (Synchronized Script):</span>
              <span className="text-[10px] font-mono text-amber-400/80">
                {sentences.length > 0 ? `${activeSentenceIndex + 1}/${sentences.length}` : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-red-900/60 text-xs sm:text-sm text-stone-200 leading-relaxed max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-red-900 font-serif">
              {sentences.map((sent, idx) => {
                const isActive = idx === activeSentenceIndex && isPlaying;
                return (
                  <span
                    key={idx}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-amber-300 font-bold bg-amber-950/40 px-1 py-0.5 rounded shadow-sm'
                        : idx < activeSentenceIndex
                        ? 'text-stone-300'
                        : 'text-stone-500'
                    } mr-1.5`}
                  >
                    "{sent}"
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action Buttons: Play/Pause, Replay, Download, Share */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-slab font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all border border-amber-400/30"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Video' : isEnded ? 'Replay Video' : 'Play Video'}</span>
              </button>

              <button
                onClick={handleReplay}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all shadow-md"
                aria-label="Replay"
                title="Replay from start"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Actions: Download Video, Share Video, Create Another */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-slab font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Save Video</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-slab font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Share Video</span>
              </button>
            </div>

            {/* Create Another Video from Script */}
            {onCreateNew && (
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  soundManager.stopAllAudio();
                  onClose();
                  onCreateNew();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-stone-950 font-slab font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Another Scripted Video</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
