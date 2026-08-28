"use client";

import { useState } from "react";
import Link from "next/link";
import { logActivity } from "@/lib/logActivity";

const PARTS = ["edukasi", "kart", "mini game", "quiz", "karakter", "visual"];

const PART_EMOJI: Record<string, string> = {
  edukasi: "📚",
  kart: "🃏",
  "mini game": "🎮",
  quiz: "⚔️",
  karakter: "🧑‍🚀",
  visual: "🎨",
};

export default function FeedbackPage() {
  const [step, setStep] = useState(1);
  const [saran, setSaran] = useState("");
  const [fav, setFav] = useState("");

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-gray-800">
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="w-full max-w-lg text-center">
        {step === 1 && (
          <div
            key="form"
            className="animate-slide-up relative overflow-hidden rounded-3xl border border-blue-200 bg-white/70 p-6 backdrop-blur-md"
          >
            <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-cyan-400 to-blue-500" />
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500 font-bold">
              💬 Curhat
            </p>
            <h1 className="mt-2 text-xl font-black">Giliranmu ngomong.</h1>
            <p className="mt-2 text-sm text-gray-500">
              Setelah main di PRIMA WORLD, ada yang perlu diubah? Tulis aja.
            </p>

            <textarea
              value={saran}
              onChange={(e) => setSaran(e.target.value)}
              placeholder="Tulis di sini…"
              className="mt-4 h-28 w-full rounded-xl border-2 border-gray-200 bg-white/80 p-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-4 text-sm font-bold text-gray-800">Paling suka bagian mana?</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {PARTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setFav(p)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
                    fav === p
                      ? "border-blue-400 bg-blue-100 text-blue-700 shadow-md"
                      : "border-gray-200 bg-white/80 text-gray-500 hover:border-blue-200"
                  }`}
                >
                  {PART_EMOJI[p]} {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                void logActivity("feedback", { message: saran, favorite_part: fav });
                setStep(2);
              }}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-black text-white shadow-lg transition hover:shadow-xl active:scale-[0.98]"
              style={{ boxShadow: "0 4px 0 #0277BD, inset 0 2px 0 rgba(255,255,255,0.3)" }}
            >
              🚀 KIRIM
            </button>
          </div>
        )}

        {step === 2 && (
          <div
            key="done"
            className="animate-scale-in relative overflow-hidden rounded-3xl border border-blue-200 bg-white/70 p-6 backdrop-blur-md"
          >
            <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-green-400 to-emerald-500" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-lg font-black text-white shadow-lg">
              ✓
            </div>
            <p className="mt-3 text-sm font-bold text-gray-800">
              🎉 Makasih! Masukanmu bantu PRIMA+ jadi lebih baik.
            </p>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 text-left border border-blue-100">
              <p className="text-sm font-bold text-gray-800">🎮 PRIMA+</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Pakai bahasa lain saat kamu butuh.
                <br />
                Pakai Bahasa Indonesia saat itu pilihanmu.
                <br />
                Yang penting: sadar kenapa kamu milih.
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-4 text-xs">
              <Link href="/world" className="font-bold text-blue-500 underline hover:text-blue-600">
                🏠 Kembali ke PRIMA CITY
              </Link>
              <Link href="/profil" className="font-bold text-blue-500 underline hover:text-blue-600">
                👤 Profil
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
