"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";
import KaraAvatar from "@/components/KaraAvatar";

const CLASSES = ["X", "XI", "XII"];

export default function IntroPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(startJourney, undefined);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [school, setSchool] = useState("");

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-gray-800">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl" />

        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="h-36 w-36">
              <KaraAvatar />
            </div>
          </div>

          <div className="mb-3 text-center">
            <p className="text-sm font-black text-blue-600">Hei! Selamat datang di PRIMA+.</p>
            <p className="text-xs text-gray-500">Sebelum mulai, kenalan dulu, ya.</p>
          </div>

          <form action={formAction} className="rounded-3xl border border-blue-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
            {step === 1 && (
              <div
                key="1"
                className="animate-slide-in-left"
              >
                <p className="text-lg font-bold text-gray-900">Siapa kamu?</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu…"
                  className="mt-3 w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400"
                />
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={() => setStep(2)}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-bold text-white shadow-md disabled:opacity-40"
                >
                  LANJUT
                </button>
              </div>
            )}

            {step === 2 && (
              <div
                key="2"
                className="animate-slide-in-left"
              >
                <p className="text-lg font-bold text-gray-900">Kelas berapa sekarang?</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {CLASSES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setKelas(c)}
                      className={`rounded-xl border py-4 text-sm font-bold transition ${
                        kelas === c
                          ? "border-blue-400 bg-blue-100 text-blue-700"
                          : "border-gray-200 bg-white/80 text-gray-500"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input type="hidden" value={kelas} />
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-500"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={!kelas}
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-bold text-white shadow-md disabled:opacity-40"
                  >
                    LANJUT
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div
                key="3"
                className="animate-slide-in-left"
              >
                <p className="text-lg font-bold text-gray-900">Sekolah mana?</p>
                <input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Nama sekolah…"
                  className="mt-3 w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400"
                />
                {state && "error" in state ? (
                  <p className="mt-2 text-xs text-rose-500">{state.error}</p>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-500"
                  >
                    ←
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
                  >
                    MASUK PRIMA WORLD →
                  </button>
                </div>
              </div>
            )}

          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="kelas" value={kelas} />
          <input type="hidden" name="school" value={school} />
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Dunia ini bakal beda tiap orang. Yuk mulai.
          </p>
        </div>
      </main>
  );
}
