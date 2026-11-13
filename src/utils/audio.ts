// Web Audio API Sound Synthesizer for Crostic Game
// Provides crisp, zero-latency micro-interactions and celebration audio

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public haptics: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crisp keyboard tap
  public playTap() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
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
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // C5 to C6
      const freq = notes[pitchIndex % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
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
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chords.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
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

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
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
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
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
      // Fanfare: G4, C5, E5, G5, C6 (extended festive finish)
      const notes = [
        { f: 392.00, d: 0.15, offset: 0.0 },
        { f: 523.25, d: 0.15, offset: 0.14 },
        { f: 659.25, d: 0.15, offset: 0.28 },
        { f: 783.99, d: 0.25, offset: 0.42 },
        { f: 659.25, d: 0.12, offset: 0.70 },
        { f: 783.99, d: 0.15, offset: 0.84 },
        { f: 1046.50, d: 0.65, offset: 1.00 },
      ];

      notes.forEach(({ f, d, offset }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = this.ctx!.currentTime + offset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.28, start + 0.03);
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

  // Trigger mobile haptic feedback if enabled
  public vibrate(pattern: number | number[] = 15) {
    if (!this.haptics) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }
}

export const sound = new SoundEngine();
