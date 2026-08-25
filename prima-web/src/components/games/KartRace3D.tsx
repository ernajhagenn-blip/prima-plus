"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { CHALLENGES as EXTERNAL_CHALLENGES } from "@/lib/challenges";

const R = 180;
const W = 64;
const RI = R - W / 2;
const RO = R + W / 2;
const CAMH = 20;
const CAMD = 34;
const MAXBASE = 150;
const RACE_TIME = 240;

type ItemKind = "mushroom" | "banana" | "green" | "red" | "star";

const ITEMS: Record<ItemKind, { icon: string; name: string }> = {
  mushroom: { icon: "🍄", name: "Jamur Kilat" },
  banana: { icon: "🍌", name: "Pisang" },
  green: { icon: "🟢", name: "Cangkang Hijau" },
  red: { icon: "🔴", name: "Cangkang Merah" },
  star: { icon: "⭐", name: "Bintang" },
};

const CHALLENGES = EXTERNAL_CHALLENGES;

interface AIKart {
  a: number; lat: number; baseLat: number; phase: number; v: number; baseV: number;
  color: string; accent: string; spin: number; prog: number; itemT: number;
}
interface Coin { a: number; lat: number; taken: number; }
interface Box { a: number; taken: number; }
interface Pad { a: number; }
interface Banana { x: number; y: number; life: number; }
interface Shell { x: number; y: number; vx: number; vy: number; kind: "green" | "red"; life: number; target: number; owner: number; bounces: number; }
interface Gate { a: number; cd: number; }
interface Particle { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; max: number; color: string; size: number; }
interface Popup { sx: number; sy: number; text: string; color: string; life: number; }

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  eOsc: OscillatorNode | null = null;
  eOsc2: OscillatorNode | null = null;
  eGain: GainNode | null = null;
  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      this.eGain = this.ctx.createGain();
      this.eGain.gain.value = 0;
      this.eOsc = this.ctx.createOscillator();
      this.eOsc.type = "triangle";
      this.eOsc.frequency.value = 70;
      this.eOsc2 = this.ctx.createOscillator();
      this.eOsc2.type = "sine";
      this.eOsc2.frequency.value = 71;
      this.eOsc.connect(this.eGain);
      this.eOsc2.connect(this.eGain);
      this.eGain.connect(this.master);
      this.eOsc.start();
      this.eOsc2.start();
    } catch { }
  }
  musicTimer: ReturnType<typeof setInterval> | null = null;
  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const chords = [
      [523.25, 659.25, 783.99],
      [392.0, 493.88, 587.33],
      [440.0, 523.25, 659.25],
      [349.23, 440.0, 523.25],
    ];
    const pattern = [0, 1, 2, 1];
    let step = 0;
    const playNote = (freq: number, dur: number, vol: number, type: OscillatorType) => {
      if (!this.ctx || !this.master) return;
      try {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.connect(g); g.connect(this.master);
        const t = this.ctx.currentTime;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.05);
      } catch { }
    };
    this.musicTimer = setInterval(() => {
      const ch = chords[Math.floor(step / 4) % 4];
      const note = ch[pattern[step % 4]];
      playNote(note, 0.4, 0.022, "triangle");
      if (step % 8 === 0) playNote(ch[0] / 2, 0.9, 0.03, "sine");
      if (step % 8 === 4) playNote(ch[2] / 2, 0.9, 0.025, "sine");
      step++;
    }, 260);
  }
  stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
  }
  engine(freq: number, vol: number) {
    if (!this.ctx || !this.eOsc || !this.eOsc2 || !this.eGain) return;
    const t = this.ctx.currentTime;
    this.eOsc.frequency.setTargetAtTime(freq, t, 0.05);
    this.eOsc2.frequency.setTargetAtTime(freq * 1.007 + 2, t, 0.05);
    this.eGain.gain.setTargetAtTime(vol, t, 0.08);
  }
  beep(f0: number, f1: number, dur: number, type: OscillatorType, vol: number) {
    if (!this.ctx || !this.master) return;
    try {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.connect(g); g.connect(this.master);
      const t = this.ctx.currentTime;
      o.frequency.setValueAtTime(f0, t);
      if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { }
  }
  setMuted(m: boolean) {
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.02);
  }
}

const AI_COLORS = [
  ["#a855f7", "#e9d5ff"], ["#22c55e", "#bbf7d0"], ["#f97316", "#fed7aa"],
  ["#3b82f6", "#bfdbfe"], ["#e11d48", "#fecdd3"], ["#eab308", "#fef08a"], ["#14b8a6", "#99f6e4"],
];
const AI_BASE = [148, 146, 144, 142, 140, 137, 134];

function angDiff(a: number, b: number) {
  let d = Math.abs(a - b) % (Math.PI * 2);
  if (d > Math.PI) d = Math.PI * 2 - d;
  return d;
}
function posSuffix(n: number) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}
const POS_COLORS = ["#FFD34D", "#C9D6E3", "#E3A05C", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];

export default function KartRace3D({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#ffb4a2",
}: {
  onComplete: (score: number, correct: number, position: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 960, h: 600 });
  const [phase, setPhase] = useState<"intro" | "count" | "race" | "results">("intro");
  const [cdStep, setCdStep] = useState(3);
  const [lap, setLap] = useState(0);
  const [position, setPosition] = useState(8);
  const [timeLeft, setTimeLeft] = useState(RACE_TIME);
  const [coinCount, setCoinCount] = useState(0);
  const [item, setItem] = useState<ItemKind | null>(null);
  const [muted, setMuted] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizTimer, setQuizTimer] = useState(25);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelected, setQuizSelected] = useState(-1);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [result, setResult] = useState({ score: 0, correct: 0, position: 8, coins: 0 });

  const isTouch = useMemo(() => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0), []);

  const S = useRef({
    x: 0, y: R, h: Math.PI, v: 0,
    drifting: false, driftDir: 0, charge: 0, hop: 0,
    boost: 0, star: 0, spin: 0, shake: 0,
    coins: 0, quizScore: 0, correct: 0,
    lap: 0, prevT: Math.PI / 2, prog: 0,
    item: null as ItemKind | null,
    ai: [] as AIKart[],
    coinsArr: [] as Coin[],
    boxes: [] as Box[],
    pads: [] as Pad[],
    bananas: [] as Banana[],
    shells: [] as Shell[],
    gates: [] as Gate[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    keys: {} as Record<string, boolean>,
    touch: { left: false, right: false, gas: false, brake: false, drift: false },
    started: false, finished: false, paused: false,
    raceTime: 0, usedQ: new Set<number>(),
    audio: new AudioEngine(),
    steerVis: 0,
  });

  useEffect(() => {
    const obs = new ResizeObserver((es) => {
      for (const e of es) {
        const w = e.contentRect.width, h = e.contentRect.height;
        if (w > 0 && h > 0) setDims({ w, h });
      }
    });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const initWorld = useCallback(() => {
    const s = S.current;
    s.x = 0; s.y = R; s.h = Math.PI; s.v = 0;
    s.drifting = false; s.charge = 0; s.boost = 0; s.star = 0; s.spin = 0;
    s.coins = 0; s.quizScore = 0; s.correct = 0; s.lap = 0; s.prevT = Math.PI / 2; s.prog = 0;
    s.item = null; s.raceTime = 0; s.finished = false; s.paused = false; s.usedQ.clear();
    s.bananas = []; s.shells = []; s.particles = []; s.popups = [];
    s.ai = AI_COLORS.map((c, i) => ({
      a: Math.PI / 2 - (i + 1) * 0.085, lat: (i % 2 === 0 ? 1 : -1) * 13,
      baseLat: (i % 2 === 0 ? 1 : -1) * 13, phase: i * 1.7, v: 0, baseV: AI_BASE[i],
      color: c[0], accent: c[1], spin: 0, prog: Math.PI / 2 - (i + 1) * 0.085, itemT: 8 + Math.random() * 10,
    }));
    s.coinsArr = [];
    for (let i = 0; i < 16; i++) s.coinsArr.push({ a: 0.28 + i * 0.392, lat: (i % 2 === 0 ? 1 : -1) * W * 0.22, taken: 0 });
    s.boxes = [];
    for (let i = 0; i < 8; i++) s.boxes.push({ a: 0.35 + i * 0.785, taken: 0 });
    s.pads = [{ a: 1.2 }, { a: 3.4 }, { a: 5.1 }];
    s.gates = [{ a: 2.25, cd: 0 }, { a: 5.35, cd: 0 }];
    setCoinCount(0); setQuizScore(0); setCorrectCount(0); setLap(0); setItem(null); setTimeLeft(RACE_TIME);
  }, []);

  useEffect(() => { initWorld(); }, [initWorld]);

  const addPopup = useCallback((wx: number, wy: number, text: string, color: string) => {
    const s = S.current;
    const d = dims;
    const f = d.h * 0.95;
    const camx = s.x - Math.cos(s.h) * CAMD, camy = s.y - Math.sin(s.h) * CAMD;
    const dx = wx - camx, dy = wy - camy;
    const cz = dx * Math.cos(s.h) + dy * Math.sin(s.h);
    if (cz < 0.2) return;
    const cx = -dx * Math.sin(s.h) + dy * Math.cos(s.h);
    const horizon = d.h * 0.42;
    const sx = d.w / 2 + (cx * f) / cz;
    const sy = horizon + (CAMH * f) / cz;
    s.popups.push({ sx, sy, text, color, life: 70 });
  }, [dims]);

  const sfxEvent = useCallback((kind: string) => {
    const a = S.current.audio;
    switch (kind) {
      case "coin": a.beep(1300, 1900, 0.09, "sine", 0.16); break;
      case "box": a.beep(700, 1200, 0.12, "triangle", 0.18); break;
      case "mushroom": a.beep(400, 900, 0.3, "sawtooth", 0.2); break;
      case "shell": a.beep(900, 300, 0.2, "square", 0.16); break;
      case "hit": a.beep(220, 60, 0.35, "sawtooth", 0.24); break;
      case "bump": a.beep(160, 90, 0.12, "square", 0.14); break;
      case "lap": a.beep(660, 660, 0.12, "sine", 0.2); setTimeout(() => a.beep(880, 880, 0.18, "sine", 0.2), 130); break;
      case "count": a.beep(880, 880, 0.14, "square", 0.2); break;
      case "go": a.beep(1320, 1320, 0.4, "square", 0.24); break;
      case "boost": a.beep(300, 1000, 0.35, "sawtooth", 0.2); break;
      case "correct": a.beep(523, 784, 0.15, "sine", 0.2); setTimeout(() => a.beep(784, 1046, 0.22, "sine", 0.2), 150); break;
      case "wrong": a.beep(300, 120, 0.3, "sawtooth", 0.2); break;
      case "star": [523, 659, 784, 1046].forEach((fq, i) => setTimeout(() => a.beep(fq, fq, 0.12, "square", 0.18), i * 90)); break;
      case "finish": [523, 659, 784, 1046, 784, 1046].forEach((fq, i) => setTimeout(() => a.beep(fq, fq, 0.16, "square", 0.22), i * 140)); break;
    }
  }, []);

  const startRace = useCallback(() => {
    S.current.audio.init();
    S.current.audio.startMusic();
    initWorld();
    setPhase("count");
    setCdStep(3);
    sfxEvent("count");
  }, [initWorld, sfxEvent]);

  useEffect(() => {
    if (phase !== "count") return;
    const s = S.current;
    let step = 3;
    const iv = setInterval(() => {
      step -= 1;
      setCdStep(step);
      if (step > 0) sfxEvent("count");
      if (step === 0) {
        sfxEvent("go");
        const gas = s.keys["arrowup"] || s.keys["w"] || s.touch.gas;
        if (gas) { s.boost = 55; sfxEvent("boost"); }
        s.started = true;
        setPhase("race");
        clearInterval(iv);
      }
    }, 750);
    return () => clearInterval(iv);
  }, [phase, sfxEvent]);

  const giveItem = useCallback(() => {
    const s = S.current;
    if (s.item) return;
    let pool: ItemKind[];
    if (position === 1) pool = ["banana", "banana", "green", "green", "mushroom"];
    else if (position <= 4) pool = ["mushroom", "green", "red", "banana", "mushroom", "red"];
    else pool = ["mushroom", "red", "star", "red", "mushroom", "star"];
    const it = pool[Math.floor(Math.random() * pool.length)];
    s.item = it;
    setItem(it);
    sfxEvent("box");
  }, [position, sfxEvent]);

  const useItem = useCallback(() => {
    const s = S.current;
    if (!s.item || s.spin > 0 || s.finished) return;
    const it = s.item;
    s.item = null;
    setItem(null);
    if (it === "mushroom") { s.boost = Math.max(s.boost, 60); sfxEvent("mushroom"); }
    else if (it === "banana") {
      s.bananas.push({ x: s.x - Math.cos(s.h) * 24, y: s.y - Math.sin(s.h) * 24, life: 2000 });
      sfxEvent("shell");
    } else if (it === "green" || it === "red") {
      const sh: Shell = {
        x: s.x + Math.cos(s.h) * 22, y: s.y + Math.sin(s.h) * 22,
        vx: Math.cos(s.h) * 280, vy: Math.sin(s.h) * 280,
        kind: it, life: 5, target: -1, owner: -1, bounces: 0,
      };
      s.shells.push(sh);
      sfxEvent("shell");
    } else if (it === "star") { s.star = 360; sfxEvent("star"); }
  }, [sfxEvent]);

  const openQuiz = useCallback(() => {
    const s = S.current;
    let pool = CHALLENGES.map((_, i) => i).filter((i) => !s.usedQ.has(i));
    if (pool.length === 0) { s.usedQ.clear(); pool = CHALLENGES.map((_, i) => i); }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    s.usedQ.add(idx);
    s.paused = true;
    setQuizIdx(idx);
    setQuizTimer(25);
    setQuizAnswered(false);
    setQuizSelected(-1);
    setQuizOpen(true);
  }, []);

  const answerQuiz = useCallback((opt: number) => {
    const s = S.current;
    if (quizAnswered) return;
    setQuizAnswered(true);
    setQuizSelected(opt);
    const c = CHALLENGES[quizIdx];
    if (opt < 0) {
      s.quizScore = Math.max(0, s.quizScore - 5);
      setQuizScore(s.quizScore);
      addPopup(s.x, s.y, "WAKTU HABIS", "#f43f5e");
      sfxEvent("wrong");
      return;
    }
    const q = c.opts[opt]?.quality ?? "poor";
    if (q === "best") {
      s.correct += 1; s.quizScore += 25; s.boost = Math.max(s.boost, 60);
      setCorrectCount(s.correct); setQuizScore(s.quizScore);
      addPopup(s.x, s.y, `${c.domain} ✓`, "#22c55e");
      sfxEvent("correct");
    } else if (q === "ok") {
      s.quizScore += 10; s.boost = Math.max(s.boost, 30);
      setQuizScore(s.quizScore);
      addPopup(s.x, s.y, `${c.domain} +`, "#facc15");
      sfxEvent("correct");
    } else {
      s.v *= 0.75;
      addPopup(s.x, s.y, `${c.domain} ✗`, "#f43f5e");
      sfxEvent("wrong");
    }
  }, [quizAnswered, quizIdx, addPopup, sfxEvent]);

  const continueQuiz = useCallback(() => {
    S.current.paused = false;
    S.current.v = Math.max(S.current.v, 30);
    setQuizOpen(false);
    setQuizAnswered(false);
    setQuizSelected(-1);
  }, []);

  useEffect(() => {
    if (!quizOpen || quizAnswered) return;
    if (quizTimer <= 0) {
      const t = setTimeout(() => answerQuiz(-1), 60);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setQuizTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [quizOpen, quizAnswered, quizTimer, answerQuiz]);

  useEffect(() => {
    if (!quizOpen) return;
    const h = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key) && !quizAnswered) { e.preventDefault(); answerQuiz(parseInt(e.key) - 1); }
      else if ((e.key === "Enter" || e.key === " ") && quizAnswered) { e.preventDefault(); continueQuiz(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [quizOpen, quizAnswered, answerQuiz, continueQuiz]);

  const finishRace = useCallback(() => {
    const s = S.current;
    if (s.finished) return;
    s.finished = true;
    s.audio.engine(0, 0);
    s.audio.stopMusic();
    const bonus = [120, 90, 70, 60, 50, 45, 40, 35][Math.min(position - 1, 7)] ?? 30;
    const total = s.coins * 15 + s.quizScore + bonus;
    setResult({ score: total, correct: s.correct, position, coins: s.coins });
    setPhase("results");
    sfxEvent("finish");
  }, [position, sfxEvent]);

  useEffect(() => {
    const s = S.current;
    const kd = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      s.keys[e.key.toLowerCase()] = true;
      if ((e.key === "x" || e.key === "X" || e.key === "Shift") && !quizOpen) useItem();
    };
    const ku = (e: KeyboardEvent) => { s.keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [quizOpen, useItem]);

  const ch = CHALLENGES[quizIdx];
  const steerVisRef = useRef(0);

  const render = useCallback((now: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const s = S.current;
    const d = dims;
    const f = d.h * 0.95;
    const horizon = d.h * 0.42;
    const shake = s.shake > 0 ? s.shake : 0;
    const camx = s.x - Math.cos(s.h) * CAMD + (Math.random() - 0.5) * shake;
    const camy = s.y - Math.sin(s.h) * CAMD + (Math.random() - 0.5) * shake;
    const cosH = Math.cos(s.h), sinH = Math.sin(s.h);

    const proj = (wx: number, wy: number, wz: number) => {
      const dx = wx - camx, dy = wy - camy;
      const cz = dx * cosH + dy * sinH;
      if (cz < 0.2) return null;
      const cx = -dx * sinH + dy * cosH;
      const sc = f / cz;
      return { x: d.w / 2 + cx * sc, y: horizon - (wz - CAMH) * sc, sc };
    };

    const skyG = ctx.createLinearGradient(0, 0, 0, horizon);
    skyG.addColorStop(0, "#2f9bff");
    skyG.addColorStop(1, "#d8f3ff");
    ctx.fillStyle = skyG;
    ctx.fillRect(0, 0, d.w, horizon);

    ctx.fillStyle = "#FFE066";
    ctx.beginPath();
    ctx.arc(d.w * 0.76, horizon - d.h * 0.18, d.h * 0.055, 0, Math.PI * 2);
    ctx.fill();

    const par = -s.h / (Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (let i = 0; i < 5; i++) {
      const cxp = ((((i * 0.23 + par) % 1) + 1) % 1) * (d.w + 200) - 100;
      const cyp = horizon - d.h * (0.2 + (i % 3) * 0.05);
      ctx.beginPath();
      ctx.ellipse(cxp, cyp, 46, 15, 0, 0, Math.PI * 2);
      ctx.ellipse(cxp + 30, cyp - 8, 32, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#2f7d4f";
    for (let i = 0; i < 8; i++) {
      const mx = ((((i * 0.14 + par * 0.6) % 1) + 1) % 1) * (d.w + 240) - 120;
      ctx.beginPath();
      ctx.moveTo(mx - 70, horizon);
      ctx.lineTo(mx, horizon - 34 - (i % 3) * 12);
      ctx.lineTo(mx + 70, horizon);
      ctx.closePath();
      ctx.fill();
    }

    const grassG = ctx.createLinearGradient(0, horizon, 0, d.h);
    grassG.addColorStop(0, "#54c96f");
    grassG.addColorStop(1, "#2fa04f");
    ctx.fillStyle = grassG;
    ctx.fillRect(0, horizon, d.w, d.h - horizon);

    const fseed = [0.13, 0.29, 0.41, 0.58, 0.67, 0.81, 0.92, 0.22, 0.37, 0.74];
    for (let i = 0; i < fseed.length; i++) {
      const fa = fseed[i] * Math.PI * 2;
      const fr = i % 2 === 0 ? RO + 55 : RI - 55;
      const fp = proj(Math.cos(fa) * fr, Math.sin(fa) * fr, 0);
      if (!fp) continue;
      const fs = Math.max(1.5, 2.2 * fp.sc);
      ctx.fillStyle = i % 3 === 0 ? "#ff8fb3" : i % 3 === 1 ? "#ffe066" : "#ffffff";
      for (let pi = 0; pi < 5; pi++) {
        const pa = (pi / 5) * Math.PI * 2 + now * 0.0004;
        ctx.beginPath();
        ctx.arc(fp.x + Math.cos(pa) * fs, fp.y + Math.sin(pa) * fs * 0.6, fs * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fs * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    interface Quad { depth: number; pts: { x: number; y: number }[]; color: string; }
    const quads: Quad[] = [];
    const SEG = 160;
    const step = (Math.PI * 2) / SEG;
    for (let i = 0; i < SEG; i++) {
      const a0 = i * step, a1 = (i + 1) * step;
      const p00 = proj(Math.cos(a0) * RO, Math.sin(a0) * RO, 0);
      const p10 = proj(Math.cos(a1) * RO, Math.sin(a1) * RO, 0);
      const p01 = proj(Math.cos(a0) * RI, Math.sin(a0) * RI, 0);
      const p11 = proj(Math.cos(a1) * RI, Math.sin(a1) * RI, 0);
      if (!p00 || !p10 || !p01 || !p11) continue;
      const midA = a0 + step / 2;
      const midx = Math.cos(midA) * R, midy = Math.sin(midA) * R;
      const depth = Math.hypot(midx - camx, midy - camy);
      const rumbo = Math.floor(i / 2) % 2 === 0;
      const lerpP = (pA: { x: number; y: number }, pB: { x: number; y: number }, t: number) => ({ x: pA.x + (pB.x - pA.x) * t, y: pA.y + (pB.y - pA.y) * t });
      const o0 = lerpP(p00, p01, 0.08), o1 = lerpP(p10, p11, 0.08);
      const i0 = lerpP(p00, p01, 0.92), i1 = lerpP(p10, p11, 0.92);
      quads.push({ depth: depth + 40, pts: [p00, p10, o1, o0], color: rumbo ? "#e74c3c" : "#f8f8f8" });
      quads.push({ depth: depth + 40, pts: [o1, p11, p01, o0], color: rumbo ? "#f8f8f8" : "#e74c3c" });
      quads.push({ depth, pts: [o0, o1, i1, i0], color: i % 4 < 2 ? "#3d4257" : "#444a61" });
      if (i % 4 < 2) {
        const d0 = proj(Math.cos(a0) * (R - 1.4), Math.sin(a0) * (R - 1.4), 0.1);
        const d1 = proj(Math.cos(a1) * (R - 1.4), Math.sin(a1) * (R - 1.4), 0.1);
        const d2 = proj(Math.cos(a1) * (R + 1.4), Math.sin(a1) * (R + 1.4), 0.1);
        const d3 = proj(Math.cos(a0) * (R + 1.4), Math.sin(a0) * (R + 1.4), 0.1);
        if (d0 && d1 && d2 && d3) quads.push({ depth: depth + 1, pts: [d0, d1, d2, d3], color: "#e8e8f0" });
      }
      if (i < 2) {
        const cols = 8;
        for (let cc = 0; cc < cols; cc++) {
          const r0 = RI + ((RO - RI) / cols) * cc;
          const r1 = r0 + (RO - RI) / cols;
          const q0 = proj(Math.cos(a0) * r0, Math.sin(a0) * r0, 0.2);
          const q1 = proj(Math.cos(a1) * r0, Math.sin(a1) * r0, 0.2);
          const q2 = proj(Math.cos(a1) * r1, Math.sin(a1) * r1, 0.2);
          const q3 = proj(Math.cos(a0) * r1, Math.sin(a0) * r1, 0.2);
          if (q0 && q1 && q2 && q3) quads.push({ depth: depth + 2, pts: [q0, q1, q2, q3], color: (i + cc) % 2 === 0 ? "#ffffff" : "#1f2430" });
        }
      }
    }

    for (const pad of s.pads) {
      const a0 = pad.a - 0.05, a1 = pad.a + 0.05;
      const q0 = proj(Math.cos(a0) * (R - 12), Math.sin(a0) * (R - 12), 0.3);
      const q1 = proj(Math.cos(a1) * (R - 12), Math.sin(a1) * (R - 12), 0.3);
      const q2 = proj(Math.cos(a1) * (R + 12), Math.sin(a1) * (R + 12), 0.3);
      const q3 = proj(Math.cos(a0) * (R + 12), Math.sin(a0) * (R + 12), 0.3);
      if (q0 && q1 && q2 && q3) quads.push({ depth: 5, pts: [q0, q1, q2, q3], color: "#ff9f1a" });
    }

    quads.sort((a, b) => b.depth - a.depth);
    for (const q of quads) {
      ctx.beginPath();
      ctx.moveTo(q.pts[0].x, q.pts[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(q.pts[i].x, q.pts[i].y);
      ctx.closePath();
      ctx.fillStyle = q.color;
      ctx.fill();
    }

    interface Bill { depth: number; draw: () => void; }
    const bills: Bill[] = [];

    for (const gate of s.gates) {
      const gx = Math.cos(gate.a) * R, gy = Math.sin(gate.a) * R;
      const p = proj(gx, gy, 12);
      if (!p) continue;
      const depth = Math.hypot(gx - camx, gy - camy);
      bills.push({
        depth, draw: () => {
          const rad = 16 * p.sc;
          const pulse = 0.75 + Math.sin(now * 0.005) * 0.25;
          ctx.save();
          ctx.strokeStyle = `rgba(250,204,21,${pulse})`;
          ctx.lineWidth = Math.max(2, 4 * p.sc);
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 18 * pulse;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.font = `900 ${rad * 1.1}px "Righteous", "Arial Black", sans-serif`;
          ctx.fillStyle = `rgba(250,204,21,${pulse})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("?", p.x, p.y);
          ctx.restore();
        },
      });
    }

    for (const box of s.boxes) {
      if (box.taken > 0) continue;
      const bx = Math.cos(box.a) * R, by = Math.sin(box.a) * R;
      const p = proj(bx, by, 9 + Math.sin(now * 0.004 + box.a) * 1.5);
      if (!p) continue;
      const depth = Math.hypot(bx - camx, by - camy);
      bills.push({
        depth, draw: () => {
          const sz = 9 * p.sc;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(now * 0.002 + box.a);
          const g = ctx.createLinearGradient(-sz, -sz, sz, sz);
          g.addColorStop(0, "rgba(255,255,255,0.35)");
          g.addColorStop(0.5, "rgba(167,139,250,0.55)");
          g.addColorStop(1, "rgba(56,189,248,0.5)");
          ctx.fillStyle = g;
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = Math.max(1, 1.5 * p.sc);
          ctx.beginPath();
          ctx.rect(-sz, -sz, sz * 2, sz * 2);
          ctx.fill();
          ctx.stroke();
          ctx.rotate(-(now * 0.002 + box.a));
          ctx.font = `900 ${sz * 1.3}px "Righteous", sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("?", 0, sz * 0.1);
          ctx.restore();
        },
      });
    }

    for (const coin of s.coinsArr) {
      if (coin.taken > 0) continue;
      const cx2 = Math.cos(coin.a) * (R + coin.lat), cy2 = Math.sin(coin.a) * (R + coin.lat);
      const p = proj(cx2, cy2, 6 + Math.sin(now * 0.005 + coin.a * 3) * 2);
      if (!p) continue;
      const depth = Math.hypot(cx2 - camx, cy2 - camy);
      bills.push({
        depth, draw: () => {
          const rad = 5.5 * p.sc;
          const sq = Math.max(0.25, Math.abs(Math.cos(now * 0.004 + coin.a)));
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(sq, 1);
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          ctx.fillStyle = "#FFD34D";
          ctx.shadowColor = "#FFD34D";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#B8860B";
          ctx.lineWidth = Math.max(1, rad * 0.18);
          ctx.stroke();
          ctx.restore();
        },
      });
    }

    for (const b of s.bananas) {
      const p = proj(b.x, b.y, 3);
      if (!p) continue;
      const depth = Math.hypot(b.x - camx, b.y - camy);
      bills.push({
        depth, draw: () => {
          ctx.font = `${12 * p.sc}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🍌", p.x, p.y);
        },
      });
    }

    for (const sh of s.shells) {
      const p = proj(sh.x, sh.y, 4);
      if (!p) continue;
      const depth = Math.hypot(sh.x - camx, sh.y - camy);
      bills.push({
        depth, draw: () => {
          const rad = 5 * p.sc;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = sh.kind === "green" ? "#22c55e" : "#ef4444";
          ctx.shadowColor = sh.kind === "green" ? "#22c55e" : "#ef4444";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.lineWidth = Math.max(1, rad * 0.25);
          ctx.stroke();
        },
      });
    }

    const drawKartSprite = (sx: number, sy: number, size: number, body: string, accent: string, tilt: number, spinR: number, starHue: number | null) => {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.beginPath();
      ctx.ellipse(0, size * 0.32, size * 0.5, size * 0.14, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fill();
      ctx.rotate(tilt + spinR);
      const bCol = starHue !== null ? `hsl(${starHue},95%,60%)` : body;
      const aCol = starHue !== null ? `hsl(${(starHue + 60) % 360},95%,75%)` : accent;
      ctx.fillStyle = "#1c1f2b";
      const wl = size * 0.22, ww = size * 0.13;
      ctx.fillRect(-size * 0.52, -size * 0.34, wl, ww);
      ctx.fillRect(size * 0.30, -size * 0.34, wl, ww);
      ctx.fillRect(-size * 0.52, size * 0.16, wl, ww);
      ctx.fillRect(size * 0.30, size * 0.16, wl, ww);
      const g = ctx.createLinearGradient(0, -size * 0.45, 0, size * 0.4);
      g.addColorStop(0, aCol);
      g.addColorStop(1, bCol);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(-size * 0.42, -size * 0.42, size * 0.84, size * 0.8, size * 0.16);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.roundRect(-size * 0.3, -size * 0.34, size * 0.6, size * 0.26, size * 0.1);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -size * 0.18, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "#f1c9a5";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -size * 0.2, size * 0.22, Math.PI, 0);
      ctx.fillStyle = aCol;
      ctx.fill();
      ctx.fillStyle = "#1c1f2b";
      ctx.beginPath();
      ctx.roundRect(-size * 0.14, -size * 0.2, size * 0.28, size * 0.09, size * 0.04);
      ctx.fill();
      ctx.restore();
    };

    for (const ai of s.ai) {
      const ax = Math.cos(ai.a) * (R + ai.lat), ay = Math.sin(ai.a) * (R + ai.lat);
      const p = proj(ax, ay, 0);
      if (!p) continue;
      const depth = Math.hypot(ax - camx, ay - camy);
      bills.push({
        depth, draw: () => {
          const size = 15 * p.sc;
          if (size < 2) return;
          drawKartSprite(p.x, p.y, size, ai.color, ai.accent, 0, ai.spin > 0 ? now * 0.02 : 0, null);
        },
      });
    }

    for (let i = 0; i < 3; i++) {
      const ba = 1.1 + i * 2.1;
      const bx = Math.cos(ba) * (RO + 120), by = Math.sin(ba) * (RO + 120);
      const p = proj(bx, by, 55 + Math.sin(now * 0.001 + i * 2) * 6);
      if (!p) continue;
      const depth = Math.hypot(bx - camx, by - camy);
      bills.push({
        depth, draw: () => {
          const s = 14 * p.sc;
          if (s < 2) return;
          const cols2 = [["#ef4444", "#f97316"], ["#a855f7", "#ec4899"], ["#0ea5e9", "#22d3ee"]][i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          const bg2 = ctx.createRadialGradient(p.x - s * 0.3, p.y - s * 0.3, s * 0.1, p.x, p.y, s);
          bg2.addColorStop(0, cols2[1]);
          bg2.addColorStop(1, cols2[0]);
          ctx.fillStyle = bg2;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = Math.max(1, s * 0.08);
          ctx.stroke();
          ctx.strokeStyle = "rgba(80,60,40,0.7)";
          ctx.lineWidth = Math.max(1, s * 0.05);
          ctx.beginPath();
          ctx.moveTo(p.x - s * 0.5, p.y + s * 0.8);
          ctx.lineTo(p.x - s * 0.2, p.y + s * 1.5);
          ctx.moveTo(p.x + s * 0.5, p.y + s * 0.8);
          ctx.lineTo(p.x + s * 0.2, p.y + s * 1.5);
          ctx.stroke();
          ctx.fillStyle = "#8b5e34";
          ctx.fillRect(p.x - s * 0.25, p.y + s * 1.5, s * 0.5, s * 0.4);
        },
      });
    }

    for (let i = 0; i < 26; i++) {
      const ta = (i / 26) * Math.PI * 2 + 0.12;
      const tx = Math.cos(ta) * (RO + 42), ty = Math.sin(ta) * (RO + 42);
      const p = proj(tx, ty, 0);
      if (!p) continue;
      const depth = Math.hypot(tx - camx, ty - camy);
      const big = i % 3 === 0;
      bills.push({
        depth, draw: () => {
          const s = (big ? 16 : 11) * p.sc;
          if (s < 2) return;
          ctx.fillStyle = "#6b4423";
          ctx.fillRect(p.x - s * 0.12, p.y - s * 0.9, s * 0.24, s * 0.9);
          ctx.fillStyle = big ? "#2e8b47" : "#3aa35a";
          ctx.beginPath();
          ctx.arc(p.x, p.y - s * 1.25, s * 0.62, 0, Math.PI * 2);
          ctx.arc(p.x - s * 0.4, p.y - s * 0.85, s * 0.45, 0, Math.PI * 2);
          ctx.arc(p.x + s * 0.4, p.y - s * 0.85, s * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.14)";
          ctx.beginPath();
          ctx.arc(p.x - s * 0.18, p.y - s * 1.45, s * 0.26, 0, Math.PI * 2);
          ctx.fill();
        },
      });
    }

    {
      const ga = Math.PI / 2;
      const pilL = proj(Math.cos(ga) * (RI - 14), Math.sin(ga) * (RI - 14), 0);
      const pilR = proj(Math.cos(ga) * (RO + 14), Math.sin(ga) * (RO + 14), 0);
      if (pilL && pilR) {
        const depth = Math.hypot(Math.cos(ga) * R - camx, Math.sin(ga) * R - camy);
        bills.push({
          depth, draw: () => {
            const pw = Math.max(3, 4 * pilL.sc);
            const ph = 34 * pilL.sc;
            ctx.fillStyle = "#c8ccd8";
            ctx.fillRect(pilL.x - pw / 2, pilL.y - ph, pw, ph);
            ctx.fillRect(pilR.x - pw / 2, pilR.y - ph, pw, ph);
            ctx.fillStyle = "#e11d48";
            ctx.fillRect(pilL.x - pw / 2, pilL.y - ph, pw, ph * 0.12);
            ctx.fillRect(pilR.x - pw / 2, pilR.y - ph, pw, ph * 0.12);
            const flagH = ph * 0.3;
            ctx.fillStyle = "#FFD34D";
            ctx.beginPath();
            ctx.moveTo(pilL.x + pw / 2, pilL.y - ph);
            ctx.lineTo(pilL.x + pw / 2 + flagH * 0.9, pilL.y - ph + flagH * 0.25);
            ctx.lineTo(pilL.x + pw / 2, pilL.y - ph + flagH * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(pilR.x + pw / 2, pilR.y - ph);
            ctx.lineTo(pilR.x + pw / 2 + flagH * 0.9, pilR.y - ph + flagH * 0.25);
            ctx.lineTo(pilR.x + pw / 2, pilR.y - ph + flagH * 0.5);
            ctx.closePath();
            ctx.fill();
            const bw = Math.hypot(pilR.x - pilL.x, pilR.y - pilL.y);
            const ang = Math.atan2(pilR.y - pilL.y, pilR.x - pilL.x);
            ctx.save();
            ctx.translate(pilL.x, pilL.y - ph);
            ctx.rotate(ang);
            const bh = Math.max(6, 10 * pilL.sc);
            ctx.fillStyle = "#1c1f2b";
            ctx.fillRect(0, -bh, bw, bh);
            const cells = 10;
            for (let i = 0; i < cells; i++) {
              ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#1c1f2b";
              ctx.fillRect((bw / cells) * i, -bh, bw / cells, bh * 0.32);
            }
            if (bw > 90) {
              ctx.font = `900 ${bh * 0.55}px "Righteous", "Arial Black", sans-serif`;
              ctx.fillStyle = "#FFD34D";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("PRIMA KART", bw / 2, -bh * 0.62);
            }
            ctx.restore();
          },
        });
      }
    }

    bills.sort((a, b) => b.depth - a.depth);
    for (const b of bills) b.draw();

    for (const p of s.particles) {
      const pp = proj(p.x, p.y, p.z);
      if (!pp) continue;
      ctx.globalAlpha = p.life / p.max;
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, Math.max(1, p.size * pp.sc), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const kartY = d.h * (d.h < 520 ? 0.6 : 0.72);
    const kartSize = Math.max(64, Math.min(d.h * 0.17, 120));
    if (s.boost > 0) {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(d.w / 2 + (Math.random() - 0.5) * kartSize * 0.5, kartY + kartSize * (0.35 + i * 0.12), kartSize * (0.1 + Math.random() * 0.08), 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "rgba(255,200,60,0.8)" : "rgba(255,120,40,0.55)";
        ctx.fill();
      }
    }
    const starHue = s.star > 0 ? (now * 0.4) % 360 : null;
    drawKartSprite(d.w / 2, kartY - (s.hop > 0 ? s.hop * kartSize * 0.5 : 0), kartSize, kartBody, kartAccent, -steerVisRef.current * 0.14, s.spin > 0 ? now * 0.02 : 0, starHue);

    for (const p of s.popups) {
      ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.font = `900 ${Math.max(16, d.h * 0.032)}px "Righteous", "Arial Black", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(20,20,40,0.9)";
      ctx.strokeText(p.text, p.sx, p.sy);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.sx, p.sy);
    }
    ctx.globalAlpha = 1;

    const mapSize = Math.max(74, Math.min(112, d.w * 0.11));
    const mapX = d.w - mapSize - 14;
    const mapY = 74;
    ctx.save();
    ctx.fillStyle = "rgba(15,18,40,0.72)";
    ctx.beginPath();
    ctx.roundRect(mapX - 6, mapY - 6, mapSize + 12, mapSize + 12, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    const mr = mapSize / 2 - 8;
    const mx0 = mapX + mapSize / 2, my0 = mapY + mapSize / 2;
    ctx.beginPath();
    ctx.arc(mx0, my0, mr, 0, Math.PI * 2);
    ctx.strokeStyle = "#8b93b8";
    ctx.lineWidth = ((RO - RI) / R) * mr;
    ctx.stroke();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mx0 + Math.cos(Math.PI / 2) * (RI / R) * mr, my0 + Math.sin(Math.PI / 2) * (RI / R) * mr);
    ctx.lineTo(mx0 + Math.cos(Math.PI / 2) * (RO / R) * mr, my0 + Math.sin(Math.PI / 2) * (RO / R) * mr);
    ctx.stroke();
    for (const ai of s.ai) {
      ctx.beginPath();
      ctx.arc(mx0 + Math.cos(ai.a) * mr, my0 + Math.sin(ai.a) * mr, 3, 0, Math.PI * 2);
      ctx.fillStyle = ai.color;
      ctx.fill();
    }
    const pt = Math.atan2(s.y, s.x);
    ctx.beginPath();
    ctx.arc(mx0 + Math.cos(pt) * mr, my0 + Math.sin(pt) * mr, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD34D";
    ctx.strokeStyle = "#1c1f2b";
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }, [dims, kartBody, kartAccent]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const s = S.current;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (phase === "race" && s.started && !s.paused && !s.finished) {
        s.raceTime += dt;
        const remaining = RACE_TIME - s.raceTime;
        setTimeLeft(Math.max(0, Math.ceil(remaining)));
        if (remaining <= 0) { finishRace(); }

        const k = s.keys;
        const t = s.touch;
        const gas = !!(k["arrowup"] || k["w"] || t.gas);
        const brake = !!(k["arrowdown"] || k["s"] || t.brake);
        const left = !!(k["arrowleft"] || k["a"] || t.left);
        const right = !!(k["arrowright"] || k["d"] || t.right);
        const driftKey = !!(k[" "] || k["z"] || t.drift);
        const steer = (left ? -1 : 0) + (right ? 1 : 0);
        s.steerVis = s.steerVis * 0.85 + steer * 0.15;
        steerVisRef.current = s.steerVis;

        const maxV = (MAXBASE + s.coins * 1.5) * (s.star > 0 ? 1.22 : 1);
        if (s.boost > 0) s.boost -= 60 * dt;
        if (s.star > 0) s.star -= 60 * dt;
        if (s.shake > 0) s.shake -= 1;
        if (s.hop > 0) s.hop -= 60 * dt;
        const boosting = s.boost > 0;
        const cap = boosting ? 215 : maxV;

        if (s.spin > 0) {
          s.spin -= dt;
          s.v = Math.max(0, s.v - 200 * dt);
          s.drifting = false;
          s.charge = 0;
        } else {
          if (gas) s.v = Math.min(cap, s.v + (boosting ? 360 : 170) * dt);
          else s.v -= s.v * 0.9 * dt;
          if (brake) s.v = Math.max(0, s.v - 300 * dt);

          const canSteer = 0.3 + 0.7 * Math.min(s.v / MAXBASE, 1);
          const turnRate = 1.9 * canSteer;

          if (driftKey && !s.drifting && steer !== 0 && s.v > 70) {
            s.drifting = true;
            s.driftDir = steer > 0 ? 1 : -1;
            s.hop = 0.22;
          }
          if (s.drifting) {
            if (!driftKey || s.v < 45) {
              const c = s.charge;
              if (c > 2.6) { s.boost = Math.max(s.boost, 95); sfxEvent("boost"); }
              else if (c > 1.7) { s.boost = Math.max(s.boost, 65); sfxEvent("boost"); }
              else if (c > 0.85) { s.boost = Math.max(s.boost, 42); }
              s.drifting = false;
              s.charge = 0;
            } else {
              s.charge += dt;
              s.h += s.driftDir * turnRate * (0.75 + 0.45 * steer * s.driftDir) * dt * 1.55;
              s.x += -Math.sin(s.h) * s.driftDir * s.v * 0.22 * dt;
              s.y += Math.cos(s.h) * s.driftDir * s.v * 0.22 * dt;
              const tier = s.charge > 2.6 ? "#d78cff" : s.charge > 1.7 ? "#ffb347" : "#57c7ff";
              if (Math.random() < 0.7) {
                s.particles.push({
                  x: s.x - Math.cos(s.h) * 10 + (Math.random() - 0.5) * 6,
                  y: s.y - Math.sin(s.h) * 10 + (Math.random() - 0.5) * 6,
                  z: 1, vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30, vz: 20,
                  life: 14, max: 14, color: tier, size: 2.2,
                });
              }
            }
          } else {
            s.h += steer * turnRate * dt;
          }

          s.x += Math.cos(s.h) * s.v * dt;
          s.y += Math.sin(s.h) * s.v * dt;

          const dist = Math.hypot(s.x, s.y);
          const offroad = dist > RO || dist < RI;
          if (offroad) {
            if (s.v > 62) s.v = Math.max(62, s.v - 260 * dt);
            if (Math.random() < 0.5) {
              s.particles.push({
                x: s.x + (Math.random() - 0.5) * 10, y: s.y + (Math.random() - 0.5) * 10, z: 1,
                vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20, vz: 25,
                life: 16, max: 16, color: "#7a5a3a", size: 2.4,
              });
            }
          }
          if (dist > RO + 22) {
            const a = Math.atan2(s.y, s.x);
            s.x = Math.cos(a) * (RO + 22); s.y = Math.sin(a) * (RO + 22);
            s.v *= 0.45; s.shake = 6; sfxEvent("bump");
          }
          if (dist < RI - 22) {
            const a = Math.atan2(s.y, s.x);
            s.x = Math.cos(a) * (RI - 22); s.y = Math.sin(a) * (RI - 22);
            s.v *= 0.45; s.shake = 6; sfxEvent("bump");
          }

          for (const pad of s.pads) {
            if (angDiff(Math.atan2(s.y, s.x), pad.a) < 0.045 && dist > RI && dist < RO) {
              if (s.boost < 40) sfxEvent("boost");
              s.boost = Math.max(s.boost, 50);
            }
          }

          for (let i = 0; i < s.coinsArr.length; i++) {
            const cn = s.coinsArr[i];
            if (cn.taken > 0) { cn.taken--; continue; }
            const cx2 = Math.cos(cn.a) * (R + cn.lat), cy2 = Math.sin(cn.a) * (R + cn.lat);
            if (Math.hypot(cx2 - s.x, cy2 - s.y) < 14) {
              cn.taken = 900;
              if (s.coins < 10) s.coins += 1;
              setCoinCount(s.coins);
              addPopup(cx2, cy2, "+15", "#FFD34D");
              sfxEvent("coin");
            }
          }

          for (let i = 0; i < s.boxes.length; i++) {
            const bx = s.boxes[i];
            if (bx.taken > 0) { bx.taken--; continue; }
            const bx2 = Math.cos(bx.a) * R, by2 = Math.sin(bx.a) * R;
            if (Math.hypot(bx2 - s.x, by2 - s.y) < 16) {
              bx.taken = 240;
              giveItem();
            }
          }

          for (let i = s.bananas.length - 1; i >= 0; i--) {
            const b = s.bananas[i];
            b.life -= 1;
            if (b.life <= 0) { s.bananas.splice(i, 1); continue; }
            if (Math.hypot(b.x - s.x, b.y - s.y) < 13) {
              s.bananas.splice(i, 1);
              if (s.star > 0) continue;
              s.spin = 1.2; s.v = 0;
              s.coins = Math.max(0, s.coins - 3);
              setCoinCount(s.coins);
              addPopup(s.x, s.y, "Terpeleset!", "#f43f5e");
              s.shake = 8; sfxEvent("hit");
            }
          }

          for (let i = s.shells.length - 1; i >= 0; i--) {
            const sh = s.shells[i];
            sh.life -= dt;
            if (sh.life <= 0) { s.shells.splice(i, 1); continue; }
            if (sh.kind === "green") {
              sh.x += sh.vx * dt; sh.y += sh.vy * dt;
              const sd = Math.hypot(sh.x, sh.y);
              if (sd > RO - 4 || sd < RI + 4) {
                const nx = sh.x / sd, ny = sh.y / sd;
                const vn = sh.vx * nx + sh.vy * ny;
                sh.vx -= 2 * vn * nx; sh.vy -= 2 * vn * ny;
                sh.x = (sd > RO - 4 ? RO - 5 : RI + 5) * nx;
                sh.y = (sd > RO - 4 ? RO - 5 : RI + 5) * ny;
                sh.bounces++;
                if (sh.bounces > 3) { s.shells.splice(i, 1); continue; }
              }
              if (Math.hypot(sh.x - s.x, sh.y - s.y) < 13 && s.star <= 0) {
                s.shells.splice(i, 1);
                s.spin = 1.2; s.v = 0; s.shake = 8; sfxEvent("hit");
                continue;
              }
              for (let j = 0; j < s.ai.length; j++) {
                const ai = s.ai[j];
                const ax = Math.cos(ai.a) * (R + ai.lat), ay = Math.sin(ai.a) * (R + ai.lat);
                if (Math.hypot(sh.x - ax, sh.y - ay) < 14) {
                  if (ai.spin <= 0) { ai.spin = 1.2; addPopup(ax, ay, "+40", "#22d3ee"); s.quizScore += 40; setQuizScore(s.quizScore); }
                  s.shells.splice(i, 1);
                  break;
                }
              }
            }
          }

          const curT = Math.atan2(s.y, s.x);
          let dT = curT - s.prevT;
          if (dT > Math.PI) dT -= Math.PI * 2;
          if (dT < -Math.PI) dT += Math.PI * 2;
          s.prog += dT;
          if (s.prevT < Math.PI / 2 && curT >= Math.PI / 2 && dT > 0 && dT < 0.5 && s.v > 20) {
            s.lap += 1;
            setLap(s.lap);
            sfxEvent("lap");
            if (s.lap >= 3) { finishRace(); }
          }
          s.prevT = curT;

          let rank = 1;
          for (const ai of s.ai) { if (ai.prog > s.prog) rank++; }
          setPosition(rank);

          for (const gate of s.gates) {
            if (gate.cd > 0) { gate.cd--; continue; }
            if (angDiff(curT, gate.a) < 0.05 && dist > RI && dist < RO) {
              gate.cd = 480;
              openQuiz();
              break;
            }
          }
        }

        for (const ai of s.ai) {
          if (ai.spin > 0) { ai.spin -= dt; ai.v = Math.max(0, ai.v - 200 * dt); }
          else {
            const rubber = Math.max(0.9, Math.min(1.12, 1 + (s.prog - ai.prog) * 0.18));
            const target = ai.baseV * rubber * (ai.itemT < 60 ? 1.3 : 1);
            ai.v = Math.min(target, ai.v + 130 * dt);
            if (ai.itemT === 60) {
              if (Math.random() < 0.5) {
                s.bananas.push({ x: Math.cos(ai.a) * (R + ai.lat) - Math.sin(ai.a) * 20, y: Math.sin(ai.a) * (R + ai.lat) + Math.cos(ai.a) * 20, life: 1600 });
              }
            }
            if (ai.itemT <= 0) ai.itemT = 500 + Math.random() * 600;
            ai.itemT--;
          }
          ai.a += (ai.v * dt) / (R + ai.lat);
          if (ai.a > Math.PI * 2) ai.a -= Math.PI * 2;
          ai.lat = ai.baseLat + Math.sin(now * 0.0005 + ai.phase) * 10;
          if (ai.a > ai.prog) ai.prog = ai.a;
          const ax = Math.cos(ai.a) * (R + ai.lat), ay = Math.sin(ai.a) * (R + ai.lat);
          if (Math.hypot(ax - s.x, ay - s.y) < 16) {
            if (s.star > 0 && ai.spin <= 0) { ai.spin = 1.2; addPopup(ax, ay, "+40", "#22d3ee"); s.quizScore += 40; setQuizScore(s.quizScore); }
            else if (s.spin <= 0) { s.v *= 0.82; ai.v *= 0.82; }
          }
        }

        s.particles = s.particles.filter((p) => {
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          p.vz -= 140 * dt;
          if (p.z < 0) { p.z = 0; p.vz *= -0.3; }
          p.life -= 1;
          return p.life > 0;
        });
        s.popups = s.popups.filter((p) => { p.sy -= 0.8; p.life--; return p.life > 0; });

        const freq = 65 + (s.v / MAXBASE) * 130 + (s.boost > 0 ? 50 : 0);
        s.audio.engine(freq, 0.05);
      } else if (phase !== "race") {
        s.audio.engine(60, 0);
      }

      render(now);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, dims, render, finishRace, giveItem, openQuiz, addPopup, sfxEvent]);

  const press = (key: "left" | "right" | "gas" | "brake" | "drift", val: boolean) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); S.current.touch[key] = val; },
    onPointerUp: () => { S.current.touch[key] = false; },
    onPointerLeave: () => { S.current.touch[key] = false; },
    onPointerCancel: () => { S.current.touch[key] = false; },
  });

  const btnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(20,22,48,0.82)", border: "2px solid rgba(255,255,255,0.55)",
    borderRadius: 18, color: "white", fontFamily: "'Righteous', 'Arial Black', sans-serif",
    userSelect: "none", touchAction: "none", WebkitUserSelect: "none",
    boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
  };

  const fmtTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", touchAction: "none", background: "#4aa8ff" }}>
      <canvas ref={canvasRef} width={dims.w} height={dims.h} style={{ width: "100%", height: "100%", display: "block" }} />

      {phase === "race" && (
        <>
          <div style={{ position: "absolute", top: "calc(10px + env(safe-area-inset-top, 0px))", left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 30, pointerEvents: "none", gap: 8 }}>
            <div style={{ width: "clamp(52px, 9vmin, 68px)", height: "clamp(52px, 9vmin, 68px)", borderRadius: "50%", background: item ? "rgba(30,32,64,0.92)" : "rgba(30,32,64,0.6)", border: `3px solid ${item ? "#FFD34D" : "rgba(255,255,255,0.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(24px, 5vmin, 32px)", boxShadow: item ? "0 0 14px rgba(255,211,77,0.5)" : "none" }}>
              {item ? ITEMS[item].icon : ""}
            </div>
            <div style={{ textAlign: "center", background: "rgba(20,22,48,0.78)", borderRadius: 14, padding: "6px 16px", border: "2px solid rgba(255,255,255,0.35)" }}>
              <div style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(16px, 3.4vmin, 24px)", color: "white", textShadow: "2px 2px 0 #1c1f2b", lineHeight: 1.1 }}>
                LAP {Math.min(lap + 1, 3)}/3
              </div>
              <div style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(11px, 2.2vmin, 15px)", color: "#FFD34D", lineHeight: 1.3 }}>
                🪙 {coinCount}/10 · ⏱ {fmtTime}
              </div>
            </div>
            <button
              onClick={() => { const m = !muted; setMuted(m); S.current.audio.setMuted(m); }}
              style={{ ...btnStyle, width: "clamp(40px, 7vmin, 50px)", height: "clamp(40px, 7vmin, 50px)", borderRadius: "50%", fontSize: 18, pointerEvents: "auto", padding: 0 }}
              aria-label="Suara"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          <div style={{ position: "absolute", right: 14, bottom: "calc(14px + env(safe-area-inset-bottom, 0px))", zIndex: 30, pointerEvents: "none", textAlign: "right" }}>
            <div style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(54px, 13vmin, 110px)", lineHeight: 0.9, color: POS_COLORS[Math.min(position - 1, 7)], WebkitTextStroke: "3px #1c1f2b", textShadow: "4px 4px 0 rgba(0,0,0,0.35)" }}>
              {position}<span style={{ fontSize: "0.45em" }}>{posSuffix(position)}</span>
            </div>
          </div>

          {isTouch && (
            <>
              <div style={{ position: "absolute", left: 12, bottom: "calc(12px + env(safe-area-inset-bottom, 0px))", zIndex: 40, display: "flex", flexDirection: "column", gap: 8 }}>
                <button {...press("drift", true)} style={{ ...btnStyle, width: 74, height: 44, fontSize: 13 }}>DRIFT</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button {...press("left", true)} style={{ ...btnStyle, width: 62, height: 62, fontSize: 26 }}>◀</button>
                  <button {...press("right", true)} style={{ ...btnStyle, width: 62, height: 62, fontSize: 26 }}>▶</button>
                </div>
              </div>
              <div style={{ position: "absolute", right: 12, bottom: "calc(12px + env(safe-area-inset-bottom, 0px))", zIndex: 40, display: "flex", alignItems: "flex-end", gap: 8, paddingRight: "clamp(60px, 14vmin, 110px)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onPointerDown={(e) => { e.preventDefault(); useItem(); }} style={{ ...btnStyle, width: 56, height: 56, borderRadius: "50%", fontSize: 22 }}>🎁</button>
                  <button {...press("brake", true)} style={{ ...btnStyle, width: 56, height: 44, fontSize: 12 }}>REM</button>
                </div>
                <button {...press("gas", true)} style={{ ...btnStyle, width: 78, height: 78, borderRadius: "50%", fontSize: 15, background: "rgba(34,197,94,0.85)", borderColor: "rgba(255,255,255,0.7)" }}>GAS</button>
              </div>
            </>
          )}

          {!isTouch && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 30, pointerEvents: "none", background: "rgba(20,22,48,0.65)", borderRadius: 10, padding: "4px 12px", whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
                W/↑ gas · S/↓ rem · A/D setir · Spasi drift · X item
              </span>
            </div>
          )}
        </>
      )}

      {phase === "intro" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,12,30,0.9)", backdropFilter: "blur(10px)", zIndex: 200, padding: 16 }}>
          <div style={{ padding: "clamp(20px,4vmin,32px) clamp(20px,4vmin,36px)", borderRadius: 24, background: "rgba(22,24,54,0.96)", border: "2px solid rgba(255,211,77,0.45)", maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", textAlign: "center" }}>
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(24px,5vmin,34px)", fontWeight: 900, color: "#FFD34D", margin: 0, textShadow: "3px 3px 0 #1c1f2b" }}>
              🏁 GRAND PRIX BAHASA
            </p>
            <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(12px,2.4vmin,15px)", color: "rgba(255,255,255,0.55)", margin: "4px 0 18px" }}>
              Language Kart · Sirkuit Prima
            </p>
            <div style={{ display: "grid", gap: 10, textAlign: "left", marginBottom: 16 }}>
              {[
                ["🏆", "Tujuan", "Selesaikan tiga putaran melawan tujuh pembalap lain dan raih posisi terbaik."],
                ["🪙", "Koin Kata Baku", "Kumpulkan koin di sirkuit. Setiap koin menambah kecepatan tertinggi dan nilai akhir."],
                ["🎁", "Kotak Item", "Berisi Jamur Kilat, Pisang, Cangkang Hijau, Cangkang Merah, dan Bintang. Gunakan dengan tombol X atau tombol item."],
                ["🍌", "Jebakan", "Pisang membuat kart terpeleset dan kehilangan tiga koin. Bintang membuatmu kebal sementara."],
                ["❓", "Gerbang Tantangan", "Lewati lingkaran emas untuk menjawab masalah berbahasa. Jawaban tepat memberi 25 poin dan dorongan kecepatan."],
                ["⚡", "Drift Mini-Turbo", "Tahan drift saat berbelok; percikan biru, oranye, lalu ungu. Lepaskan untuk dorongan ekstra."],
              ].map(([ic, tt, dd]) => (
                <div key={tt} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 13px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{ic}</span>
                  <div>
                    <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13, color: "#FFD34D", margin: "0 0 2px" }}>{tt}</p>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.72)", margin: 0, lineHeight: 1.45 }}>{dd}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "0 0 16px" }}>
              {isTouch
                ? "Layar sentuh: gunakan tombol di layar — kiri/kanan untuk setir, GAS untuk melaju, DRIFT untuk belokan tajam."
                : "Papan ketik: W/↑ gas · S/↓ rem · A/D atau ←/→ setir · Spasi drift · X item"}
            </p>
            <button onClick={startRace} style={{ padding: "15px 42px", borderRadius: 16, background: "linear-gradient(135deg, #f97316, #ef4444)", border: "none", color: "white", fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: 19, fontWeight: 900, cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 5px 22px rgba(239,68,68,0.45)" }}>
              MULAI BALAPAN
            </button>
          </div>
        </div>
      )}

      {phase === "count" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 150, pointerEvents: "none" }}>
          <div style={{ display: "flex", gap: 18, marginBottom: 20 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ width: "clamp(30px,7vmin,48px)", height: "clamp(30px,7vmin,48px)", borderRadius: "50%", background: cdStep <= 3 - n + 1 ? "#ef4444" : "rgba(40,40,60,0.7)", border: "3px solid rgba(255,255,255,0.6)", boxShadow: cdStep <= 3 - n + 1 ? "0 0 24px rgba(239,68,68,0.8)" : "none" }} />
            ))}
          </div>
          {cdStep === 0 && (
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(40px,10vmin,80px)", color: "#4ade80", textShadow: "4px 4px 0 #1c1f2b", margin: 0, animation: "popIn 0.3s both" }}>
              MULAI!
            </p>
          )}
        </div>
      )}

      {quizOpen && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,10,26,0.86)", backdropFilter: "blur(10px)", zIndex: 300, padding: 14 }}>
          <div style={{ padding: "clamp(18px,3.5vmin,28px) clamp(18px,3.5vmin,32px)", borderRadius: 20, background: "rgba(24,26,58,0.97)", border: "2px solid rgba(250,204,21,0.5)", maxWidth: 600, width: "100%", maxHeight: "92vh", overflowY: "auto", animation: "popIn 0.3s both" }}>
            <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 16 }}>
              <div style={{ width: `${(quizTimer / 25) * 100}%`, height: "100%", borderRadius: 3, background: quizTimer <= 6 ? "#ef4444" : "#facc15", transition: "width 1s linear" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13, color: "#facc15", letterSpacing: "0.06em" }}>GERBANG TANTANGAN</span>
                <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 9, letterSpacing: "0.12em", color: "#0b0d22", background: "#facc15", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{ch.domain}</span>
              </div>
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 18, color: quizTimer <= 6 ? "#ef4444" : "#facc15" }}>{quizTimer}s</span>
            </div>
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(15px,2.8vmin,19px)", color: "white", margin: "0 0 18px", lineHeight: 1.45 }}>{ch.q}</p>
            <div style={{ display: "grid", gap: 9 }}>
              {ch.opts.map((opt, i) => {
                let bg = "rgba(255,255,255,0.06)";
                let border = "rgba(255,255,255,0.12)";
                let txt = "rgba(255,255,255,0.88)";
                if (quizAnswered) {
                  const selQ = quizSelected >= 0 ? ch.opts[quizSelected]?.quality : null;
                  if (i === quizSelected) {
                    if (selQ === "best") { bg = "rgba(34,197,94,0.18)"; border = "#22c55e"; txt = "#4ade80"; }
                    else if (selQ === "ok") { bg = "rgba(250,204,21,0.14)"; border = "#facc15"; txt = "#fde047"; }
                    else { bg = "rgba(239,68,68,0.16)"; border = "#ef4444"; txt = "#f87171"; }
                  } else if (opt.quality === "best") { bg = "rgba(34,197,94,0.1)"; border = "rgba(34,197,94,0.5)"; txt = "#86efac"; }
                }
                return (
                  <button key={i} onClick={() => !quizAnswered && answerQuiz(i)} disabled={quizAnswered}
                    style={{ padding: "13px 16px", borderRadius: 12, background: bg, border: `1.5px solid ${border}`, color: txt, fontFamily: "Arial, sans-serif", fontSize: "clamp(13px,2.4vmin,15px)", fontWeight: 600, textAlign: "left", cursor: quizAnswered ? "default" : "pointer", lineHeight: 1.4 }}>
                    <span style={{ fontFamily: "'Righteous', sans-serif", color: "rgba(255,255,255,0.35)", marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {quizAnswered && quizSelected >= 0 && (
              <>
                <div style={{ marginTop: 15, padding: "13px 16px", borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.4)" }}>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>HASIL</p>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13.5, color: "white", margin: "0 0 8px", lineHeight: 1.45 }}>{ch.opts[quizSelected]?.hasil}</p>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>MENGAPA BEGITU</p>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{ch.opts[quizSelected]?.fb}</p>
                </div>
                <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 12, background: "rgba(250,204,21,0.07)", border: "1px dashed rgba(250,204,21,0.45)" }}>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#facc15", margin: "0 0 5px" }}>COBA PIKIR LAGI</p>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>{ch.reflect}</p>
                </div>
                <button onClick={continueQuiz} style={{ marginTop: 14, width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Righteous', sans-serif", fontSize: 16, fontWeight: 900, cursor: "pointer", letterSpacing: "0.04em" }}>
                  LANJUTKAN BALAPAN (Enter)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {phase === "results" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,10,26,0.9)", backdropFilter: "blur(12px)", zIndex: 250, padding: 16 }}>
          <div style={{ padding: "clamp(22px,4vmin,34px) clamp(22px,4vmin,42px)", borderRadius: 24, background: "rgba(24,26,58,0.97)", border: "2px solid rgba(255,211,77,0.5)", maxWidth: 460, width: "100%", textAlign: "center", animation: "popIn 0.45s both", maxHeight: "92vh", overflowY: "auto" }}>
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(28px,6vmin,40px)", color: "#FFD34D", margin: 0, textShadow: "3px 3px 0 #1c1f2b" }}>
              {result.position === 1 ? "🏆 JUARA!" : "FINIS!"}
            </p>
            <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(15px,3vmin,20px)", color: "white", margin: "8px 0 4px" }}>
              Posisi {result.position}<span style={{ fontSize: "0.6em" }}>{posSuffix(result.position)}</span> dari 8 pembalap
            </p>
            <div style={{ display: "grid", gap: 6, margin: "16px 0", textAlign: "left", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 18px" }}>
              {[
                [`Koin kata baku (${result.coins})`, `+${result.coins * 15}`],
                ["Tantangan terjawab tepat", `${result.correct} benar`],
                ["Bonus posisi", "sesuai peringkat"],
              ].map(([a, b]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                  <span>{a}</span>
                  <span style={{ color: "#FFD34D", fontWeight: 700 }}>{b}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(26px,5.4vmin,38px)", color: "#4ade80", margin: "0 0 10px", textShadow: "2px 2px 0 #1c1f2b" }}>
              Skor: {result.score}
            </p>
            <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: "0 0 18px", lineHeight: 1.5 }}>
              {result.position === 1
                ? "Luar biasa! Kepekaanmu memilih kata dan menyusun strategi menunjukkan kesadaran berbahasa yang matang."
                : result.position <= 3
                  ? "Hebat! Sedikit lagi menuju puncak. Terus asah kepekaan berbahasamu."
                  : "Proses yang baik. Setiap tantangan yang kamu jawab membuatmu makin teliti dalam berbahasa."}
            </p>
            <button onClick={() => onComplete(result.score, result.correct, result.position)} style={{ width: "100%", padding: "15px 0", borderRadius: 14, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Righteous', sans-serif", fontSize: 16, fontWeight: 900, cursor: "pointer", letterSpacing: "0.04em" }}>
              SIMPAN HASIL
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes popIn{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
