"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GOOD = [
  "makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar",
  "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik",
];
const BAD = [
  "hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you", "so fun",
];

type Token = { x: number; y: number; word: string; good: boolean; taken: boolean };
type AIKart = { x: number; y: number; angle: number; speed: number; color: string; lap: number; progress: number };

const TRACK_R = 140;
const TRACK_W = 50;
const CENTER_X = 200;
const CENTER_Y = 200;
const TOTAL_LAPS = 3;

function makeTokens(): Token[] {
  const arr: Token[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = TRACK_R + (Math.random() - 0.5) * 20;
    arr.push({
      x: CENTER_X + Math.cos(angle) * r,
      y: CENTER_Y + Math.sin(angle) * r,
      word: GOOD[i % GOOD.length],
      good: true,
      taken: false,
    });
  }
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + 0.4;
    const r = TRACK_R + (Math.random() - 0.5) * 20;
    arr.push({
      x: CENTER_X + Math.cos(angle) * r,
      y: CENTER_Y + Math.sin(angle) * r,
      word: BAD[i % BAD.length],
      good: false,
      taken: false,
    });
  }
  return arr;
}

function makeAIKarts(): AIKart[] {
  const colors = ["#a855f7", "#22c55e", "#f97316"];
  return colors.map((c, i) => ({
    x: CENTER_X + Math.cos((i / 3) * Math.PI * 2) * TRACK_R,
    y: CENTER_Y + Math.sin((i / 3) * Math.PI * 2) * TRACK_R,
    angle: (i / 3) * Math.PI * 2,
    speed: 0.8 + Math.random() * 0.6,
    color: c,
    lap: 0,
    progress: 0,
  }));
}

function KartSprite({ x, y, angle, body, accent }: { x: number; y: number; angle: number; body: string; accent: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 14,
        width: 20,
        height: 28,
        transform: `rotate(${(angle * 180) / Math.PI}deg)`,
        transformOrigin: "center center",
        zIndex: 20,
        transition: "left 0.05s linear, top 0.05s linear",
      }}
    >
      <div style={{ width: 20, height: 28, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 2,
            width: 16,
            height: 20,
            borderRadius: "4px 4px 6px 6px",
            background: `linear-gradient(180deg, ${accent}, ${body})`,
            boxShadow: `0 2px 6px rgba(0,0,0,0.3)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#f1c9a5",
            border: "2px solid white",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#1e293b",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#1e293b",
          }}
        />
      </div>
    </div>
  );
}

function TokenSprite({ x, y, word, good, taken }: Token) {
  if (taken) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 18,
        top: y - 10,
        zIndex: 15,
      }}
    >
      <div
        style={{
          padding: "3px 8px",
          borderRadius: 12,
          fontSize: 10,
          fontWeight: 900,
          fontFamily: '"Arial Black", sans-serif',
          color: "white",
          background: good
            ? "linear-gradient(135deg, #22d3ee, #0891b2)"
            : "linear-gradient(135deg, #fb7185, #be123c)",
          boxShadow: `0 2px 8px ${good ? "#0891b2" : "#be123c"}66`,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {good ? "+" : "−"} {word}
      </div>
    </div>
  );
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
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [over, setOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: CENTER_X, y: CENTER_Y + TRACK_R, angle: 0 });
  const [playerLap, setPlayerLap] = useState(0);
  const [position, setPosition] = useState(1);
  const [speed, setSpeed] = useState(0);
  const [drifting, setDrifting] = useState(false);
  const [boost, setBoost] = useState(0);

  const playerRef = useRef({ x: CENTER_X, y: CENTER_Y + TRACK_R, angle: Math.PI, v: 0 });
  const tokensRef = useRef<Token[]>(makeTokens());
  const aiRef = useRef<AIKart[]>(makeAIKarts());
  const keysRef = useRef<Record<string, boolean>>({});
  const scoreRef = useRef(0);
  const timeRef = useRef(60);
  const overRef = useRef(false);
  const lastAngleRef = useRef(Math.PI);
  const crossedStartRef = useRef(false);
  const aiLapCrossedRef = useRef<boolean[]>([false, false, false]);

  const gameLoopRef = useRef<number>(0);

  const updatePositions = useCallback(() => {
    const p = playerRef.current;
    setPlayerPos({ x: p.x, y: p.y, angle: p.angle });
    setSpeed(Math.abs(p.v));

    const aiKarts = aiRef.current;
    let pos = 1;
    const pProgress = playerLap * 1000 + (p.angle < 0 ? p.angle + Math.PI * 2 : p.angle) * 100;
    for (const ai of aiKarts) {
      const aiProgress = ai.lap * 1000 + ai.angle * 100;
      if (aiProgress > pProgress) pos++;
    }
    setPosition(pos);
  }, [playerLap]);

  useEffect(() => {
    const ek = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const eu = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);

    const timer = setInterval(() => {
      if (overRef.current) return;
      timeRef.current -= 1;
      setTime(timeRef.current);
      if (timeRef.current <= 0) {
        overRef.current = true;
        setOver(true);
        onComplete(scoreRef.current);
      }
    }, 1000);

    let lastTime = performance.now();

    const loop = (now: number) => {
      if (overRef.current) return;
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;
      const k = keysRef.current;
      const p = playerRef.current;

      if (k["arrowup"] || k["w"]) p.v += 0.15;
      if (k["arrowdown"] || k["s"]) p.v -= 0.2;
      if (k["arrowleft"] || k["a"]) p.angle += 0.04;
      if (k["arrowright"] || k["d"]) p.angle -= 0.04;

      const isDrifting = k[" "];
      setDrifting(isDrifting);
      const driftMod = isDrifting ? 0.92 : 0.96;
      p.v *= driftMod;
      if (p.v > 0.7) p.v = 0.7;
      if (p.v < -0.3) p.v = -0.3;

      const fx = Math.sin(p.angle);
      const fz = -Math.cos(p.angle);
      p.x += fx * p.v * (dt / 16) * 5;
      p.y += fz * p.v * (dt / 16) * 5;

      const dx = p.x - CENTER_X;
      const dy = p.y - CENTER_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > TRACK_R + TRACK_W / 2 + 10) {
        const pushAngle = Math.atan2(dy, dx);
        p.x = CENTER_X + Math.cos(pushAngle) * (TRACK_R + TRACK_W / 2 + 8);
        p.y = CENTER_Y + Math.sin(pushAngle) * (TRACK_R + TRACK_W / 2 + 8);
        p.v *= 0.3;
      }
      if (dist < TRACK_R - TRACK_W / 2 - 10) {
        const pushAngle = Math.atan2(dy, dx);
        p.x = CENTER_X + Math.cos(pushAngle) * (TRACK_R - TRACK_W / 2 - 8);
        p.y = CENTER_Y + Math.sin(pushAngle) * (TRACK_R - TRACK_W / 2 - 8);
        p.v *= 0.3;
      }

      const currentAngle = Math.atan2(p.y - CENTER_Y, p.x - CENTER_X);
      const normalizedAngle = currentAngle < 0 ? currentAngle + Math.PI * 2 : currentAngle;
      if (normalizedAngle < 0.3 && lastAngleRef.current > Math.PI * 2 - 0.3) {
        if (!crossedStartRef.current) {
          crossedStartRef.current = true;
          if (p.v > 0.1) {
            setPlayerLap((prev) => {
              const newLap = prev + 1;
              if (newLap >= TOTAL_LAPS) {
                overRef.current = true;
                setOver(true);
                onComplete(scoreRef.current);
              }
              return newLap;
            });
          }
        }
      } else if (normalizedAngle > Math.PI) {
        crossedStartRef.current = false;
      }
      lastAngleRef.current = normalizedAngle;

      for (let i = 0; i < tokensRef.current.length; i++) {
        const t = tokensRef.current[i];
        if (t.taken) continue;
        const td = Math.hypot(t.x - p.x, t.y - p.y);
        if (td < 22) {
          tokensRef.current[i] = { ...t, taken: true };
          if (t.good) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
          } else {
            scoreRef.current = Math.max(0, scoreRef.current - 6);
            setScore(scoreRef.current);
            p.v *= 0.4;
          }
          setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const r = TRACK_R + (Math.random() - 0.5) * 20;
            tokensRef.current[i] = {
              x: CENTER_X + Math.cos(angle) * r,
              y: CENTER_Y + Math.sin(angle) * r,
              word: t.good ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)],
              good: t.good,
              taken: false,
            };
          }, 2000);
        }
      }

      for (const ai of aiRef.current) {
        ai.angle += ai.speed * 0.008 * (dt / 16);
        if (ai.angle > Math.PI * 2) {
          ai.angle -= Math.PI * 2;
        }
        const aiDx = Math.cos(ai.angle);
        const aiDy = Math.sin(ai.angle);
        const jitter = (Math.sin(now * 0.001 + ai.angle * 3) * 0.15);
        ai.x = CENTER_X + Math.cos(ai.angle) * (TRACK_R + jitter * 10);
        ai.y = CENTER_Y + Math.sin(ai.angle) * (TRACK_R + jitter * 10);

        const aiNorm = ai.angle;
        if (aiNorm < 0.3 && !aiLapCrossedRef.current[aiRef.current.indexOf(ai)]) {
          aiLapCrossedRef.current[aiRef.current.indexOf(ai)] = true;
          ai.lap++;
        } else if (aiNorm > Math.PI) {
          aiLapCrossedRef.current[aiRef.current.indexOf(ai)] = false;
        }
      }

      updatePositions();
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", ek);
      window.removeEventListener("keyup", eu);
      clearInterval(timer);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [onComplete, updatePositions]);

  return (
    <div className="relative h-[68vh] w-full overflow-hidden rounded-2xl" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #4CAF50 60%, #2E7D32 100%)" }}>
      {/* HUD */}
      <div className="absolute left-3 top-2 z-30 flex w-[calc(100%-1.5rem)] items-center justify-between text-sm">
        <span className="rounded-lg bg-white/80 px-3 py-1 font-black text-cyan-600 backdrop-blur-sm">Skor: {score}</span>
        <span className="rounded-lg bg-white/80 px-3 py-1 font-black text-rose-500 backdrop-blur-sm">Waktu: {time}s</span>
        <span className="rounded-lg bg-white/80 px-3 py-1 font-black text-purple-600 backdrop-blur-sm">Posisi: {position}/4</span>
        <span className="rounded-lg bg-white/80 px-3 py-1 font-black text-green-600 backdrop-blur-sm">Lap: {Math.min(playerLap + 1, TOTAL_LAPS)}/{TOTAL_LAPS}</span>
      </div>

      {/* Speed indicator */}
      <div className="absolute bottom-3 left-3 z-30">
        <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1 backdrop-blur-sm">
          <span className="text-xs font-bold text-gray-500">SPD</span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(speed * 140, 100)}%`,
                background: drifting
                  ? "linear-gradient(90deg, #f97316, #ef4444)"
                  : "linear-gradient(90deg, #22c55e, #06b6d4)",
              }}
            />
          </div>
          {drifting && <span className="text-xs font-black text-orange-500">DRIFT!</span>}
        </div>
      </div>

      {/* Track area */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {/* Track circle */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - TRACK_R - TRACK_W / 2,
            top: CENTER_Y - TRACK_R - TRACK_W / 2,
            width: (TRACK_R + TRACK_W / 2) * 2,
            height: (TRACK_R + TRACK_W / 2) * 2,
            borderRadius: "50%",
            border: "3px dashed rgba(255,255,255,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: CENTER_X - TRACK_R + TRACK_W / 2,
            top: CENTER_Y - TRACK_R + TRACK_W / 2,
            width: (TRACK_R - TRACK_W / 2) * 2,
            height: (TRACK_R - TRACK_W / 2) * 2,
            borderRadius: "50%",
            border: "3px dashed rgba(255,255,255,0.3)",
          }}
        />

        {/* Start/finish line */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X + TRACK_R - 3,
            top: CENTER_Y - 8,
            width: 6,
            height: 16,
            background: "repeating-linear-gradient(0deg, white 0px, white 3px, #1e293b 3px, #1e293b 6px)",
            borderRadius: 2,
            zIndex: 12,
          }}
        />

        {/* Track surface dots for visual reference */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CENTER_X + Math.cos(a) * TRACK_R - 2,
                top: CENTER_Y + Math.sin(a) * TRACK_R - 2,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                zIndex: 5,
              }}
            />
          );
        })}

        {/* Inner grass decoration */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - TRACK_R + TRACK_W / 2 + 10,
            top: CENTER_Y - TRACK_R + TRACK_W / 2 + 10,
            width: (TRACK_R - TRACK_W / 2 - 10) * 2,
            height: (TRACK_R - TRACK_W / 2 - 10) * 2,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.15)",
            zIndex: 4,
          }}
        />

        {/* Tokens */}
        {tokensRef.current.map((t, i) => (
          <TokenSprite key={i} {...t} />
        ))}

        {/* AI karts */}
        {aiRef.current.map((ai, i) => (
          <KartSprite key={`ai-${i}`} x={ai.x} y={ai.y} angle={ai.angle} body={ai.color} accent="white" />
        ))}

        {/* Player kart */}
        <KartSprite x={playerPos.x} y={playerPos.y} angle={playerPos.angle} body={kartBody} accent={kartAccent} />

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - 30,
            top: CENTER_Y - 10,
            width: 60,
            textAlign: "center",
            fontSize: 11,
            fontWeight: 900,
            color: "rgba(255,255,255,0.4)",
            fontFamily: '"Arial Black", sans-serif',
            letterSpacing: "0.1em",
            zIndex: 6,
          }}
        >
          PRIMA+
        </div>
      </div>

      {/* Instructions */}
      {!over && (
        <p className="absolute bottom-3 left-3 right-3 z-30 text-center text-[10px] text-gray-700">
          Panah/WASD nyetir · Spasi drift · Kumpul kata Indonesia (+10) · Hindari bahasa asing (−6) · 3 lap!
        </p>
      )}

      {/* Game over */}
      {over && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl text-center"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            animation: "fadeIn 0.4s ease-out both",
          }}
        >
          <p className="text-3xl font-black text-white" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>SELESAI!</p>
          <p className="mt-2 text-xl font-black text-cyan-300">Skor: {score}</p>
          <p className="mt-1 text-sm text-white/70">
            {score >= 80
              ? "Mantul! Loyalitas bahasamu kece."
              : score >= 40
              ? "Lumayan, masih bisa lebih sadar."
              : "Coba lagi, kumpulin lebih banyak kata Indonesia!"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
