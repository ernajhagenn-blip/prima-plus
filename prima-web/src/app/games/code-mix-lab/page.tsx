"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Question {
  mixedMessage: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    mixedMessage: "Gue lagi download file dari drive buat tugas prakarya besok",
    question: "Bagian mana yang merupakan code-mixing (campuran bahasa)?",
    correctAnswer: "'download' dan 'drive' adalah bahasa Inggris yang menyatu dalam kalimat Indonesia",
    options: [
      "'download' dan 'drive' adalah bahasa Inggris yang menyatu dalam kalimat Indonesia",
      "Seluruh kalimat adalah bahasa Indonesia murni",
      "'Gue' dan 'besok' adalah code-mixing",
      "Tidak ada code-mixing dalam kalimat ini",
    ],
    explanation: "'Download' dan 'drive' adalah kata bahasa Inggris yang terintegrasi dalam struktur kalimat Indonesia — ini contoh code-mixing.",
  },
  {
    mixedMessage: "Bro, meeting-nya diundur jam 3 ya, jangan lupa bawa laptop",
    question: "Jenis code-mixing apa yang terjadi pada kata 'meeting'?",
    correctAnswer: "Code-switching — kata Inggris disisipkan utuh dalam kalimat Indonesia",
    options: [
      "Code-switching — kata Inggris disisipkan utuh dalam kalimat Indonesia",
      "Code-mixing — 'meeting' sudah menjadi kata Indonesia",
      "Loanword — 'meeting' sudah baku dalam KBBI",
      "Tidak ada code-mixing",
    ],
    explanation: "'Meeting' disisipkan utuh tanpa adaptasi morfologi — ini code-switching (penggantian kode).",
  },
  {
    mixedMessage: "Aku lagi deadline nih, taunya malah diminta revisi lagi",
    question: "Apakah 'deadline' termasuk code-mixing?",
    correctAnswer: "Ya — 'deadline' adalah bahasa Inggris yang digunakan sebagai ganti 'batas waktu'",
    options: [
      "Ya — 'deadline' adalah bahasa Inggris yang digunakan sebagai ganti 'batas waktu'",
      "Tidak — 'deadline' sudah menjadi kata baku Indonesia",
      "Tidak — karena semua orang menggunakannya",
      "Ya — tapi hanya masalah jika dalam surat resmi",
    ],
    explanation: "'Deadline' adalah bahasa Inggris. Padanan Indonesia-nya adalah 'batas waktu' atau 'tenggat waktu'.",
  },
  {
    mixedMessage: "Lo bisa follow akun Instagram gue ya? Biar kita bisa collab konten",
    question: "Ada berapa kata bahasa Inggris dalam kalimat ini?",
    correctAnswer: "3 kata: 'follow', 'Instagram', dan 'collab'",
    options: [
      "3 kata: 'follow', 'Instagram', dan 'collab'",
      "2 kata: 'Instagram' dan 'collab'",
      "1 kata: 'follow' saja",
      "4 kata: 'Lo', 'follow', 'Instagram', 'collab'",
    ],
    explanation: "'Follow', 'Instagram', dan 'collab' adalah kata bahasa Inggris. 'Lo' adalah bahasa Indonesia gaul, bukan Inggris.",
  },
  {
    mixedMessage: "Gue harus submit tugasnya sebelum jam 5, gak kayak kemarin yang telat",
    question: "Apakah penggunaan 'submit' dalam konteks ini acceptable dalam bahasa Indonesia baku?",
    correctAnswer: "Tidak — dalam bahasa baku, gunakan 'mengumpulkan' atau 'menyerahkan'",
    options: [
      "Tidak — dalam bahasa baku, gunakan 'mengumpulkan' atau 'menyerahkan'",
      "Ya — 'submit' sudah menjadi kata Indonesia",
      "Ya — semua orang mengerti maknanya",
      "Tidak — karena 'submit' adalah kata bahasa Jepang",
    ],
    explanation: "'Submit' adalah bahasa Inggris. Dalam konteks formal/akademik, gunakan 'mengumpulkan' atau 'menyerahkan'.",
  },
  {
    mixedMessage: "Aku lagi stuck nih sama soal matematika, gak ngerti cara ngerjainnya",
    question: "Analisis: bagian 'stuck' dalam kalimat ini adalah...",
    correctAnswer: "Code-switching — kata Inggris yang menggantikan kata Indonesia 'terjebak/kesusahan'",
    options: [
      "Code-switching — kata Inggris yang menggantikan kata Indonesia 'terjebak/kesusahan'",
      "Code-mixing — karena sudah umum digunakan",
      "Loanword — sudah masuk KBBI",
      "Bukan code-mixing karena konteksnya informal",
    ],
    explanation: "'Stuck' adalah bahasa Inggris yang menggantikan 'terjebak' atau 'kesusahan'. Ini code-switching.",
  },
  {
    mixedMessage: "Besok kita brainstorm bareng ya buat ide project kelompok",
    question: "Bagian code-mixing yang paling tepat diidentifikasi adalah...",
    correctAnswer: "'brainstorm' dan 'project' — dua kata Inggris dalam struktur kalimat Indonesia",
    options: [
      "'brainstorm' dan 'project' — dua kata Inggris dalam struktur kalimat Indonesia",
      "'besok' dan 'kelompok' — kata Indonesia yang tidak perlu",
      "'kita' dan 'bareng' — duplikasi makna",
      "Tidak ada code-mixing",
    ],
    explanation: "'Brainstorm' (berpikir kreatif) dan 'project' (rencana/program) adalah code-mixing dari bahasa Inggris.",
  },
  {
    mixedMessage: "Gue lagi streaming series di Netflix, seru banget season barunya",
    question: "Apakah 'streaming' dan 'series' termasuk code-mixing?",
    correctAnswer: "Ya — kedua kata adalah bahasa Inggris yang menyatu dalam percakapan Indonesia",
    options: [
      "Ya — kedua kata adalah bahasa Inggris yang menyatu dalam percakapan Indonesia",
      "Tidak — 'streaming' sudah menjadi kata Indonesia",
      "Hanya 'streaming' yang code-mixing, 'series' bukan",
      "Tidak ada code-mixing karena ini percakapan informal",
    ],
    explanation: "'Streaming' dan 'series' keduanya adalah kata bahasa Inggris yang digunakan dalam konteks Indonesia.",
  },
  {
    mixedMessage: "Lo harus update CV lo dong kalau mau apply kerja",
    question: "Identifikasi kode bahasa yang digunakan:",
    correctAnswer: "Code-mixing Indonesia-Inggris — 'update', 'CV', 'apply' adalah kata Inggris",
    options: [
      "Code-mixing Indonesia-Inggris — 'update', 'CV', 'apply' adalah kata Inggris",
      "Bahasa Indonesia murni dengan ejaan yang salah",
      "Bahasa Inggris dengan beberapa kata Indonesia",
      "Tidak ada campuran bahasa",
    ],
    explanation: "'Update' (memperbarui), 'CV' (curriculum vitae), dan 'apply' (melamar) adalah code-mixing bahasa Inggris.",
  },
  {
    mixedMessage: "Kemarin gue marathon nonton anime sampe subuh, sekarang puyeng",
    question: "Kata 'marathon' dalam konteks ini bermakna...",
    correctAnswer: "Menonton terus-menerus tanpa jeda — penggunaan metaforis dari bahasa Inggris",
    options: [
      "Menonton terus-menerus tanpa jeda — penggunaan metaforis dari bahasa Inggris",
      "Mengikuti lari marathon",
      "Kata baku Indonesia untuk 'maraton'",
      "Tidak bermakna apa-apa",
    ],
    explanation: "'Marathon' digunakan secara metaforis (marathon nonton = nonton nonstop). Ini contoh bagaimana code-mixing bisa memperkaya ekspresi.",
  },
];

const XP_PER_CORRECT = 12;

export default function CodeMixLabPage() {
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
      const correct = answer === q.correctAnswer;
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
      }, 2500);
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 text-4xl shadow-lg shadow-violet-500/20">
            🧪
          </div>
          <h1 className="mt-6 text-3xl font-black">Code-Mix Lab</h1>
          <p className="mt-3 text-sm text-white/40">
            Analisis fenomena code-mixing: campuran bahasa Indonesia dan Inggris dalam percakapan sehari-hari.
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-white/30">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-violet-400">●</span>
              <span>10 pesan campuran untuk dianalisis</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-violet-400">●</span>
              <span>Identifikasi jenis dan bagian code-mixing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-violet-400">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
          </div>
          <button
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-4 text-lg font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-104 active:scale-96"
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-white/40">Code-Mix Lab</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-violet-400">{xp}</p>
              <p className="mt-1 text-[11px] text-white/30">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-emerald-400">{accuracy}%</p>
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
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 py-3 text-sm font-bold text-white transition hover:scale-103 active:scale-97"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-300/40">
            Code-Mix Lab
          </p>
          <p className="text-sm font-bold text-white">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-violet-400">
          {xp} XP
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400/60">
              Pesan campuran
            </p>
            <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-sm text-white/80 leading-relaxed">&quot;{q.mixedMessage}&quot;</p>
            </div>
            <p className="mt-4 text-sm font-semibold text-white">{q.question}</p>
          </div>

          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.correctAnswer;
              const isSelected = opt === selected;
              let btnStyle = "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]";
              if (showFeedback && isCorrect) btnStyle = "border-emerald-400/60 bg-emerald-500/15";
              if (showFeedback && isSelected && !isCorrect) btnStyle = "border-rose-400/60 bg-rose-500/15";

              return (
                <button
                  key={i}
                  onClick={() => !showFeedback && handleAnswer(opt)}
                  disabled={showFeedback}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition-all ${btnStyle} ${!showFeedback ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                >
                  <span className="mr-2 text-[11px] text-white/20">{String.fromCharCode(65 + i)}.</span>
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
