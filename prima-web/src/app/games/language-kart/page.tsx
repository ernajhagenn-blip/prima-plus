"use client";

import { useState } from "react";
import Link from "next/link";
import { recordGameAction } from "@/app/actions";
import { useJourney } from "@/lib/store";
import { KARTS } from "@/components/game/karts";
import KartRace3D from "@/components/games/KartRace3D";

export default function LanguageKartPage() {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const kartKey = useJourney((s) => s.kartKey);
  const kart = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-gray-800">
      <Link href="/world" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-3xl border-2 border-red-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-red-400 to-rose-500 px-3 py-1 text-xs font-black text-white shadow-md">
          MAIN GAME · {kart.name}
        </span>
        <h1 className="mt-2 text-2xl font-black">Language Kart</h1>
        <p className="mt-1 text-sm text-gray-600">
          Balapan 2D top-down ala Mario Kart! Setir kartnya (W/A/S/D atau panah), embat kata
          Indonesia (+10), jangan nabrak bahasa asing (-6). 3 lap, 60 detik. Gas!
        </p>
      </div>

      <div className="mt-4">
        {!done ? (
          <KartRace3D
            onComplete={(s) => { setScore(s); setDone(true); }}
            kartBody={kart.body}
            kartAccent={kart.accent}
          />
        ) : (
          <div className="rounded-3xl border-2 border-red-200 bg-white/70 p-6 text-center shadow-lg backdrop-blur-md">
            <p className="text-lg font-bold text-gray-900">Skor akhir: {score}</p>
            <p className="mt-1 text-xs text-gray-500">Disimpan ke profil kamu.</p>
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
