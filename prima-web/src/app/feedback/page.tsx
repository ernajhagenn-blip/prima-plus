"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const PARTS = ["edukasi", "kart", "mini game", "quiz", "karakter", "visual"];

export default function FeedbackPage() {
  const [step, setStep] = useState(1);
  const [saran, setSaran] = useState("");
  const [fav, setFav] = useState("");

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0f2c] to-[#1a1147] px-6 text-white">
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="w-full max-w-lg text-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/60">
                Reflection
              </p>
              <h1 className="mt-2 text-xl font-black">Sekarang giliranmu.</h1>
              <p className="mt-2 text-sm text-white/70">
                Setelah perjalananmu di PRIMA WORLD, apa yang menurutmu perlu
                diperbaiki?
              </p>

              <textarea
                value={saran}
                onChange={(e) => setSaran(e.target.value)}
                placeholder="Tulis saranmu…"
                className="mt-4 h-28 w-full rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-cyan-300"
              />

              <p className="mt-4 text-sm font-bold">Bagian mana yang paling kamu suka?</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {PARTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setFav(p)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      fav === p
                        ? "border-cyan-300 bg-cyan-400/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-5 w-full rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0a0f2c]"
              >
                KIRIM SARAN
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-lg font-black">
                K
              </div>
              <p className="mt-3 text-sm text-white/80">
                “Terima kasih. PRIMA WORLD berkembang dari pengalaman penggunanya.”
              </p>

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-cyan-500/20 p-5 text-left">
                <p className="text-sm font-bold">PRIMA+</p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Gunakan bahasa lain ketika kamu membutuhkannya.
                  <br />
                  Gunakan Bahasa Indonesia ketika itu adalah pilihanmu.
                  <br />
                  Yang terpenting: sadari mengapa kamu memilih.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-4 text-xs">
                <Link href="/world" className="text-cyan-200/70 underline">
                  Kembali ke PRIMA CITY
                </Link>
                <Link href="/profil" className="text-cyan-200/70 underline">
                  Profil
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
