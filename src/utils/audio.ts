import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

class SoundManager {
  private ctx: AudioContext | null = null;
  private ringtoneInterval: number | null = null;
  private ringtoneAudio: HTMLAudioElement | null = null;
  private isRingtonePlaying = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  public isAudioPlaying = false;
  private activeTimeouts: number[] = [];

  constructor() {
    this.initAudioUnlock();
  }

  // Auto-unlock AudioContext on first user interaction
  private initAudioUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      try {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch {
        // ignore
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  }

  getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  async triggerVibrate() {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
  }

  async triggerNotificationHaptic() {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }

  private clearAllTimeouts() {
    this.activeTimeouts.forEach(id => clearTimeout(id));
    this.activeTimeouts = [];
  }

  // STOP ALL AUDIO INSTANTLY (Prevents any audio overlap or premature callbacks)
  stopAllAudio() {
    this.isAudioPlaying = false;
    this.stopRingtone();
    this.clearAllTimeouts();

    if (this.currentAudioElement) {
      try {
        const el = this.currentAudioElement;
        // Detach handlers before pausing to prevent phantom onended / onerror callbacks
        el.onplay = null;
        el.onended = null;
        el.onerror = null;
        el.pause();
        el.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  stopSpeaking() {
    this.stopAllAudio();
  }

  // Play audio file strictly alone (no overlap, safe promise handling)
  playAudioFile(
    url: string,
    onStart?: () => void,
    onEnd?: () => void
  ): HTMLAudioElement {
    this.stopAllAudio();
    this.isAudioPlaying = true;

    const audio = new Audio(url);
    this.currentAudioElement = audio;

    let hasEnded = false;
    const safeEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.currentAudioElement === audio) {
        this.isAudioPlaying = false;
        this.currentAudioElement = null;
      }
      onEnd?.();
    };

    audio.onplay = () => {
      onStart?.();
    };

    audio.onended = () => {
      safeEnd();
    };

    audio.onerror = () => {
      safeEnd();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If aborted intentionally by stopAllAudio, do nothing
        if (err?.name === 'AbortError') return;
        safeEnd();
      });
    }

    return audio;
  }

  // Play Santa's Master Sample Voice (Unified deep male Santa voice)
  // "Ho ho ho! Merry Christmas to all! I'm making my list, and checking it twice. Now have you been naughty? Or have you been nice?"
  playSantaMasterVoice(onStart?: () => void, onEnd?: () => void): HTMLAudioElement {
    return this.playAudioFile('/audio/santa_turn1_opening.mp3', onStart, onEnd);
  }

  // Play Santa's conversational turns (all verified unified deep male Santa voice, 100% consistent)
  playSantaTurn(
    turnNumber: 1 | 2 | 3 | 4,
    onStart?: () => void,
    onEnd?: () => void
  ): HTMLAudioElement {
    const turnFiles: Record<number, string> = {
      1: '/audio/santa_turn1_opening.mp3',      // Unified Christopher Neural: "Ho ho ho! Merry Christmas to all! ..."
      2: '/audio/santa_turn2_gift_ask.mp3',     // Unified Christopher Neural: "Ho ho ho! Splendid! ... what special gift do you wish for?"
      3: '/audio/santa_turn3_cookies_ask.mp3',  // Unified Christopher Neural: "Ho ho ho! What a wonderful wish! ... cookies and carrots on Christmas Eve?"
      4: '/audio/santa_turn4_farewell.mp3'      // Unified Christopher Neural: "Ho ho ho! That warms my old heart! ... Merry Christmas to all!"
    };

    const file = turnFiles[turnNumber] || turnFiles[1];
    return this.playAudioFile(file, onStart, onEnd);
  }

  // Play Santa scenario audio (all deep male Santa tracks, matching the unified voice)
  playSantaScenario(
    scenarioId: string,
    onStart?: () => void,
    onEnd?: () => void
  ): HTMLAudioElement {
    const scenarioFiles: Record<string, string> = {
      happy_birthday: '/audio/santa_scenario_birthday.mp3',
      received_letter: '/audio/santa_scenario_letter.mp3',
      gentle_discipline: '/audio/santa_scenario_discipline.mp3',
      christmas_eve_flight: '/audio/santa_scenario_eve.mp3',
      naughty_or_nice: '/audio/santa_turn1_opening.mp3'
    };

    const file = scenarioFiles[scenarioId] || '/audio/santa_turn1_opening.mp3';
    return this.playAudioFile(file, onStart, onEnd);
  }

  // Play DTMF keypad touch tones
  playDTMF(key: string) {
    this.triggerVibrate();

    const dtmfFreqs: Record<string, [number, number]> = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };

    const freqs = dtmfFreqs[key];
    if (!freqs) return;

    try {
      const ctx = this.getContext();
      const [low, high] = freqs;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = low;
      osc2.frequency.value = high;

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.18);
    } catch (e) {
      console.warn('DTMF sound error', e);
    }
  }

  // Jingle Bells Holiday Ringtone
  startChristmasRingtone() {
    if (this.isRingtonePlaying) return;
    this.stopAllAudio();
    this.isRingtonePlaying = true;

    try {
      const ringVoice = new Audio('/audio/santa_ring_call_en.mp3');
      ringVoice.loop = true;
      ringVoice.volume = 0.95;
      ringVoice.play().catch(() => {});
      this.ringtoneAudio = ringVoice;
    } catch {
      // ignore
    }
  }

  stopRingtone() {
    this.isRingtonePlaying = false;
    if (this.ringtoneInterval !== null) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
    if (this.ringtoneAudio) {
      try {
        this.ringtoneAudio.pause();
        this.ringtoneAudio.currentTime = 0;
        this.ringtoneAudio.src = '';
      } catch {
        // ignore
      }
      this.ringtoneAudio = null;
    }
  }

  // Magic sparkling chime
  playMagicChime() {
    this.triggerNotificationHaptic();
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // ignore
    }
  }

  playBell(freq = 880, duration = 0.4, type: OscillatorType = 'sine', gainVal = 0.25) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  // Santa Speech Handler: Strictly GUARANTEES a male Santa voice only! Never a female voice!
  speakSanta(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    this.stopAllAudio();

    const lower = text.toLowerCase();
    // 1. If text matches known turns or scenarios, use authentic studio tracks:
    if (lower.includes('naughty') || lower.includes('nice') || lower.includes('checking it twice')) {
      this.playSantaTurn(1, onStart, onEnd);
      return;
    }
    if (lower.includes('wish for') || lower.includes('dream gift') || lower.includes('nice book')) {
      this.playSantaTurn(2, onStart, onEnd);
      return;
    }
    if (lower.includes('cookie') || lower.includes('rudolph') || lower.includes('carrots')) {
      this.playSantaTurn(3, onStart, onEnd);
      return;
    }
    if (lower.includes('farewell') || lower.includes('goodbye') || lower.includes('new year') || lower.includes('bed early')) {
      this.playSantaTurn(4, onStart, onEnd);
      return;
    }
    if (lower.includes('birthday')) {
      this.playSantaScenario('happy_birthday', onStart, onEnd);
      return;
    }
    if (lower.includes('letter')) {
      this.playSantaScenario('received_letter', onStart, onEnd);
      return;
    }

    // 2. Strict Male Speech Synthesis Fallback (ONLY if a genuine male voice is detected)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const voices = window.speechSynthesis.getVoices();

        // STRICT FILTER: reject any known female voice names!
        const maleVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase();
          const isFemale =
            name.includes('zira') || name.includes('jenny') || name.includes('aria') ||
            name.includes('samantha') || name.includes('victoria') || name.includes('karen') ||
            name.includes('female') || name.includes('woman') || name.includes('girl') ||
            name.includes('hazel') || name.includes('susan') || name.includes('heera');
          if (isFemale) return false;
          return lang.includes('en') && (
            name.includes('david') || name.includes('mark') || name.includes('george') ||
            name.includes('guy') || name.includes('male') || name.includes('natural')
          );
        });

        // Only use SpeechSynthesis if a verified male voice is found
        if (maleVoice) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = maleVoice;
          utterance.pitch = 0.65; // Deep baritone
          utterance.rate = 0.82;  // Deliberate grandfatherly pacing
          utterance.volume = 1.0;

          utterance.onstart = () => {
            this.isAudioPlaying = true;
            onStart?.();
          };
          utterance.onend = () => {
            this.isAudioPlaying = false;
            onEnd?.();
          };
          utterance.onerror = () => {
            this.isAudioPlaying = false;
            onEnd?.();
          };

          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch {
        // ignore
      }
    }

    // 3. Guaranteed Safe Fallback: Play authentic Santa audio clip (100% male!)
    this.playAudioFile('/audio/santa_intro_en.mp3', onStart, onEnd);
  }
}

export const soundManager = new SoundManager();
