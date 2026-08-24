"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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
      <span className="inline-block rounded bg-rose-500/20 px-1.5 py-0.5 font-bold text-rose-400 underline decoration-rose-400/40 decoration-wavy underline-offset-4">
        {error}
      </span>
      {parts[1]}
    </>
  );
}

export default function LanguageDetectivePage() {
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
      const correct = answer === q.correctCorrection;
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
      }, 2200);
    },
    [currentQ, showFeedback]
  );

  const q = QUESTIONS[currentQ];
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#060b1e] px-4 text-white">
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-4xl shadow-lg shadow-emerald-500/20">
            🔍
          </div>
          <h1 className="mt-6 text-3xl font-black">Language Detective</h1>
          <p className="mt-3 text-sm text-white/40">
            Temukan kesalahan bahasa tersembunyi di setiap paragraf. Peranmu adalah detektif tata bahasa!
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-white/30">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">●</span>
              <span>10 paragraf dengan kesalahan tersembunyi</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">●</span>
              <span>Identifikasi perbaikan yang tepat untuk setiap kesalahan</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
          </div>
          <button
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition hover:scale-104 active:scale-96"
          >
            MULAI ▶
          </button>
          <button
            onClick={() => router.push("/games")}
            className="mt-3 text-xs text-white/25 transition hover:text-white/50"
          >
            ← Kembali ke Arcade
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#060b1e] px-4 text-white">
        <div className="animate-scale-in w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-white/40">Language Detective</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-emerald-400">{xp}</p>
              <p className="mt-1 text-[11px] text-white/30">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-cyan-400">{accuracy}%</p>
              <p className="mt-1 text-[11px] text-white/30">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-amber-400">
                {answers.filter(Boolean).length}/{QUESTIONS.length}
              </p>
              <p className="mt-1 text-[11px] text-white/30">Benar</p>
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
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10 hover:scale-103 active:scale-97"
            >
              Main Lagi
            </button>
            <button
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white transition hover:scale-103 active:scale-97"
            >
              ke Arcade →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#060b1e] text-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push("/games")}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-white/50 transition hover:bg-white/10"
        >
          ✕
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300/40">
            Language Detective
          </p>
          <p className="text-sm font-bold text-white">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-emerald-400">
          {xp} XP
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">
                Temukan kesalahan
              </p>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                🔍 {q.errorType}
              </span>
            </div>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              {highlightError(q.paragraph, q.errorHighlight)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctCorrection;
              const isSelected = opt === selected;
              let btnStyle = "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]";
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
            <div className="mt-4 animate-fade-in rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold text-white/50">Penjelasan:</p>
              <p className="mt-1 text-sm text-white/70">{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
