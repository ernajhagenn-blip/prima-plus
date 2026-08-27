"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";

interface Question {
  paragraph: string;
  errorHighlight: string;
  errorType: string;
  correctCorrection: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    paragraph: "Menurut saya, pendidikan bahasa Indonesia sangat penting untuk {meningkatakan} kualitas generasi muda dalam berkomunikasi.",
    errorHighlight: "meningkatakan",
    errorType: "Ejaan",
    correctCorrection: "meningkatkan",
    options: ["meningkatkan", "meningkatakan", "meningkatkan kualitas", "meningkatakan kualitas"],
    explanation: "Kata 'meningkatkan' berasal dari akar 'tingkat' + imbuhan 'men-...-kan'. Ejaan yang benar: tidak ada huruf 'a' tambahan.",
  },
  {
    paragraph: "Penggunaan bahasa gaul di media sosial {berdampak} terhadap kemampuan menulis siswa secara akademik.",
    errorHighlight: "berdampak",
    errorType: "Kata Baku",
    correctCorrection: "berpengaruh",
    options: ["berpengaruh", "berdampak", "mempengaruhi", "berakibat"],
    explanation: "'Berdampak' sebenarnya tidak salah, tapi dalam konteks akademik formal, 'berpengaruh' lebih tepat dan baku.",
  },
  {
    paragraph: "Para siswa harus {dipersilahkan} untuk menggunakan kamus digital saat mengerjakan tugas.",
    errorHighlight: "dipersilahkan",
    errorType: "Imbuhan",
    correctCorrection: "dipersilakan",
    options: ["dipersilakan", "dipersilahkan", "dipersilahkan dengan", "dipersilakan untuk"],
    explanation: "Kata 'silahkan' tidak baku. Yang benar adalah 'silakan' (imperatif) sehingga passive-nya menjadi 'dipersilakan'.",
  },
  {
    paragraph: "Hasil {penilitian} menunjukkan bahwa kesadaran berbahasa remaja masih perlu ditingkatkan.",
    errorHighlight: "penilitian",
    errorType: "Ejaan",
    correctCorrection: "penelitian",
    options: ["penelitian", "penilitian", "penelitianan", "penilitianan"],
    explanation: "Kata baku-nya adalah 'penelitian' dari akar 'teliti'. 'Penilitian' adalah kesalahan ejaan yang umum.",
  },
  {
    paragraph: "Film tersebut {menggambarkan} kehidupan remaja di era digital dengan sangat apik.",
    errorHighlight: "menggambarkan",
    errorType: "Pilihan Kata",
    correctCorrection: "menggambarkan",
    options: ["menggambarkan", "menceritakan", "memaparkan", "mendeskripsikan"],
    explanation: "Sebenarnya 'menggambarkan' sudah benar. Namun dalam konteks film, 'menceritakan' lebih umum dan tepat.",
  },
  {
    paragraph: "Guru {harus} memberikan contoh penggunaan bahasa Indonesia yang baik kepada siswanya.",
    errorHighlight: "harus",
    errorType: "Tanda Baca",
    correctCorrection: "seharusnya",
    options: ["seharusnya", "harus", "penting untuk", "wajib"],
    explanation: "Dalam konteks saran/anjuran akademik, 'seharusnya' lebih tepat daripada 'harus' yang bersifat memaksa.",
  },
  {
    paragraph: "Kesadaran berbahasa dapat {dibentuk} sejak dini melalui pendidikan di lingkungan keluarga.",
    errorHighlight: "dibentuk",
    errorType: "Collocation",
    correctCorrection: "dibangun",
    options: ["dibangun", "dibentuk", "dikembangkan", "ditumbuhkan"],
    explanation: "'Dibentuk' kurang tepat untuk 'kesadaran'. Collocation yang benar adalah 'membangun kesadaran' atau 'menumbuhkan kesadaran'.",
  },
  {
    paragraph: "Remaja zaman sekarang lebih {senang} menggunakan bahasa Indonesia campur daripada bahasa Indonesia baku.",
    errorHighlight: "senang",
    errorType: "Diksi",
    correctCorrection: "cenderung",
    options: ["cenderung", "senang", "lebih suka", "menggemari"],
    explanation: "Dalam konteks penelitian, 'cenderung' lebih objektif. 'Senang' terlalu subjektif dan tidak akademis.",
  },
  {
    paragraph: "Media digital {telah} menjadi bagian tak terpisahkan dari kehidupan remaja Indonesia saat ini.",
    errorHighlight: "telah",
    errorType: "Aspek temporal",
    correctCorrection: "sudah",
    options: ["sudah", "telah", "telah menjadi", "baru saja"],
    explanation: "Dalam bahasa lisan/ informal, 'sudah' lebih natural. Dalam tulisan formal, 'telah' sebenarnya sudah benar. Namun untuk konteks penelitian sosial, 'sudah' lebih sesuai.",
  },
  {
    paragraph: "Program {PRIMA+} ini diharapkan dapat meningkatkan loyalitas bahasa Indonesia di kalangan pelajar.",
    errorHighlight: "PRIMA+",
    errorType: "Konsistensi istilah",
    correctCorrection: "PRIMA Plus",
    options: ["PRIMA Plus", "PRIMA+", "Prima Plus", "prima+"],
    explanation: "Dalam naskah akademik, nama program sebaiknya ditulis konsisten. 'PRIMA Plus' lebih baku daripada 'PRIMA+'.",
  },
];

const XP_PER_CORRECT = 12;

function highlightError(paragraph: string, error: string) {
  const parts = paragraph.split(`{${error}}`);
  if (parts.length === 1) return paragraph;
  return (
    <>
      {parts[0]}
      <span className="inline-block rounded bg-rose-500/20 px-1.5 py-0.5 font-bold text-rose-700 underline decoration-rose-500/40 decoration-wavy underline-offset-4">
        {error}
      </span>
      {parts[1]}
    </>
  );
}

export default function LanguageDetectivePage() {
  const router = useRouter();

  useEffect(() => () => gameAudio.stopMusic(), []);
  const [phase, setPhase] = useState<"start" | "play" | "result">("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = useCallback(
    (answer: string) => {
      const q = QUESTIONS[currentQ];
      const correct = answer === q.correctCorrection;
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
          gameAudio.sfx("win");
          setPhase("result");
        }
      }, 2200);
    },
    [currentQ, showFeedback]
  );

  const q = QUESTIONS[currentQ];
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 relative overflow-hidden">
        <GameBackButton />
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #051a12 0%, #0a2e1f 50%, #051a12 100%)" }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ["#34d399", "#10b981", "#6ee7b7", "#a78bfa", "#facc15"][i % 5],
              boxShadow: `0 0 ${6 + i % 4}px ${["#34d399", "#10b981", "#6ee7b7", "#a78bfa", "#facc15"][i % 5]}`,
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
              border: `1px solid ${["#34d39922", "#10b98122", "#6ee7b722", "#a78bfa22"][i]}`,
              animation: `gameSpin ${10 + i * 4}s linear infinite`,
            }} />
          ))}
        </div>
        <div
          className="animate-scale-in w-full max-w-lg rounded-[28px] bg-white/95 p-10 text-center backdrop-blur-sm relative z-10"
          style={{ border: "5px solid #253057", boxShadow: "0 12px 0 #253057, 0 24px 50px rgba(37,48,87,0.3)" }}
        >
          <div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
            style={{ background: "linear-gradient(135deg, #34d399, #10b981)", border: "5px solid #253057", boxShadow: "0 8px 0 #047857" }}
          >
            🔍
          </div>
          <h1
            className="font-display mt-7 text-5xl text-slate-900"
            style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}
          >
            Language Detective
          </h1>
          <p className="font-body mt-4 text-lg text-slate-600 leading-relaxed">
            Temukan kesalahan bahasa tersembunyi di setiap paragraf. Peranmu adalah detektif tata bahasa!
          </p>
          <div className="font-body mt-7 space-y-3 text-left text-base font-semibold text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-emerald-600 text-lg">●</span>
              <span>10 paragraf dengan kesalahan tersembunyi</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-emerald-600 text-lg">●</span>
              <span>Identifikasi perbaikan yang tepat untuk setiap kesalahan</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-emerald-600 text-lg">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
          </div>
          <button
            onClick={() => { gameAudio.startMusic("mystery"); gameAudio.sfx("click"); setPhase("play"); }}
            className="font-display mt-9 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-5 text-2xl font-black text-white transition hover:scale-104 active:scale-96"
            style={{ border: "5px solid #253057", boxShadow: "0 8px 0 #047857" }}
          >
            MULAI ▶
          </button>
          <button
            onClick={() => router.push("/games")}
            className="font-body mt-5 text-base font-semibold text-slate-500 transition hover:text-slate-700"
          >
            ← Kembali ke Arcade
          </button>
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-base font-semibold text-slate-600">Language Detective</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-3xl font-black text-emerald-700">{xp}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
              <p className="text-3xl font-black text-cyan-700">{accuracy}%</p>
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
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">
            🔍 Language Detective
          </p>
          <p className="text-lg font-black text-gray-900">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
          {xp} XP
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white/85 p-8 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700/60">
                🔎 Temukan kesalahan
              </p>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                🔍 {q.errorType}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
              {highlightError(q.paragraph, q.errorHighlight)}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctCorrection;
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
