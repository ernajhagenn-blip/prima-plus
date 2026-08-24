"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SceneErrorBoundary from "./SceneErrorBoundary";

const WorldHubScene = dynamic(() => import("./WorldHubScene"), { ssr: false });

const ZONES = [
  {
    id: "story",
    icon: "🏰",
    name: "Story District",
    desc: "Jelajahi cerita dan ambil keputusan yang membentuk karaktermu.",
    href: "/journey/1",
    gradient: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
    shadow: "#2E7D32",
    glow: "rgba(76,175,80,0.45)",
    status: "available" as const,
  },
  {
    id: "kart",
    icon: "🏎️",
    name: "PRIMA Kart Arena",
    desc: "Balapan kart melalui checkpoint situasi bahasa Indonesia.",
    href: "/select",
    gradient: "linear-gradient(135deg, #EF5350 0%, #FFA726 100%)",
    shadow: "#C62828",
    glow: "rgba(239,83,80,0.45)",
    status: "available" as const,
  },
  {
    id: "tower",
    icon: "🏗️",
    name: "Challenge Tower",
    desc: "Taklukkan 6 lantai tantangan bahasa untuk membuktikan kemampuanmu.",
    href: "/games/challenge-tower",
    gradient: "linear-gradient(135deg, #AB47BC 0%, #7E57C2 100%)",
    shadow: "#6A1B9A",
    glow: "rgba(171,71,188,0.45)",
    status: "available" as const,
  },
  {
    id: "arcade",
    icon: "🎮",
    name: "Mini Game Arcade",
    desc: "6 mini games seru untuk melatih kesadaran berbahasa.",
    href: "/games",
    gradient: "linear-gradient(135deg, #42A5F5 0%, #26C6DA 100%)",
    shadow: "#1565C0",
    glow: "rgba(66,165,245,0.45)",
    status: "available" as const,
  },
  {
    id: "garage",
    icon: "🔧",
    name: "Garage & Upgrade",
    desc: "Kustomisasi kart dan tingkatkan performa balapanmu.",
    href: "/kart",
    gradient: "linear-gradient(135deg, #FFCA28 0%, #FFA726 100%)",
    shadow: "#F57F17",
    glow: "rgba(255,202,40,0.45)",
    status: "available" as const,
  },
  {
    id: "knowledge",
    icon: "📚",
    name: "Knowledge Center",
    desc: "Pelajari materi kesadaran berbahasa sebelum masuk arena.",
    href: "/edukasi",
    gradient: "linear-gradient(135deg, #26C6DA 0%, #42A5F5 100%)",
    shadow: "#00838F",
    glow: "rgba(38,198,218,0.45)",
    status: "available" as const,
  },
] as const;

const DIMENSIONS = [
  { key: "konteks", label: "Konteks", value: 82, color: "#42A5F5" },
  { key: "kejelasan", label: "Kejelasan", value: 76, color: "#AB47BC" },
  { key: "adaptasi", label: "Adaptasi", value: 88, color: "#66BB6A" },
  { key: "loyalitas", label: "Loyalitas", value: 71, color: "#EF5350" },
  { key: "kesadaran", label: "Kesadaran", value: 65, color: "#FFCA28" },
];

function ZoneCard({ zone, onClick }: { zone: (typeof ZONES)[number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="group relative overflow-hidden text-left transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        borderRadius: 20,
        background: zone.gradient,
        border: "3px solid rgba(255,255,255,0.4)",
        boxShadow: hovered
          ? `0 6px 0 ${zone.shadow}, 0 10px 20px rgba(0,0,0,0.25), 0 0 30px ${zone.glow}`
          : `0 6px 0 ${zone.shadow}, 0 10px 20px rgba(0,0,0,0.2)`,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[17px] bg-gradient-to-b from-white/25 to-transparent" />
      <div className="relative p-5 pb-6">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30 text-4xl backdrop-blur-sm">
          {zone.icon}
        </div>
        <h2 className="text-lg font-black uppercase tracking-wide text-white drop-shadow-md">
          {zone.name}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/90">{zone.desc}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-200 group-hover:bg-white/45">
          <span>Kunjungi</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}

function ProfileCard({ name, level, stars }: { name: string; level: number; stars: number }) {
  return (
    <div
      className="overflow-hidden rounded-3xl text-white"
      style={{
        background: "linear-gradient(180deg, #FFA726 0%, #EF5350 50%, #E53935 100%)",
        border: "3px solid rgba(255,255,255,0.4)",
        boxShadow: "0 6px 0 #BF360C, 0 10px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="relative p-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 text-4xl backdrop-blur-sm"
            style={{ border: "3px solid rgba(255,255,255,0.5)" }}
          >
            🧑‍🚀
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-white drop-shadow-md">
              {name || "Petualang"}
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/30 px-3 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
              ⭐ Level {level}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/25 px-4 py-2.5 backdrop-blur-sm">
          <span className="text-xl">⭐</span>
          <span className="text-lg font-black text-white">{stars}</span>
          <span className="text-xs font-semibold text-white/70">Bintang</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white/80">{d.label}</span>
                <span className="text-[11px] font-bold text-white">{d.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${d.value}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-4 h-28 w-28">
          <RadarChart />
        </div>
      </div>
    </div>
  );
}

function RadarChart() {
  const cx = 56;
  const cy = 56;
  const r = 42;
  const rings = [0.25, 0.5, 0.75, 1];
  const axes = DIMENSIONS.length;
  const points = DIMENSIONS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    const dist = (d.value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 112 112" className="h-full w-full">
      {rings.map((s) => (
        <polygon
          key={s}
          points={Array.from({ length: axes }, (_, i) => {
            const a = (Math.PI * 2 * i) / axes - Math.PI / 2;
            return `${cx + r * s * Math.cos(a)},${cy + r * s * Math.sin(a)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />
      ))}
      {Array.from({ length: axes }, (_, i) => {
        const a = (Math.PI * 2 * i) / axes - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a)}
            y2={cy + r * Math.sin(a)}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.6"
          />
        );
      })}
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" />
      ))}
    </svg>
  );
}

export default function WorldHub({
  episodesDone = 0,
  total = 6,
  cards = 0,
  gameScores = {} as Record<string, number>,
  playerName = "",
}: {
  episodesDone?: number;
  total?: number;
  cards?: number;
  gameScores?: Record<string, number>;
  playerName?: string;
}) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((episodesDone / total) * 100) : 0;
  const level = Math.floor(episodesDone / 2) + 1;
  const stars = Object.values(gameScores).reduce((a, b) => a + b, 0) + cards * 5;

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 20%, #B3E5FC 45%, #C8E6C9 70%, #A5D6A7 85%, #81C784 100%)",
      }}
    >
      <SceneErrorBoundary label="World Hub">
        <WorldHubScene />
      </SceneErrorBoundary>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6" style={{ zIndex: 10 }}>
        <header className="text-center" style={{ animation: "slideDown 0.5s ease-out both" }}>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/80">
            PRIMA+ World Hub
          </p>
          <h1
            className="mt-2 text-5xl font-black tracking-tight text-white sm:text-6xl"
            style={{
              textShadow: "0 4px 0 #1565C0, 0 6px 12px rgba(0,0,0,0.2)",
            }}
          >
            PRIMA CITY
          </h1>
          <p className="mt-1 text-sm font-bold text-white/85">PILIH PETUALANGANMU!</p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            {ZONES.map((zone, i) => (
              <div key={zone.id} style={{ animation: `slideUp 0.5s ${i * 0.08}s ease-out both` }}>
                <ZoneCard zone={zone} onClick={() => router.push(zone.href)} />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1" style={{ animation: "slideRight 0.5s 0.4s ease-out both" }}>
            <ProfileCard name={playerName} level={level} stars={stars} />
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden rounded-3xl"
          style={{
            animation: "slideUp 0.5s 0.7s ease-out both",
            background: "linear-gradient(135deg, #FFA726 0%, #EF5350 50%, #EC407A 100%)",
            border: "3px solid rgba(255,255,255,0.4)",
            boxShadow: "0 6px 0 #BF360C, 0 10px 20px rgba(0,0,0,0.2)",
          }}
        >
          <div className="relative p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-white drop-shadow-md">
                  🗺️ Progress Perjalanan
                </h3>
                <span className="text-2xl font-black text-white drop-shadow-md">{pct}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                <p className="text-xs font-semibold text-white/80">
                  Episode: <span className="font-black text-white">{episodesDone}/{total}</span>
                </p>
                <p className="text-xs font-semibold text-white/80">
                  Kartu: <span className="font-black text-white">{cards}</span>
                </p>
                <p className="text-xs font-semibold text-white/80">
                  Skor Total: <span className="font-black text-white">{stars}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center" style={{ animation: "fadeIn 0.8s 1s ease-out both" }}>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
            PRIMA+ · BAHASA KITA. PILIHAN KITA.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { 0% { opacity: 0; transform: translateX(30px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
