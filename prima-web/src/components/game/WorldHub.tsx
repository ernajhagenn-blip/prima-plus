"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ZONES = [
  {
    id: "story",
    icon: "📖",
    name: "Story District",
    desc: "Pilih jalan ceritamu. Keputusanmu nentuin karakter.",
    href: "/journey/1",
    gradient: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
    shadow: "#2E7D32",
  },
  {
    id: "kart",
    icon: "🏎️",
    name: "PRIMA Kart Arena",
    desc: "Balapan lewat situasi bahasa. Cepat dan jeli!",
    href: "/select",
    gradient: "linear-gradient(135deg, #EF5350 0%, #FFA726 100%)",
    shadow: "#C62828",
  },
  {
    id: "tower",
    icon: "🏗️",
    name: "Challenge Tower",
    desc: "6 lantai tantangan. Naik terus atau stuck?",
    href: "/games/challenge-tower",
    gradient: "linear-gradient(135deg, #AB47BC 0%, #7E57C2 100%)",
    shadow: "#6A1B9A",
  },
  {
    id: "arcade",
    icon: "🎮",
    name: "Mini Game Arcade",
    desc: "6 mini game seru. Latihan bahasa sambil main.",
    href: "/games",
    gradient: "linear-gradient(135deg, #42A5F5 0%, #26C6DA 100%)",
    shadow: "#1565C0",
  },
  {
    id: "garage",
    icon: "🔧",
    name: "Garage & Upgrade",
    desc: "Upgrade kartmu. Makin kenceng, makin asik.",
    href: "/kart",
    gradient: "linear-gradient(135deg, #FFCA28 0%, #FFA726 100%)",
    shadow: "#F57F17",
  },
  {
    id: "knowledge",
    icon: "📚",
    name: "Knowledge Center",
    desc: "Baca dulu biar makin ngerti. Nggak wajib, tapi ngebantu.",
    href: "/edukasi",
    gradient: "linear-gradient(135deg, #26C6DA 0%, #42A5F5 100%)",
    shadow: "#00838F",
  },
] as const;

function ZoneCard({ zone, onClick }: { zone: (typeof ZONES)[number]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-left transition-all duration-200 hover:-translate-y-1 active:scale-[0.97]"
      style={{
        borderRadius: 16,
        background: zone.gradient,
        border: "3px solid rgba(255,255,255,0.4)",
        boxShadow: `0 4px 0 ${zone.shadow}, 0 8px 16px rgba(0,0,0,0.2)`,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[13px] bg-gradient-to-b from-white/25 to-transparent" />
      <div className="relative p-4">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 text-2xl backdrop-blur-sm">
          {zone.icon}
        </div>
        <h2 className="text-base font-black uppercase tracking-wide text-white drop-shadow-md">
          {zone.name}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-white/90">{zone.desc}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-200 group-hover:bg-white/45">
          <span>Masuk</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
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
      {/* Floating CSS Clouds */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="hub-cloud hc1" />
        <div className="hub-cloud hc2" />
        <div className="hub-cloud hc3" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6" style={{ zIndex: 10 }}>
        <header className="text-center" style={{ animation: "slideDown 0.5s ease-out both" }}>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/80">
            PRIMA+ World Hub
          </p>
          <h1
            className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl"
            style={{ textShadow: "0 4px 0 #1565C0, 0 6px 12px rgba(0,0,0,0.2)" }}
          >
            PRIMA CITY
          </h1>
          <p className="mt-1 text-sm font-bold text-white/85">PILIH PETUALANGANMU!</p>
        </header>

        <div className="mt-6 rounded-3xl bg-white/40 p-4 backdrop-blur-md sm:p-6" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ZONES.map((zone, i) => (
              <div key={zone.id} style={{ animation: `slideUp 0.5s ${i * 0.08}s ease-out both` }}>
                <ZoneCard zone={zone} onClick={() => router.push(zone.href)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animation: "slideUp 0.5s 0.5s ease-out both" }}>
          <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4 backdrop-blur-sm" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-xl text-white">🧑‍🚀</div>
            <div>
              <p className="text-sm font-black text-gray-800">{playerName || "Petualang"}</p>
              <p className="text-xs font-bold text-gray-500">Level {level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4 backdrop-blur-sm" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-xl text-white">⭐</div>
            <div>
              <p className="text-sm font-black text-gray-800">{stars} Bintang</p>
              <p className="text-xs font-bold text-gray-500">Total skor</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4 backdrop-blur-sm" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-xl text-white">🃏</div>
            <div>
              <p className="text-sm font-black text-gray-800">{cards} Kartu</p>
              <p className="text-xs font-bold text-gray-500">Koleksi</p>
            </div>
          </div>
        </div>

        <div
          className="mt-6 overflow-hidden rounded-3xl"
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
                <h3 className="text-sm font-black uppercase tracking-widest text-white drop-shadow-md">🗺️ Progress</h3>
                <span className="text-2xl font-black text-white drop-shadow-md">{pct}%</span>
              </div>
              <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%`, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                <p className="text-xs font-semibold text-white/80">Episode: <span className="font-black text-white">{episodesDone}/{total}</span></p>
                <p className="text-xs font-semibold text-white/80">Kartu: <span className="font-black text-white">{cards}</span></p>
                <p className="text-xs font-semibold text-white/80">Skor: <span className="font-black text-white">{stars}</span></p>
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
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

        .hub-cloud {
          position: absolute;
          background: white;
          border-radius: 50px;
          opacity: 0.6;
        }
        .hub-cloud::before,
        .hub-cloud::after {
          content: "";
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        .hc1 {
          width: 100px; height: 32px;
          top: 6%; left: 5%;
          animation: hubCloudDrift 20s linear infinite;
        }
        .hc1::before { width: 42px; height: 42px; top: -22px; left: 16px; }
        .hc1::after { width: 58px; height: 48px; top: -24px; left: 38px; }

        .hc2 {
          width: 80px; height: 26px;
          top: 18%; left: 65%;
          animation: hubCloudDrift 24s linear infinite;
          animation-delay: -6s;
        }
        .hc2::before { width: 34px; height: 34px; top: -18px; left: 12px; }
        .hc2::after { width: 46px; height: 38px; top: -20px; left: 30px; }

        .hc3 {
          width: 110px; height: 36px;
          top: 10%; left: 80%;
          animation: hubCloudDrift 18s linear infinite;
          animation-delay: -12s;
        }
        .hc3::before { width: 48px; height: 48px; top: -24px; left: 20px; }
        .hc3::after { width: 64px; height: 52px; top: -26px; left: 44px; }

        @keyframes hubCloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100vw - 200px)); }
        }
      `}</style>
    </div>
  );
}
