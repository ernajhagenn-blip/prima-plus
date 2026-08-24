"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GOOD_WORDS = ["makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar", "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik"];
const BAD_WORDS = ["hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you", "so fun"];

interface Token { x: number; y: number; word: string; good: boolean; taken: boolean; respawn: number; }
interface AIKart { angle: number; speed: number; color: string; lap: number; crossed: boolean; drift: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }
interface ScorePopup { x: number; y: number; text: string; color: string; life: number; }

const TRACK_R = 0; // set dynamically
const TOTAL_LAPS = 3;

function proceduralSound(type: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.08;
    if (type === "pickup") {
      osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } else if (type === "crash") {
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
    } else if (type === "tick") {
      osc.type = "square"; osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.value = 0.04;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    }
  } catch {}
}

export default function KartRace3D({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#0ea5e9",
}: {
  onComplete: (score: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [position, setPosition] = useState(1);
  const [playerLap, setPlayerLap] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [drifting, setDrifting] = useState(false);
  const [over, setOver] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const stateRef = useRef({
    px: 0, py: 0, pa: 0, pv: 0,
    tokens: [] as Token[],
    ai: [] as AIKart[],
    particles: [] as Particle[],
    popups: [] as ScorePopup[],
    keys: {} as Record<string, boolean>,
    score: 0, time: 60, lap: 0, over: false,
    lastAngle: 0, crossedStart: false,
    trackR: 0, trackW: 0, cx: 0, cy: 0,
    countdown: 3, countdownTimer: 0,
    tilt: 0,
    touchSteer: 0, touchGas: false, touchBrake: false,
  });

  const touchRef = useRef({ steerX: 0, gas: false, brake: false, active: false, startX: 0 });

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        const h = e.contentRect.height;
        setDimensions({ w, h });
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    const w = dimensions.w;
    const h = dimensions.h;
    s.cx = w / 2;
    s.cy = h / 2;
    s.trackR = Math.min(w, h) * 0.32;
    s.trackW = Math.min(w, h) * 0.12;
    s.px = s.cx;
    s.py = s.cy + s.trackR;
    s.pa = Math.PI;

    s.tokens = [];
    const tokenCount = 14;
    for (let i = 0; i < tokenCount; i++) {
      const angle = (i / tokenCount) * Math.PI * 2;
      const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.6;
      const isGood = i < 10;
      s.tokens.push({
        x: s.cx + Math.cos(angle) * r,
        y: s.cy + Math.sin(angle) * r,
        word: isGood ? GOOD_WORDS[i % GOOD_WORDS.length] : BAD_WORDS[(i - 10) % BAD_WORDS.length],
        good: isGood, taken: false, respawn: 0,
      });
    }

    s.ai = [
      { angle: 0, speed: 0.012, color: "#a855f7", lap: 0, crossed: false, drift: 0 },
      { angle: Math.PI * 2 / 3, speed: 0.010, color: "#22c55e", lap: 0, crossed: false, drift: 0 },
      { angle: Math.PI * 4 / 3, speed: 0.014, color: "#f97316", lap: 0, crossed: false, drift: 0 },
    ];
  }, [dimensions]);

  useEffect(() => {
    const s = stateRef.current;
    const ek = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      s.keys[e.key.toLowerCase()] = true;
    };
    const eu = (e: KeyboardEvent) => { s.keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);

    // Countdown
    s.countdown = 3;
    s.countdownTimer = Date.now();

    const timer = setInterval(() => {
      if (s.over) return;
      const elapsed = Date.now() - s.countdownTimer;
      const cd = 3 - Math.floor(elapsed / 1000);
      if (cd !== s.countdown && cd >= 0) {
        s.countdown = cd;
        setCountdown(cd);
        if (cd > 0) proceduralSound("tick");
        if (cd === 0) { s.countdownTimer = Date.now() + 1000; }
      }
      if (cd <= 0 && elapsed > 3500) {
        s.time -= 1;
        setTime(s.time);
        if (s.time <= 10 && s.time > 0) proceduralSound("tick");
        if (s.time <= 0) {
          s.over = true;
          setOver(true);
          onComplete(s.score);
        }
      }
    }, 1000);

    let lastTime = performance.now();
    const loop = (now: number) => {
      if (s.over) return;
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;
      const elapsed = Date.now() - s.countdownTimer;

      if (elapsed < 3500) {
        // During countdown, render but don't move
        render(s);
        requestAnimationFrame(loop);
        return;
      }

      const k = s.keys;
      const hasTouch = touchRef.current.active;

      // Input
      if (k["arrowup"] || k["w"] || hasTouch && touchRef.current.gas) s.pv += 0.18;
      if (k["arrowdown"] || k["s"] || hasTouch && touchRef.current.brake) s.pv -= 0.25;
      const steerInput = (k["arrowleft"] || k["a"] ? 1 : 0) - (k["arrowright"] || k["d"] ? 1 : 0) + (hasTouch ? touchRef.current.steerX : 0);
      s.pa += steerInput * 0.045;

      const isDrift = k[" "] || false;
      setDrifting(isDrift);
      s.pv *= isDrift ? 0.93 : 0.97;
      if (s.pv > 0.9) s.pv = 0.9;
      if (s.pv < -0.35) s.pv = -0.35;

      s.px += Math.sin(s.pa) * s.pv * (dt / 16) * 6;
      s.py += -Math.cos(s.pa) * s.pv * (dt / 16) * 6;

      // Track boundary
      const dx = s.px - s.cx;
      const dy = s.py - s.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > s.trackR + s.trackW / 2 + 8) {
        const pushA = Math.atan2(dy, dx);
        s.px = s.cx + Math.cos(pushA) * (s.trackR + s.trackW / 2 + 6);
        s.py = s.cy + Math.sin(pushA) * (s.trackR + s.trackW / 2 + 6);
        s.pv *= 0.25;
        proceduralSound("crash");
        // Screen shake particles
        for (let i = 0; i < 8; i++) {
          s.particles.push({ x: s.px, y: s.py, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, life: 20, color: "#f97316" });
        }
      }
      if (dist < s.trackR - s.trackW / 2 - 8) {
        const pushA = Math.atan2(dy, dx);
        s.px = s.cx + Math.cos(pushA) * (s.trackR - s.trackW / 2 - 6);
        s.py = s.cy + Math.sin(pushA) * (s.trackR - s.trackW / 2 - 6);
        s.pv *= 0.25;
        proceduralSound("crash");
      }

      // Tilt effect
      s.tilt = s.tilt * 0.9 + (steerInput * 0.1) * 0.1;

      // Lap detection
      const curAngle = Math.atan2(s.py - s.cy, s.px - s.cx);
      const norm = curAngle < 0 ? curAngle + Math.PI * 2 : curAngle;
      if (norm < 0.3 && s.lastAngle > Math.PI * 2 - 0.3 && !s.crossedStart) {
        s.crossedStart = true;
        if (s.pv > 0.05) {
          s.lap++;
          setPlayerLap(s.lap);
          if (s.lap >= TOTAL_LAPS) {
            s.over = true;
            setOver(true);
            onComplete(s.score);
          }
        }
      } else if (norm > Math.PI) {
        s.crossedStart = false;
      }
      s.lastAngle = norm;

      // Token collection
      for (let i = 0; i < s.tokens.length; i++) {
        const t = s.tokens[i];
        if (t.taken) {
          if (t.respawn > 0) t.respawn--;
          if (t.respawn <= 0) {
            const a = Math.random() * Math.PI * 2;
            const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.6;
            t.x = s.cx + Math.cos(a) * r;
            t.y = s.cy + Math.sin(a) * r;
            t.word = t.good ? GOOD_WORDS[Math.floor(Math.random() * GOOD_WORDS.length)] : BAD_WORDS[Math.floor(Math.random() * BAD_WORDS.length)];
            t.taken = false;
          }
          continue;
        }
        const td = Math.hypot(t.x - s.px, t.y - s.py);
        if (td < 28) {
          t.taken = true;
          t.respawn = 120;
          if (t.good) {
            s.score += 10;
            proceduralSound("pickup");
            s.popups.push({ x: t.x, y: t.y - 10, text: "+10", color: "#22d3ee", life: 40 });
            for (let j = 0; j < 5; j++) s.particles.push({ x: t.x, y: t.y, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 15, color: "#22d3ee" });
          } else {
            s.score = Math.max(0, s.score - 6);
            s.pv *= 0.35;
            proceduralSound("crash");
            s.popups.push({ x: t.x, y: t.y - 10, text: "-6", color: "#f43f5e", life: 40 });
            for (let j = 0; j < 5; j++) s.particles.push({ x: t.x, y: t.y, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 15, color: "#f43f5e" });
          }
          setScore(s.score);
        }
      }

      // AI
      for (const ai of s.ai) {
        ai.angle += ai.speed * (1 + Math.sin(now * 0.0005) * 0.2);
        if (ai.angle > Math.PI * 2) ai.angle -= Math.PI * 2;
        const aiNorm = ai.angle;
        if (aiNorm < 0.3 && !ai.crossed) { ai.crossed = true; ai.lap++; }
        else if (aiNorm > Math.PI) ai.crossed = false;
      }

      // Drift particles
      if (isDrift && Math.abs(s.pv) > 0.3) {
        s.particles.push({
          x: s.px + (Math.random() - 0.5) * 6,
          y: s.py + (Math.random() - 0.5) * 6,
          vx: -Math.sin(s.pa) * s.pv * 0.5 + (Math.random() - 0.5),
          vy: Math.cos(s.pa) * s.pv * 0.5 + (Math.random() - 0.5),
          life: 12, color: "rgba(255,255,255,0.5)",
        });
      }

      // Update particles
      s.particles = s.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life--; return p.life > 0; });
      s.popups = s.popups.filter(p => { p.y -= 1; p.life--; return p.life > 0; });

      // Position
      const pProgress = s.lap * 1000 + norm * 100;
      let pos = 1;
      for (const ai of s.ai) {
        const aiProg = ai.lap * 1000 + ai.angle * 100;
        if (aiProg > pProgress) pos++;
      }
      setPosition(pos);
      setSpeed(Math.abs(s.pv));
      setDrifting(isDrift);

      render(s);
      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", ek);
      window.removeEventListener("keyup", eu);
      clearInterval(timer);
      cancelAnimationFrame(id);
    };
  }, [dimensions, onComplete]);

  const render = (s: typeof stateRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = dimensions.w;
    const h = dimensions.h;

    // Background
    ctx.fillStyle = "#90ded3";
    ctx.fillRect(0, 0, w, h);

    // Vignette
    const vignette = ctx.createRadialGradient(w/2, h/2, w*0.2, w/2, h/2, w*0.7);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Track
    ctx.beginPath();
    ctx.arc(s.cx, s.cy, s.trackR + s.trackW / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#6bb89a";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Inner track edge
    ctx.beginPath();
    ctx.arc(s.cx, s.cy, s.trackR - s.trackW / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center circle
    ctx.beginPath();
    ctx.arc(s.cx, s.cy, s.trackR - s.trackW / 2 - 8, 0, Math.PI * 2);
    ctx.fillStyle = "#4caf50";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s.cx, s.cy, s.trackR - s.trackW / 2 - 8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // PRIMA+ label
    ctx.font = `bold ${Math.max(10, s.trackR * 0.12)}px "Arial Black", sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PRIMA+", s.cx, s.cy);

    // Start/finish line
    ctx.save();
    ctx.translate(s.cx + s.trackR, s.cy);
    for (let i = -4; i < 4; i++) {
      ctx.fillStyle = i % 2 === 0 ? "white" : "#1e293b";
      ctx.fillRect(-3, i * 4, 6, 4);
    }
    ctx.restore();

    // Tokens
    for (const t of s.tokens) {
      if (t.taken) continue;
      const pillW = Math.max(28, ctx.measureText(t.word).width + 20);
      const pillH = 18;
      ctx.beginPath();
      ctx.roundRect(t.x - pillW/2, t.y - pillH/2, pillW, pillH, pillH/2);
      const grad = ctx.createLinearGradient(t.x - pillW/2, t.y, t.x + pillW/2, t.y);
      if (t.good) {
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(1, "#0ea5e9");
      } else {
        grad.addColorStop(0, "#fb7185");
        grad.addColorStop(1, "#e11d48");
      }
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowColor = t.good ? "rgba(14,165,233,0.4)" : "rgba(225,29,72,0.4)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = `bold ${Math.max(8, s.trackR * 0.05)}px "Arial Black", sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${t.good ? "+" : "−"} ${t.word}`, t.x, t.y + 1);
    }

    // AI karts
    for (const ai of s.ai) {
      const ax = s.cx + Math.cos(ai.angle) * s.trackR;
      const ay = s.cy + Math.sin(ai.angle) * s.trackR;
      drawKart(ctx, ax, ay, ai.angle + Math.PI/2, ai.color, "white", s.trackR);
    }

    // Player kart
    drawKart(ctx, s.px, s.py, s.pa + Math.PI/2, kartBody, kartAccent, s.trackR);

    // Particles
    for (const p of s.particles) {
      ctx.globalAlpha = p.life / 20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Score popups
    for (const p of s.popups) {
      ctx.globalAlpha = p.life / 40;
      ctx.font = `bold ${Math.max(12, s.trackR * 0.08)}px "Arial Black", sans-serif`;
      ctx.fillStyle = p.color;
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;

    // Countdown
    if (s.countdown > 0) {
      ctx.font = `bold ${Math.min(w, h) * 0.2}px "Arial Black", sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(s.countdown), w/2, h/2);
    } else if (s.countdown === 0 && (Date.now() - s.countdownTimer) < 1500) {
      ctx.font = `bold ${Math.min(w, h) * 0.15}px "Arial Black", sans-serif`;
      ctx.fillStyle = "#22c55e";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GO!", w/2, h/2);
    }
  };

  const drawKart = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, body: string, accent: string, trackR: number) => {
    const size = Math.max(8, trackR * 0.06);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Body
    ctx.beginPath();
    ctx.roundRect(-size * 0.4, -size * 0.6, size * 0.8, size * 1.2, size * 0.15);
    const bodyGrad = ctx.createLinearGradient(0, -size * 0.6, 0, size * 0.6);
    bodyGrad.addColorStop(0, accent);
    bodyGrad.addColorStop(1, body);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Head
    ctx.beginPath();
    ctx.arc(0, -size * 0.15, size * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#f1c9a5";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Wheels
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-size * 0.5, -size * 0.4, size * 0.15, size * 0.2);
    ctx.fillRect(size * 0.35, -size * 0.4, size * 0.15, size * 0.2);
    ctx.fillRect(-size * 0.5, size * 0.2, size * 0.15, size * 0.2);
    ctx.fillRect(size * 0.35, size * 0.2, size * 0.15, size * 0.2);

    ctx.restore();
  };

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const w = rect.width;
    touchRef.current.active = true;
    touchRef.current.startX = x;
    touchRef.current.steerX = 0;
    touchRef.current.gas = x > w * 0.5;
    touchRef.current.brake = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchRef.current.active) return;
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const w = rect.width;
    const h = rect.height;
    const y = touch.clientY - rect.top;
    const dx = (x - touchRef.current.startX) / (w * 0.15);
    touchRef.current.steerX = Math.max(-1, Math.min(1, dx));
    touchRef.current.gas = y < h * 0.7;
    touchRef.current.brake = y >= h * 0.7;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current.active = false;
    touchRef.current.steerX = 0;
    touchRef.current.gas = false;
    touchRef.current.brake = false;
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "75vh", position: "relative", overflow: "hidden", borderRadius: "16px", touchAction: "none" }}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

      <canvas ref={canvasRef} width={dimensions.w} height={dimensions.h} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* HUD */}
      <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", justifyContent: "space-between", zIndex: 30, pointerEvents: "none" }}>
        <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", fontFamily: "'Arial Black', sans-serif", fontSize: "12px", color: "#0891b2", fontWeight: 900 }}>Skor: {score}</span>
        <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", fontFamily: "'Arial Black', sans-serif", fontSize: "12px", color: time <= 10 ? "#ef4444" : "#f43f5e", fontWeight: 900 }}>Waktu: {time}s</span>
        <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", fontFamily: "'Arial Black', sans-serif", fontSize: "12px", color: "#7c3aed", fontWeight: 900 }}>Posisi: {position}/4</span>
        <span style={{ padding: "4px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", fontFamily: "'Arial Black', sans-serif", fontSize: "12px", color: "#16a34a", fontWeight: 900 }}>Lap: {Math.min(playerLap + 1, TOTAL_LAPS)}/{TOTAL_LAPS}</span>
      </div>

      {/* Speed bar */}
      <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 30, display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
        <span style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "9px", color: "#64748b", fontWeight: 900 }}>SPD</span>
        <div style={{ width: "80px", height: "6px", borderRadius: "3px", background: "#e2e8f0", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(speed * 110, 100)}%`, height: "100%", borderRadius: "3px", background: drifting ? "linear-gradient(90deg, #f97316, #ef4444)" : "linear-gradient(90deg, #22c55e, #06b6d4)", transition: "width 0.1s" }} />
        </div>
        {drifting && <span style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "9px", color: "#f97316", fontWeight: 900 }}>DRIFT!</span>}
      </div>

      {/* Instructions */}
      {!over && (
        <p style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", zIndex: 30, fontFamily: "'Arial', sans-serif", fontSize: "9px", color: "rgba(0,0,0,0.4)", pointerEvents: "none", whiteSpace: "nowrap" }}>
          WASD/Panah nyetir · Spasi drift · Kumpul kata Indonesia (+10) · Hindari bahasa asing (-6) · 3 lap!
        </p>
      )}

      {/* Game over overlay */}
      {over && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 50,
        }}>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "2rem", fontWeight: 900, color: "white", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>SELESAI!</p>
          <p style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#22d3ee", marginTop: "8px" }}>Skor: {score}</p>
          <p style={{ fontFamily: "'Arial', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
            {score >= 80 ? "Mantul! Loyalitas bahasamu kece." : score >= 40 ? "Lumayan, masih bisa lebih sadar." : "Coba lagi, kumpulin lebih banyak kata Indonesia!"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
