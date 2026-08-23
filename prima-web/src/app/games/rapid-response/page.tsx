"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface WordPrompt {
  word: string;
  acceptableResponses: string[];
  category: string;
}

const WORD_PROMPTS: WordPrompt[] = [
  { word: "Sekolah", acceptableResponses: ["belajar", "guru", "kelas", "siswa", "pendidikan", "ilmu", "ujian", "tugas", "buku", "perpustakaan"], category: "Tempat" },
  { word: "Bahasa", acceptableResponses: ["komunikasi", "kata", "kalimat", "bicara", "tulis", "ucap", "aturan", "kosakata", "gaya", "ragam"], category: "Konsep" },
  { word: "Remaja", acceptableResponses: ["muda", "sekolah", "generasi", "masa depan", "pelajar", "siswa", "anak", "energik", "digital", "kreatif"], category: "Sosial" },
  { word: "Digital", acceptableResponses: ["teknologi", "internet", "online", "aplikasi", "gadget", "smartphone", "media", "platform", "website", "software"], category: "Teknologi" },
  { word: "Budaya", acceptableResponses: ["tradisi", "adat", "kebiasaan", "seni", "musik", "tari", "upacara", "warisan", "lokal", "daerah"], category: "Sosial" },
  { word: "Komunikasi", acceptableResponses: ["bicara", "pesan", "chat", "telepon", "tatap muka", "diskusi", "rapat", "presentasi", "surat", "email"], category: "Aktivitas" },
  { word: "Pendidikan", acceptableResponses: ["sekolah", "guru", "belajar", "ilmu", "kelas", "kuliah", "tugas", "ujian", "lulus", "ijazah"], category: "Sistem" },
  { word: "Sosial", acceptableResponses: ["teman", "keluarga", "masyarakat", "interaksi", "komunikasi", "kerumunan", "acara", "kumpul", "pertemanan", "jejaring"], category: "Relasi" },
  { word: "Kreatif", acceptableResponses: ["ide", "imajinasi", "inovasi", "seni", "desain", "kreasi", "orisinal", "unik", "baru", "berbeda"], category: "Karakter" },
  { word: "Indonesia", acceptableResponses: ["tanah air", "negara", "bangsa", "pulau", "budaya", "bahasa", "merah putih", "garuda", "nusantara", " archipelago"], category: "Identitas" },
  { word: "Adaptasi", acceptableResponses: ["perubahan", "penyesuaian", "evolusi", "transformasi", "penyesuaian", "perkembangan", "kemajuan", "pembaharuan", "pembaruan", "modernisasi"], category: "Proses" },
  { word: "Loyalitas", acceptableResponses: ["kesetiaan", "komitmen", "dedikasi", "pengabdian", "kepatuhan", "kekompakan", "kebersamaan", "ketulusan", "keikhlasan", "kecintaan"], category: "Nilai" },
];

const TIMER_SECONDS = 5;
const XP_PER_WORD = 8;

export default function RapidResponsePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "play" | "result">("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [userInput, setUserInput] = useState("");
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [answers, setAnswers] = useState<{ word: string; response: string; correct: boolean }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "play") {
      inputRef.current?.focus();
    }
  }, [phase, currentQ]);

  useEffect(() => {
    if (phase !== "play" || lastResult !== null) return;
    if (timer <= 0) {
      handleSubmit(null);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timer, lastResult]);

  const handleSubmit = useCallback(
    (input: string | null) => {
      if (lastResult !== null) return;
      const prompt = WORD_PROMPTS[currentQ];
      const response = (input ?? "").trim().toLowerCase();
      const correct =
        response.length > 0 &&
        prompt.acceptableResponses.some(
          (r) => r.toLowerCase() === response || response.includes(r.toLowerCase()) || r.toLowerCase().includes(response)
        );
      if (correct) setScore((s) => s + XP_PER_WORD);
      setAnswers((a) => [...a, { word: prompt.word, response: response || "—", correct }]);
      setLastResult(correct ? "correct" : "wrong");
      setUserInput("");
      setTimeout(() => {
        setLastResult(null);
        if (currentQ + 1 < WORD_PROMPTS.length) {
          setCurrentQ((c) => c + 1);
          setTimer(TIMER_SECONDS);
        } else {
          setPhase("result");
        }
      }, 1200);
    },
    [currentQ, lastResult]
  );

  const prompt = WORD_PROMPTS[currentQ];
  const timerPct = (timer / TIMER_SECONDS) * 100;
  const xp = score;
  const accuracy = answers.length > 0 ? Math.round((answers.filter((a) => a.correct).length / answers.length) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#060b1e] px-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 to-rose-600 text-4xl shadow-lg shadow-fuchsia-500/20">
            ⚡
          </div>
          <h1 className="mt-6 text-3xl font-black">Rapid Response</h1>
          <p className="mt-3 text-sm text-white/40">
            Uji kecepatan berpikir bahasa! Tulis kata asosiasi yang relevan dalam{" "}
            <span className="font-bold text-fuchsia-400">{TIMER_SECONDS} detik</span>.
          </p>
          <div className="mt-6 space-y-2 text-left text-xs text-white/30">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-fuchsia-400">●</span>
              <span>12 kata prompt yang muncul satu per satu</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-fuchsia-400">●</span>
              <span>Tulis satu kata/frasa asosiasi secepat mungkin</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-fuchsia-400">●</span>
              <span>Setiap jawaban relevan = +{XP_PER_WORD} XP</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPhase("play")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-4 text-lg font-black text-white shadow-lg shadow-fuchsia-500/20"
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-rose-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-sm text-white/40">Rapid Response</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-fuchsia-400">{xp}</p>
              <p className="mt-1 text-[11px] text-white/30">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-emerald-400">{accuracy}%</p>
              <p className="mt-1 text-[11px] text-white/30">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-black text-amber-400">
                {answers.filter((a) => a.correct).length}/{WORD_PROMPTS.length}
              </p>
              <p className="mt-1 text-[11px] text-white/30">Relevan</p>
            </div>
          </div>

          <div className="mt-6 max-h-40 space-y-1 overflow-y-auto text-left">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                  a.correct ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}
              >
                <span className="font-bold">{a.word}</span>
                <span className="text-white/40">→ {a.response}</span>
                <span>{a.correct ? "✓" : "✗"}</span>
              </div>
            ))}
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
                setLastResult(null);
                setAnswers([]);
                setUserInput("");
              }}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Main Lagi
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-3 text-sm font-bold text-white"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-300/40">
            Rapid Response
          </p>
          <p className="text-sm font-bold text-white">
            {currentQ + 1} / {WORD_PROMPTS.length}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-fuchsia-400">
          {xp} XP
        </div>
      </div>

      {/* Timer */}
      <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full transition-colors ${
            timerPct > 50
              ? "bg-gradient-to-r from-fuchsia-500 to-rose-500"
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-md text-center"
          >
            {/* Category badge */}
            <span className="inline-block rounded-full bg-fuchsia-500/10 px-3 py-1 text-[11px] font-bold text-fuchsia-400">
              {prompt.category}
            </span>

            {/* Word prompt */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mt-6"
            >
              <h2 className="text-6xl font-black text-white" style={{ textShadow: "0 0 40px rgba(217,70,239,0.4)" }}>
                {prompt.word}
              </h2>
            </motion.div>

            {/* Timer display */}
            <div className="mt-6">
              <span
                className={`text-4xl font-black ${
                  timer <= 2 ? "text-rose-400" : timer <= 4 ? "text-amber-400" : "text-fuchsia-400"
                }`}
              >
                {timer}
              </span>
              <p className="mt-1 text-xs text-white/30">detik tersisa</p>
            </div>

            {/* Input */}
            <div className="mt-6">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && userInput.trim().length > 0 && lastResult === null) {
                    handleSubmit(userInput);
                  }
                }}
                disabled={lastResult !== null}
                placeholder="Ketik asosiasimu..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center text-lg font-bold text-white placeholder-white/20 outline-none transition focus:border-fuchsia-500/50 focus:bg-white/10 disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => userInput.trim().length > 0 && handleSubmit(userInput)}
                disabled={userInput.trim().length === 0 || lastResult !== null}
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-3 text-sm font-bold text-white transition disabled:opacity-30"
              >
                KIRIM ⏎
              </motion.button>
            </div>

            {/* Feedback flash */}
            {lastResult !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 rounded-xl p-3 text-sm font-bold ${
                  lastResult === "correct"
                    ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-400"
                    : "border border-rose-400/30 bg-rose-500/15 text-rose-400"
                }`}
              >
                {lastResult === "correct" ? "✓ Relevan! +8 XP" : "✗ Kurang tepat"}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
