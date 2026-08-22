"use client";

import { useEffect, useRef, useState } from "react";

type Plat = { x: number; y: number; w: number; h: number };
type Token = { x: number; y: number; word: string; good: boolean; taken: boolean };

const W = 900;
const H = 420;

const PLATS: Plat[] = [
  { x: 0, y: H - 28, w: W, h: 28 },
  { x: 140, y: H - 120, w: 130, h: 16 },
  { x: 340, y: H - 185, w: 130, h: 16 },
  { x: 540, y: H - 130, w: 130, h: 16 },
  { x: 720, y: H - 210, w: 150, h: 16 },
];

const GOOD = ["salam", "teman", "karya", "semangat", "jujur", "ramah", "belajar", "senyum", "cantik", "hebat"];
const BAD = ["hallo", "omg", "btw", "vibes", "slay", "okay"];

export default function PlatformerGame({ onComplete }: { onComplete: (score: number, won: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState<null | "win" | "lose">(null);
  const [pop, setPop] = useState<{ text: string; good: boolean } | null>(null);

  const scoreRef = useRef(0);
  const overRef = useRef<null | "win" | "lose">(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const keys: Record<string, boolean> = {};
    const ek = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keys[e.key.toLowerCase()] = true;
    };
    const eu = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);

    const p = { x: 40, y: H - 70, w: 26, h: 34, vx: 0, vy: 0, onGround: false };
    let tokens: Token[] = [
      { x: 200, y: H - 150, word: GOOD[0], good: true, taken: false },
      { x: 400, y: H - 215, word: GOOD[1], good: true, taken: false },
      { x: 600, y: H - 160, word: GOOD[2], good: true, taken: false },
      { x: 790, y: H - 240, word: GOOD[3], good: true, taken: false },
      { x: 300, y: H - 55, word: BAD[0], good: false, taken: false },
      { x: 500, y: H - 55, word: BAD[1], good: false, taken: false },
      { x: 680, y: H - 55, word: BAD[2], good: false, taken: false },
    ];

    const flag = { x: W - 50, y: H - 28 };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      const f = dt / 16;

      // input
      if (keys["arrowleft"] || keys["a"]) p.vx = -3.2;
      else if (keys["arrowright"] || keys["d"]) p.vx = 3.2;
      else p.vx = 0;
      if ((keys["arrowup"] || keys["w"] || keys[" "]) && p.onGround) { p.vy = -9.5; p.onGround = false; }

      p.vy += 0.55 * f;
      if (p.vy > 12) p.vy = 12;
      p.x += p.vx * f;
      p.y += p.vy * f;

      // walls
      if (p.x < 14) p.x = 14;
      if (p.x > W - 40) p.x = W - 40;

      // platform collision
      p.onGround = false;
      const prevBottom = p.y + p.h - p.vy * f;
      for (const pl of PLATS) {
        const within = p.x + p.w > pl.x && p.x < pl.x + pl.w;
        const foot = p.y + p.h;
        if (within && p.vy >= 0 && prevBottom <= pl.y + 6 && foot >= pl.y) {
          p.y = pl.y - p.h;
          p.vy = 0;
          p.onGround = true;
        }
      }

      // tokens
      for (const tk of tokens) {
        if (tk.taken) continue;
        if (Math.abs(tk.x - (p.x + p.w / 2)) < 24 && Math.abs(tk.y - (p.y + p.h / 2)) < 28) {
          tk.taken = true;
          if (tk.good) {
            scoreRef.current += 10; setScore(scoreRef.current);
            setPop({ text: "+10 " + tk.word, good: true });
          } else {
            scoreRef.current = Math.max(0, scoreRef.current - 6); setScore(scoreRef.current);
            p.vy = -5; p.x -= 30;
            setPop({ text: "jebakan! " + tk.word, good: false });
          }
          setTimeout(() => setPop(null), 600);
        }
      }

      // win / lose
      if (p.x + p.w >= flag.x - 10 && !overRef.current) {
        overRef.current = "win"; setOver("win"); onCompleteRef.current(scoreRef.current, true);
      }

      // draw
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0b1130"); g.addColorStop(1, "#1b1147");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      for (const pl of PLATS) {
        ctx.fillStyle = pl.y === H - 28 ? "#312e81" : "#4338ca";
        ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      }

      // flag
      ctx.fillStyle = "#facc15";
      ctx.fillRect(flag.x, flag.y - 70, 4, 70);
      ctx.beginPath();
      ctx.moveTo(flag.x + 4, flag.y - 70);
      ctx.lineTo(flag.x + 30, flag.y - 58);
      ctx.lineTo(flag.x + 4, flag.y - 46);
      ctx.fill();

      // tokens
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const tk of tokens) {
        if (tk.taken) continue;
        ctx.beginPath();
        ctx.arc(tk.x, tk.y, 13, 0, Math.PI * 2);
        ctx.fillStyle = tk.good ? "#22d3ee" : "#fb7185";
        ctx.fill();
        ctx.fillStyle = tk.good ? "#cffafe" : "#fecdd3";
        ctx.font = "11px sans-serif";
        ctx.fillText(tk.word, tk.x, tk.y + 22);
      }

      // player
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "#0ea5e9";
      ctx.fillRect(p.x + 4, p.y + 6, p.w - 8, 10);

      if (!overRef.current) requestAnimationFrame(loop);
    };
    const raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", ek);
      window.removeEventListener("keyup", eu);
    };
  }, []);

  return (
    <div className="relative">
      <div className="mb-2 text-sm">
        <span className="font-bold text-cyan-300">Skor: {score}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-2xl border border-white/10 bg-[#0b1130]" />
      {pop && (
        <div className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${pop.good ? "bg-cyan-400/20 text-cyan-200" : "bg-rose-500/20 text-rose-200"}`}>
          {pop.text}
        </div>
      )}
      {!over && (
        <p className="mt-2 text-xs text-white/50">
          Panah kiri/kanan atau A/D buat jalan, Spasi / panah atas buat lompat.
          Ambil kata Biru, hindari kata Merah, tembus bendera kuning!
        </p>
      )}
      {over === "win" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/70 text-center">
          <p className="text-2xl font-black text-white">MANTUL! SAMPE FINISH</p>
          <p className="mt-1 text-cyan-300">Skor: {score}</p>
        </div>
      )}
    </div>
  );
}
