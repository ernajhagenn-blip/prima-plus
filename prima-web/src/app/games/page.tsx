"use client";

import Link from "next/link";
import { useEffect } from "react";
import { gameAudio } from "@/lib/gameAudio";

const MINI_GAMES = [
  {
    href: "/games/context-match",
    name: "Context Match",
    icon: "🎯",
    desc: "Pilih ragam bahasa yang tepat untuk setiap situasi — formal, informal, casual, atau akademik. Uji kepekaanmu membaca konteks dan menempatkan bahasa sesuai audiens!",
    gradient: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    shadow: "#1d4ed8",
    difficulty: 3,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/chat-repair",
    name: "Chat Repair",
    icon: "💬",
    desc: "Perbaiki chat yang canggung agar jelas, sopan, dan enak dibaca. Latih kemampuan menyesuaikan bahasa dengan situasi — dari obrolan santai hingga pesan formal.",
    gradient: "linear-gradient(135deg, #fb7185, #ec4899)",
    shadow: "#be185d",
    difficulty: 2,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/word-switch",
    name: "Word Switch",
    icon: "🔤",
    desc: "Ganti kata asing dengan padanan Bahasa Indonesia yang tepat. Asah kosakatamu, temukan keindahan bahasa sendiri, dan buktikan bahwa bahasa Indonesia itu kaya!",
    gradient: "linear-gradient(135deg, #fbbf24, #f97316)",
    shadow: "#c2410c",
    difficulty: 2,
    zone: "MEDIA LAB",
  },
  {
    href: "/games/code-mix-lab",
    name: "Code-Mix Lab",
    icon: "🧪",
    desc: "Bedah campuran bahasa Indonesia dan Inggris dalam percakapan sehari-hari. Pahami kapan campuran itu tepat digunakan dan kapan sebaiknya tidak — jadi penutur yang kritis!",
    gradient: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
    shadow: "#6d28d9",
    difficulty: 4,
    zone: "PRIMA CIRCUIT",
  },
  {
    href: "/games/language-detective",
    name: "Language Detective",
    icon: "🔍",
    desc: "Cari dan koreksi kesalahan bahasa yang tersembunyi dalam teks. Latih ketelitianmu membedah ejaan, struktur kalimat, dan tata bahasa Indonesia yang benar!",
    gradient: "linear-gradient(135deg, #34d399, #10b981)",
    shadow: "#047857",
    difficulty: 3,
    zone: "SOCIAL STREET",
  },
  {
    href: "/games/rapid-response",
    name: "Rapid Response",
    icon: "⚡",
    desc: "Asosiasi kata dalam 5 detik! Sebutkan padanan Indonesia secepat mungkin sebelum waktu habis. Cepat, seru, dan penuh tantangan — adu kecepatan berpikirmu!",
    gradient: "linear-gradient(135deg, #e879f9, #d946ef)",
    shadow: "#a21caf",
    difficulty: 5,
    zone: "PRIMA CIRCUIT",
  },
];

const NAVY = "#253057";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-2xl leading-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ filter: i < count ? "none" : "grayscale(1)", opacity: i < count ? 1 : 0.35 }}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export default function GamesPage() {
  useEffect(() => {
    const kick = () => {
      gameAudio.startMusic("arcade");
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      gameAudio.stopMusic();
    };
  }, []);

  return (
    <div className="relative min-h-dvh w-full font-body text-slate-800">
      <div className="flex min-h-dvh w-full flex-col px-5 py-7 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="animate-slide-down flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl text-5xl"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                border: `5px solid ${NAVY}`,
                boxShadow: `0 8px 0 ${NAVY}`,
              }}
            >
              🎮
            </div>
            <div>
              <Link
                href="/world"
                className="text-sm font-extrabold uppercase tracking-widest text-blue-800 underline-offset-2 transition hover:text-blue-950 hover:underline"
              >
                ← Prima City
              </Link>
              <h1
                className="font-display text-4xl leading-tight sm:text-5xl"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 3px 0 rgba(37,48,87,0.3))",
                }}
              >
                Mini Game Arcade
              </h1>
            </div>
          </div>
          <div
            className="rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-600"
            style={{ border: `3px solid ${NAVY}`, boxShadow: `0 5px 0 ${NAVY}` }}
          >
            6 game seru buat ngasah otak bahasa!
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr pb-3">
          {MINI_GAMES.map((game, i) => (
            <div key={game.href} className="animate-slide-up h-full" style={{ animationDelay: `${i * 60}ms` }}>
              <Link
                href={game.href}
                onClick={() => gameAudio.sfx("click")}
                className="group flex h-full flex-col rounded-[28px] bg-white p-8 transition-all duration-200 hover:-translate-y-2"
                style={{
                  border: `5px solid ${NAVY}`,
                  boxShadow: `0 10px 0 ${NAVY}, 0 18px 30px rgba(37,48,87,0.25)`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 14px 0 ${NAVY}, 0 24px 40px rgba(37,48,87,0.3)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 10px 0 ${NAVY}, 0 18px 30px rgba(37,48,87,0.25)`; }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl text-5xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: game.gradient,
                      border: `5px solid ${NAVY}`,
                      boxShadow: `0 7px 0 ${game.shadow}, inset 0 4px 0 rgba(255,255,255,0.45)`,
                    }}
                  >
                    {game.icon}
                  </div>
                  <Stars count={game.difficulty} />
                </div>

                <h2
                  className="mt-11 font-display text-[1.85rem] leading-tight text-slate-800"
                  style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}
                >
                  {game.name}
                </h2>
                <span
                  className="mt-3 w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: game.gradient, border: `3px solid ${NAVY}` }}
                >
                  {game.zone}
                </span>

                <p className="mt-5 flex-1 font-body text-[0.95rem] leading-relaxed text-slate-700">
                  {game.desc}
                </p>

                <button
                  className="mt-7 w-full rounded-2xl py-4 font-display text-xl text-white transition-all duration-150 group-hover:brightness-110 active:translate-y-1.5"
                  style={{
                    background: game.gradient,
                    border: `5px solid ${NAVY}`,
                    boxShadow: `0 7px 0 ${game.shadow}`,
                  }}
                  tabIndex={-1}
                >
                  MAINKAN ▶
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p
          className="mt-7 text-center font-body text-base text-slate-600"
        >
          Skor tersimpan otomatis · Main kapan aja, urutan bebas
        </p>
      </div>
    </div>
  );
}
