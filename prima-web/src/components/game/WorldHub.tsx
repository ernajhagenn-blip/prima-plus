"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ZONES = [
  {
    id: "story",
    icon: "🏰",
    name: "Story District",
    desc: "Jelajahi cerita dan ambil keputusan yang membentuk karaktermu.",
    href: "/journey/1",
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    shadow: "#15803d",
    glow: "rgba(34,197,94,0.45)",
    status: "available" as const,
  },
  {
    id: "kart",
    icon: "🏎️",
    name: "PRIMA Kart Arena",
    desc: "Balapan kart melalui checkpoint situasi bahasa Indonesia.",
    href: "/select",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
    shadow: "#b91c1c",
    glow: "rgba(239,68,68,0.45)",
    status: "available" as const,
  },
  {
    id: "tower",
    icon: "🏗️",
    name: "Challenge Tower",
    desc: "Taklukkan 6 lantai tantangan bahasa untuk membuktikan kemampuanmu.",
    href: "/games/challenge-tower",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    shadow: "#6b21a8",
    glow: "rgba(168,85,247,0.45)",
    status: "available" as const,
  },
  {
    id: "arcade",
    icon: "🎮",
    name: "Mini Game Arcade",
    desc: "6 mini games seru untuk melatih kesadaran berbahasa.",
    href: "/games",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    shadow: "#1d4ed8",
    glow: "rgba(59,130,246,0.45)",
    status: "available" as const,
  },
  {
    id: "garage",
    icon: "🔧",
    name: "Garage & Upgrade",
    desc: "Kustomisasi kart dan tingkatkan performa balapanmu.",
    href: "/kart",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    shadow: "#b45309",
    glow: "rgba(245,158,11,0.45)",
    status: "available" as const,
  },
  {
    id: "knowledge",
    icon: "📚",
    name: "Knowledge Center",
    desc: "Pelajari materi kesadaran berbahasa sebelum masuk arena.",
    href: "/edukasi",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
    shadow: "#0d9488",
    glow: "rgba(20,184,166,0.45)",
    status: "available" as const,
  },
] as const;

const DIMENSIONS = [
  { key: "konteks", label: "Konteks", value: 82, color: "#3b82f6" },
  { key: "kejelasan", label: "Kejelasan", value: 76, color: "#a855f7" },
  { key: "adaptasi", label: "Adaptasi", value: 88, color: "#22c55e" },
  { key: "loyalitas", label: "Loyalitas", value: 71, color: "#ef4444" },
  { key: "kesadaran", label: "Kesadaran", value: 65, color: "#f59e0b" },
];

function ZoneCard({
  zone,
  onClick,
}: {
  zone: (typeof ZONES)[number];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="group relative overflow-hidden text-left transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] active:scale-[0.97] animate-slide-up"
      style={{
        borderRadius: 20,
        background: zone.gradient,
        border: "3px solid rgba(255,255,255,0.3)",
        boxShadow: hovered
          ? `0 6px 0 ${zone.shadow}, 0 10px 20px rgba(0,0,0,0.25), 0 0 30px ${zone.glow}`
          : `0 6px 0 ${zone.shadow}, 0 10px 20px rgba(0,0,0,0.2)`,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[17px] bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative p-5 pb-6">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/25 text-4xl backdrop-blur-sm">
          {zone.icon}
        </div>

        <h2 className="text-lg font-black uppercase tracking-wide text-white drop-shadow-md">
          {zone.name}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
          {zone.desc}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-200 group-hover:bg-white/35">
          <span>Kunjungi</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}

function ProfileCard({
  name,
  level,
  stars,
}: {
  name: string;
  level: number;
  stars: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-3xl text-white"
      style={{
        background: "linear-gradient(180deg, #f97316 0%, #ef4444 50%, #dc2626 100%)",
        border: "3px solid rgba(255,255,255,0.35)",
        boxShadow: "0 6px 0 #991b1b, 0 10px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-4xl backdrop-blur-sm"
            style={{ border: "3px solid rgba(255,255,255,0.4)" }}
          >
            🧑‍🚀
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-white drop-shadow-md">
              {name || "Petualang"}
            </p>
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
              ⭐ Level {level}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm">
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
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

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
        background: "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #bae6fd 55%, #86efac 80%, #4ade80 100%)",
      }}
    >
      {/* Floating clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[8%] left-[5%] h-20 w-40 rounded-full bg-white/40 blur-sm"
          style={{ filter: "blur(8px)" }}
        />
        <div
          className="absolute top-[12%] left-[15%] h-14 w-28 rounded-full bg-white/30 blur-sm"
          style={{ filter: "blur(6px)" }}
        />
        <div
          className="absolute top-[5%] right-[10%] h-24 w-48 rounded-full bg-white/35 blur-sm"
          style={{ filter: "blur(10px)" }}
        />
        <div
          className="absolute top-[15%] right-[25%] h-16 w-32 rounded-full bg-white/25 blur-sm"
          style={{ filter: "blur(7px)" }}
        />
        <div
          className="absolute top-[20%] left-[50%] h-12 w-24 rounded-full bg-white/30 blur-sm"
          style={{ filter: "blur(6px)" }}
        />

        {/* Rolling hills at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[25vh]">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="h-full w-full">
            <ellipse cx="360" cy="200" rx="600" ry="180" fill="#22c55e" opacity="0.5" />
            <ellipse cx="1080" cy="200" rx="500" ry="160" fill="#16a34a" opacity="0.4" />
            <ellipse cx="720" cy="210" rx="800" ry="150" fill="#15803d" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6">
        {/* Header */}
        <header
          className="animate-slide-down text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/70">
            PRIMA+ World Hub
          </p>
          <h1
            className="mt-2 text-5xl font-black tracking-tight text-white sm:text-6xl"
            style={{ textShadow: "0 4px 0 #1d4ed8, 0 6px 12px rgba(0,0,0,0.2)" }}
          >
            PRIMA CITY
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/80">PILIH PETUALANGANMU!</p>
        </header>

        {/* Main layout: Zones + Profile */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Zone Grid - left side */}
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3"
          >
            {ZONES.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} onClick={() => router.push(zone.href)} />
            ))}
          </div>

          {/* Profile Card - right sidebar */}
          <div
            className="animate-slide-in-right lg:col-span-1"
            style={{ animationDelay: "400ms" }}
          >
            <ProfileCard name={playerName} level={level} stars={stars} />
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div
          className="mt-8 animate-slide-up overflow-hidden rounded-3xl"
          style={{
            animationDelay: "700ms",
            background: "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)",
            border: "3px solid rgba(255,255,255,0.35)",
            boxShadow: "0 6px 0 #9f1239, 0 10px 20px rgba(0,0,0,0.2)",
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

        {/* Footer branding */}
        <div
          className="mt-6 animate-fade-in text-center"
          style={{ animationDelay: "1000ms" }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            PRIMA+ · BAHASA KITA. PILIHAN KITA.
          </p>
        </div>
      </div>
    </div>
  );
}
