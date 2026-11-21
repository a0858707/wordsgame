import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Web Audio API Sound Synthesizer & Haptic Engine for Crostic Game
// Provides crisp, zero-latency micro-interactions and celebration audio
// Optimized for iOS Taptic Engine & Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public haptics: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.unlockAudio();
      };

      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('touchend', unlockHandler, { passive: true });
      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('click', unlockHandler);
    }
  }

  // Unlocks audio context on mobile (iOS Safari requires explicit gesture warmup)
  public unlockAudio() {
    this.initContext();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (!this.isUnlocked) {
        try {
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
          this.isUnlocked = true;
        } catch {
          // ignore
        }
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crisp keyboard tap (enhanced for phone speakers)
  public playTap() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.055);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  // Cheerful chime when a letter is placed
  public playLetterChime(pitchIndex = 0) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5]; // C5 to C6
      const freq = notes[pitchIndex % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.24);
    } catch {
      // ignore
    }
  }

  // Uplifting chord/arpeggio when a word clue is completely solved
  public playWordSolved() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chords.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Magic hint sparkle
  public playHintSparkle() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const baseFreq = 880;
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + i * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * (1 + i * 0.25), startTime);

        gain.gain.setValueAtTime(0.28, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      }
    } catch {
      // ignore
    }
  }

  // Error buzz
  public playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.setValueAtTime(130, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  // Grand victory fanfare on puzzle solved!
  public playVictoryFanfare() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 392.0, d: 0.16, offset: 0.0 },
        { f: 523.25, d: 0.16, offset: 0.14 },
        { f: 659.25, d: 0.16, offset: 0.28 },
        { f: 783.99, d: 0.26, offset: 0.42 },
        { f: 659.25, d: 0.14, offset: 0.7 },
        { f: 783.99, d: 0.16, offset: 0.84 },
        { f: 1046.5, d: 0.75, offset: 1.0 },
      ];

      notes.forEach(({ f, d, offset }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = this.ctx!.currentTime + offset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.42, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + d + 0.05);
      });
    } catch {
      // ignore
    }
  }

  // Trigger native iOS Taptic Engine impact
  public async hapticTap(style: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.haptics) return;
    try {
      const impactStyle =
        style === 'heavy'
          ? ImpactStyle.Heavy
          : style === 'medium'
          ? ImpactStyle.Medium
          : ImpactStyle.Light;
      await Haptics.impact({ style: impactStyle });
    } catch {
      // Fallback to web vibration if capacitor is unavailable
      this.vibrateWeb(10);
    }
  }

  // Trigger success haptic notification (word solved / level complete)
  public async hapticSuccess() {
    if (!this.haptics) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      this.vibrateWeb([25, 40, 25]);
    }
  }

  // Trigger error buzz haptic
  public async hapticError() {
    if (!this.haptics) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      this.vibrateWeb([40, 30, 40]);
    }
  }

  // Trigger subtle selection haptic when navigating tiles
  public async hapticSelection() {
    if (!this.haptics) return;
    try {
      await Haptics.selectionChanged();
    } catch {
      // ignore
    }
  }

  // Web vibration fallback for non-native browsers
  private vibrateWeb(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }

  // Legacy vibrate compatibility wrapper
  public vibrate(pattern: number | number[] = 20) {
    if (!this.haptics) return;
    if (Array.isArray(pattern)) {
      this.hapticSuccess();
    } else {
      this.hapticTap(pattern > 25 ? 'medium' : 'light');
    }
  }
}

export const sound = new SoundEngine();
