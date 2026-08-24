"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GOOD = ["makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar", "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik", "gotong royong", "sopan"];
const BAD = ["hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you", "so fun", "nope", "whatever"];

interface Token { x: number; y: number; word: string; good: boolean; taken: boolean; respawn: number; z: number; bobPhase: number; }
interface AIKart { angle: number; speed: number; color: string; glow: string; lap: number; crossed: boolean; bobPhase: number; }
interface Particle { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number; color: string; size: number; }
interface Popup { x: number; y: number; z: number; text: string; color: string; life: number; }
interface Star { x: number; y: number; r: number; b: number; layer: number; }

function sfx(type: string) {
  try {
    const c = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination); g.gain.value = 0.06;
    if (type === "pickup") { o.type = "sine"; o.frequency.setValueAtTime(880, c.currentTime); o.frequency.exponentialRampToValueAtTime(1760, c.currentTime + 0.08); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15); o.start(); o.stop(c.currentTime + 0.15); }
    else if (type === "crash") { o.type = "sawtooth"; o.frequency.setValueAtTime(200, c.currentTime); o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.2); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25); o.start(); o.stop(c.currentTime + 0.25); }
    else if (type === "tick") { o.type = "square"; o.frequency.value = 1200; g.gain.value = 0.03; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06); o.start(); o.stop(c.currentTime + 0.06); }
    else if (type === "go") { o.type = "sine"; o.frequency.setValueAtTime(523, c.currentTime); o.frequency.setValueAtTime(659, c.currentTime + 0.12); o.frequency.setValueAtTime(784, c.currentTime + 0.24); g.gain.value = 0.08; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4); o.start(); o.stop(c.currentTime + 0.4); }
    else if (type === "lap") { o.type = "sine"; o.frequency.setValueAtTime(660, c.currentTime); o.frequency.setValueAtTime(880, c.currentTime + 0.1); g.gain.value = 0.07; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25); o.start(); o.stop(c.currentTime + 0.25); }
  } catch {}
}

// 3D projection: isometric-ish view
function project(x3: number, y3: number, z3: number, cx: number, cy: number, scale: number, camAngle: number, tiltX: number) {
  const cosA = Math.cos(camAngle);
  const sinA = Math.sin(camAngle);
  const rx = x3 * cosA - y3 * sinA;
  const ry = x3 * sinA + y3 * cosA;
  const px = cx + rx * scale;
  const py = cy + ry * scale * 0.45 - z3 * scale * 0.8 + tiltX * 30;
  const depth = ry;
  return { px, py, depth, scale: scale * (1 - depth * 0.0003) };
}

export default function KartRace3D({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#a855f7",
}: {
  onComplete: (score: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [position, setPosition] = useState(1);
  const [lap, setLap] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [drifting, setDrifting] = useState(false);
  const [over, setOver] = useState(false);
  const [cd, setCd] = useState(3);

  const S = useRef({
    px: 0, py: 0, pa: 0, pv: 0, pz: 0,
    tokens: [] as Token[], ai: [] as AIKart[],
    particles: [] as Particle[], popups: [] as Popup[],
    keys: {} as Record<string, boolean>,
    score: 0, time: 60, lap: 0, over: false,
    lastAngle: 0, crossedStart: false,
    cx: 0, cy: 0, trackR: 0, trackW: 0, scale: 1,
    cdVal: 3, cdTime: 0, started: false,
    stars: [] as Star[],
    camAngle: 0, camTilt: 0,
    boostTimer: 0,
  });

  const touch = useRef({ steerX: 0, gas: false, brake: false, active: false, sx: 0, sy: 0 });

  useEffect(() => {
    const obs = new ResizeObserver(e => { for (const en of e) setDims({ w: en.contentRect.width, h: en.contentRect.height }); });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const s = S.current;
    const w = dims.w, h = dims.h;
    s.cx = w / 2;
    s.cy = h * 0.55;
    s.trackR = Math.min(w, h) * 0.32;
    s.trackW = Math.min(w, h) * 0.12;
    s.scale = Math.min(w / 900, h / 600) * 1.1;
    s.px = 0;
    s.py = s.trackR;
    s.pa = Math.PI;
    s.camAngle = 0;

    s.stars = [];
    for (let i = 0; i < 120; i++) {
      s.stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.5,
        r: Math.random() * 2 + 0.2,
        b: Math.random() * Math.PI * 2,
        layer: Math.floor(Math.random() * 3),
      });
    }

    s.tokens = [];
    const cnt = 16;
    for (let i = 0; i < cnt; i++) {
      const a = (i / cnt) * Math.PI * 2;
      const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.5;
      const good = i < 12;
      s.tokens.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        word: good ? GOOD[i % GOOD.length] : BAD[(i - 12) % BAD.length],
        good, taken: false, respawn: 0, z: 0, bobPhase: Math.random() * Math.PI * 2,
      });
    }

    s.ai = [
      { angle: 0, speed: 0.013, color: "#a855f7", glow: "#c084fc", lap: 0, crossed: false, bobPhase: 0 },
      { angle: Math.PI * 2 / 3, speed: 0.011, color: "#22c55e", glow: "#4ade80", lap: 0, crossed: false, bobPhase: 1 },
      { angle: Math.PI * 4 / 3, speed: 0.015, color: "#f97316", glow: "#fb923c", lap: 0, crossed: false, bobPhase: 2 },
    ];
  }, [dims]);

  useEffect(() => {
    const s = S.current;
    const ek = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      s.keys[e.key.toLowerCase()] = true;
    };
    const eu = (e: KeyboardEvent) => { s.keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);

    s.cdVal = 3; s.cdTime = Date.now(); s.over = false; s.score = 0; s.time = 60; s.lap = 0;

    const timer = setInterval(() => {
      if (s.over) return;
      const el = Date.now() - s.cdTime;
      const v = 3 - Math.floor(el / 1000);
      if (v !== s.cdVal && v >= 0) {
        s.cdVal = v; setCd(v);
        if (v > 0) sfx("tick");
        if (v === 0) { sfx("go"); s.started = true; setTimeout(() => { s.cdVal = -1; setCd(-1); }, 800); }
      }
      if (s.started && el > 4000) {
        s.time--; setTime(s.time);
        if (s.time <= 10 && s.time > 0) sfx("tick");
        if (s.time <= 0) { s.over = true; setOver(true); onComplete(s.score); }
      }
    }, 1000);

    let lt = performance.now();
    const loop = (now: number) => {
      if (s.over) { draw(s, now); return; }
      const dt = Math.min(now - lt, 32); lt = now;

      if (!s.started) { draw(s, now); requestAnimationFrame(loop); return; }

      const k = s.keys;
      const tc = touch.current;
      const hasT = tc.active;

      const gas = k["arrowup"] || k["w"] || (hasT && tc.gas);
      const brake = k["arrowdown"] || k["s"] || (hasT && tc.brake);
      const steer = ((k["arrowleft"] || k["a"] ? 1 : 0) - (k["arrowright"] || k["d"] ? 1 : 0)) + (hasT ? tc.steerX : 0);

      if (gas) s.pv += 0.17;
      if (brake) s.pv -= 0.23;
      s.pa += steer * 0.05;

      const isDrift = !!k[" "];
      setDrifting(isDrift);
      s.pv *= isDrift ? 0.925 : 0.968;
      if (s.pv > 0.9) s.pv = 0.9;
      if (s.pv < -0.32) s.pv = -0.32;
      if (Math.abs(s.pv) < 0.004) s.pv = 0;

      s.px += Math.sin(s.pa) * s.pv * dt * 0.35;
      s.py += -Math.cos(s.pa) * s.pv * dt * 0.35;

      // Boost effect
      if (s.boostTimer > 0) { s.boostTimer--; s.pv *= 1.01; }

      // Track bounds
      const dx = s.px, dy = s.py - s.trackR;
      const dist = Math.sqrt(s.px * s.px + (s.py) * (s.py));
      const dTrack = Math.abs(dist - s.trackR);
      if (dTrack > s.trackW / 2 + 8) {
        const a = Math.atan2(s.py, s.px);
        const target = s.trackR + (dist > s.trackR ? s.trackW / 2 + 6 : -(s.trackW / 2 + 6));
        s.px = Math.cos(a) * target;
        s.py = Math.sin(a) * target;
        s.pv *= 0.2;
        sfx("crash");
        for (let i = 0; i < 12; i++) {
          s.particles.push({ x: s.px, y: s.py, z: 5, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, vz: Math.random() * 4, life: 25, maxLife: 25, color: "#f97316", size: Math.random() * 3 + 1.5 });
        }
      }

      // Player Z bounce
      s.pz = Math.max(0, s.pz - 0.3);
      if (dTrack > s.trackW / 2 - 5 && dTrack < s.trackW / 2 + 5) s.pz = Math.sin(now * 0.01) * 2;

      // Camera follow player angle
      s.camAngle = lerp(s.camAngle, s.pa * 0.15, 0.03);
      s.camTilt = lerp(s.camTilt, steer * 0.5, 0.08);

      // Lap
      const curA = Math.atan2(s.py, s.px);
      const norm = curA < 0 ? curA + Math.PI * 2 : curA;
      if (norm < 0.3 && s.lastAngle > Math.PI * 2 - 0.3 && !s.crossedStart) {
        s.crossedStart = true;
        if (s.pv > 0.05) {
          s.lap++; setLap(s.lap); sfx("lap");
          if (s.lap >= 3) { s.over = true; setOver(true); onComplete(s.score); }
        }
      } else if (norm > Math.PI) s.crossedStart = false;
      s.lastAngle = norm;

      // Tokens
      for (let i = 0; i < s.tokens.length; i++) {
        const t = s.tokens[i];
        if (t.taken) { if (t.respawn > 0) { t.respawn--; continue; } const a = Math.random() * Math.PI * 2; const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.5; t.x = Math.cos(a) * r; t.y = Math.sin(a) * r; t.word = t.good ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)]; t.taken = false; t.z = 0; continue; }
        t.z = Math.sin(now * 0.003 + t.bobPhase) * 3 + 5;
        const td = Math.hypot(t.x - s.px, t.y - s.py);
        if (td < 28) {
          t.taken = true; t.respawn = 160;
          if (t.good) {
            s.score += 10; s.boostTimer = 20; sfx("pickup");
            s.popups.push({ x: t.x, y: t.y, z: 20, text: "+10 " + t.word, color: "#22d3ee", life: 55 });
            for (let j = 0; j < 10; j++) s.particles.push({ x: t.x, y: t.y, z: t.z, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 3 + 1, life: 30, maxLife: 30, color: "#22d3ee", size: Math.random() * 3 + 1 });
          } else {
            s.score = Math.max(0, s.score - 6); s.pv *= 0.3; sfx("crash");
            s.popups.push({ x: t.x, y: t.y, z: 20, text: "-6 " + t.word, color: "#f43f5e", life: 55 });
            for (let j = 0; j < 10; j++) s.particles.push({ x: t.x, y: t.y, z: t.z, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 3 + 1, life: 30, maxLife: 30, color: "#f43f5e", size: Math.random() * 3 + 1 });
          }
          setScore(s.score);
        }
      }

      // AI
      for (const ai of s.ai) {
        ai.angle += ai.speed * (1 + Math.sin(now * 0.0003 + ai.bobPhase * 5) * 0.15);
        if (ai.angle > Math.PI * 2) ai.angle -= Math.PI * 2;
        if (ai.angle < 0.3 && !ai.crossed) { ai.crossed = true; ai.lap++; }
        else if (ai.angle > Math.PI) ai.crossed = false;
      }

      // Particles
      if (isDrift && Math.abs(s.pv) > 0.3) {
        for (let i = 0; i < 2; i++) {
          s.particles.push({
            x: s.px - Math.sin(s.pa) * 10 + (Math.random() - 0.5) * 6,
            y: s.py + Math.cos(s.pa) * 10 + (Math.random() - 0.5) * 6,
            z: 2, vx: -Math.sin(s.pa) * s.pv * 0.4, vy: Math.cos(s.pa) * s.pv * 0.4, vz: 0.5,
            life: 18, maxLife: 18, color: "rgba(168,85,247,0.7)", size: Math.random() * 2.5 + 1,
          });
        }
      }
      if (Math.abs(s.pv) > 0.5) {
        s.particles.push({ x: s.px - Math.sin(s.pa) * 12, y: s.py + Math.cos(s.pa) * 12, z: 1, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, vz: 0, life: 12, maxLife: 12, color: "rgba(255,255,255,0.25)", size: 1 });
      }

      s.particles = s.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.z += p.vz; p.vz -= 0.12; if (p.z < 0) { p.z = 0; p.vz *= -0.3; } p.life--; return p.life > 0; });
      s.popups = s.popups.filter(p => { p.z += 0.3; p.life--; return p.life > 0; });

      // Position
      const pProg = s.lap * 1000 + norm * 100;
      let pos = 1;
      for (const ai of s.ai) { if (ai.lap * 1000 + ai.angle * 100 > pProg) pos++; }
      setPosition(pos);
      setSpeed(Math.abs(s.pv));

      draw(s, now);
      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => { window.removeEventListener("keydown", ek); window.removeEventListener("keyup", eu); clearInterval(timer); cancelAnimationFrame(id); };
  }, [dims, onComplete]);

  const draw = (s: typeof S.current, now: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = dims.w, h = dims.h;

    // === SKY ===
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#050510");
    sky.addColorStop(0.3, "#0a0a2e");
    sky.addColorStop(0.6, "#0f0a30");
    sky.addColorStop(1, "#1a0825");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Nebula layers
    for (let i = 0; i < 3; i++) {
      const nx = w * (0.2 + i * 0.3);
      const ny = h * (0.15 + i * 0.15);
      const neb = ctx.createRadialGradient(nx, ny, 0, nx, ny, w * 0.3);
      const colors = ["rgba(124,58,237,0.06)", "rgba(168,85,247,0.05)", "rgba(192,132,252,0.04)"];
      neb.addColorStop(0, colors[i]);
      neb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);
    }

    // Stars parallax layers
    for (let layer = 0; layer < 3; layer++) {
      const parallax = (layer + 1) * 0.3;
      const scrollX = s.camAngle * 50 * parallax;
      for (const star of s.stars) {
        if (star.layer !== layer) continue;
        const twinkle = 0.3 + 0.7 * Math.sin(now * 0.001 + star.b * 8);
        const sx = ((star.x - scrollX) % w + w) % w;
        ctx.beginPath();
        ctx.arc(sx, star.y, star.r * (0.6 + layer * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle * (0.3 + layer * 0.15)})`;
        ctx.fill();
        if (layer === 2 && star.r > 1.5) {
          ctx.beginPath();
          ctx.arc(sx, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168,85,247,${twinkle * 0.08})`;
          ctx.fill();
        }
      }
    }

    // === GROUND PLANE ===
    const groundY = h * 0.42;
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
    groundGrad.addColorStop(0, "rgba(15,15,45,0.6)");
    groundGrad.addColorStop(0.3, "rgba(10,10,35,0.8)");
    groundGrad.addColorStop(1, "rgba(5,5,20,1)");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Grid lines for ground depth
    ctx.strokeStyle = "rgba(124,58,237,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const gy = groundY + i * (h - groundY) / 20;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // === COLLECT ALL 3D OBJECTS FOR DEPTH SORTING ===
    interface RenderObj { type: string; x: number; y: number; z: number; depth: number; data: any; }
    const objects: RenderObj[] = [];

    // Track ring - multiple rings for 3D look
    for (let ring = 0; ring < 3; ring++) {
      const rOff = (ring - 1) * s.trackW * 0.35;
      const r = s.trackR + rOff;
      const segments = 60;
      for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI * 2;
        const a2 = ((i + 1) / segments) * Math.PI * 2;
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const p1 = project(x1, y1, 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
        const p2 = project(x2, y2, 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
        const midDepth = (p1.depth + p2.depth) / 2;
        objects.push({ type: "track", x: 0, y: 0, z: 0, depth: midDepth, data: { p1, p2, ring, seg: i } });
      }
    }

    // Start/finish
    const sf1 = project(s.trackR, -3, 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
    const sf2 = project(s.trackR, 3, 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
    objects.push({ type: "startfinish", x: s.trackR, y: 0, z: 0, depth: sf1.depth, data: { p1: sf1, p2: sf2 } });

    // Tokens
    for (const t of s.tokens) {
      if (t.taken) continue;
      const p = project(t.x, t.y, t.z, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
      objects.push({ type: "token", x: t.x, y: t.y, z: t.z, depth: p.depth, data: { ...t, proj: p } });
    }

    // AI
    for (const ai of s.ai) {
      const ax = Math.cos(ai.angle) * s.trackR;
      const ay = Math.sin(ai.angle) * s.trackR;
      const p = project(ax, ay, 3, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
      objects.push({ type: "kart", x: ax, y: ay, z: 3, depth: p.depth, data: { ...ai, proj: p, isPlayer: false } });
    }

    // Player
    const pp = project(s.px, s.py, 3 + s.pz, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
    objects.push({ type: "kart", x: s.px, y: s.py, z: 3 + s.pz, depth: pp.depth, data: { color: kartBody, glow: kartAccent, angle: s.pa, proj: pp, isPlayer: true, speed: s.pv, drifting } });

    // Particles
    for (const p of s.particles) {
      const proj = project(p.x, p.y, p.z, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
      objects.push({ type: "particle", x: p.x, y: p.y, z: p.z, depth: proj.depth, data: { ...p, proj } });
    }

    // Popups
    for (const p of s.popups) {
      const proj = project(p.x, p.y, p.z, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
      objects.push({ type: "popup", x: p.x, y: p.y, z: p.z, depth: proj.depth, data: { ...p, proj } });
    }

    // Sort by depth (back to front)
    objects.sort((a, b) => a.depth - b.depth);

    // === RENDER OBJECTS ===
    for (const obj of objects) {
      if (obj.type === "track") {
        const { p1, p2, ring, seg } = obj.data;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        const isOuter = ring === 0;
        const isInner = ring === 2;
        const alpha = isOuter ? 0.5 : isInner ? 0.4 : 0.15;
        const color = ring === 1 ? `rgba(124,58,237,${alpha})` : ring === 0 ? `rgba(168,85,247,${alpha})` : `rgba(99,102,241,${alpha})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = ring === 1 ? 3 : 1.5;
        ctx.setLineDash(ring === 1 ? [] : [6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Track surface between inner and outer
        if (ring === 1) {
          const io1 = project(Math.cos((seg / 60) * Math.PI * 2) * (s.trackR + s.trackW / 2), Math.sin((seg / 60) * Math.PI * 2) * (s.trackR + s.trackW / 2), 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
          const io2 = project(Math.cos(((seg + 1) / 60) * Math.PI * 2) * (s.trackR + s.trackW / 2), Math.sin(((seg + 1) / 60) * Math.PI * 2) * (s.trackR + s.trackW / 2), 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
          const ii1 = project(Math.cos((seg / 60) * Math.PI * 2) * (s.trackR - s.trackW / 2), Math.sin((seg / 60) * Math.PI * 2) * (s.trackR - s.trackW / 2), 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
          const ii2 = project(Math.cos(((seg + 1) / 60) * Math.PI * 2) * (s.trackR - s.trackW / 2), Math.sin(((seg + 1) / 60) * Math.PI * 2) * (s.trackR - s.trackW / 2), 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
          ctx.beginPath();
          ctx.moveTo(io1.px, io1.py);
          ctx.lineTo(io2.px, io2.py);
          ctx.lineTo(ii2.px, ii2.py);
          ctx.lineTo(ii1.px, ii1.py);
          ctx.closePath();
          ctx.fillStyle = "rgba(20,15,50,0.7)";
          ctx.fill();
        }
      }

      if (obj.type === "startfinish") {
        const { p1, p2 } = obj.data;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (obj.type === "token") {
        const t = obj.data;
        const p = t.proj;
        const pulse = 1 + Math.sin(now * 0.004 + t.bobPhase) * 0.1;
        const sz = Math.max(8, s.trackR * 0.04) * p.scale;
        const pillW = sz * (t.word.length * 0.7 + 2);
        const pillH = sz * 1.6;

        ctx.save();
        ctx.translate(p.px, p.py);
        ctx.scale(pulse, pulse);

        // Token shadow on ground
        ctx.beginPath();
        ctx.ellipse(0, pillH * 0.4, pillW * 0.4, pillH * 0.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fill();

        // Glow
        ctx.shadowColor = t.good ? "#22d3ee" : "#f43f5e";
        ctx.shadowBlur = 15 * pulse;

        // Pill
        ctx.beginPath();
        ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, pillH / 2);
        const g = ctx.createLinearGradient(-pillW / 2, 0, pillW / 2, 0);
        g.addColorStop(0, t.good ? "rgba(34,211,238,0.95)" : "rgba(251,113,133,0.95)");
        g.addColorStop(1, t.good ? "rgba(14,165,233,0.95)" : "rgba(225,29,72,0.95)");
        ctx.fillStyle = g;
        ctx.fill();

        // Highlight on pill
        ctx.beginPath();
        ctx.roundRect(-pillW / 2 + 2, -pillH / 2 + 1, pillW - 4, pillH * 0.35, pillH * 0.15);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = `800 ${sz * 0.85}px "Arial Black", sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${t.good ? "+" : "−"} ${t.word}`, 0, 1);

        ctx.restore();
      }

      if (obj.type === "kart") {
        const d = obj.data;
        const p = d.proj;
        const sz = Math.max(10, s.trackR * 0.06) * p.scale;

        ctx.save();
        ctx.translate(p.px, p.py);

        // Shadow
        ctx.beginPath();
        ctx.ellipse(2, sz * 0.5, sz * 0.5, sz * 0.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fill();

        // Kart body rotation
        ctx.rotate((d.angle || 0) + Math.PI / 2);

        // Glow
        ctx.shadowColor = d.glow;
        ctx.shadowBlur = d.isPlayer ? 20 : 12;

        // Body
        ctx.beginPath();
        ctx.roundRect(-sz * 0.35, -sz * 0.65, sz * 0.7, sz * 1.3, sz * 0.18);
        const bg = ctx.createLinearGradient(0, -sz * 0.65, 0, sz * 0.65);
        bg.addColorStop(0, d.glow);
        bg.addColorStop(1, d.color);
        ctx.fillStyle = bg;
        ctx.fill();

        // Body highlight
        ctx.beginPath();
        ctx.roundRect(-sz * 0.25, -sz * 0.55, sz * 0.5, sz * 0.5, sz * 0.12);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fill();

        ctx.shadowBlur = 0;

        // Head
        ctx.beginPath();
        ctx.arc(0, -sz * 0.15, sz * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "#f1c9a5";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Eyes
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(-sz * 0.07, -sz * 0.18, sz * 0.045, 0, Math.PI * 2);
        ctx.arc(sz * 0.07, -sz * 0.18, sz * 0.045, 0, Math.PI * 2);
        ctx.fill();
        // Eye highlight
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-sz * 0.06, -sz * 0.19, sz * 0.015, 0, Math.PI * 2);
        ctx.arc(sz * 0.08, -sz * 0.19, sz * 0.015, 0, Math.PI * 2);
        ctx.fill();

        // Wheels
        ctx.fillStyle = "#0f172a";
        const ww = sz * 0.16, wh = sz * 0.1;
        ctx.fillRect(-sz * 0.45, -sz * 0.42, ww, wh);
        ctx.fillRect(sz * 0.29, -sz * 0.42, ww, wh);
        ctx.fillRect(-sz * 0.45, sz * 0.32, ww, wh);
        ctx.fillRect(sz * 0.29, sz * 0.32, ww, wh);

        // Wheel glow
        ctx.fillStyle = `${d.glow}44`;
        ctx.fillRect(-sz * 0.45, -sz * 0.42, ww, wh);
        ctx.fillRect(sz * 0.29, -sz * 0.42, ww, wh);

        ctx.restore();

        // Player indicator arrow
        if (d.isPlayer) {
          ctx.save();
          ctx.translate(p.px, p.py - sz * 0.9);
          const arrowBounce = Math.sin(now * 0.005) * 3;
          ctx.translate(0, arrowBounce);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-5, -8);
          ctx.lineTo(5, -8);
          ctx.closePath();
          ctx.fillStyle = d.glow;
          ctx.shadowColor = d.glow;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }

      if (obj.type === "particle") {
        const p = obj.data;
        const proj = p.proj;
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.size * alpha * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      if (obj.type === "popup") {
        const p = obj.data;
        const proj = p.proj;
        const alpha = p.life / 55;
        ctx.globalAlpha = alpha;
        ctx.font = `900 ${Math.max(11, s.trackR * 0.055) * proj.scale}px "Arial Black", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, proj.px, proj.py);
        ctx.shadowBlur = 0;
      }
    }
    ctx.globalAlpha = 1;

    // Center PRIMA+ label
    const cp = project(0, 0, 0, s.cx, s.cy, s.scale, s.camAngle, s.camTilt);
    ctx.font = `900 ${Math.max(14, s.trackR * 0.1)}px "Arial Black", sans-serif`;
    ctx.fillStyle = "rgba(168,85,247,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PRIMA+", cp.px, cp.py);

    // === COUNTDOWN ===
    if (s.cdVal > 0) {
      ctx.font = `900 ${Math.min(w, h) * 0.3}px "Arial Black", sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 40;
      ctx.fillStyle = "white";
      ctx.fillText(String(s.cdVal), w / 2, h * 0.35);
      ctx.shadowBlur = 0;
    } else if (s.cdVal === 0) {
      ctx.font = `900 ${Math.min(w, h) * 0.22}px "Arial Black", sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 40;
      ctx.fillStyle = "#22c55e";
      ctx.fillText("GO!", w / 2, h * 0.35);
      ctx.shadowBlur = 0;
    }

    // Vignette
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.65);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    touch.current = { active: true, sx: t.clientX - r.left, sy: t.clientY - r.top, steerX: 0, gas: (t.clientY - r.top) < r.height * 0.55, brake: (t.clientY - r.top) >= r.height * 0.55 };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!touch.current.active) return;
    const t = e.touches[0];
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = t.clientX - r.left, y = t.clientY - r.top;
    touch.current.steerX = Math.max(-1, Math.min(1, (x - touch.current.sx) / (r.width * 0.12)));
    touch.current.gas = y < r.height * 0.55;
    touch.current.brake = y >= r.height * 0.55;
  }, []);

  const onTouchEnd = useCallback(() => { touch.current = { active: false, steerX: 0, gas: false, brake: false, sx: 0, sy: 0 }; }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: "70vh", position: "relative", overflow: "hidden", borderRadius: 16, touchAction: "none", border: "1px solid rgba(124,58,237,0.3)" }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <canvas ref={canvasRef} width={dims.w} height={dims.h} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* HUD */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", gap: 6, zIndex: 30, pointerEvents: "none", flexWrap: "wrap" }}>
        {[{ l: "SKOR", v: score, c: "#22d3ee", i: "★" }, { l: "WAKTU", v: `${time}s`, c: time <= 10 ? "#ef4444" : "#f43f5e", i: "⏱" }, { l: "POS", v: `${position}/4`, c: "#a855f7", i: "🏁" }, { l: "LAP", v: `${Math.min(lap + 1, 3)}/3`, c: "#22c55e", i: "🔄" }].map(it => (
          <div key={it.l} style={{ padding: "5px 12px", borderRadius: 10, background: "rgba(10,10,30,0.88)", border: `1px solid ${it.c}40`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>{it.i}</span>
            <div><div style={{ fontFamily: "Arial", fontSize: 8, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.1em" }}>{it.l}</div>
              <div style={{ fontFamily: "'Arial Black'", fontSize: 13, color: it.c, fontWeight: 900, lineHeight: 1 }}>{it.v}</div></div>
          </div>
        ))}
      </div>

      {/* Speed */}
      <div style={{ position: "absolute", bottom: 36, left: 10, zIndex: 30, display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 10, background: "rgba(10,10,30,0.88)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(12px)" }}>
        <span style={{ fontFamily: "'Arial Black'", fontSize: 8, color: "rgba(255,255,255,0.45)", fontWeight: 900, letterSpacing: "0.1em" }}>SPD</span>
        <div style={{ width: 90, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(speed * 115, 100)}%`, height: "100%", borderRadius: 3, background: drifting ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#22c55e,#06b6d4)", transition: "width 0.08s", boxShadow: drifting ? "0 0 10px #f97316" : "0 0 10px #22c55e" }} />
        </div>
        {drifting && <span style={{ fontFamily: "'Arial Black'", fontSize: 9, color: "#f97316", fontWeight: 900, textShadow: "0 0 10px #f97316" }}>DRIFT!</span>}
      </div>

      {!over && (
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", zIndex: 30, padding: "3px 10px", borderRadius: 8, background: "rgba(10,10,30,0.7)", backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: "Arial", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>WASD/Arrows nyetir · Spasi drift · Kumpul kata Indonesia (+10) · Hindari bahasa asing (-6) · 3 lap!</span>
        </div>
      )}

      {over && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.88)", backdropFilter: "blur(16px)", zIndex: 50 }}>
          <div style={{ padding: "30px 50px", borderRadius: 20, background: "rgba(15,15,45,0.95)", border: "1px solid rgba(124,58,237,0.5)", textAlign: "center", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <p style={{ fontFamily: "'Arial Black'", fontSize: "2.5rem", fontWeight: 900, color: "white", margin: 0 }}>SELESAI!</p>
            <p style={{ fontFamily: "'Arial Black'", fontSize: "1.8rem", fontWeight: 900, color: "#22d3ee", margin: "10px 0 5px" }}>Skor: {score}</p>
            <p style={{ fontFamily: "Arial", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              {score >= 80 ? "Mantul! Loyalitas bahasamu kece." : score >= 40 ? "Lumayan, masih bisa lebih sadar." : "Coba lagi, kumpulin lebih banyak kata Indonesia!"}
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes popIn{0%{opacity:0;transform:scale(0.5)}100%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
