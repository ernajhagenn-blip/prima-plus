"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Question {
  sentence: string;
  highlightedWord: string;
  correctReplacement: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    sentence: "Gue mau {ke} mall bareng temen-temen.",
    highlightedWord: "ke",
    correctReplacement: "pergi ke",
    options: ["pergi ke", "pergi di", "datang ke", "visit ke"],
    explanation: "'Ke' dalam bahasa Indonesia formal baku harus diikuti kata kerja. 'Pergi ke' lebih tepat.",
  },
  {
    sentence: "Dia itu {paling}-paling cerdas di kelas.",
    highlightedWord: "paling",
    correctReplacement: "sangat",
    options: ["sangat", "paling banget", "sekali", "banget"],
    explanation: "'Paling' bermakna superlatif. Untuk menunjukkan程度, gunakan 'sangat' atau 'amat'.",
  },
  {
    sentence: "Aku {mau} nanya dong, ada tugas apa aja kemarin?",
    highlightedWord: "mau",
    correctReplacement: "ingin bertanya",
    options: ["ingin bertanya", "mau nanya", "akan tanya", "mo nanya"],
    explanation: "Dalam konteks formal, 'mau' sebaiknya diganti 'ingin' atau 'hendak'.",
  },
  {
    sentence: "Menurut gue, filmnya {gak} terlalu bagus sih.",
    highlightedWord: "gak",
    correctReplacement: "tidak",
    options: ["tidak", "enggak", "nggak", "gak banget"],
    explanation: "'Gak' adalah bentuk tidak baku. Dalam bahasa Indonesia baku, gunakan 'tidak'.",
  },
  {
    sentence: "Kita harus {调研} dulu sebelum membuat keputusan.",
    highlightedWord: "调研",
    correctReplacement: "riset",
    options: ["riset", "penelitian", "survei", "kajian"],
    explanation: "Kata '调研' adalah bahasa Mandarin. Dalam bahasa Indonesia, gunakan 'riset' atau 'penelitian'.",
  },
  {
    sentence: "Tugas ini harus {submit} sebelum deadline ya.",
    highlightedWord: "submit",
    correctReplacement: "dikumpulkan",
    options: ["dikumpulkan", "dikirim", "diserahkan", "diunggah"],
    explanation: "Meskipun 'submit' umum digunakan, dalam bahasa Indonesia baku lebih baik gunakan 'dikumpulkan'.",
  },
  {
    sentence: "Lu tuh emang {drama queen} banget deh.",
    highlightedWord: "drama queen",
    correctReplacement: "lebay",
    options: ["lebay", "berlebihan", "dramatis", "sensitif"],
    explanation: "'Drama queen' adalah bahasa Inggris slang. Padanan Indonesia-nya adalah 'lebay' atau 'berlebihan'.",
  },
  {
    sentence: "Aku {lagi} sibuk banget nih, nanti aja ya.",
    highlightedWord: "lagi",
    correctReplacement: "sedang",
    options: ["sedang", " lagi", "tengah", "pas"],
    explanation: "'Lagi' bermakna waktu. Dalam bahasa baku, 'sedang' lebih tepat untuk menunjukkan aktivitas.",
  },
  {
    sentence: "Jangan {lupa} ya, besok kita {meet} di kantor.",
    highlightedWord: "meet",
    correctReplacement: "bertemu",
    options: ["bertemu", "kumpul", "kopdar", "nongkrong"],
    explanation: "'Meet' adalah bahasa Inggris. Dalam bahasa Indonesia, gunakan 'bertemu'.",
  },
  {
    sentence: "Soal ujiannya {ke}-hard banget, gue gak bisa jawab.",
    highlightedWord: "ke-hard",
    correctReplacement: "terlalu sulit",
    options: ["terlalu sulit", "sangat sulit", "sulit banget", "mengerikan"],
    explanation: "'Ke-hard' adalah campuran bahasa. Gunakan 'terlalu sulit' atau 'amat sulit' dalam bahasa baku.",
  },
];

const XP_PER_CORRECT = 10;

function highlightSentence(sentence: string, word: string) {
  const parts = sentence.split(`{${word}}`);
  if (parts.length === 1) return sentence;
  return (
    <>
      {parts[0]}
      <span className="inline-block rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-400 underline decoration-amber-400/40 decoration-wavy underline-offset-4">
        {word}
      </span>
      {parts[1]}
    </>
  );
}

export default function WordSwitchPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "play" | "result">("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = QUESTIONS[currentQ];
      const correct = answer === q.correctReplacement;
      if (correct) setScore((s) => s + XP_PER_CORRECT);
      setAnswers((a) => [...a, correct]);
      setSelected(answer);
      setShowFeedback(true);
      setTimeout(() => {
        if (currentQ + 1 < QUESTIONS.length) {
          setCurrentQ((c) => c + 1);
          setSelected(null);
          setShowFeedback(false);
        } else {
          setPhase("result");
        }
      }, 2000);
    },
    [currentQ, showFeedback]
  );

  const q = QUESTIONS[currentQ];
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-4xl shadow-lg shadow-amber-500/20">
            🔤
          </div>
          <h1 className="mt-6 text-3xl font-black">Word Switch</h1>
          <p className="mt-3 text-sm text-gray-500">
            Ganti kata yang salah, informal, atau tidak baku dengan padanan yang tepat.
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-gray-400">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">●</span>
              <span>10 kalimat dengan kata yang perlu diganti</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">●</span>
              <span>Pilih pengganti terbaik dari 4 opsi</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
          </div>
          <button
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-4 text-lg font-black text-white shadow-lg shadow-amber-500/20 transition hover:scale-104 active:scale-96"
          >
            MULAI ▶
          </button>
          <button
            onClick={() => router.push("/games")}
            className="mt-3 text-xs text-gray-400 transition hover:text-gray-500"
          >
            ← Kembali ke Arcade
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-gray-500">Word Switch</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
              <p className="text-3xl font-black text-amber-400">{xp}</p>
              <p className="mt-1 text-[11px] text-gray-400">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
              <p className="text-3xl font-black text-emerald-400">{accuracy}%</p>
              <p className="mt-1 text-[11px] text-gray-400">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
              <p className="text-3xl font-black text-amber-400">
                {answers.filter(Boolean).length}/{QUESTIONS.length}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">Benar</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setPhase("play");
                setCurrentQ(0);
                setScore(0);
                setSelected(null);
                setShowFeedback(false);
                setAnswers([]);
              }}
              className="flex-1 rounded-xl border border-gray-200 bg-white/70 py-3 text-sm font-bold text-gray-900 transition hover:bg-white/80 hover:scale-103 active:scale-97"
            >
              Main Lagi
            </button>
            <button
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-bold text-gray-900 transition hover:scale-103 active:scale-97"
            >
              ke Arcade →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col text-gray-800">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push("/games")}
          className="rounded-lg bg-white/70 border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-white/80"
        >
          ✕
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300/40">
            Word Switch
          </p>
          <p className="text-sm font-bold text-gray-900">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/70 border border-gray-200 px-3 py-1.5 text-xs font-bold text-amber-400">
          {xp} XP
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400/60">
              Ganti kata yang ditandai
            </p>
            <p className="mt-3 text-lg font-semibold text-gray-800 leading-relaxed">
              {highlightSentence(q.sentence, q.highlightedWord)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctReplacement;
              const isSelected = opt === selected;
              let btnStyle = "border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white/90";
              if (showFeedback && isCorrect) btnStyle = "border-emerald-400/60 bg-emerald-500/15";
              if (showFeedback && isSelected && !isCorrect) btnStyle = "border-rose-400/60 bg-rose-500/15";

              return (
                <button
                  key={opt}
                  onClick={() => !showFeedback && handleAnswer(opt)}
                  disabled={showFeedback}
                  className={`rounded-xl border p-4 text-center text-sm font-bold transition-all ${btnStyle} ${!showFeedback ? "hover:scale-103 active:scale-97" : ""}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 animate-fade-in rounded-xl border border-gray-200 bg-white/70 p-4">
              <p className="text-xs font-bold text-gray-500">Penjelasan:</p>
              <p className="mt-1 text-sm text-gray-600">{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
