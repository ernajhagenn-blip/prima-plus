"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ZONES = [
  {
    id: "story",
    icon: "🏰",
    name: "Story District",
    desc: "Jelajahi cerita dan ambil keputusan yang membentuk karaktermu.",
    href: "/journey/1",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glow: "rgba(251,146,60,0.35)",
    status: "available" as const,
  },
  {
    id: "kart",
    icon: "🏎️",
    name: "PRIMA Kart Arena",
    desc: "Balapan kart melalui checkpoint situasi bahasa Indonesia.",
    href: "/select",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    glow: "rgba(244,63,94,0.35)",
    status: "available" as const,
  },
  {
    id: "tower",
    icon: "🏗️",
    name: "Challenge Tower",
    desc: "Taklukkan 6 lantai tantangan bahasa untuk membuktikan kemampuanmu.",
    href: "/games/challenge-tower",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    glow: "rgba(167,139,250,0.35)",
    status: "available" as const,
  },
  {
    id: "arcade",
    icon: "🎮",
    name: "Mini Game Arcade",
    desc: "6 mini games seru untuk melatih kesadaran berbahasa.",
    href: "/games",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    glow: "rgba(6,182,212,0.35)",
    status: "available" as const,
  },
  {
    id: "garage",
    icon: "🔧",
    name: "Garage & Upgrade",
    desc: "Kustomisasi kart dan tingkatkan performa balapanmu.",
    href: "/kart",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "rgba(56,189,248,0.35)",
    status: "available" as const,
  },
  {
    id: "knowledge",
    icon: "📚",
    name: "Knowledge Center",
    desc: "Pelajari materi kesadaran berbahasa sebelum masuk arena.",
    href: "/edukasi",
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    glow: "rgba(16,185,129,0.35)",
    status: "available" as const,
  },
] as const;

const STATUS_LABEL: Record<string, { text: string; color: string; dot: string }> = {
  available: { text: "Bisa Dimainkan", color: "text-emerald-400", dot: "bg-emerald-400" },
  locked: { text: "Terkunci", color: "text-zinc-500", dot: "bg-zinc-500" },
  completed: { text: "Selesai", color: "text-amber-400", dot: "bg-amber-400" },
};

const DIMENSIONS = [
  { key: "konteks", label: "Konteks", value: 82, color: "from-cyan-400 to-blue-500" },
  { key: "kejelasan", label: "Kejelasan", value: 76, color: "from-violet-400 to-purple-500" },
  { key: "adaptasi", label: "Adaptasi", value: 88, color: "from-emerald-400 to-teal-500" },
  { key: "loyalitas", label: "Loyalitas", value: 71, color: "from-rose-400 to-pink-500" },
  { key: "kesadaran", label: "Kesadaran", value: 65, color: "from-amber-400 to-orange-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
};

function PlayerCard({ name, level, stars }: { name: string; level: number; stars: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-lg shadow-orange-500/20">
        🧑‍🚀
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{name || "Petualang"}</p>
        <p className="text-[11px] text-white/50">Level {level}</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1">
        <span className="text-sm">⭐</span>
        <span className="text-xs font-bold text-amber-400">{stars}</span>
      </div>
    </div>
  );
}

function DimensionBar({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/60">{label}</span>
        <span className="text-[11px] font-bold text-white/80">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        />
      </div>
    </div>
  );
}

function RadarChartPlaceholder() {
  const cx = 75;
  const cy = 75;
  const r = 55;
  const rings = [0.25, 0.5, 0.75, 1];
  const axes = DIMENSIONS.length;
  const points = DIMENSIONS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    const dist = (d.value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 150 150" className="h-full w-full">
      {rings.map((s) => (
        <polygon
          key={s}
          points={Array.from({ length: axes }, (_, i) => {
            const a = (Math.PI * 2 * i) / axes - Math.PI / 2;
            return `${cx + r * s * Math.cos(a)},${cy + r * s * Math.sin(a)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
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
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.6"
          />
        );
      })}
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.6)" strokeWidth="1.2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#38bdf8" />
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const pct = total > 0 ? Math.round((episodesDone / total) * 100) : 0;
  const level = Math.floor(episodesDone / 2) + 1;
  const stars = Object.values(gameScores).reduce((a, b) => a + b, 0) + cards * 5;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#060b1e] text-white">
      {/* City silhouette background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#0a1128]/90 to-transparent" />
        <div
          className="absolute bottom-0 left-0 right-0 h-[30vh] opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Crect x='20' y='60' width='40' height='140' rx='2' fill='white'/%3E%3Crect x='70' y='30' width='30' height='170' rx='2' fill='white'/%3E%3Crect x='110' y='80' width='50' height='120' rx='2' fill='white'/%3E%3Crect x='170' y='20' width='25' height='180' rx='2' fill='white'/%3E%3Crect x='205' y='50' width='35' height='150' rx='2' fill='white'/%3E%3Crect x='250' y='40' width='45' height='160' rx='2' fill='white'/%3E%3Crect x='310' y='70' width='30' height='130' rx='2' fill='white'/%3E%3Crect x='350' y='15' width='20' height='185' rx='2' fill='white'/%3E%3Crect x='380' y='55' width='55' height='145' rx='2' fill='white'/%3E%3Crect x='450' y='35' width='28' height='165' rx='2' fill='white'/%3E%3Crect x='490' y='65' width='42' height='135' rx='2' fill='white'/%3E%3Crect x='545' y='25' width='36' height='175' rx='2' fill='white'/%3E%3Crect x='590' y='50' width='48' height='150' rx='2' fill='white'/%3E%3Crect x='650' y='10' width='22' height='190' rx='2' fill='white'/%3E%3Crect x='685' y='45' width='40' height='155' rx='2' fill='white'/%3E%3Crect x='740' y='60' width='52' height='140' rx='2' fill='white'/%3E%3Crect x='810' y='20' width='30' height='180' rx='2' fill='white'/%3E%3Crect x='850' y='55' width='38' height='145' rx='2' fill='white'/%3E%3Crect x='900' y='35' width='26' height='165' rx='2' fill='white'/%3E%3Crect x='940' y='70' width='44' height='130' rx='2' fill='white'/%3E%3Crect x='1000' y='25' width='34' height='175' rx='2' fill='white'/%3E%3Crect x='1050' y='50' width='48' height='150' rx='2' fill='white'/%3E%3Crect x='1110' y='40' width='28' height='160' rx='2' fill='white'/%3E%3Crect x='1150' y='60' width='36' height='140' rx='2' fill='white'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundSize: "auto 100%",
          }}
        />
        {/* Ambient glow spots */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-violet-500/5 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/5 blur-[100px]" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400/70">
              PRIMA+ World Hub
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
              PRIMA<span className="text-cyan-400">CITY</span>
            </h1>
            <p className="mt-1 text-sm text-white/40">PILIH PETUALANGANMU.</p>
          </div>
          <PlayerCard name={playerName} level={level} stars={stars} />
        </motion.header>

        {/* Zone Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ZONES.map((zone) => {
            const st = STATUS_LABEL[zone.status];
            const isHovered = hoveredId === zone.id;
            return (
              <motion.button
                key={zone.id}
                variants={item}
                onMouseEnter={() => setHoveredId(zone.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => router.push(zone.href)}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 text-left transition-all duration-300"
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
                    : `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                  boxShadow: isHovered ? `0 20px 50px -12px ${zone.glow}, 0 0 0 1px rgba(255,255,255,0.1)` : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* Glossy top edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${zone.gradient} text-2xl shadow-lg`}
                      style={{ boxShadow: `0 8px 24px -4px ${zone.glow}` }}
                    >
                      {zone.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${st.color}`}>
                        {st.text}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-4 text-base font-black uppercase tracking-wide text-white">
                    {zone.name}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                    {zone.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-white/30 transition-colors group-hover:text-white/60">
                    <span>Masuk Zona</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${zone.gradient} transition-all duration-500 group-hover:w-full`}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Bottom Section: Progress + Radar */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Overall Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:col-span-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/70">Progress Perjalanan</h3>
              <span className="text-lg font-black text-cyan-400">{pct}%</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <p className="text-[11px] text-white/40">
                Episode: <span className="font-bold text-white/70">{episodesDone}/{total}</span>
              </p>
              <p className="text-[11px] text-white/40">
                Kartu: <span className="font-bold text-white/70">{cards}</span>
              </p>
              <p className="text-[11px] text-white/40">
                Skor Total: <span className="font-bold text-white/70">{stars}</span>
              </p>
            </div>
          </motion.div>

          {/* Radar Chart + Dimensions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:col-span-2"
          >
            <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-white/70">
              Dimensi Kemampuan
            </h3>
            <div className="mx-auto h-32 w-32">
              <RadarChartPlaceholder />
            </div>
            <div className="mt-3 space-y-2.5">
              {DIMENSIONS.map((d) => (
                <DimensionBar key={d.key} label={d.label} value={d.value} gradient={d.color} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/15">
            PRIMA+ · BAHASA KITA. PILIHAN KITA.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
