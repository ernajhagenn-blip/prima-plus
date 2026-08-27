"use client";

export type MusicStyle = "arcade" | "puzzle" | "action" | "mystery" | "chill" | "victory" | "tense" | "happy";

interface Preset {
  tempo: number;
  wave: OscillatorType;
  bassWave: OscillatorType;
  chords: number[][];
  melody: number[];
  vol: number;
}

const PRESETS: Record<MusicStyle, Preset> = {
  arcade: {
    tempo: 165, wave: "square", bassWave: "triangle", vol: 0.028,
    chords: [[523.25, 659.25, 783.99], [392, 493.88, 587.33], [440, 523.25, 659.25], [349.23, 440, 523.25]],
    melody: [0, 2, 1, 2, 0, 1, 2, 1],
  },
  puzzle: {
    tempo: 290, wave: "triangle", bassWave: "sine", vol: 0.03,
    chords: [[261.63, 329.63, 392], [220, 261.63, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63]],
    melody: [0, 1, 2, 1, 2, 0, 1, 0],
  },
  action: {
    tempo: 125, wave: "sawtooth", bassWave: "square", vol: 0.022,
    chords: [[440, 554.37, 659.25], [493.88, 622.25, 739.99], [440, 554.37, 659.25], [587.33, 739.99, 880]],
    melody: [0, 0, 2, 1, 0, 2, 1, 2],
  },
  mystery: {
    tempo: 330, wave: "sine", bassWave: "sine", vol: 0.034,
    chords: [[311.13, 392, 466.16], [293.66, 369.99, 440], [277.18, 329.63, 415.3], [261.63, 311.13, 392]],
    melody: [2, 1, 0, 1, 2, 0, 1, 2],
  },
  chill: {
    tempo: 380, wave: "sine", bassWave: "triangle", vol: 0.032,
    chords: [[349.23, 440, 523.25], [329.63, 392, 493.88], [293.66, 369.99, 440], [261.63, 329.63, 392]],
    melody: [0, 2, 1, 0, 2, 1, 0, 1],
  },
  victory: {
    tempo: 180, wave: "square", bassWave: "triangle", vol: 0.03,
    chords: [[523.25, 659.25, 783.99], [587.33, 739.99, 880], [523.25, 659.25, 783.99], [659.25, 783.99, 987.77]],
    melody: [0, 1, 2, 0, 2, 1, 0, 2],
  },
  tense: {
    tempo: 140, wave: "sawtooth", bassWave: "square", vol: 0.02,
    chords: [[220, 277.18, 329.63], [233.08, 293.66, 349.23], [220, 277.18, 329.63], [207.65, 261.63, 311.13]],
    melody: [0, 2, 1, 0, 1, 2, 0, 1],
  },
  happy: {
    tempo: 200, wave: "triangle", bassWave: "sine", vol: 0.035,
    chords: [[392, 493.88, 587.33], [440, 554.37, 659.25], [523.25, 659.25, 783.99], [440, 554.37, 659.25]],
    melody: [0, 2, 0, 1, 2, 0, 1, 2],
  },
};

class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private preset: Preset = PRESETS.arcade;
  muted = false;

  private ensure() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 1;
      this.musicGain.connect(this.master);
    } catch { /* noop */ }
  }

  resume() {
    this.ensure();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.ensure();
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.02);
  }

  startMusic(style: MusicStyle) {
    this.ensure();
    this.resume();
    if (!this.ctx || !this.musicGain) return;
    this.preset = PRESETS[style];
    if (this.timer) return;
    const playNote = (freq: number, dur: number, vol: number, type: OscillatorType, delay = 0) => {
      if (!this.ctx || !this.musicGain) return;
      try {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.connect(g); g.connect(this.musicGain);
        const t = this.ctx.currentTime + delay;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.05);
      } catch { /* noop */ }
    };
    this.timer = setInterval(() => {
      const p = this.preset;
      const ch = p.chords[Math.floor(this.step / 8) % p.chords.length];
      const mi = p.melody[this.step % p.melody.length];
      playNote(ch[mi], p.tempo / 1000 * 1.6, p.vol, p.wave);
      if (this.step % 4 === 0) playNote(ch[0] / 2, p.tempo / 1000 * 2.4, p.vol * 1.15, p.bassWave);
      if (this.step % 8 === 4) playNote(ch[2] * 2, p.tempo / 1000 * 0.8, p.vol * 0.6, p.wave);
      this.step++;
    }, this.preset.tempo);
  }

  stopMusic() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.step = 0;
  }

  sfx(name: "click" | "correct" | "wrong" | "tick" | "win" | "lose" | "whoosh" | "coin" | "hover" | "select" | "typing" | "page" | "notification" | "error" | "success" | "levelup" | "powerup" | "jump" | "reveal" | "transition" | "dialog") {
    this.ensure();
    this.resume();
    if (!this.ctx || !this.master) return;
    const beep = (f0: number, f1: number, dur: number, type: OscillatorType, vol: number, delay = 0) => {
      if (!this.ctx || !this.master) return;
      try {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.connect(g); g.connect(this.master);
        const t = this.ctx.currentTime + delay;
        o.frequency.setValueAtTime(f0, t);
        if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.start(t); o.stop(t + dur + 0.02);
      } catch { /* noop */ }
    };
    switch (name) {
      case "click": beep(620, 420, 0.07, "square", 0.12); break;
      case "tick": beep(950, 950, 0.035, "square", 0.06); break;
      case "coin": beep(988, 1319, 0.09, "square", 0.1); beep(1319, 1568, 0.12, "square", 0.08, 0.07); break;
      case "correct": beep(660, 660, 0.09, "triangle", 0.16); beep(880, 880, 0.12, "triangle", 0.16, 0.09); beep(1175, 1175, 0.16, "triangle", 0.14, 0.18); break;
      case "wrong": beep(220, 130, 0.28, "sawtooth", 0.14); break;
      case "win": [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => beep(f, f, 0.16, "triangle", 0.16, i * 0.11)); break;
      case "lose": beep(330, 165, 0.5, "sawtooth", 0.12); break;
      case "whoosh": beep(900, 180, 0.18, "sine", 0.1); break;
      case "hover": beep(1200, 1400, 0.04, "sine", 0.05); break;
      case "select": beep(800, 1200, 0.08, "triangle", 0.1); break;
      case "typing": beep(600 + Math.random() * 200, 500 + Math.random() * 200, 0.03, "square", 0.04); break;
      case "page": beep(500, 800, 0.12, "sine", 0.08); beep(700, 900, 0.1, "sine", 0.06, 0.06); break;
      case "notification": beep(880, 1320, 0.1, "triangle", 0.12); beep(1100, 1500, 0.14, "triangle", 0.1, 0.1); break;
      case "error": beep(300, 150, 0.15, "square", 0.14); beep(250, 100, 0.2, "square", 0.12, 0.12); break;
      case "success": [523, 659, 784, 1047].forEach((f, i) => beep(f, f, 0.12, "triangle", 0.12, i * 0.08)); break;
      case "levelup": [440, 554, 659, 880].forEach((f, i) => beep(f, f * 1.02, 0.14, "square", 0.13, i * 0.07)); break;
      case "powerup": beep(400, 1200, 0.3, "sawtooth", 0.15); beep(800, 1600, 0.2, "triangle", 0.12, 0.15); break;
      case "jump": beep(300, 800, 0.15, "sine", 0.1); break;
      case "reveal": beep(400, 600, 0.08, "sine", 0.06); beep(600, 900, 0.1, "sine", 0.08, 0.08); beep(900, 1200, 0.15, "triangle", 0.1, 0.16); break;
      case "transition": beep(500, 300, 0.15, "sine", 0.08); beep(300, 600, 0.18, "sine", 0.06, 0.1); break;
      case "dialog": beep(800, 600, 0.05, "triangle", 0.06); break;
    }
  }
}

export const gameAudio = new GameAudio();
