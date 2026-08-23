"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
      }, 2200);
    },
    [currentQ, showFeedback]
  );

  const q = QUESTIONS[currentQ];
  const timerPct = (timer / TIMER_SECONDS) * 100;
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter(Boolean).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#060b1e] px-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-4xl shadow-lg shadow-rose-500/20">
            💬
          </div>
          <h1 className="mt-6 text-3xl font-black">Chat Repair</h1>
          <p className="mt-3 text-sm text-white/40">
            Perbaiki pesan chat yang ambigu, canggung, atau salah arah. Pilih rephrase terbaik dari 4 opsi.
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-white/30">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-rose-400">●</span>
              <span>10 pesan chat yang perlu diperbaiki</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-rose-400">●</span>
              <span>Pilih rephrase paling tepat dari 4 opsi</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-rose-400">●</span>
              <span>Setiap jawaban benar = +{XP_PER_CORRECT} XP</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 py-4 text-lg font-black text-white shadow-lg shadow-rose-500/20"
          >
            MULAI ▶
          </motion.button>
          <button
            onClick={() => router.push("/games")}
            className="mt-3 text-xs text-white/25 transition hover:text-white/50"
          >
            ← Kembali ke Arcade
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#060b1e] px-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-pink-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-white/40">Chat Repair</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-rose-400">{xp}</p>
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setPhase("play");
                setCurrentQ(0);
                setScore(0);
                setTimer(TIMER_SECONDS);
                setSelected(null);
                setShowFeedback(false);
                setAnswers([]);
              }}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Main Lagi
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-sm font-bold text-white"
            >
              ke Arcade →
            </motion.button>
          </div>
        </motion.div>
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
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-300/40">
            Chat Repair
          </p>
          <p className="text-sm font-bold text-white">
            {currentQ + 1} / {QUESTIONS.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-rose-400">
          {xp} XP
        </div>
      </div>

      <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full transition-colors ${
            timerPct > 50
              ? "bg-gradient-to-r from-rose-500 to-pink-500"
              : timerPct > 25
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-gradient-to-r from-rose-500 to-red-500"
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="w-full max-w-lg"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-400/60">
                Pesan yang perlu diperbaiki
              </p>
              <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-sm text-white/80 leading-relaxed">&quot;{q.broken}&quot;</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-400">
                  💬 {q.context}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.correctRephrase;
                const isSelected = opt === selected;
                let btnStyle = "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]";
                if (showFeedback && isCorrect) btnStyle = "border-emerald-400/60 bg-emerald-500/15";
                if (showFeedback && isSelected && !isCorrect) btnStyle = "border-rose-400/60 bg-rose-500/15";

                return (
                  <motion.button
                    key={i}
                    whileHover={!showFeedback ? { scale: 1.02 } : undefined}
                    whileTap={!showFeedback ? { scale: 0.98 } : undefined}
                    onClick={() => !showFeedback && handleAnswer(opt)}
                    disabled={showFeedback}
                    className={`w-full rounded-xl border p-4 text-left text-sm transition-all ${btnStyle}`}
                  >
                    <span className="mr-2 text-[11px] text-white/20">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-bold text-white/50">Penjelasan:</p>
                <p className="mt-1 text-sm text-white/70">{q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
