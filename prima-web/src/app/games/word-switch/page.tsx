"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";

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
    sentence: "Dia itu {paling} cerdas di kelas.",
    highlightedWord: "paling",
    correctReplacement: "sangat",
    options: ["sangat", "paling banget", "sekali", "banget"],
    explanation: "'Paling' bermakna superlatif. Untuk menunjukkan intensitas, gunakan 'sangat' atau 'amat'.",
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
    sentence: "Kita harus {research} dulu sebelum membuat keputusan.",
    highlightedWord: "research",
    correctReplacement: "riset",
    options: ["riset", "penelitian", "survei", "kajian"],
    explanation: "Kata 'research' adalah bahasa Inggris. Dalam bahasa Indonesia, gunakan 'riset' atau 'penelitian'.",
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
      <span className="inline-block rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-700 underline decoration-amber-500/40 decoration-wavy underline-offset-4">
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

  useEffect(() => () => gameAudio.stopMusic(), []);

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = QUESTIONS[currentQ];
      const correct = answer === q.correctReplacement;
      gameAudio.sfx(correct ? "correct" : "wrong");
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
          gameAudio.sfx(answers.filter(Boolean).length + (correct ? 1 : 0) >= QUESTIONS.length / 2 ? "win" : "lose");
          setPhase("result");
        }
      }, 2000);
    },
    [currentQ, showFeedback, answers]
  );

  const q = QUESTIONS[currentQ];
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 relative overflow-hidden">
        <GameBackButton />
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a1005 0%, #2d1a08 50%, #1a1005 100%)" }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ["#fbbf24", "#f97316", "#facc15", "#fb923c", "#eab308"][i % 5],
              boxShadow: `0 0 ${6 + i % 4}px ${["#fbbf24", "#f97316", "#facc15", "#fb923c", "#eab308"][i % 5]}`,
              animation: `gameFloat ${3 + (i % 5) * 0.8}s ${(i % 6) * 0.4}s ease-in-out infinite`,
            }} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <div key={`ring${i}`} className="absolute" style={{
              left: `${20 + i * 20}%`,
              top: `${15 + i * 18}%`,
              width: 60 + i * 20,
              height: 60 + i * 20,
              borderRadius: "50%",
              border: `1px solid ${["#fbbf2422", "#f9731622", "#facc1522", "#fb923c22"][i]}`,
              animation: `gameSpin ${10 + i * 4}s linear infinite`,
            }} />
          ))}
        </div>
        <div className="animate-scale-in w-full max-w-lg relative z-10">
          <div className="rounded-[28px] bg-white/95 p-10 text-center backdrop-blur-sm" style={{ border: "5px solid #253057", boxShadow: "0 12px 0 #253057, 0 24px 50px rgba(37,48,87,0.3)" }}>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl" style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", border: "5px solid #253057", boxShadow: "0 8px 0 #c2410c" }}>
              🔤
            </div>
            <h1 className="mt-7 font-display text-5xl text-slate-900" style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}>Word Switch</h1>
            <p className="mt-4 font-body text-lg text-slate-600 leading-relaxed">
              Ganti kata yang salah, informal, atau tidak baku dengan padanan yang tepat.
            </p>
            <div className="mt-7 space-y-3 text-left text-base font-semibold text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-amber-600 text-lg">●</span>
                <span>10 kalimat dengan kata yang perlu diganti</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-amber-600 text-lg">●</span>
                <span>Pilih pengganti terbaik dari 4 opsi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-amber-600 text-lg">●</span>
                <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
              </div>
            </div>
            <button
              onClick={() => { gameAudio.startMusic("puzzle"); gameAudio.sfx("click"); setPhase("play"); }}
              className="mt-9 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-5 text-2xl text-white transition hover:scale-104 active:scale-96"
              style={{ border: "5px solid #253057", boxShadow: "0 8px 0 #c2410c" }}
            >
              <span className="font-display font-black">MULAI ▶</span>
            </button>
            <button
              onClick={() => router.push("/games")}
              className="mt-5 font-body text-base font-semibold text-slate-500 transition hover:text-slate-700"
            >
              ← Kembali ke Arcade
            </button>
          </div>
        </div>
        <style>{`
          @keyframes gameFloat { 0%,100% { transform: translateY(0); opacity: 0.15; } 50% { transform: translateY(-20px); opacity: 0.4; } }
          @keyframes gameSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <GameBackButton />
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-base font-semibold text-slate-600">Word Switch</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-3xl font-black text-amber-700">{xp}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-3xl font-black text-emerald-700">{accuracy}%</p>
              <p className="mt-1 text-xs font-bold text-slate-500">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-3xl font-black text-amber-700">
                {answers.filter(Boolean).length}/{QUESTIONS.length}
              </p>
                <p className="mt-1 text-xs font-bold text-slate-500">Benar</p>
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
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white/70 py-3 text-sm font-bold text-gray-700 transition hover:bg-white/80 hover:scale-103 active:scale-97"
            >
              Main Lagi
            </button>
            <button
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700/60">
            🔤 Word Switch
          </p>
          <p className="text-lg font-black text-gray-900">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700">
          {xp} XP
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white/85 p-8 backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-700/60">
              🔄 Ganti kata yang ditandai
            </p>
            <p className="mt-3 text-2xl font-bold text-gray-800 leading-relaxed">
              {highlightSentence(q.sentence, q.highlightedWord)}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
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
                  className={`rounded-xl border p-5 text-center text-lg font-bold transition-all ${btnStyle} ${!showFeedback ? "hover:scale-103 active:scale-97" : ""}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 animate-fade-in rounded-xl border border-gray-200 bg-white/70 p-4">
              <p className="text-sm font-bold text-slate-500">Penjelasan:</p>
              <p className="mt-1 text-base text-gray-700">{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
