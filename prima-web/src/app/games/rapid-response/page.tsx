"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";
import { useLogGameResult } from "@/lib/useLogGameResult";

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

  useEffect(() => () => gameAudio.stopMusic(), []);
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
      gameAudio.sfx(correct ? "coin" : "wrong");
      setAnswers((a) => [...a, { word: prompt.word, response: response || "—", correct }]);
      setLastResult(correct ? "correct" : "wrong");
      setUserInput("");
      setTimeout(() => {
        setLastResult(null);
        if (currentQ + 1 < WORD_PROMPTS.length) {
          setCurrentQ((c) => c + 1);
          setTimer(TIMER_SECONDS);
        } else {
          gameAudio.sfx("win");
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

  useLogGameResult("rapid-response", "mini_game", phase === "result", {
    score: xp,
    accuracy,
    correct: answers.filter((a) => a.correct).length,
    total: WORD_PROMPTS.length,
    detail: { answers },
  });

  if (phase === "start") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 relative overflow-hidden">
        <GameBackButton />
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a0520 0%, #2d0a35 50%, #1a0520 100%)" }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ["#e879f9", "#d946ef", "#f472b6", "#facc15", "#a78bfa"][i % 5],
              boxShadow: `0 0 ${6 + i % 4}px ${["#e879f9", "#d946ef", "#f472b6", "#facc15", "#a78bfa"][i % 5]}`,
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
              border: `1px solid ${["#e879f922", "#d946ef22", "#f472b622", "#facc1522"][i]}`,
              animation: `gameSpin ${10 + i * 4}s linear infinite`,
            }} />
          ))}
        </div>
        <div className="animate-scale-in w-full max-w-lg relative z-10">
          <div
            className="rounded-[28px] bg-white/95 backdrop-blur-sm p-10 text-center"
            style={{ border: "5px solid #253057", boxShadow: "0 12px 0 #253057, 0 24px 50px rgba(37,48,87,0.3)" }}
          >
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
              style={{ background: "linear-gradient(135deg, #e879f9, #d946ef)", border: "5px solid #253057", boxShadow: "0 8px 0 #a21caf" }}
            >
              ⚡
            </div>
            <h1 className="mt-7 font-display text-5xl text-slate-900" style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}>
              Rapid Response
            </h1>
            <p className="mt-4 font-body text-lg text-slate-600 leading-relaxed">
              Uji kecepatan berpikir bahasa! Tulis kata asosiasi yang relevan dalam{" "}
              <span className="font-bold text-fuchsia-700">{TIMER_SECONDS} detik</span>.
            </p>
            <div className="mt-7 space-y-3 text-left text-base font-semibold text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-fuchsia-600 text-lg">●</span>
                <span>12 kata prompt yang muncul satu per satu</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-fuchsia-600 text-lg">●</span>
                <span>Tulis satu kata/frasa asosiasi secepat mungkin</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-fuchsia-600 text-lg">●</span>
                <span>Setiap jawaban relevan = +{XP_PER_WORD} XP</span>
              </div>
            </div>
            <button
              onClick={() => { gameAudio.startMusic("action"); gameAudio.sfx("click"); setPhase("play"); }}
              className="mt-9 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-5 font-display text-2xl font-black text-white transition hover:scale-104 active:scale-96"
              style={{ border: "5px solid #253057", boxShadow: "0 8px 0 #a21caf" }}
            >
              MULAI ▶
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-rose-600/20 text-4xl">
            🏆
          </div>
          <h1 className="mt-6 text-3xl font-black">Selesai!</h1>
          <p className="mt-2 text-base font-semibold text-slate-600">Rapid Response</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50/70 p-4">
              <p className="text-3xl font-black text-fuchsia-700">{xp}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">XP Earned</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-3xl font-black text-emerald-700">{accuracy}%</p>
              <p className="mt-1 text-xs font-bold text-slate-500">Akurasi</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-3xl font-black text-amber-700">
                {answers.filter((a) => a.correct).length}/{WORD_PROMPTS.length}
              </p>
                <p className="mt-1 text-xs font-bold text-slate-500">Relevan</p>
            </div>
          </div>

          <div className="mt-6 max-h-40 space-y-1 overflow-y-auto text-left">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                  a.correct ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                <span className="font-bold">{a.word}</span>
                <span className="text-gray-600">→ {a.response}</span>
                <span>{a.correct ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setPhase("play");
                setCurrentQ(0);
                setScore(0);
                setTimer(TIMER_SECONDS);
                setLastResult(null);
                setAnswers([]);
                setUserInput("");
              }}
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white/70 py-3 text-sm font-bold text-gray-700 transition hover:bg-white/80 hover:scale-103 active:scale-97"
            >
              Main Lagi
            </button>
            <button
              onClick={() => router.push("/games")}
              className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97"
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
          <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-700/60">
            ⚡ Rapid Response
          </p>
          <p className="text-sm font-bold text-gray-900">
            {currentQ + 1} / {WORD_PROMPTS.length}
          </p>
        </div>
        <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-200 px-3 py-1.5 text-xs font-bold text-fuchsia-700">
          {xp} XP
        </div>
      </div>

      {/* Timer */}
      <div className="mx-4 mt-2 h-1.5 overflow-hidden rounded-full bg-white/70 border border-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            timerPct > 50
              ? "bg-gradient-to-r from-fuchsia-500 to-rose-500"
              : timerPct > 25
              ? "bg-gradient-to-r from-amber-500 to-orange-500"
              : "bg-gradient-to-r from-rose-500 to-red-500"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div key={currentQ} className="animate-scale-in w-full max-w-md text-center">
          {/* Category badge */}
          <span className="inline-block rounded-full bg-fuchsia-100 px-3 py-1 text-[11px] font-bold text-fuchsia-700">
            {prompt.category}
          </span>

          {/* Word prompt */}
          <div className="mt-6">
            <h2 className="text-6xl font-black text-gray-900" style={{ textShadow: "0 0 40px rgba(192,132,252,0.3)" }}>
              {prompt.word}
            </h2>
          </div>

          {/* Timer display */}
          <div className="mt-6">
            <span
              className={`text-4xl font-black ${
                timer <= 2 ? "text-rose-600" : timer <= 4 ? "text-amber-600" : "text-fuchsia-600"
              }`}
            >
              {timer}
            </span>
            <p className="mt-1 text-xs text-gray-500">detik tersisa</p>
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
              className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-5 py-4 text-center text-lg font-bold text-gray-800 placeholder-gray-400 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200 focus:bg-white disabled:opacity-50"
            />
            <button
              onClick={() => userInput.trim().length > 0 && handleSubmit(userInput)}
              disabled={userInput.trim().length === 0 || lastResult !== null}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-600 py-3 text-sm font-black text-white shadow-lg transition hover:scale-103 active:scale-97 disabled:opacity-30"
            >
              KIRIM ⏎
            </button>
          </div>

          {/* Feedback flash */}
          {lastResult !== null && (
            <div
              className={`mt-4 animate-scale-in rounded-xl p-3 text-sm font-bold ${
                lastResult === "correct"
                  ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-400"
                  : "border border-rose-400/30 bg-rose-500/15 text-rose-400"
              }`}
            >
              {lastResult === "correct" ? "✓ Relevan! +8 XP" : "✗ Kurang tepat"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
