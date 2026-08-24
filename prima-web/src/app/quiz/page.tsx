"use client";

import { useState } from "react";
import { submitFinalQuiz } from "@/app/actions";

type Q = {
  type: string;
  situation: string;
  prompt: string;
  options: { key: string; text: string; correct: boolean }[];
};

const QUIZ: Q[] = [
  {
    type: "Scenario",
    situation: "Kamu berbicara dengan teman dekat tentang tugas.",
    prompt: "Ragam apa yang paling tepat?",
    options: [
      { key: "a", text: "Santai, jelas, dan sopan untuk teman.", correct: true },
      { key: "b", text: "Baku kaku seperti surat resmi.", correct: false },
      { key: "c", text: "Sembarang asal dia paham.", correct: false },
    ],
  },
  {
    type: "Context",
    situation: "Pesan ini akan dikirim kepada guru untuk mengubah jadwal.",
    prompt: "Pilihan mana yang paling sesuai?",
    options: [
      { key: "a", text: "Ibu, apakah Bapak/Ibu berkenan jika jadwal diubah? Mohon maaf mengganggu.", correct: true },
      { key: "b", text: "Bu, jadwal diubah ya, makasih.", correct: false },
      { key: "c", text: "reschedule ya Bu, tks.", correct: false },
    ],
  },
  {
    type: "Reasoning",
    situation: "Kamu memakai istilah asing di caption.",
    prompt: "Alasan mana yang menunjukkan kesadaran berbahasa?",
    options: [
      { key: "a", text: "Maknanya lebih tepat/singkat dan aku tahu alasannya.", correct: true },
      { key: "b", text: "Agar terlihat lebih pintar dari teman.", correct: false },
      { key: "c", text: "Karena semua orang melakukannya.", correct: false },
    ],
  },
  {
    type: "Consequence",
    situation: "Kamu membalas 'ok' ke guru yang memberi instruksi penting.",
    prompt: "Kemungkinan penafsiran guru?",
    options: [
      { key: "a", text: "Kurang jelas dan terasa kurang santun.", correct: true },
      { key: "b", text: "Sangat detail dan profesional.", correct: false },
      { key: "c", text: "Tidak ada dampak sama sekali.", correct: false },
    ],
  },
  {
    type: "Reflection",
    situation: "Lingkungan sekitarmu mulai menggunakan istilah tertentu.",
    prompt: "Apa yang paling memengaruhi pilihan bahasamu?",
    options: [
      { key: "a", text: "Kebiasaan, tren, dan situasi — yang sebaiknya kusadari.", correct: true },
      { key: "b", text: "Sama sekali tidak ada yang memengaruhi.", correct: false },
      { key: "c", text: "Orang lain yang selalu salah.", correct: false },
    ],
  },
  {
    type: "Scenario",
    situation: "Kamu membuat pengumuman kegiatan di akun resmi sekolah.",
    prompt: "Caption mana yang tepat?",
    options: [
      { key: "a", text: "Diberitahukan: pendaftaran dibuka hingga Jumat. Silakan hubungi panitia.", correct: true },
      { key: "b", text: "yuk ikut seru banget guys!! dm aja", correct: false },
      { key: "c", text: "our event is open, join now!", correct: false },
    ],
  },
];

export default function QuizPage() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = QUIZ[idx];
  const isLast = idx === QUIZ.length - 1;

  function choose(k: string) {
    if (picked) return;
    setPicked(k);
    if (q.options.find((o) => o.key === k)?.correct) setScore((s) => s + 1);
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-gray-800">
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="w-full max-w-lg">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-purple-400/80">
          Final Language Challenge
        </p>
        <p className="mt-1 text-center text-sm text-gray-500">
          “Bukan tentang seberapa banyak kata yang kamu hafal. Tentang seberapa sadar kamu memilihnya.”
        </p>

        <div key={idx} className="mt-6 animate-slide-in-left rounded-3xl border border-purple-200 bg-white/70 p-6 backdrop-blur-md">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
              {q.type}
            </span>
            <p className="mt-3 text-sm text-gray-600">{q.situation}</p>
            <p className="mt-2 text-base font-bold text-gray-800">{q.prompt}</p>

            <div className="mt-4 space-y-2">
              {q.options.map((o) => {
                const state =
                  picked && o.key === picked
                    ? o.correct
                      ? "c"
                      : "w"
                    : picked && o.correct
                      ? "c"
                      : "";
                return (
                  <button
                    key={o.key}
                    disabled={!!picked}
                    onClick={() => choose(o.key)}
                    className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      state === "c"
                        ? "border-green-400 bg-green-50 text-green-700"
                        : state === "w"
                          ? "border-rose-400 bg-rose-50 text-rose-700"
                          : "border-gray-200 bg-white/80 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {o.text}
                  </button>
                );
              })}
            </div>

            {picked && (
              isLast ? (
                <form action={submitFinalQuiz} className="mt-4">
                  <input type="hidden" name="score" value={score} />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
                  >
                    Lihat Refleksi →
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setIdx((i) => i + 1);
                    setPicked(null);
                  }}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
                >
                  Lanjut →
                </button>
              )
            )}
          </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          {idx + 1}/{QUIZ.length}
        </p>
      </div>
    </main>
  );
}
