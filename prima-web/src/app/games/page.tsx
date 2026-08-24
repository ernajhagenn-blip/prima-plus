"use client";

import Link from "next/link";

const MINI_GAMES = [
  {
    href: "/games/context-match",
    name: "Context Match",
    icon: "🎯",
    desc: "Pilih ragam bahasa yang pas buat tiap situasi.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.35)",
    difficulty: 3,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/chat-repair",
    name: "Chat Repair",
    icon: "💬",
    desc: "Perbaiki chat yang canggung biar jelas dan enak dibaca.",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.35)",
    difficulty: 2,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/word-switch",
    name: "Word Switch",
    icon: "🔤",
    desc: "Ganti kata yang salah dengan padanan yang bener.",
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.35)",
    difficulty: 2,
    zone: "MEDIA LAB",
  },
  {
    href: "/games/code-mix-lab",
    name: "Code-Mix Lab",
    icon: "🧪",
    desc: "Bedah campuran bahasa Indonesia dan Inggris.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.35)",
    difficulty: 4,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/language-detective",
    name: "Language Detective",
    icon: "🔍",
    desc: "Cari dan koreksi kesalahan bahasa yang tersembunyi.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
    difficulty: 3,
    zone: "SOCIAL STREET",
  },
  {
    href: "/games/rapid-response",
    name: "Rapid Response",
    icon: "⚡",
    desc: "Asosiasi kata dalam 5 detik. Cepat atau gagal!",
    gradient: "from-fuchsia-500 to-rose-600",
    glow: "rgba(217,70,239,0.35)",
    difficulty: 5,
    zone: "PRIMA CIRCUIT",
  },
];

function DifficultyStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < count ? "bg-yellow-400" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function GamesPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden text-gray-800">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/5 h-80 w-80 rounded-full bg-cyan-300/10 blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-violet-300/10 blur-[120px]" />
        <div className="absolute top-2/3 left-1/2 h-60 w-60 rounded-full bg-rose-300/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-6">
        {/* Header */}
        <div
          className="animate-slide-down flex items-center justify-between"
        >
          <div>
            <Link
              href="/world"
              className="text-xs font-semibold text-blue-400 transition hover:text-blue-600"
            >
              ← PRIMA CITY
            </Link>
            <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              Mini Game{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                Arcade
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              6 game seru buat ngasah otak bahasa.
            </p>
          </div>
          <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white/70 text-3xl backdrop-blur-md sm:flex shadow-sm">
            🎮
          </div>
        </div>

        {/* Game Grid */}
        <div
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MINI_GAMES.map((game, i) => (
            <div key={game.href} className="animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
              <Link
                href={game.href}
                className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
              >
                {/* Glossy top edge */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                {/* Hover glow */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: game.glow }}
                />

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${game.gradient} text-2xl shadow-lg`}
                      style={{ boxShadow: `0 8px 24px -4px ${game.glow}` }}
                    >
                      {game.icon}
                    </div>
                    <div className="text-right">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        {game.zone}
                      </span>
                      <div className="mt-1.5">
                        <DifficultyStars count={game.difficulty} />
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                    {game.name}
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                    {game.desc}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold text-gray-400 transition-colors group-hover:text-blue-500">
                    <span>Mainkan</span>
                    <span className="transition-transform group-hover:translate-x-1.5">→</span>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${game.gradient} transition-all duration-600 group-hover:w-full`}
                />
              </Link>
            </div>
          ))}
        </div>

        <p
          className="mt-10 animate-fade-in text-center text-[11px] text-gray-400"
          style={{ animationDelay: "800ms" }}
        >
          Skor tersimpan otomatis. Main kapan aja, urutan bebas.
        </p>
      </div>
    </div>
  );
}
