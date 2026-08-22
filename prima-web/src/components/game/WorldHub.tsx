"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const WorldHubScene = dynamic(() => import("./WorldHubScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-[#1ea5e9] to-[#a5f3fc]" />,
});

const LOCATIONS = [
  { i: 0, title: "LANGUAGE KART ARENA", sub: "Balapan 3D", color: "from-rose-500 to-orange-400", href: "/select" },
  { i: 1, title: "MINI GAME ARCADE", sub: "6 tantangan", color: "from-cyan-500 to-blue-500", href: "/games" },
  { i: 2, title: "CHALLENGE TOWER", sub: "Final Challenge", color: "from-violet-500 to-fuchsia-500", href: "/quiz" },
  { i: 3, title: "FEEDBACK STATION", sub: "Kirim Saran", color: "from-pink-500 to-rose-400", href: "/feedback" },
];

export default function WorldHub({
  episodesDone = 0,
  total = 6,
  cards = 0,
  gameScores = {} as Record<string, number>,
}: {
  episodesDone?: number;
  total?: number;
  cards?: number;
  gameScores?: Record<string, number>;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const pct = Math.round((episodesDone / total) * 100);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <SceneErrorBoundary label="World Hub">
        <WorldHubScene hovered={hovered} onPick={(i) => router.push(LOCATIONS[i].href)} />
      </SceneErrorBoundary>

      {/* HUD top */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80">PRIMA CITY</p>
          <h1 className="text-2xl font-black text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>PILIH PETUALANGANMU</h1>
        </div>
        <div className="rounded-xl bg-black/40 px-3 py-2 text-right text-white">
          <p className="text-[10px] uppercase tracking-wide text-white/60">Progress Belajar</p>
          <p className="text-sm font-black">{episodesDone}/{total} · {pct}%</p>
        </div>
      </div>

      {/* location buttons */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        {LOCATIONS.map((l) => (
          <motion.button
            key={l.i}
            onMouseEnter={() => setHovered(l.i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(l.href)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${l.color} p-4 shadow-[0_6px_0_rgba(0,0,0,0.4)]`}
          >
            <span className="text-sm font-black text-white" style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.4)" }}>{l.title}</span>
            <span className="text-[11px] text-white/90">{l.sub}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
