"use client";

import { useEffect, useRef, useState } from "react";

type Token = { x: number; y: number; word: string; good: boolean; taken: boolean; t: number };

const GOOD = [
  "makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar",
  "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik",
];
const BAD = [
  "hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you", "so fun",
];

const W = 900;
const H = 520;

export default function RacingGame({ onComplete }: { onComplete: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [over, setOver] = useState(false);
  const [pop, setPop] = useState<{ text: string; good: boolean } | null>(null);

  const scoreRef = useRef(0);
  const overRef = useRef(false);
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

    const player = { x: W / 2, y: H - 80, a: 0, v: 0 };
    let tokens: Token[] = [];
    const spawn = (good: boolean): Token => ({
      x: 60 + Math.random() * (W - 120),
      y: 60 + Math.random() * (H - 160),
      word: (good ? GOOD : BAD)[Math.floor(Math.random() * (good ? GOOD : BAD).length)],
      good,
      taken: false,
      t: 0,
    });
    for (let i = 0; i < 7; i++) tokens.push(spawn(true));
    for (let i = 0; i < 3; i++) tokens.push(spawn(false));

    let last = performance.now();
    let tick = 0;

    const loop = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;

      // input
      if (keys["arrowup"] || keys["w"]) player.v += 0.18;
      if (keys["arrowdown"] || keys["s"]) player.v -= 0.22;
      if (keys["arrowleft"] || keys["a"]) player.a -= 0.055;
      if (keys["arrowright"] || keys["d"]) player.a += 0.055;
      player.v *= 0.95;
      if (player.v > 5) player.v = 5;
      if (player.v < -2) player.v = -2;
      player.x += Math.sin(player.a) * player.v * (dt / 16);
      player.y -= Math.cos(player.a) * player.v * (dt / 16);

      // bounds
      if (player.x < 22) { player.x = 22; player.v *= 0.4; }
      if (player.x > W - 22) { player.x = W - 22; player.v *= 0.4; }
      if (player.y < 22) { player.y = 22; player.v *= 0.4; }
      if (player.y > H - 22) { player.y = H - 22; player.v *= 0.4; }

      // tokens
      for (const tk of tokens) {
        const d = Math.hypot(tk.x - player.x, tk.y - player.y);
        if (!tk.taken && d < 26) {
          tk.taken = true;
          if (tk.good) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            setPop({ text: "+10 " + tk.word, good: true });
          } else {
            scoreRef.current = Math.max(0, scoreRef.current - 6);
            setScore(scoreRef.current);
            player.v *= 0.3;
            setPop({ text: "jebakan! " + tk.word, good: false });
          }
          setTimeout(() => setPop(null), 600);
          tk.t = 0;
          // respawn elsewhere
          Object.assign(tk, spawn(tk.good));
        }
      }

      // render
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0c1330");
      g.addColorStop(1, "#161f4d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // track ring
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 60;
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2, W / 2 - 70, H / 2 - 50, 0, 0, Math.PI * 2);
      ctx.stroke();

      // tokens
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const tk of tokens) {
        ctx.beginPath();
        ctx.arc(tk.x, tk.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = tk.good ? "#22d3ee" : "#fb7185";
        ctx.fill();
        ctx.fillStyle = "#06121f";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(tk.good ? "ID" : "EN", tk.x, tk.y);
        ctx.fillStyle = tk.good ? "#cffafe" : "#fecdd3";
        ctx.font = "12px sans-serif";
        ctx.fillText(tk.word, tk.x, tk.y + 28);
      }

      // player kart
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.a);
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(-12, -8, 24, 16);
      ctx.fillStyle = "#0ea5e9";
      ctx.fillRect(-8, -5, 16, 10);
      ctx.restore();

      tick += dt;
      if (!overRef.current) requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          overRef.current = true;
          onCompleteRef.current(scoreRef.current);
          setOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      window.removeEventListener("keydown", ek);
      window.removeEventListener("keyup", eu);
    };
  }, []);

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-cyan-600">Skor: {score}</span>
        <span className="font-bold text-rose-500">Waktu: {time}s</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full rounded-2xl border-2 border-red-200 bg-[#0c1330]"
      />
      {pop && (
        <div
          className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${
            pop.good ? "bg-cyan-400/20 text-cyan-200" : "bg-rose-500/20 text-rose-200"
          }`}
        >
          {pop.text}
        </div>
      )}
      {!over && (
        <p className="mt-2 text-xs text-white/50">
          Pakai panah / WASD buat nyetir. Kumpulin kata Biru (Bahasa Indonesia),
          jangan nabrak kata Merah (bahasa asing). Gas!
        </p>
      )}
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/70 text-center">
          <p className="text-2xl font-black text-white">SELESAI!</p>
          <p className="mt-1 text-cyan-300">Skor kamu: {score}</p>
          <p className="mt-1 text-xs text-white/70">
            {score >= 80 ? "Mantul! Loyalitas bahasamu kece." : score >= 40 ? "Lumayan, masih bisa lebih sadar." : "Coba lagi, kumpulin lebih banyak kata Indonesia!"}
          </p>
        </div>
      )}
    </div>
  );
}
