"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";

const FLOORS = [
  {
    floor: 1,
    title: "Dasar Bahasa",
    desc: "Uji pemahamanmu tentang tata bahasa dasar Indonesia.",
    icon: "📖",
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.4)",
    questions: [
      { q: "Manakah kalimat yang menggunakan kata baku?", options: ["Aku pergi ke swalayan", "Aku pergi ke supermarket", "Aku pergi ke toko", "Aku pergi ke warung"], answer: 1 },
      { q: "\"Mereka sedang ___ tugas sekolah.\" Pilihan yang tepat adalah...", options: ["mengerjakan", "ngerjain", "ngulik", "ngerjain"], answer: 0 },
      { q: "Kata \"efektif\" dan \"efisien\" memiliki arti yang...", options: ["Sama persis", "Berbeda", "Tidak ada hubungannya", "Bergantung konteks"], answer: 1 },
    ],
  },
  {
    floor: 2,
    title: "Konteks Komunikasi",
    desc: "Pahami bagaimana situasi mempengaruhi pilihan bahasamu.",
    icon: "🗣️",
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.4)",
    questions: [
      { q: "Ketika berbicara dengan guru, sebaiknya menggunakan ragam...", options: ["Santai", "Formal", "Slang", "Campur-campur"], answer: 1 },
      { q: "Mengirim pesan ke teman sebaya, ragam yang paling tepat adalah...", options: ["Sangat formal", "Santai dengan bahasa gaul yang sopan", "Bahasa daerah", "Tidak perlu bahasa"], answer: 1 },
      { q: "Dalam situasi resmi, penggunaan bahasa Indonesia yang baik adalah...", options: ["Campur bahasa", "Bahasa baku", "Bahasa gaul", "Tidak perlu bahasa"], answer: 1 },
    ],
  },
  {
    floor: 3,
    title: "Adaptasi Media",
    desc: "Tunjukkan kemampuanmu menyesuaikan bahasa untuk platform berbeda.",
    icon: "📱",
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.4)",
    questions: [
      { q: "Untuk caption Instagram formal, manakah yang paling tepat?", options: ["Gais, yok ke sini seru abisss!", "Yuk kunjungi acara kami! Informasi selengkapnya di bio.", "Hayo siapa yang mau ikutan?", "Datang ya jangan lupa!"], answer: 1 },
      { q: "Menulis artikel berita sebaiknya menggunakan...", options: ["Bahasa gaul", "Bahasa jurnalistik yang baku", "Bahasa percakapan", "Bahasa asing"], answer: 1 },
      { q: "Dalam presentasi bisnis, nada bahasa yang tepat adalah...", options: ["Sangat santai", "Profesional dan jelas", "Emosional", "Tidak perlu bahasa"], answer: 1 },
    ],
  },
  {
    floor: 4,
    title: "Kesadaran Norma",
    desc: "Uji kesadaranmu tentang etika dan norma berbahasa Indonesia.",
    icon: "⚖️",
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.4)",
    questions: [
      { q: "Penggunaan bahasa Indonesia yang baik mencerminkan...", options: ["Kepribadian", "Status sosial", "Usia", "Domisili"], answer: 0 },
      { q: "Mencampur bahasa secara berlebihan dalam komunikasi formal dapat...", options: ["Membuat keren", "Mengurangi kejelasan pesan", "Tidak ada efek", "Meningkatkan kreativitas"], answer: 1 },
      { q: "Budaya linguistik Indonesia menekankan pentingnya...", options: ["Kesantunan", "Kekerasan", "Ketidaktahuan", "Kebisingan"], answer: 0 },
    ],
  },
  {
    floor: 5,
    title: "Refleksi Kritis",
    desc: "Analisis dan evaluasi penggunaan bahasa dalam konteks nyata.",
    icon: "🔍",
    gradient: "from-rose-500 to-pink-500",
    glow: "rgba(244,63,94,0.4)",
    questions: [
      { q: "Apa dampak negatif dari penggunaan bahasa gaul yang berlebihan di media formal?", options: ["Meningkatkan kreativitas", "Menurunkan kredibilitas", "Tidak ada dampak", "Meningkatkan engagement"], answer: 1 },
      { q: "Kesadaran berbahasa adalah kemampuan untuk...", options: ["Menggunakan bahasa sesuai konteks", "Berbicara keras", "Menulis panjang", "Menggunakan bahasa asing"], answer: 0 },
      { q: "Peran generasi muda dalam menjaga bahasa Indonesia adalah...", options: ["Tidak ada peran", "Menjaga dan mengembangkan", "Mengabaikan saja", "Mengganti dengan bahasa lain"], answer: 1 },
    ],
  },
  {
    floor: 6,
    title: "Loyalitas Berbahasa",
    desc: "Buktikan komitmenmu terhadap penggunaan bahasa Indonesia yang berkualitas.",
    icon: "🏆",
    gradient: "from-yellow-400 to-amber-500",
    glow: "rgba(251,191,36,0.5)",
    questions: [
      { q: "Loyalitas berbahasa Indonesia tercermin dalam perilaku...", options: ["Konsisten menggunakan bahasa baku dalam konteks formal", "Menggunakan bahasa asing saja", "Tidak peduli dengan bahasa", "Hanya berbicara saat diminta"], answer: 0 },
      { q: "Cara terbaik menumbuhkan kebanggaan berbahasa Indonesia adalah...", options: ["Mengabaikannya", "Mempelajari dan menggunakannya dengan baik", "Menggantinya dengan bahasa lain", "Hanya menggunakan bahasa gaul"], answer: 1 },
      { q: "Seorang petualang bahasa yang baik seharusnya...", options: ["Hanya menggunakan satu ragam", "Mampu beradaptasi dengan berbagai situasi", "Tidak mau belajar", "Mengabaikan aturan bahasa"], answer: 1 },
    ],
  },
];

type FloorState = "locked" | "active" | "completed";
type AnswerState = "unanswered" | "correct" | "wrong";

export default function ChallengeTowerPage() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [floorScores, setFloorScores] = useState<number[]>(new Array(FLOORS.length).fill(0));
  const [floorStates, setFloorStates] = useState<FloorState[]>(() => {
    const s: FloorState[] = ["active"];
    for (let i = 1; i < FLOORS.length; i++) s.push("locked");
    return s;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [gameComplete, setGameComplete] = useState(false);

  const floor = FLOORS[currentFloor];
  const question = floor?.questions[currentQ];
  const totalQuestions = FLOORS.reduce((a, f) => a + f.questions.length, 0);
  const totalAnswered = FLOORS.slice(0, currentFloor).reduce((a, f) => a + f.questions.length, 0) + currentQ;

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selected !== null) return;
      setSelected(idx);
      const correct = idx === question.answer;
      setAnswerState(correct ? "correct" : "wrong");
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (currentQ < floor.questions.length - 1) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setAnswerState("unanswered");
        } else {
          const fScore = floor.questions.filter((_, i) => {
            const wasCorrect = i === currentQ ? correct : selected === floor.questions[i].answer;
            return wasCorrect;
          }).length;
          setFloorScores((prev) => {
            const next = [...prev];
            next[currentFloor] = fScore;
            return next;
          });
          setFloorStates((prev) => {
            const next = [...prev];
            next[currentFloor] = "completed";
            if (currentFloor + 1 < FLOORS.length) {
              next[currentFloor + 1] = "active";
            }
            return next;
          });

          if (currentFloor + 1 < FLOORS.length) {
            setCurrentFloor((f) => f + 1);
            setCurrentQ(0);
            setSelected(null);
            setAnswerState("unanswered");
          } else {
            setGameComplete(true);
          }
        }
      }, 1200);
    },
    [selected, question, currentQ, floor, currentFloor]
  );

  const totalScore = floorScores.reduce((a, b) => a + b, 0);
  const maxScore = totalQuestions;

  if (gameComplete) {
    return (
      <div className="relative min-h-dvh overflow-hidden text-gray-800">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/15 blur-[150px]" />
        </div>
        <div className="relative mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <div className="animate-bounce-in text-7xl">
            🏆
          </div>
          <h1 className="mt-6 animate-slide-up text-3xl font-black text-gray-900">
            Tower Selesai!
          </h1>
          <p className="mt-2 animate-fade-in text-lg text-gray-500">
            Skor: <span className="font-bold text-amber-700">{totalScore}</span> / {maxScore}
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => window.location.reload()} className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-300/30 transition hover:shadow-orange-400/40" style={{ boxShadow: "0 4px 0 #E65100, inset 0 2px 0 rgba(255,255,255,0.3)" }}>
              🔄 Main Lagi
            </button>
            <Link href="/world" className="rounded-xl border-2 border-gray-200 bg-white/70 px-6 py-3 text-sm font-bold text-gray-600 backdrop-blur-md transition hover:bg-white/90">
              Kembali ke City
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden text-gray-800">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-300/15 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/world" className="text-xs font-semibold text-blue-500">
            ← PRIMA CITY
          </Link>
          <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
              Skor: <span className="font-bold text-amber-700">{score}</span>
            </span>
            <span className="text-xs text-gray-500">
              {totalAnswered}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Floor indicator */}
        <div className="mt-6 flex items-end gap-1.5">
          {FLOORS.map((f, i) => {
            const state = floorStates[i];
            const isActive = i === currentFloor;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`relative h-2 w-full overflow-hidden rounded-full transition-all duration-500 ${
                    state === "completed" ? "bg-gray-300" : isActive ? "bg-gray-200" : "bg-gray-100"
                  }`}
                >
                  {state === "completed" && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${f.gradient}`}
                      style={{ width: "100%" }}
                    />
                  )}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${f.gradient} transition-all duration-500`}
                      style={{ width: `${((currentQ + 1) / f.questions.length) * 100}%` }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? "text-gray-800" : state === "completed" ? "text-gray-500" : "text-gray-400"}`}>
                  {f.floor}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current floor info */}
        <div
          key={currentFloor}
          className="mt-8 animate-slide-up text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-4xl shadow-lg backdrop-blur-md border border-gray-200" style={{ boxShadow: `0 20px 60px -10px ${floor.glow}` }}>
            {floor.icon}
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            🏗️ Lantai {floor.floor}
          </p>
          <h2 className="mt-1 text-2xl font-black text-gray-900">{floor.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{floor.desc}</p>
        </div>

        {/* Question */}
        <div
          key={`${currentFloor}-${currentQ}`}
          className="mt-8 animate-slide-in-left rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-md"
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
            ❓ Pertanyaan {currentQ + 1} / {floor.questions.length}
          </p>
          <p className="mt-3 text-base font-semibold text-gray-800 leading-relaxed">{question.q}</p>

          <div className="mt-5 space-y-2.5">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.answer;
              let borderColor = "border-gray-200";
              let bgColor = "bg-white/80";
              let textColor = "text-gray-700";

              if (answerState !== "unanswered") {
                if (isCorrect) {
                  borderColor = "border-emerald-500/50";
                  bgColor = "bg-emerald-500/10";
                  textColor = "text-emerald-400";
                } else if (isSelected && !isCorrect) {
                  borderColor = "border-rose-500/50";
                  bgColor = "bg-rose-500/10";
                  textColor = "text-rose-400";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-xl border ${borderColor} ${bgColor} px-4 py-3 text-left text-sm font-medium ${textColor} transition-all duration-200 hover:border-gray-300 hover:bg-white disabled:cursor-not-allowed`}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[11px] font-bold text-gray-600">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answerState !== "unanswered" && isCorrect && (
                    <span className="ml-2 text-emerald-600">✓</span>
                  )}
                  {isSelected && !isCorrect && answerState !== "unanswered" && (
                    <span className="ml-2 text-rose-600">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Floor completion mini-badge */}
        <div className="mt-6 flex justify-center gap-2">
          {FLOORS.map((f, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${
                floorStates[i] === "completed"
                  ? `bg-gradient-to-br ${f.gradient} shadow-lg text-white`
                  : i === currentFloor
                  ? "border border-gray-300 bg-white/70 text-gray-700"
                  : "border border-gray-200 bg-white/50 text-gray-400"
              }`}
              style={
                floorStates[i] === "completed"
                  ? { boxShadow: `0 4px 12px ${f.glow}` }
                  : undefined
              }
            >
              {floorStates[i] === "completed" ? "✓" : f.floor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
