"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { recordGameAction } from "@/app/actions";
import { useJourney } from "@/lib/store";
import { KARTS } from "@/components/game/karts";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const KartRace3D = dynamic(() => import("@/components/games/KartRace3D"), { ssr: false });

export default function LanguageKartPage() {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const kartKey = useJourney((s) => s.kartKey);
  const kart = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-white">
      <Link href="/world" className="text-xs font-semibold text-cyan-300">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1130] to-[#1b1147] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-300">MAIN GAME · {kart.name}</p>
        <h1 className="mt-1 text-2xl font-black">Language Kart</h1>
        <p className="mt-1 text-sm text-white/70">
          Balapan 3D ala Mario Kart! Setir kartnya (W/A/S/D atau panah), embat bola
          Biru (kata Bahasa Indonesia, +10), jangan nabrak bola Merah (bahasa asing, −6).
          60 detik, kamera ngikut di belakang. Gas sebanyak mungkin!
        </p>
      </div>

      <div className="mt-4">
        {!done ? (
          <SceneErrorBoundary label="Language Kart">
            <KartRace3D onComplete={(s) => { setScore(s); setDone(true); }} kartBody={kart.body} kartAccent={kart.accent} />
          </SceneErrorBoundary>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
            <p className="text-lg font-bold">Skor akhir: {score}</p>
            <p className="mt-1 text-xs text-white/60">Disimpan ke profil kamu.</p>
            <form action={recordGameAction} className="mt-4">
              <input type="hidden" name="game" value="language_kart" />
              <input type="hidden" name="score" value={score} />
              <input type="hidden" name="card" value="Pengendali Kata" />
              <button type="submit" className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0a0f2c]">
                Simpan & Balik ke PRIMA CITY
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
