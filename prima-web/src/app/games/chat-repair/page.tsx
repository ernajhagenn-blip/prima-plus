"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";
import { useLogGameResult } from "@/lib/useLogGameResult";

interface Question {
  broken: string;
  context: string;
  correctRephrase: string;
  options: string[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    broken: "Lo gue minta tolong dong ke perpus ambilinn buku gue yang ketinggalan",
    context: "Chat ke teman sekelas",
    correctRephrase: "Hei, bisa tolong ambilkan buku gue yang ketinggalan di perpus?",
    options: [
      "Hei, bisa tolong ambilkan buku gue yang ketinggalan di perpus?",
      "Gue minta lo ambil buku di perpus sekarang",
      "Tolong ambil buku perpus yang ketinggalan ya",
      "Hey can you get my book from the library?",
    ],
    explanation: "Pesan asli terlalu banyak campuran dan ambigu. Perbaikan menggunakan bahasa yang jelas dan sopan.",
  },
  {
    broken: "Emangnya gue peduli apa lo mau bilang gitu",
    context: "Balasan pesan teman yang mengkritik",
    correctRephrase: "Oke, gue dengar. Tapi gue punya alasan sendiri kenapa gue begini.",
    options: [
      "Oke, gue dengar. Tapi gue punya alasan sendiri kenapa gue begini.",
      "Emangnya gue peduli apa lo mau bilang gitu",
      "Lo tuh emang selalu bawel banget sih",
      "Yaudah terserah lo deh",
    ],
    explanation: "Mengganti respons defensif dengan respons yang lebih dewasa dan komunikatif.",
  },
  {
    broken: "Btw kmren gua udh kirim tugasnya ya, tp kayaknya salah file deh, sry ya",
    context: "Chat ke guru pengirim tugas",
    correctRephrase: "Selamat pagi, Pak/Bu. Saya sudah mengirimkan tugasnya, namun sepertinya saya mengirim file yang salah. Mohon maaf, saya akan kirim ulang yang benar.",
    options: [
      "Selamat pagi, Pak/Bu. Saya sudah mengirimkan tugasnya, namun sepertinya saya mengirim file yang salah. Mohon maaf, saya akan kirim ulang yang benar.",
      "Btw kmren gua udh kirim tugasnya ya, tp kayaknya salah file deh, sry ya",
      "Pak, tugas saya salah file. Undo dong",
      "Maaf pak, file tugasnya salah. Aku kirim ulang ya",
    ],
    explanation: "Chat ke guru harus menggunakan bahasa formal dan jelas, bukan bahasa sehari-hari.",
  },
  {
    broken: "Kok diem aja sih? Ngomong dong kalau ada masalah, jangan kayak orang bisu",
    context: "Chat ke teman yang sedang diam",
    correctRephrase: "Kayaknya kamu lagi ada sesuatu ya? Kalau mau cerita, aku siap dengar kok.",
    options: [
      "Kayaknya kamu lagi ada sesuatu ya? Kalau mau cerita, aku siap dengar kok.",
      "Kok diem aja sih? Ngomong dong kalau ada masalah",
      "Halo?? Ada yang salah? Talk to me!",
      "Lo kenapa sih? Jangan diem terus dong",
    ],
    explanation: "Mengganti nada yang menuduh dengan empati dan keterbukaan.",
  },
  {
    broken: "Bro gue lagi stuck nih di soal matematika, bisa gak lo bantuin gue malem ini jam 11",
    context: "Chat ke teman",
    correctRephrase: "Hey, gue lagi stuck di soal mat. Bisa bantuin gue malem ini jam 11 gak? Kalau bisa, makasih banyak!",
    options: [
      "Hey, gue lagi stuck di soal mat. Bisa bantuin gue malem ini jam 11 gak? Kalau bisa, makasih banyak!",
      "Bro gue lagi stuck nih di soal matematika, bisa gak lo bantuin gue malem ini jam 11",
      "Lo harus bantuin gue sekarang! Soal mat gue gak bisa",
      "Help me with math please!! Urgent!!!",
    ],
    explanation: "Menambahkan kalimat sopan (makasih) dan konteks yang lebih jelas.",
  },
  {
    broken: "Gue udah capek banget sama sikap lo yang kayak gini terus, beneran deh",
    context: "Chat ke pacar setelah bertengkar",
    correctRephrase: "Aku merasa lelah dengan situasi ini. Bisa kita bicara dan selesaikan bersama?",
    options: [
      "Aku merasa lelah dengan situasi ini. Bisa kita bicara dan selesaikan bersama?",
      "Gue udah capek banget sama sikap lo yang kayak gini terus",
      "Lo tuh emang gak berubah-ubah, gue muak",
      "I'm done with you, seriously",
    ],
    explanation: "Mengganti tuduhan dengan ungkapan perasaan yang lebih konstruktif.",
  },
  {
    broken: "Eh btw jangan lupa ya besok kita janjiannya jam 3 di mall, jangan telat lagi kayak kemarin",
    context: "Chat ke teman",
    correctRephrase: "Hey, jangan lupa ya besok kita ketemu jam 3 di mall. Sampai ketemu!",
    options: [
      "Hey, jangan lupa ya besok kita ketemu jam 3 di mall. Sampai ketemu!",
      "Eh btw jangan lupa ya besok kita janjiannya jam 3 di mall, jangan telat lagi kayak kemarin",
      "Besok jam 3 di mall. Jangan telat!",
      "Remember our meeting tomorrow at 3! Don't be late again!",
    ],
    explanation: "Menghilangkan nada menyalahkan ('kayak kemarin') dan membuat pesan lebih positif.",
  },
  {
    broken: "Tolong diemail ke aku file presentasinya yang versi terbaru itu yang kemarin kita bahas",
    context: "Chat ke rekan kerja",
    correctRephrase: "Halo, bisa tolong email file presentasi versi terbaru yang kemarin kita bahas? Terima kasih.",
    options: [
      "Halo, bisa tolong email file presentasi versi terbaru yang kemarin kita bahas? Terima kasih.",
      "Tolong diemail ke aku file presentasinya yang versi terbaru",
      "Email file presentasi terbaru ya! Thanks",
      "Can you send me the latest presentation file? Thanks!",
    ],
    explanation: "Menambahkan salam pembuka dan terima kasih untuk sopan santun di tempat kerja.",
  },
  {
    broken: "Pulang bareng gak nih? Mobil gue bawa sendiri sih, tapi kalau lo mau ikut gue anter",
    context: "Chat ke teman sekantor",
    correctRephrase: "Mau pulang bareng gak? Gue bisa anter kalau mau.",
    options: [
      "Mau pulang bareng gak? Gue bisa anter kalau mau.",
      "Pulang bareng gak nih? Mobil gue bawa sendiri sih, tapi kalau lo mau ikut gue anter",
      "Hey want a ride home? I have my car",
      "Lo mau gue anter pulang gak? Gue bawa mobil",
    ],
    explanation: "Menyederhanakan pesan yang bertele-tele menjadi lebih ringkas dan jelas.",
  },
  {
    broken: "Gue gak ngerti kenapa harus gue yang selalu ngerjain semuanya, lo tuh emang males banget",
    context: "Chat ke teman sekelompok",
    correctRephrase: "Gue merasa kayaknya gue yang terlalu banyak ngerjain. Bisa kita bagi tugas biar adil?",
    options: [
      "Gue merasa kayaknya gue yang terlalu banyak ngerjain. Bisa kita bagi tugas biar adil?",
      "Gue gak ngerti kenapa harus gue yang selalu ngerjain semuanya, lo tuh emang males banget",
      "Lo tuhemales banget sih! Kerja dong!",
      "You never do anything. I always do all the work!",
    ],
    explanation: "Mengganti tuduhan dengan permintaan pembagian tugas yang konstruktif.",
  },
];

const TIMER_SECONDS = 20;
const XP_PER_CORRECT = 10;

export default function ChatRepairPage() {
  const router = useRouter();

  useEffect(() => () => gameAudio.stopMusic(), []);
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
      const correct = answer === q.correctRephrase;
      gameAudio.sfx(correct ? "correct" : "wrong");
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
          gameAudio.sfx("win");
          setPhase("result");
        }
      }, 2200);
    },
    [currentQ, showFeedback]
  );

  const q = QUESTIONS[currentQ];
  const timerPct = (timer / TIMER_SECONDS) * 100;
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  useLogGameResult("chat-repair", "mini_game", phase === "result", {
    score: xp,
    accuracy,
    correct: answers.filter(Boolean).length,
    total: QUESTIONS.length,
    detail: { answers },
  });

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 relative overflow-hidden">
        <GameBackButton />
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a0a1e 0%, #2d1533 50%, #1a0a1e 100%)" }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ["#fb7185", "#ec4899", "#f472b6", "#facc15", "#a78bfa"][i % 5],
              boxShadow: `0 0 ${6 + i % 4}px ${["#fb7185", "#ec4899", "#f472b6", "#facc15", "#a78bfa"][i % 5]}`,
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
              border: `1px solid ${["#fb718522", "#ec489922", "#f472b622", "#facc1522"][i]}`,
              animation: `gameSpin ${10 + i * 4}s linear infinite`,
            }} />
          ))}
        </div>
        <div className="animate-scale-in w-full max-w-lg relative z-10">
          <div
            className="rounded-[28px] bg-white/95 p-10 text-center backdrop-blur-sm"
            style={{ border: "5px solid #253057", boxShadow: "0 12px 0 #253057, 0 24px 50px rgba(37,48,87,0.3)" }}
          >
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
              style={{ background: "linear-gradient(135deg, #fb7185, #ec4899)", border: "5px solid #253057", boxShadow: "0 8px 0 #be185d" }}
            >
              💬
            </div>
            <h1
              className="font-display mt-7 text-5xl text-slate-900"
              style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}
            >
              Chat Repair
            </h1>
            <p className="font-body mt-4 text-lg text-slate-600 leading-relaxed">
              Perbaiki pesan chat yang ambigu, canggung, atau salah arah. Pilih rephrase terbaik dari 4 opsi.
            </p>
            <div className="font-body mt-7 space-y-3 text-left text-base font-semibold text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-rose-600 text-lg">●</span>
                <span>10 pesan chat yang perlu diperbaiki</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-rose-600 text-lg">●</span>
                <span>Pilih rephrase paling tepat dari 4 opsi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-rose-600 text-lg">●</span>
                <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
              </div>
            </div>
            <button
              onClick={() => { gameAudio.startMusic("chill"); gameAudio.sfx("click"); setPhase("play"); }}
              className="font-display mt-9 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 py-5 text-2xl font-black text-white transition hover:scale-104 active:scale-96"
              style={{ border: "5px solid #253057", boxShadow: "0 8px 0 #be185d" }}
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-pink-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-base font-semibold text-slate-600">Chat Repair</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
              <p className="text-3xl font-black text-rose-700">{xp}</p>
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
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-700/60">
            💬 Chat Repair
          </p>
          <p className="text-lg font-black text-gray-900">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700">
          {xp} XP
        </div>
      </div>

      <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-white/70 border border-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            timerPct > 50
              ? "bg-gradient-to-r from-rose-500 to-pink-500"
              : timerPct > 25
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-gradient-to-r from-rose-500 to-red-500"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-slide-in-left w-full max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white/85 p-8 backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-700/60">
              📝 Pesan yang perlu diperbaiki
            </p>
            <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">&quot;{q.broken}&quot;</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                💬 {q.context}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.correctRephrase;
              const isSelected = opt === selected;
              let btnStyle = "border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white/90";
              if (showFeedback && isCorrect) btnStyle = "border-emerald-400/60 bg-emerald-500/15";
              if (showFeedback && isSelected && !isCorrect) btnStyle = "border-rose-400/60 bg-rose-500/15";

              return (
                <button
                  key={i}
                  onClick={() => !showFeedback && handleAnswer(opt)}
                  disabled={showFeedback}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition-all ${btnStyle} ${!showFeedback ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                >
                  <span className="mr-2 text-[11px] text-gray-400">{String.fromCharCode(65 + i)}.</span>
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
