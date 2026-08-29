"use client";

import { useState } from "react";
import Link from "next/link";
import PlatformerGame from "@/components/games/PlatformerGame";
import { recordGameAction } from "@/app/actions";

export default function LompatKataPage() {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-gray-800">
      <Link href="/world" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-3xl border-2 border-emerald-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-1 text-xs font-black text-white shadow-md">
          MINI GAME · SOCIAL STREET
        </span>
        <h1 className="mt-2 text-2xl font-black">Lompat Kata</h1>
        <p className="mt-1 text-sm text-gray-600">
          Lompat-lompat ala Mario! Ambil kata Biru (Indonesia), hindari kata Merah
          (asing), terus tembus bendera kuning di ujung. Simpel tapi nagih.
        </p>
      </div>

      <div className="mt-4">
        {!done ? (
          <PlatformerGame onComplete={(s) => { setScore(s); setDone(true); }} />
        ) : (
          <div className="rounded-3xl border-2 border-emerald-200 bg-white/70 p-6 text-center shadow-lg backdrop-blur-md">
            <p className="text-lg font-bold text-gray-900">Skor akhir: {score}</p>
            <p className="mt-1 text-xs text-gray-500">Disimpan ke profil kamu.</p>
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
