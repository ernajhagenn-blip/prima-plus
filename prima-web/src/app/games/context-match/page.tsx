"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Question {
  scenario: string;
  audience: string;
  correctRegister: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    scenario: "Kamu sedang presentasi di depan kelas tentang hasil penelitian sains.",
    audience: "Guru dan seluruh kelas",
    correctRegister: "Formal",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "Presentasi di kelas membutuhkan ragam formal/akademik dengan struktur kalimat baku.",
  },
  {
    scenario: "Kamu sedang chat di grup WhatsApp teman sekelas.",
    audience: "Teman dekat",
    correctRegister: "Casual",
    options: ["Formal", "Informal", "Casual", "Baku"],
    explanation: "Chat dengan teman dekat menggunakan ragam casual/santai.",
  },
  {
    scenario: "Kamu menulis surat lamaran magang ke sebuah perusahaan.",
    audience: "HRD Perusahaan",
    correctRegister: "Formal",
    options: ["Formal", "Informal", "Casual", "Slang"],
    explanation: "Surat lamaran kerja menggunakan ragam formal baku dengan tata bahasa yang rapi.",
  },
  {
    scenario: "Kamu mengirim DM ke artis favorit di Instagram.",
    audience: "Idola /公众人物",
    correctRegister: "Informal",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "DM ke idola sebaiknya menggunakan ragam informal yang sopan namun tidak kaku.",
  },
  {
    scenario: "Kamu sedang menulis esai untuk kompetisi essay tingkat nasional.",
    audience: "Dewan juri",
    correctRegister: "Akademik",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "Esai kompetisi membutuhkan ragam akademik dengan diksi ilmiah dan struktur argumentatif.",
  },
  {
    scenario: "Kamu berbicara dengan adik kelas yang baru masuk sekolah.",
    audience: "Adik kelas",
    correctRegister: "Informal",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "Berbicara dengan adik kelas sebaiknya informal — ramah tapi tidak terlalu slang.",
  },
  {
    scenario: "Kamu memberikan sambutan sebagai ketua OSIS di acara formal sekolah.",
    audience: "Guru dan siswa",
    correctRegister: "Formal",
    options: ["Formal", "Informal", "Casual", "Slang"],
    explanation: "Sambutan ketua OSIS di acara formal menggunakan ragam formal dengan intonasi teratur.",
  },
  {
    scenario: "Kamu sedang Stream di TikTok dan berinteraksi dengan penonton.",
    audience: "Penonton live stream",
    correctRegister: "Casual",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "Live stream membutuhkan ragam casual yang interaktif dan menghibur.",
  },
  {
    scenario: "Kamu menulis caption untuk foto wisuda di Instagram.",
    audience: "Teman dan keluarga",
    correctRegister: "Informal",
    options: ["Formal", "Informal", "Casual", "Akademik"],
    explanation: "Caption Instagram untuk momen pribadi cukup informal — hangat tapi tidak terlalu formal.",
  },
  {
    scenario: "Kamu menelepon guru BK untuk membuat janji konsultasi.",
    audience: "Guru BK",
    correctRegister: "Formal",
    options: ["Formal", "Informal", "Casual", "Baku"],
    explanation: "Berbicara dengan guru sebaiknya menggunakan ragam formal yang sopan.",
  },
];

const TIMER_SECONDS = 15;
const XP_PER_CORRECT = 10;

export default function ContextMatchPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "play" | "result">("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (phase !== "play" || showFeedback) return;
    if (timer <= 0) {
      handleAnswer(null);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timer, showFeedback]);

  const handleAnswer = useCallback(
    (answer: string | null) => {
      const q = QUESTIONS[currentQ];
      const correct = answer === q.correctRegister;
      if (correct) setScore((s) => s + XP_PER_CORRECT);
      setAnswers((a) => [...a, correct]);
      setSelected(answer);
      setShowFeedback(true);
      setTimeout(() => {
        if (currentQ + 1 < QUESTIONS.length) {
          setCurrentQ((c) => c + 1);
          setTimer(TIMER_SECONDS);
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
  const timerPct = (timer / TIMER_SECONDS) * 100;
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-4xl shadow-lg shadow-cyan-500/20">
            🎯
          </div>
          <h1 className="mt-6 text-3xl font-black text-gray-900">Context Match</h1>
          <p className="mt-3 text-sm text-gray-500">
            Pilih ragam bahasa yang tepat untuk setiap situasi. Kamu punya{" "}
            <span className="font-bold text-cyan-700">{TIMER_SECONDS} detik</span> per soal.
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-gray-500">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-cyan-600">●</span>
              <span>10 soal — pilih ragam: Formal, Informal, Casual, atau Akademik</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-cyan-600">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-cyan-600">●</span>
              <span>Lihat penjelasan setelah menjawab</span>
            </div>
          </div>
          <button
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-black text-white shadow-lg shadow-cyan-500/20 transition hover:scale-104 active:scale-96"
          >
            MULAI ▶
          </button>
          <button
            onClick={() => router.push("/games")}
            className="mt-3 text-xs font-bold text-gray-500 transition hover:text-gray-700"
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-gray-500">Context Match</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
              <p className="text-3xl font-black text-cyan-700">{xp}</p>
              <p className="mt-1 text-[11px] text-gray-500">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-3xl font-black text-emerald-700">{accuracy}%</p>
              <p className="mt-1 text-[11px] text-gray-500">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-3xl font-black text-amber-700">
                {answers.filter(Boolean).length}/{QUESTIONS.length}
              </p>
                <p className="mt-1 text-[11px] text-gray-500">Benar</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setPhase("play");
                setCurrentQ(0);
                setScore(0);
                setTimer(TIMER_SECONDS);
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
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97"
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push("/games")}
          className="rounded-lg bg-white/70 px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-white/80"
        >
          ✕
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-700/60">
            🎯 Context Match
          </p>
          <p className="text-sm font-bold text-gray-900">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-bold text-cyan-700">
          {xp} XP
        </div>
      </div>

      {/* Timer */}
      <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            timerPct > 50
              ? "bg-gradient-to-r from-cyan-500 to-blue-500"
              : timerPct > 25
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-gradient-to-r from-rose-500 to-red-500"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-700/60">
              📋 Skenario
            </p>
            <p className="mt-2 text-base font-semibold text-gray-800 leading-relaxed">
              {q.scenario}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-[11px] font-bold text-cyan-700">
                👤 {q.audience}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctRegister;
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
