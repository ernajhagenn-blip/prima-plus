"use client";

import { useState } from "react";
import Link from "next/link";
import PlatformerGame from "@/components/games/PlatformerGame";
import { recordGameAction } from "@/app/actions";

export default function LompatKataPage() {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-white">
      <Link href="/world" className="text-xs font-semibold text-cyan-300">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1130] to-[#1b1147] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">MINI GAME · SOCIAL STREET</p>
        <h1 className="mt-1 text-2xl font-black">Lompat Kata</h1>
        <p className="mt-1 text-sm text-white/70">
          Lompat-lompat ala Mario! Ambil kata Biru (Indonesia), hindari kata Merah
          (asing), terus tembus bendera kuning di ujung. Simpel tapi nagih.
        </p>
      </div>

      <div className="mt-4">
        {!done ? (
          <PlatformerGame onComplete={(s) => { setScore(s); setDone(true); }} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
            <p className="text-lg font-bold">Skor akhir: {score}</p>
            <p className="mt-1 text-xs text-white/60">Disimpan ke profil kamu.</p>
            <form action={recordGameAction} className="mt-4">
              <input type="hidden" name="game" value="lompat_kata" />
              <input type="hidden" name="score" value={score} />
              <input type="hidden" name="card" value="Pelompat Kata" />
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
