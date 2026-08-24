"use client";

import Link from "next/link";
import KaraAvatar from "@/components/KaraAvatar";

export default function WorldHub({
  episodesDone,
  total,
  nextEpisode,
  gameScores,
  cards,
}: {
  episodesDone: number;
  total: number;
  nextEpisode: number | null;
  gameScores: Record<string, number>;
  cards: number;
}) {
  const pct = Math.round((episodesDone / total) * 100);
  const PORTALS = [
    { icon: "🏁", title: "RACE", desc: "Language Kart (balapan 3D)", href: "/games/language-kart", color: "from-rose-500 to-orange-400" },
    { icon: "🎮", title: "PLAY", desc: "Mini Games & Arena", href: "/games", color: "from-cyan-500 to-blue-500" },
    { icon: "🧠", title: "CHALLENGE", desc: "Final Language Challenge", href: "/quiz", color: "from-violet-500 to-fuchsia-500" },
    { icon: "💬", title: "SUGGEST", desc: "Kirim Saran / Feedback", href: "/feedback", color: "from-amber-400 to-yellow-500" },
  ];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-[#0a0f2c] via-[#131a47] to-[#0a0f2c] px-4 py-8 text-white">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-rose-500/15 blur-3xl" />

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-600">PRIMA CITY</p>
            <h1 className="text-3xl font-black">Mau ngapain sekarang?</h1>
          </div>
          <KaraAvatar className="h-24 w-24" />
        </div>

        {/* progress */}
        <div className="mt-5 rounded-2xl border-2 border-cyan-200 bg-white/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">Progress Belajar</span>
            <span className="text-cyan-200/70">{episodesDone}/{total} episode</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-rose-400" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/60">
            {nextEpisode
              ? `Lanjut ke Episode ${nextEpisode} buat nambah kartu & skill.`
              : `Semua episode selesai! Coba game atau uji diri di Final Quiz.`}
          </p>
        </div>

        {/* primary CTA */}
        <Link
          href={nextEpisode ? `/journey/${nextEpisode}` : "/journey/1"}
          className="mt-4 block rounded-2xl bg-gradient-to-r from-rose-500 to-cyan-500 px-5 py-4 text-center text-sm font-black shadow-lg"
        >
          {nextEpisode ? `▶ LANJUT BELAJAR — EPISODE ${nextEpisode}` : `↻ ULANGI BELAJAR`}
        </Link>

        {/* portals */}
        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-gray-500">ATAU MAIN LANGSUNG</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {PORTALS.map((p, i) => (
            <div
              key={p.title}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Link href={p.href} className="block">
                <div className={`flex h-28 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} p-3 shadow-md`}>
                  <span className="text-3xl">{p.icon}</span>
                  <span className="mt-1 text-sm font-black">{p.title}</span>
                  <span className="text-[10px] text-white/80">{p.desc}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* quick stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl border border-cyan-100 bg-white/60 p-2"><p className="text-lg font-black text-cyan-600">{cards}</p><p className="text-gray-500">Kartu</p></div>
          <div className="rounded-xl border border-rose-100 bg-white/60 p-2"><p className="text-lg font-black text-rose-500">{gameScores.language_kart ?? 0}</p><p className="text-gray-500">Skor Kart</p></div>
          <div className="rounded-xl border border-amber-100 bg-white/60 p-2"><p className="text-lg font-black text-amber-500">{gameScores.lompat_kata ?? 0}</p><p className="text-gray-500">Skor Lompat</p></div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs">
          <Link href="/profil" className="text-cyan-200/70 underline">Profil</Link>
          <Link href="/cards" className="text-cyan-200/70 underline">Kartu</Link>
          <Link href="/penelitian" className="text-amber-200/70 underline">Penelitian</Link>
        </div>
      </div>
    </main>
  );
}
