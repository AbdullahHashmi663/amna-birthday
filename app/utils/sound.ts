// Web Audio API Sound Synthesizer for Birthday Experience
// 100% self-contained, no external audio files required!

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Gentle balloon pop sound
export function playPop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    console.warn("Audio pop error:", e);
  }
}

// Ethereal celebration chime
export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const startTime = now + idx * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  } catch (e) {
    console.warn("Audio chime error:", e);
  }
}

// Gentle Ameen prayer bell
export function playPrayerBell() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const freqs = [440, 880, 1320]; // A4 with harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.15 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  } catch (e) {
    console.warn("Audio bell error:", e);
  }
}

// Candle blow whoosh
export function playBlowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(300, now + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio blow error:", e);
  }
}

// Music Box Synthesizer for "Happy Birthday"
// Frequencies in Hz:
const NOTE: Record<string, number> = {
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

// [note, duration in beats]
const BIRTHDAY_TUNE: [string, number][] = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2.5],
];

class BirthdayMusicBox {
  private isPlaying = false;
  private currentTimeout: NodeJS.Timeout | null = null;
  private noteIndex = 0;
  private beatDuration = 480; // ms per beat

  public play(onNote?: (note: string) => void) {
    if (this.isPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    this.isPlaying = true;
    this.scheduleNextNote(onNote);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.noteIndex = 0;
  }

  public toggle(onNote?: (note: string) => void): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(onNote);
      return true;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }

  private scheduleNextNote(onNote?: (note: string) => void) {
    if (!this.isPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const [noteName, beats] = BIRTHDAY_TUNE[this.noteIndex];
    const freq = NOTE[noteName];

    if (freq) {
      this.playMusicBoxNote(ctx, freq);
      if (onNote) onNote(noteName);
    }

    const noteDurationMs = beats * this.beatDuration;
    this.noteIndex = (this.noteIndex + 1) % BIRTHDAY_TUNE.length;

    // Small extra pause between loops
    const delay = this.noteIndex === 0 ? noteDurationMs + 1200 : noteDurationMs;

    this.currentTimeout = setTimeout(() => {
      this.scheduleNextNote(onNote);
    }, delay);
  }

  private playMusicBoxNote(ctx: AudioContext, freq: number) {
    const now = ctx.currentTime;
    
    // Fundamental
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    // Harmonic sparkle
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 1.5);

    osc2.start(now);
    osc2.stop(now + 0.7);
  }
}

export const musicBox = new BirthdayMusicBox();
