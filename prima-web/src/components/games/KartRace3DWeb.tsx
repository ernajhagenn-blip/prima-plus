"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SCENARIOS as CHALLENGES } from "@/lib/challengeScenarios";
import { validateAll } from "@/lib/challengeValidator";

const R = 180;
const W = 64;
const RI = R - W / 2;
const RO = R + W / 2;
const CAMD = 55;
const CAMH = 28;
const MAXBASE = 150;
const RACE_TIME = 240;

const trackWobble = (a: number) => Math.sin(a * 3) * 26 + Math.cos(a * 5) * 13 + Math.sin(a * 2 + 0.7) * 14;
const trackR = (a: number) => R + trackWobble(a);
const trackY = (a: number) => 12 + Math.sin(a * 2) * 8 + Math.sin(a * 3 + 1.2) * 4;

type ItemKind = "mushroom" | "banana" | "green" | "red" | "star";
const ITEMS: Record<ItemKind, { icon: string }> = {
  mushroom: { icon: "🍄" }, banana: { icon: "🍌" }, green: { icon: "🟢" }, red: { icon: "🔴" }, star: { icon: "⭐" },
};

interface AIKart { a: number; lat: number; baseLat: number; phase: number; v: number; baseV: number; spin: number; prog: number; itemT: number; }
interface Coin { a: number; lat: number; taken: number; }
interface Box { a: number; taken: number; }
interface Pad { a: number; }
interface Banana { x: number; y: number; life: number; }
interface Shell { x: number; y: number; vx: number; vy: number; kind: "green" | "red"; life: number; bounces: number; }
interface Gate { a: number; cd: number; }

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  eOsc: OscillatorNode | null = null;
  eGain: GainNode | null = null;
  musicTimer: ReturnType<typeof setInterval> | null = null;
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
      this.eOsc.connect(this.eGain);
      this.eGain.connect(this.master);
      this.eOsc.start();
    } catch { }
  }
  engine(freq: number, vol: number) {
    if (!this.ctx || !this.eOsc || !this.eGain) return;
    const t = this.ctx.currentTime;
    this.eOsc.frequency.setTargetAtTime(freq, t, 0.05);
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
  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const chords = [[523.25, 659.25, 783.99], [392.0, 493.88, 587.33], [440.0, 523.25, 659.25], [349.23, 440.0, 523.25]];
    const pattern = [0, 1, 2, 1];
    let step = 0;
    const playNote = (freq: number, dur: number, vol: number, type: OscillatorType) => {
      if (!this.ctx || !this.master) return;
      try {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.connect(g); g.connect(this.master);
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
      playNote(ch[pattern[step % 4]], 0.4, 0.022, "triangle");
      if (step % 8 === 0) playNote(ch[0] / 2, 0.9, 0.03, "sine");
      if (step % 8 === 4) playNote(ch[2] / 2, 0.9, 0.025, "sine");
      step++;
    }, 260);
  }
  stopMusic() { if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; } }
  setMuted(m: boolean) { if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.02); }
}

const AI_COLORS = ["#a855f7", "#22c55e", "#f97316", "#3b82f6", "#e11d48", "#eab308", "#14b8a6"];
const AI_BASE = [148, 146, 144, 142, 140, 137, 134];

function angDiff(a: number, b: number) {
  let d = Math.abs(a - b) % (Math.PI * 2);
  if (d > Math.PI) d = Math.PI * 2 - d;
  return d;
}
function posSuffix(n: number) { return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"; }
const POS_COLORS = ["#FFD34D", "#C9D6E3", "#E3A05C", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];

function makeCheckerTex(c1: string, c2: string, rep: number) {
  const cv = document.createElement("canvas");
  cv.width = 128; cv.height = 8;
  const x = cv.getContext("2d")!;
  for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 === 0 ? c1 : c2; x.fillRect(i * 8, 0, 8, 8); }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(rep, 1);
  return t;
}

function buildStrip(
  a0: number, a1: number, latA: number, latB: number, dyA: number, dyB: number,
  mat: THREE.Material, segs: number, uvRep: number, uvSwap = false, groundA = false, groundB = false,
): THREE.Mesh {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const f = i / segs;
    const a = a0 + (a1 - a0) * f;
    const r = trackR(a), y = trackY(a);
    const cx = Math.cos(a), cz = Math.sin(a);
    const yA = groundA ? 0 : y + dyA;
    const yB = groundB ? 0 : y + dyB;
    pos.push(cx * (r + latA), yA, cz * (r + latA));
    pos.push(cx * (r + latB), yB, cz * (r + latB));
    if (uvSwap) uv.push(0, f * uvRep, 1, f * uvRep);
    else uv.push(f * uvRep, 0, f * uvRep, 1);
    if (i < segs) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

function makeTextTex(text: string, bg: string, fg: string) {
  const cv = document.createElement("canvas");
  cv.width = 512; cv.height = 96;
  const x = cv.getContext("2d")!;
  x.fillStyle = bg; x.fillRect(0, 0, 512, 96);
  for (let i = 0; i < 32; i++) { x.fillStyle = i % 2 === 0 ? "#ffffff" : "#1c1f2b"; x.fillRect(i * 16, 0, 16, 14); x.fillRect(i * 16, 82, 16, 14); }
  x.font = "900 56px Arial Black, sans-serif";
  x.textAlign = "center"; x.textBaseline = "middle";
  x.fillStyle = fg; x.fillText(text, 256, 50);
  const t = new THREE.CanvasTexture(cv);
  return t;
}

function buildKart(body: string, accent: string, suit: string, name?: string): THREE.Group {
  const g = new THREE.Group();
  const mBody = new THREE.MeshStandardMaterial({ color: new THREE.Color(body), roughness: 0.4, metalness: 0.15 });
  const mAcc = new THREE.MeshStandardMaterial({ color: new THREE.Color(accent), roughness: 0.35, metalness: 0.2 });
  const mDark = new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.7 });
  const mSkin = new THREE.MeshStandardMaterial({ color: 0xf1c9a5, roughness: 0.6 });

  const chassis = new THREE.Mesh(new RoundedBoxGeometry(13, 7, 24, 3, 2.4), mBody);
  chassis.position.y = 8; g.add(chassis);
  const noseGeo = new THREE.CylinderGeometry(2.8, 4.4, 7, 18);
  noseGeo.rotateX(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, mAcc);
  nose.position.set(0, 7.5, 14.5); g.add(nose);
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 5), mAcc);
  spoiler.position.set(0, 16, -11); g.add(spoiler);
  const sL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 1.5), mDark);
  sL.position.set(-6, 12.5, -11); g.add(sL);
  const sR = sL.clone(); sR.position.x = 6; g.add(sR);
  const wGeo = new THREE.CylinderGeometry(4.6, 4.6, 5, 20);
  wGeo.rotateZ(Math.PI / 2);
  [[-10.5, 8], [10.5, 8], [-10.5, -9], [10.5, -9]].forEach(([wx, wz]) => {
    const w = new THREE.Mesh(wGeo, mDark);
    w.position.set(wx, 4.6, wz); g.add(w);
  });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(4.6, 4.5, 6, 16), new THREE.MeshStandardMaterial({ color: new THREE.Color(suit), roughness: 0.5 }));
  torso.position.set(0, 14.5, -2); g.add(torso);
  const armMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(suit), roughness: 0.5 });
  const armGeo = new THREE.CapsuleGeometry(1.8, 7, 4, 8);
  const armL = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-6.5, 13, 4); armL.rotation.z = 0.3; armL.rotation.x = -0.5; g.add(armL);
  const armR = new THREE.Mesh(armGeo, armMat);
  armR.position.set(6.5, 13, 4); armR.rotation.z = -0.3; armR.rotation.x = -0.5; g.add(armR);
  const handGeo = new THREE.SphereGeometry(2, 10, 8);
  const handL = new THREE.Mesh(handGeo, mSkin);
  handL.position.set(-8, 10.5, 8); g.add(handL);
  const handR = new THREE.Mesh(handGeo, mSkin);
  handR.position.set(8, 10.5, 8); g.add(handR);
  const wheelGeo = new THREE.TorusGeometry(3.5, 0.6, 8, 24);
  const steeringWheel = new THREE.Mesh(wheelGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3, metalness: 0.5 }));
  steeringWheel.position.set(0, 11, 10); steeringWheel.rotation.x = -0.4; g.add(steeringWheel);
  const head = new THREE.Mesh(new THREE.SphereGeometry(6.4, 24, 18), mSkin);
  head.position.set(0, 23, -2); head.scale.set(1, 1.06, 1); g.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(7.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: new THREE.Color(body), roughness: 0.35 }));
  helmet.position.set(0, 23.5, -2); g.add(helmet);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(8.5, 3.6, 2), new THREE.MeshStandardMaterial({ color: 0x1c1f2b, roughness: 0.2, metalness: 0.4 }));
  visor.position.set(0, 22.5, 3.6); g.add(visor);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(13, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.06; g.add(shadow);
  if (name) {
    const cv = document.createElement("canvas");
    cv.width = 256; cv.height = 64;
    const cx = cv.getContext("2d")!;
    cx.clearRect(0, 0, 256, 64);
    cx.fillStyle = "rgba(0,0,0,0.55)";
    cx.beginPath(); cx.roundRect(4, 4, 248, 56, 14); cx.fill();
    cx.font = "900 36px Arial Black, sans-serif";
    cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillStyle = "#ffffff";
    cx.fillText(name, 128, 34);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(12, 3, 1);
    sprite.position.set(0, 36, -2);
    g.add(sprite);
  }
  return g;
}

function buildTree(big: boolean): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, big ? 14 : 10, 8), new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 }));
  trunk.position.y = (big ? 14 : 10) / 2; g.add(trunk);
  const leafM = new THREE.MeshStandardMaterial({ color: big ? 0x2e8b47 : 0x3aa35a, roughness: 0.85 });
  const f1 = new THREE.Mesh(new THREE.SphereGeometry(big ? 11 : 8, 12, 10), leafM);
  f1.position.y = big ? 20 : 15; g.add(f1);
  const f2 = new THREE.Mesh(new THREE.SphereGeometry(big ? 7 : 5.5, 10, 8), leafM);
  f2.position.set(-4, big ? 14 : 10.5, 2); g.add(f2);
  return g;
}

export default function KartRace3DWeb({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#fbbf24",
}: {
  onComplete: (score: number, correct: number, position: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
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
  const [popupMsg, setPopupMsg] = useState<{ text: string; color: string; key: number } | null>(null);

  useEffect(() => {
    const issues = validateAll();
    if (issues.length > 0) console.warn("[PRIMA+] Validasi tantangan:", issues);
  }, []);

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0); }, []);

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
    keys: {} as Record<string, boolean>,
    touch: { left: false, right: false, gas: false, brake: false, drift: false },
    started: false, finished: false, paused: false,
    raceTime: 0, usedQ: new Set<number>(),
    audio: new AudioEngine(),
    camPos: new THREE.Vector3(0, trackY(Math.PI / 2) + CAMH, trackR(Math.PI / 2) + CAMD),
    camLook: new THREE.Vector3(0, trackY(Math.PI / 2) + 3, trackR(Math.PI / 2)),
    fov: 62,
    steerVis: 0,
  });

  const T = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    player?: THREE.Group;
    flames?: THREE.Mesh[];
    balloons?: THREE.Group[];
    aiMeshes: THREE.Group[];
    coinMeshes: THREE.Mesh[];
    boxMeshes: THREE.Group[];
    gateMeshes: THREE.Mesh[];
    sparks: { m: THREE.Mesh; life: number; vy: number }[];
    glbKarts: THREE.Group[];
    arena?: THREE.Group;
    spawnSpark?: (x: number, z: number, color: string) => void;
    ready: boolean;
  }>({ aiMeshes: [], coinMeshes: [], boxMeshes: [], gateMeshes: [], sparks: [], glbKarts: [], ready: false });

  const [fatal3D, setFatal3D] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x6ec6ff);
      scene.fog = new THREE.Fog(0xa8ddff, 300, 1200);
      camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 2000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xcfeaff, 0x3f7d52, 1.05));
    const sunL = new THREE.DirectionalLight(0xfff2d0, 1.6);
    sunL.position.set(120, 220, 80);
    scene.add(sunL);

    const FULL = Math.PI * 2;
    const grass = new THREE.Mesh(new THREE.CircleGeometry(900, 48), new THREE.MeshStandardMaterial({ color: 0x4dbd68, roughness: 1 }));
    grass.rotation.x = -Math.PI / 2; grass.position.y = -0.05;
    scene.add(grass);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x414658, roughness: 0.9, side: THREE.DoubleSide });
    scene.add(buildStrip(0, FULL, -W / 2, W / 2, 0, 0, roadMat, 260, 1));
    const curbMat = new THREE.MeshStandardMaterial({ map: makeCheckerTex("#e74c3c", "#f8f8f8", 90), roughness: 0.7, side: THREE.DoubleSide });
    scene.add(buildStrip(0, FULL, -W / 2 - 4.5, -W / 2, 0.08, 0.08, curbMat, 260, 90));
    scene.add(buildStrip(0, FULL, W / 2, W / 2 + 4.5, 0.08, 0.08, curbMat, 260, 90));
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x46b25c, roughness: 1, side: THREE.DoubleSide });
    scene.add(buildStrip(0, FULL, -W / 2 - 40, -W / 2 - 4.5, 0, 0.02, skirtMat, 200, 1, false, true, false));
    scene.add(buildStrip(0, FULL, W / 2 + 4.5, W / 2 + 40, 0.02, 0, skirtMat, 200, 1, false, false, true));
    const dashMat = new THREE.MeshBasicMaterial({ map: makeCheckerTex("#e8e8f0", "#414658", 70), side: THREE.DoubleSide });
    scene.add(buildStrip(0, FULL, -1.5, 1.5, 0.1, 0.1, dashMat, 260, 70));
    const startTex = makeCheckerTex("#ffffff", "#1f2430", 10);
    const startStrip = buildStrip(Math.PI / 2 - 0.026, Math.PI / 2 + 0.026, -W / 2 * 0.96, W / 2 * 0.96, 0.12, 0.12, new THREE.MeshBasicMaterial({ map: startTex, side: THREE.DoubleSide }), 4, 10, true);
    scene.add(startStrip);

    for (let i = 0; i < 26; i++) {
      const ta = (i / 26) * Math.PI * 2 + 0.12;
      const tr = buildTree(i % 3 === 0);
      tr.position.set(Math.cos(ta) * (trackR(ta) + 52), 0, Math.sin(ta) * (trackR(ta) + 52));
      scene.add(tr);
    }
    for (let i = 0; i < 10; i++) {
      const ta = i * 0.63 + 0.3;
      const tr = buildTree(false);
      tr.position.set(Math.cos(ta) * (trackR(ta) - 62), 0, Math.sin(ta) * (trackR(ta) - 62));
      tr.scale.setScalar(0.8);
      scene.add(tr);
    }

    const balloons: THREE.Group[] = [];
    const balloonCols = [0xef4444, 0xa855f7, 0x0ea5e9];
    for (let i = 0; i < 3; i++) {
      const bg = new THREE.Group();
      const env = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 12), new THREE.MeshStandardMaterial({ color: balloonCols[i], roughness: 0.5 }));
      env.scale.set(1, 1.15, 1); bg.add(env);
      const basket = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshStandardMaterial({ color: 0x8b5e34, roughness: 0.9 }));
      basket.position.y = -16; bg.add(basket);
      const ba = 1.1 + i * 2.1;
      bg.position.set(Math.cos(ba) * (RO + 120), 55, Math.sin(ba) * (RO + 120));
      scene.add(bg); balloons.push(bg);
    }
    T.current.balloons = balloons;

    const startA = Math.PI / 2;
    const bannerGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(2.5, 2.5, 40, 12);
    const pillarM = new THREE.MeshStandardMaterial({ color: 0xc8ccd8, roughness: 0.5 });
    const halfSpan = W / 2 + 16;
    const pilL = new THREE.Mesh(pillarGeo, pillarM); pilL.position.set(-halfSpan, 20, 0); bannerGroup.add(pilL);
    const pilR = new THREE.Mesh(pillarGeo, pillarM); pilR.position.set(halfSpan, 20, 0); bannerGroup.add(pilR);
    const bannerDark = new THREE.MeshStandardMaterial({ color: 0x1c1f2b, roughness: 0.6 });
    const bannerTex = new THREE.MeshStandardMaterial({ map: makeTextTex("PRIMA KART", "#1c1f2b", "#FFD34D"), roughness: 0.6 });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(W + 64, 10, 3), [bannerDark, bannerDark, bannerDark, bannerDark, bannerTex, bannerTex]);
    banner.position.set(0, 38, 0); bannerGroup.add(banner);
    bannerGroup.position.set(Math.cos(startA) * trackR(startA), trackY(startA), Math.sin(startA) * trackR(startA));
    bannerGroup.rotation.y = -startA;
    scene.add(bannerGroup);

    const flagCols = [0xef4444, 0xfacc15, 0x3b82f6, 0x22c55e, 0xec4899];
    const flagGeo = new THREE.PlaneGeometry(3.2, 4);
    const poleGeo = new THREE.CylinderGeometry(0.7, 0.7, 26, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    for (let loc = 0; loc < 6; loc++) {
      const baseA = loc * (Math.PI / 3) + 0.5;
      const r = trackR(baseA) + 34;
      const baseY = Math.max(trackY(baseA), 0);
      const pA = new THREE.Vector3(Math.cos(baseA) * r, baseY + 13, Math.sin(baseA) * r);
      const pB = new THREE.Vector3(Math.cos(baseA + 0.16) * r, baseY + 13, Math.sin(baseA + 0.16) * r);
      const pole1 = new THREE.Mesh(poleGeo, poleMat); pole1.position.copy(pA); scene.add(pole1);
      const pole2 = new THREE.Mesh(poleGeo, poleMat); pole2.position.copy(pB); scene.add(pole2);
      for (let f = 0; f < 9; f++) {
        const t = (f + 0.5) / 9;
        const sag = Math.sin(t * Math.PI) * 4;
        const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ color: flagCols[(f + loc) % 5], roughness: 0.6, side: THREE.DoubleSide }));
        flag.position.lerpVectors(pA, pB, t);
        flag.position.y -= sag;
        flag.rotation.y = baseA + Math.PI / 2;
        scene.add(flag);
      }
    }

    const crystalGeo = new THREE.IcosahedronGeometry(5.2, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x7c3aed, emissiveIntensity: 0.55, roughness: 0.15, metalness: 0.35, flatShading: true });
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.28, side: THREE.DoubleSide });
    for (let i = 0; i < 8; i++) {
      const a = 0.35 + i * 0.785;
      const grp = new THREE.Group();
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      grp.add(crystal);
      const halo = new THREE.Mesh(new THREE.RingGeometry(6.4, 7.4, 24), haloMat);
      halo.rotation.x = -Math.PI / 2;
      grp.add(halo);
      grp.position.set(Math.cos(a) * trackR(a), trackY(a) + 9, Math.sin(a) * trackR(a));
      scene.add(grp);
      T.current.boxMeshes.push(grp);
    }
    const coinGeo = new THREE.CylinderGeometry(5, 5, 1.2, 18);
    coinGeo.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd34d, metalness: 0.7, roughness: 0.25, emissive: 0x8a6508, emissiveIntensity: 0.25 });
    for (let i = 0; i < 16; i++) {
      const a = 0.28 + i * 0.392;
      const lat = (i % 2 === 0 ? 1 : -1) * W * 0.22;
      const cm = new THREE.Mesh(coinGeo, coinMat);
      cm.position.set(Math.cos(a) * (trackR(a) + lat), trackY(a) + 6, Math.sin(a) * (trackR(a) + lat));
      scene.add(cm); T.current.coinMeshes.push(cm);
    }
    const gateMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.5, roughness: 0.3 });
    for (const ga of [2.25, 5.35]) {
      const gm = new THREE.Mesh(new THREE.TorusGeometry(16, 1.6, 12, 36), gateMat);
      gm.position.set(Math.cos(ga) * trackR(ga), trackY(ga) + 8, Math.sin(ga) * trackR(ga));
      gm.rotation.y = -ga;
      scene.add(gm); T.current.gateMeshes.push(gm);
    }
    for (let i = 0; i < 3; i++) {
      const pa = [1.2, 3.4, 5.1][i];
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(22, 14), new THREE.MeshStandardMaterial({ color: 0xff9f1a, emissive: 0xff9f1a, emissiveIntensity: 0.35 }));
      pad.rotation.x = -Math.PI / 2; pad.rotation.z = -pa;
      pad.position.set(Math.cos(pa) * trackR(pa), trackY(pa) + 0.2, Math.sin(pa) * trackR(pa));
      scene.add(pad);
    }

    const PLAYER_NAMES = ["Nara", "Raga", "Kira", "Bimo", "Alya", "Dava", "Mira", "Senä"];
    const player = buildKart(kartBody, kartAccent, "#b91c1c", PLAYER_NAMES[0]);
    player.scale.setScalar(0.65);
    scene.add(player);
    T.current.player = player;
    const flames: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff9f1a, transparent: true, opacity: 0.85 }));
      f.position.set(i === 0 ? -5 : 5, 6, -15);
      f.visible = false;
      player.add(f); flames.push(f);
    }
    T.current.flames = flames;

    const AI_NAMES = ["Raga", "Kira", "Bimo", "Alya", "Dava", "Mira", "Senä"];
    for (let i = 0; i < 7; i++) {
      const ak = buildKart(AI_COLORS[i], "#f8fafc", AI_COLORS[i], AI_NAMES[i]);
      ak.scale.setScalar(0.65);
      ak.scale.setScalar(1.05);
      scene.add(ak); T.current.aiMeshes.push(ak);
    }
    const gltfLoader = new GLTFLoader();
    // Kenney GLBs reference external PNGs that aren't bundled.
    // Intercept URI loads and substitute a tiny white data-URI; kart tints come from procedural mats.
    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9ZqEX+oAAAAASUVORK5CYII=";
    gltfLoader.manager.setURLModifier(() => WHITE_PNG);
    const kartFiles = ["kart-oobi", "kart-oodi", "kart-ooli", "kart-oopi", "kart-oozi"];
    const glbModels: Record<string, THREE.Group> = {};
    let glbDone = 0;
    const buildSlots = () => {
      const slots: THREE.Group[] = [];
      for (let s = 0; s < 8; s++) {
        const src = glbModels[kartFiles[s % 5]];
        if (!src) return;
        const g = new THREE.Group();
        const clone = src.clone(true);
        g.add(clone);
        scene.add(g);
        slots.push(g);
      }
      const tints = [0xef4444, 0xa855f7, 0x22c55e, 0x3b82f6, 0xf97316, 0xeab308, 0x14b8a6, 0xec4899];
      slots.forEach((g, i) => {
        g.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mesh.material = mats.map((m) => {
              const mm = (m as THREE.MeshStandardMaterial).clone();
              if (i > 0 && mm.color && mm.color.getHSL({ h: 0, s: 0, l: 0 }).l > 0.25) {
                const hsl = mm.color.getHSL({ h: 0, s: 0, l: 0 });
                mm.color.setHSL(((hsl.h + tints[i] / 360) % 1), Math.max(hsl.s, 0.75), hsl.l);
              }
              return mm;
            });
          }
        });
      });
      T.current.glbKarts = slots;
    };
    kartFiles.forEach((f) => {
      gltfLoader.load(`${process.env.NEXT_PUBLIC_BASE_PATH}/models/karts/${f}.glb`, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        model.scale.setScalar(10 / Math.max(size.x, size.z, 0.001));
        const wrap = new THREE.Group();
        wrap.add(model);
        const box2 = new THREE.Box3().setFromObject(wrap);
        const ctr = new THREE.Vector3();
        box2.getCenter(ctr);
        model.position.set(-ctr.x, -box2.min.y, -ctr.z);
        glbModels[f] = wrap;
        glbDone++;
        if (glbDone === kartFiles.length) buildSlots();
      }, undefined, () => { glbDone++; if (glbDone === kartFiles.length) buildSlots(); });
    });

    const sparkGeo = new THREE.SphereGeometry(1.2, 6, 6);
    const sparks: { m: THREE.Mesh; life: number; vy: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const sm = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
      sm.visible = false; scene.add(sm);
      sparks.push({ m: sm, life: 0, vy: 0 });
    }
    T.current.sparks = sparks;
    T.current.spawnSpark = (x: number, z: number, color: string) => {
      const sp = sparks.find((s2) => s2.life <= 0);
      if (!sp) return;
      sp.life = 1; sp.vy = 14 + Math.random() * 10;
      sp.m.visible = true;
      sp.m.position.set(x, 1.5, z);
      sp.m.scale.setScalar(0.8 + Math.random() * 0.8);
      (sp.m.material as THREE.MeshBasicMaterial).color.set(color);
      (sp.m.material as THREE.MeshBasicMaterial).opacity = 0.9;
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);
    T.current.renderer = renderer;
    T.current.scene = scene;
    T.current.camera = camera;
    T.current.ready = true;
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      T.current.ready = false;
    };
    } catch (err) {
      console.error("[KartRace3D] init failed:", err);
      setFatal3D(err instanceof Error ? err.message : String(err));
    }
  }, [kartBody, kartAccent]);

  if (fatal3D) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0d22", color: "white", padding: 24, textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 22, color: "#FFD34D", margin: "0 0 12px" }}>Mode 3D tidak dapat dimuat</p>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 18px" }}>{fatal3D}</p>
          <button onClick={() => onComplete(0, 0, 8)} style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "white", fontFamily: "'Righteous', sans-serif", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>LEWATI & KEMBALI</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const s = S.current;
    s.x = 0; s.y = trackR(Math.PI / 2); s.h = Math.PI; s.v = 0;
    s.drifting = false; s.charge = 0; s.boost = 0; s.star = 0; s.spin = 0;
    s.coins = 0; s.quizScore = 0; s.correct = 0; s.lap = 0; s.prevT = Math.PI / 2; s.prog = 0;
    s.item = null; s.raceTime = 0; s.finished = false; s.paused = false; s.usedQ.clear();
    s.bananas = []; s.shells = [];
    s.ai = AI_COLORS.map((_, i) => ({
      a: Math.PI / 2 - (i + 1) * 0.085, lat: (i % 2 === 0 ? 1 : -1) * 13,
      baseLat: (i % 2 === 0 ? 1 : -1) * 13, phase: i * 1.7, v: 0, baseV: AI_BASE[i],
      spin: 0, prog: Math.PI / 2 - (i + 1) * 0.085, itemT: 8 + Math.random() * 10,
    }));
    s.coinsArr = [];
    for (let i = 0; i < 16; i++) s.coinsArr.push({ a: 0.28 + i * 0.392, lat: (i % 2 === 0 ? 1 : -1) * W * 0.22, taken: 0 });
    s.boxes = [];
    for (let i = 0; i < 8; i++) s.boxes.push({ a: 0.35 + i * 0.785, taken: 0 });
    s.pads = [{ a: 1.2 }, { a: 3.4 }, { a: 5.1 }];
    s.gates = [{ a: 2.25, cd: 0 }, { a: 5.35, cd: 0 }];
    T.current.coinMeshes.forEach((m) => { m.visible = true; });
    T.current.boxMeshes.forEach((m) => { m.visible = true; });
    setCoinCount(0); setQuizScore(0); setCorrectCount(0); setLap(0); setItem(null); setTimeLeft(RACE_TIME);
  }, []);

  const addPopup = useCallback((text: string, color: string) => {
    setPopupMsg({ text, color, key: Date.now() });
    setTimeout(() => setPopupMsg(null), 1400);
  }, []);

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
    setPhase("count"); setCdStep(3); sfxEvent("count");
  }, [sfxEvent]);

  useEffect(() => {
    if (phase !== "count") return;
    const s = S.current;
    let step = 3;
    const iv = setInterval(() => {
      step -= 1; setCdStep(step);
      if (step > 0) sfxEvent("count");
      if (step === 0) {
        sfxEvent("go");
        const gas = s.keys["arrowup"] || s.keys["w"] || s.touch.gas;
        if (gas) { s.boost = 55; sfxEvent("boost"); }
        s.started = true; setPhase("race"); clearInterval(iv);
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
    s.item = it; setItem(it); sfxEvent("box");
  }, [position, sfxEvent]);

  const useItem = useCallback(() => {
    const s = S.current;
    if (!s.item || s.spin > 0 || s.finished) return;
    const it = s.item; s.item = null; setItem(null);
    if (it === "mushroom") { s.boost = Math.max(s.boost, 60); sfxEvent("mushroom"); }
    else if (it === "banana") {
      s.bananas.push({ x: s.x - Math.cos(s.h) * 26, y: s.y - Math.sin(s.h) * 26, life: 2000 });
      sfxEvent("shell");
    } else if (it === "green" || it === "red") {
      s.shells.push({ x: s.x + Math.cos(s.h) * 22, y: s.y + Math.sin(s.h) * 22, vx: Math.cos(s.h) * 280, vy: Math.sin(s.h) * 280, kind: it, life: 5, bounces: 0 });
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
    setQuizIdx(idx); setQuizTimer(25); setQuizAnswered(false); setQuizSelected(-1); setQuizOpen(true);
  }, []);

  const answerQuiz = useCallback((opt: number) => {
    const s = S.current;
    if (quizAnswered) return;
    setQuizAnswered(true); setQuizSelected(opt);
    const c = CHALLENGES[quizIdx];
    if (opt < 0) {
      s.quizScore = Math.max(0, s.quizScore - 5); setQuizScore(s.quizScore);
      addPopup("WAKTU HABIS", "#f43f5e"); sfxEvent("wrong"); return;
    }
    const eff = c.choices[opt]?.consequence.gameEffect ?? "slowdown";
    const q = eff === "boost" ? "best" : eff === "neutral" ? "ok" : "poor";
    if (q === "best") {
      s.correct += 1; s.quizScore += 25; s.boost = Math.max(s.boost, 60);
      setCorrectCount(s.correct); setQuizScore(s.quizScore);
      addPopup(`${c.domain} +25`, "#22c55e"); sfxEvent("correct");
    } else if (q === "ok") {
      s.quizScore += 10; s.boost = Math.max(s.boost, 30); setQuizScore(s.quizScore);
      addPopup(`${c.domain} +10`, "#facc15"); sfxEvent("correct");
    } else {
      s.v *= 0.75; addPopup(`${c.domain}`, "#f43f5e"); sfxEvent("wrong");
    }
  }, [quizAnswered, quizIdx, addPopup, sfxEvent]);

  const continueQuiz = useCallback(() => {
    S.current.paused = false;
    S.current.v = Math.max(S.current.v, 30);
    setQuizOpen(false); setQuizAnswered(false); setQuizSelected(-1);
  }, []);

  useEffect(() => {
    if (!quizOpen || quizAnswered) return;
    if (quizTimer <= 0) { const t = setTimeout(() => answerQuiz(-1), 60); return () => clearTimeout(t); }
    const t = setTimeout(() => setQuizTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [quizOpen, quizAnswered, quizTimer, answerQuiz]);

  useEffect(() => {
    if (!quizOpen) return;
    const h = (e: KeyboardEvent) => {
      if (["1", "2", "3"].includes(e.key) && !quizAnswered && CHALLENGES[quizIdx].choices[parseInt(e.key) - 1]) { e.preventDefault(); answerQuiz(parseInt(e.key) - 1); }
      else if ((e.key === "Enter" || e.key === " ") && quizAnswered) { e.preventDefault(); continueQuiz(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [quizOpen, quizAnswered, quizIdx, answerQuiz, continueQuiz]);

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
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const s = S.current;
      const t3 = T.current;
      if (!t3.ready || !t3.renderer || !t3.camera || !t3.player) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (phase === "race" && s.started && !s.paused && !s.finished) {
        s.raceTime += dt;
        const remaining = RACE_TIME - s.raceTime;
        setTimeLeft(Math.max(0, Math.ceil(remaining)));
        if (remaining <= 0) finishRace();

        const k = s.keys;
        const tc = s.touch;
        const gas = !!(k["arrowup"] || k["w"] || tc.gas);
        const brake = !!(k["arrowdown"] || k["s"] || tc.brake);
        const left = !!(k["arrowleft"] || k["a"] || tc.left);
        const right = !!(k["arrowright"] || k["d"] || tc.right);
        const driftKey = !!(k[" "] || k["z"] || tc.drift);
        const steer = (left ? -1 : 0) + (right ? 1 : 0);
        s.steerVis = s.steerVis * 0.85 + steer * 0.15;

        const maxV = (MAXBASE + s.coins * 1.5) * (s.star > 0 ? 1.22 : 1);
        if (s.boost > 0) s.boost -= 60 * dt;
        if (s.star > 0) s.star -= 60 * dt;
        if (s.shake > 0) s.shake -= 1;
        if (s.hop > 0) s.hop -= 60 * dt;
        const boosting = s.boost > 0;
        const cap = boosting ? 215 : maxV;

        if (s.spin > 0) {
          s.spin -= dt; s.v = Math.max(0, s.v - 200 * dt); s.drifting = false; s.charge = 0;
        } else {
          if (gas) s.v = Math.min(cap, s.v + (boosting ? 360 : 170) * dt);
          else s.v -= s.v * 0.9 * dt;
          if (brake) s.v = Math.max(0, s.v - 300 * dt);
          const canSteer = 0.3 + 0.7 * Math.min(s.v / MAXBASE, 1);
          const turnRate = 1.9 * canSteer;
          if (driftKey && !s.drifting && steer !== 0 && s.v > 70) {
            s.drifting = true; s.driftDir = steer > 0 ? 1 : -1; s.hop = 0.22;
          }
          if (s.drifting) {
            if (!driftKey || s.v < 45) {
              const c = s.charge;
              if (c > 2.6) { s.boost = Math.max(s.boost, 95); sfxEvent("boost"); }
              else if (c > 1.7) { s.boost = Math.max(s.boost, 65); sfxEvent("boost"); }
              else if (c > 0.85) { s.boost = Math.max(s.boost, 42); }
              s.drifting = false; s.charge = 0;
            } else {
              s.charge += dt;
              s.h += s.driftDir * turnRate * (0.75 + 0.45 * steer * s.driftDir) * dt * 1.55;
              s.x += -Math.sin(s.h) * s.driftDir * s.v * 0.22 * dt;
              s.y += Math.cos(s.h) * s.driftDir * s.v * 0.22 * dt;
              const tier = s.charge > 2.6 ? "#d78cff" : s.charge > 1.7 ? "#ffb347" : "#57c7ff";
              if (Math.random() < 0.7 && t3.spawnSpark) {
                t3.spawnSpark(s.x - Math.cos(s.h) * 10 + (Math.random() - 0.5) * 6, s.y - Math.sin(s.h) * 10 + (Math.random() - 0.5) * 6, tier);
              }
            }
          } else {
            s.h += steer * turnRate * dt;
          }
          s.x += Math.cos(s.h) * s.v * dt;
          s.y += Math.sin(s.h) * s.v * dt;

          const pAng = Math.atan2(s.y, s.x);
          const trC = trackR(pAng);
          const dist = Math.hypot(s.x, s.y);
          const offroad = dist > trC + W / 2 || dist < trC - W / 2;
          if (offroad) {
            if (s.v > 62) s.v = Math.max(62, s.v - 260 * dt);
            if (Math.random() < 0.5 && t3.spawnSpark) t3.spawnSpark(s.x + (Math.random() - 0.5) * 10, s.y + (Math.random() - 0.5) * 10, "#7a5a3a");
          }
          if (dist > trC + W / 2 + 22) {
            const a = Math.atan2(s.y, s.x);
            s.x = Math.cos(a) * (trC + W / 2 + 22); s.y = Math.sin(a) * (trC + W / 2 + 22);
            s.v *= 0.45; s.shake = 6; sfxEvent("bump");
          }
          if (dist < trC - W / 2 - 22) {
            const a = Math.atan2(s.y, s.x);
            s.x = Math.cos(a) * (trC - W / 2 - 22); s.y = Math.sin(a) * (trC - W / 2 - 22);
            s.v *= 0.45; s.shake = 6; sfxEvent("bump");
          }
          for (const pad of s.pads) {
            if (angDiff(Math.atan2(s.y, s.x), pad.a) < 0.045 && dist > trC - W / 2 && dist < trC + W / 2) {
              if (s.boost < 40) sfxEvent("boost");
              s.boost = Math.max(s.boost, 50);
            }
          }
          for (let i = 0; i < s.coinsArr.length; i++) {
            const cn = s.coinsArr[i];
            if (cn.taken > 0) { cn.taken--; continue; }
            const cx2 = Math.cos(cn.a) * (trackR(cn.a) + cn.lat), cy2 = Math.sin(cn.a) * (trackR(cn.a) + cn.lat);
            if (Math.hypot(cx2 - s.x, cy2 - s.y) < 14) {
              cn.taken = 900;
              if (s.coins < 10) s.coins += 1;
              setCoinCount(s.coins);
              addPopup("+15", "#FFD34D");
              sfxEvent("coin");
            }
          }
          for (let i = 0; i < s.boxes.length; i++) {
            const bx = s.boxes[i];
            if (bx.taken > 0) { bx.taken--; continue; }
            const bx2 = Math.cos(bx.a) * trackR(bx.a), by2 = Math.sin(bx.a) * trackR(bx.a);
            if (Math.hypot(bx2 - s.x, by2 - s.y) < 16) { bx.taken = 300; giveItem(); }
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
              addPopup("Terpeleset!", "#f43f5e");
              s.shake = 8; sfxEvent("hit");
            }
          }
          for (let i = s.shells.length - 1; i >= 0; i--) {
            const sh = s.shells[i];
            sh.life -= dt;
            if (sh.life <= 0) { s.shells.splice(i, 1); continue; }
            sh.x += sh.vx * dt; sh.y += sh.vy * dt;
            const sd = Math.hypot(sh.x, sh.y);
            const shA = Math.atan2(sh.y, sh.x);
            const shTr = trackR(shA);
            const shInner = shTr - W / 2 + 5, shOuter = shTr + W / 2 - 5;
            if (sd > shOuter || sd < shInner) {
              const nx = sh.x / sd, ny = sh.y / sd;
              const vn = sh.vx * nx + sh.vy * ny;
              sh.vx -= 2 * vn * nx; sh.vy -= 2 * vn * ny;
              const lim = sd > shOuter ? shOuter - 1 : shInner + 1;
              sh.x = lim * nx;
              sh.y = lim * ny;
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
                if (ai.spin <= 0) { ai.spin = 1.2; addPopup("+40", "#22d3ee"); s.quizScore += 40; setQuizScore(s.quizScore); }
                s.shells.splice(i, 1);
                break;
              }
            }
          }
          const curT = Math.atan2(s.y, s.x);
          let dT = curT - s.prevT;
          if (dT > Math.PI) dT -= Math.PI * 2;
          if (dT < -Math.PI) dT += Math.PI * 2;
          s.prog += dT;
          if (s.prevT < Math.PI / 2 && curT >= Math.PI / 2 && dT > 0 && dT < 0.5 && s.v > 20) {
            s.lap += 1; setLap(s.lap); sfxEvent("lap");
            if (s.lap >= 3) finishRace();
          }
          s.prevT = curT;
          let rank = 1;
          for (const ai of s.ai) { if (ai.prog > s.prog) rank++; }
          setPosition(rank);
          for (const gate of s.gates) {
            if (gate.cd > 0) { gate.cd--; continue; }
            if (angDiff(curT, gate.a) < 0.05 && dist > RI && dist < RO) { gate.cd = 480; openQuiz(); break; }
          }
        }

        for (const ai of s.ai) {
          if (ai.spin > 0) { ai.spin -= dt; ai.v = Math.max(0, ai.v - 200 * dt); }
          else {
            const rubber = Math.max(0.9, Math.min(1.12, 1 + (s.prog - ai.prog) * 0.18));
            const target = ai.baseV * rubber * (ai.itemT < 60 ? 1.3 : 1);
            ai.v = Math.min(target, ai.v + 130 * dt);
            if (ai.itemT === 60 && Math.random() < 0.5) {
              s.bananas.push({ x: Math.cos(ai.a) * (R + ai.lat) - Math.sin(ai.a) * 20, y: Math.sin(ai.a) * (R + ai.lat) + Math.cos(ai.a) * 20, life: 1600 });
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
            if (s.star > 0 && ai.spin <= 0) { ai.spin = 1.2; addPopup("+40", "#22d3ee"); s.quizScore += 40; setQuizScore(s.quizScore); }
            else if (s.spin <= 0) { s.v *= 0.82; ai.v *= 0.82; }
          }
        }

        const freq = 65 + (s.v / MAXBASE) * 130 + (s.boost > 0 ? 50 : 0);
        s.audio.engine(freq, 0.045);
      } else if (phase !== "race") {
        s.audio.engine(60, 0);
      }

      // ── SYNC 3D ──
      const px = s.x, pz = s.y;
      const rotY = Math.PI / 2 - s.h;
      const pBaseY = trackY(Math.atan2(pz, px));
      if (t3.player) {
        t3.player.position.set(px, pBaseY + (s.hop > 0 ? s.hop * 30 : 0), pz);
        t3.player.rotation.y = rotY + (s.spin > 0 ? now * 0.02 : 0);
        t3.player.rotation.z = -s.steerVis * 0.08;
        if (t3.flames) {
          const show = s.boost > 0;
          t3.flames.forEach((f) => {
            f.visible = show;
            if (show) f.scale.setScalar(0.7 + Math.random() * 0.7);
          });
        }
        if (s.star > 0) {
          t3.player.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) {
              const mm = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (mm && mm.emissive) { mm.emissive.setHSL((now * 0.0004) % 1, 0.9, 0.35); mm.emissiveIntensity = 0.5; }
            }
          });
        }
      }
      t3.aiMeshes.forEach((m, i) => {
        const ai = s.ai[i];
        if (!ai) return;
        m.position.set(Math.cos(ai.a) * (trackR(ai.a) + ai.lat), trackY(ai.a), Math.sin(ai.a) * (trackR(ai.a) + ai.lat));
        m.rotation.y = Math.PI / 2 - ai.a + (ai.spin > 0 ? now * 0.02 : 0);
      });
      t3.coinMeshes.forEach((m, i) => {
        const cn = s.coinsArr[i];
        if (!cn) return;
        m.visible = cn.taken <= 0;
        m.rotation.y = now * 0.003 + i;
        m.position.y = trackY(cn.a) + 6 + Math.sin(now * 0.004 + i) * 1.2;
      });
      t3.boxMeshes.forEach((m, i) => {
        const bx = s.boxes[i];
        if (!bx) return;
        m.visible = bx.taken <= 0;
        m.rotation.y = now * 0.0015 + i;
        m.rotation.x = now * 0.001 + i;
        m.position.y = trackY(bx.a) + 9 + Math.sin(now * 0.003 + i) * 1.5;
      });
      t3.gateMeshes.forEach((m, i) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.4 + Math.sin(now * 0.005 + i * 2) * 0.3;
        m.rotation.z = now * 0.0008;
      });
      if (t3.balloons) t3.balloons.forEach((b, i) => { b.position.y = 55 + Math.sin(now * 0.0008 + i * 2) * 5; });
      t3.sparks.forEach((sp) => {
        if (sp.life <= 0) return;
        sp.life -= dt * 2.4;
        if (sp.life <= 0) { sp.m.visible = false; return; }
        sp.m.position.y += sp.vy * dt;
        sp.vy -= 40 * dt;
        (sp.m.material as THREE.MeshBasicMaterial).opacity = sp.life * 0.9;
      });

      if (t3.glbKarts.length === 8) {
        t3.glbKarts[0].visible = false;
        for (let i = 1; i < 8; i++) {
          const proc = t3.aiMeshes[i - 1];
          const g = t3.glbKarts[i];
          if (!g || !proc) continue;
          proc.visible = false;
          g.visible = true;
          g.position.copy(proc.position);
          g.rotation.y = proc.rotation.y;
          g.rotation.z = proc.rotation.z;
        }
        if (t3.player) t3.player.visible = true;
      }

      // Camera: spring chase + FOV boost + roll
      const dirX = Math.cos(s.h), dirZ = Math.sin(s.h);
      const shake = s.shake > 0 ? s.shake : 0;
      const targetPos = new THREE.Vector3(
        px - dirX * CAMD + (Math.random() - 0.5) * shake,
        pBaseY + CAMH + (s.hop > 0 ? s.hop * 20 : 0),
        pz - dirZ * CAMD + (Math.random() - 0.5) * shake
      );
      const targetLook = new THREE.Vector3(px + dirX * 20, pBaseY + 8, pz + dirZ * 20);
      const lerpK = 1 - Math.exp(-dt * 8);
      s.camPos.lerp(targetPos, lerpK);
      const toCam = new THREE.Vector3(s.camPos.x - px, 0, s.camPos.z - pz);
      const camDist = toCam.length();
      if (camDist < CAMD * 0.55) { toCam.multiplyScalar((CAMD * 0.55) / Math.max(camDist, 0.001)); s.camPos.x = px + toCam.x; s.camPos.z = pz + toCam.z; }
      s.camLook.lerp(targetLook, lerpK);
      t3.camera.position.copy(s.camPos);
      t3.camera.up.set(Math.sin(-s.steerVis * 0.05) * 0.3, 1, 0).normalize();
      t3.camera.lookAt(s.camLook);
      const targetFov = s.boost > 0 ? 76 : 62;
      s.fov += (targetFov - s.fov) * Math.min(1, dt * 6);
      if (Math.abs(t3.camera.fov - s.fov) > 0.05) { t3.camera.fov = s.fov; t3.camera.updateProjectionMatrix(); }

      // Minimap
      const mini = miniRef.current;
      if (mini) {
        const mx = mini.getContext("2d")!;
        const ms = mini.width;
        mx.clearRect(0, 0, ms, ms);
        mx.fillStyle = "rgba(10,14,40,0.75)";
        mx.beginPath();
        mx.roundRect(0, 0, ms, ms, 12);
        mx.fill();
        const mr = ms / 2 - 10;
        const cx0 = ms / 2, cy0 = ms / 2;
        mx.beginPath();
        mx.arc(cx0, cy0, mr, 0, Math.PI * 2);
        mx.strokeStyle = "#8b93b8";
        mx.lineWidth = ((RO - RI) / R) * mr;
        mx.stroke();
        for (const ai of s.ai) {
          mx.beginPath();
          mx.arc(cx0 + Math.cos(ai.a) * mr, cy0 + Math.sin(ai.a) * mr, 3, 0, Math.PI * 2);
          mx.fillStyle = AI_COLORS[s.ai.indexOf(ai)];
          mx.fill();
        }
        const pt = Math.atan2(s.y, s.x);
        mx.beginPath();
        mx.arc(cx0 + Math.cos(pt) * mr, cy0 + Math.sin(pt) * mr, 5, 0, Math.PI * 2);
        mx.fillStyle = "#FFD34D"; mx.strokeStyle = "#1c1f2b"; mx.lineWidth = 2;
        mx.fill(); mx.stroke();
      }

      t3.renderer.render(t3.scene!, t3.camera);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, finishRace, giveItem, openQuiz, addPopup, sfxEvent]);

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
  const ch = CHALLENGES[quizIdx];

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", touchAction: "none", background: "#6ec6ff" }}>
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

          <canvas ref={miniRef} width={110} height={110} style={{ position: "absolute", top: "calc(74px + env(safe-area-inset-top, 0px))", right: 14, zIndex: 29, pointerEvents: "none", width: "clamp(84px, 14vmin, 116px)", height: "clamp(84px, 14vmin, 116px)" }} />

          <div style={{ position: "absolute", right: 14, bottom: "calc(14px + env(safe-area-inset-bottom, 0px))", zIndex: 30, pointerEvents: "none", textAlign: "right" }}>
            <div style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(54px, 13vmin, 110px)", lineHeight: 0.9, color: POS_COLORS[Math.min(position - 1, 7)], WebkitTextStroke: "3px #1c1f2b", textShadow: "4px 4px 0 rgba(0,0,0,0.35)" }}>
              {position}<span style={{ fontSize: "0.45em" }}>{posSuffix(position)}</span>
            </div>
          </div>

          {popupMsg && (
            <div key={popupMsg.key} style={{ position: "absolute", left: "50%", top: "38%", transform: "translateX(-50%)", zIndex: 40, pointerEvents: "none", animation: "popupFloat 1.4s ease both" }}>
              <span style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(22px, 4.5vmin, 36px)", color: popupMsg.color, WebkitTextStroke: "2px #1c1f2b", textShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>
                {popupMsg.text}
              </span>
            </div>
          )}

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
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,12,30,0.88)", backdropFilter: "blur(10px)", zIndex: 200, padding: 16 }}>
          <div style={{ padding: "clamp(20px,4vmin,32px) clamp(20px,4vmin,36px)", borderRadius: 24, background: "rgba(22,24,54,0.96)", border: "2px solid rgba(255,211,77,0.45)", maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto", textAlign: "center" }}>
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(24px,5vmin,34px)", fontWeight: 900, color: "#FFD34D", margin: "0 0 4px", textShadow: "3px 3px 0 #1c1f2b" }}>
              🏁 GRAND PRIX BAHASA
            </p>
            <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(12px,2.4vmin,15px)", color: "rgba(255,255,255,0.55)", margin: "0 0 18px" }}>
              Language Kart · Sirkuit Prima · 3D
            </p>
            <div style={{ display: "grid", gap: 10, textAlign: "left", marginBottom: 16 }}>
              {[
                ["🏆", "Tujuan", "Selesaikan tiga putaran melawan tujuh pembalap lain dan raih posisi terbaik."],
                ["🪙", "Koin Kata Baku", "Kumpulkan koin di sirkuit. Setiap koin menambah kecepatan tertinggi dan nilai akhir."],
                ["🎁", "Kotak Item", "Jamur Kilat, Pisang, Cangkang Hijau, Cangkang Merah, dan Bintang. Gunakan dengan X atau tombol item."],
                ["❓", "Gerbang Tantangan", "Lewati cincin emas untuk menghadapi masalah berbahasa. Jawaban paling tepat memberi dorongan penuh."],
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
              {isTouch ? "Layar sentuh: tombol kiri/kanan setir, GAS melaju, DRIFT belokan tajam." : "Papan ketik: W/↑ gas · S/↓ rem · A/D atau ←/→ setir · Spasi drift · X item"}
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

      {quizOpen && ch && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,10,26,0.86)", backdropFilter: "blur(10px)", zIndex: 300, padding: 14 }}>
          <div style={{ padding: "clamp(18px,3.5vmin,28px) clamp(18px,3.5vmin,32px)", borderRadius: 20, background: "rgba(24,26,58,0.97)", border: "2px solid rgba(250,204,21,0.5)", maxWidth: 600, width: "100%", maxHeight: "92vh", overflowY: "auto", animation: "popIn 0.3s both" }}>
            {/* Timer Bar */}
            <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 16 }}>
              <div style={{ width: `${(quizTimer / 25) * 100}%`, height: "100%", borderRadius: 3, background: quizTimer <= 6 ? "#ef4444" : "#facc15", transition: "width 1s linear" }} />
            </div>

            {/* Character Card */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Righteous', sans-serif", fontSize: 18, color: "white", fontWeight: 700, boxShadow: "0 2px 12px rgba(124,58,237,0.4)" }}>
                {ch.chapter === 1 ? "NA" : ch.chapter === 2 ? "RG" : ch.chapter === 3 ? "KI" : ch.chapter === 4 ? "BI" : "AL"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 14, color: "white", margin: "0 0 2px" }}>
                  {ch.chapter === 1 ? "Nara" : ch.chapter === 2 ? "Raga" : ch.chapter === 3 ? "Kira" : ch.chapter === 4 ? "Bimo" : "Alya"}
                </p>
                <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11.5, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.4 }}>
                  {ch.chapter === 1 ? "Tenang, suka nanya kenapa" : ch.chapter === 2 ? "Cepat ngegas ikut tren" : ch.chapter === 3 ? "Kreator, peduli audiens" : ch.chapter === 4 ? "Pecinta budaya" : "Praktis, tau kapan formal"}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 18, color: quizTimer <= 6 ? "#ef4444" : "#facc15" }}>{quizTimer}s</span>
              </div>
            </div>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13, color: "#facc15", letterSpacing: "0.06em" }}>GERBANG TANTANGAN</span>
                <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 9, letterSpacing: "0.12em", color: "#0b0d22", background: "#facc15", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{ch.domain.replace(/-/g, " ").toUpperCase()}</span>
              </div>
            </div>

            {/* Question */}
            <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "clamp(15px,2.8vmin,19px)", color: "white", margin: "0 0 18px", lineHeight: 1.45 }}>{ch.context}</p>

            {/* Choices */}
            <div style={{ display: "grid", gap: 9 }}>
              {ch.choices.map((opt, i) => {
                let bg = "rgba(255,255,255,0.06)";
                let border = "rgba(255,255,255,0.12)";
                let txt = "rgba(255,255,255,0.88)";
                if (quizAnswered) {
                  const selQ = quizSelected >= 0 ? ch.choices[quizSelected]?.consequence.gameEffect : null;
                  if (i === quizSelected) {
                    if (selQ === "boost") { bg = "rgba(34,197,94,0.18)"; border = "#22c55e"; txt = "#4ade80"; }
                    else if (selQ === "neutral") { bg = "rgba(250,204,21,0.14)"; border = "#facc15"; txt = "#fde047"; }
                    else { bg = "rgba(239,68,68,0.16)"; border = "#ef4444"; txt = "#f87171"; }
                  } else if (opt.consequence.gameEffect === "boost") { bg = "rgba(34,197,94,0.1)"; border = "rgba(34,197,94,0.5)"; txt = "#86efac"; }
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

            {/* Feedback */}
            {quizAnswered && quizSelected >= 0 && (
              <>
                <div style={{ marginTop: 15, padding: "13px 16px", borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.4)" }}>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>HASIL</p>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13.5, color: "white", margin: "0 0 8px", lineHeight: 1.45 }}>
                    {ch.choices[quizSelected]?.consequence.gameEffect === "boost"
                      ? "Keputusanmu bekerja dengan baik di konteks ini."
                      : ch.choices[quizSelected]?.consequence.gameEffect === "neutral"
                        ? "Pesan sampai — dengan satu hal yang layak dicermati."
                        : "Terkirim, tapi efeknya berbeda dari yang mungkin kamu niatkan."}
                  </p>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>MENGAPA BEGITU</p>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{ch.choices[quizSelected]?.consequence.feedback}</p>
                </div>
                <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 12, background: "rgba(250,204,21,0.07)", border: "1px dashed rgba(250,204,21,0.45)" }}>
                  <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#facc15", margin: "0 0 5px" }}>COBA PIKIR LAGI</p>
                  <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>{ch.reflectiveQuestion}</p>
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

      <style>{`@keyframes popIn{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}} @keyframes popupFloat{0%{opacity:0;transform:translateX(-50%) translateY(16px) scale(0.8)}15%{opacity:1;transform:translateX(-50%) translateY(0) scale(1.1)}25%{transform:translateX(-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-30px)}}`}</style>
    </div>
  );
}
