"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";

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
      const correct = answer === q.correctAnswer;
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
      }, 2500);
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
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #1a1030 50%, #0f0a1a 100%)" }} />
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 31) % 100}%`,
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ["#a78bfa", "#8b5cf6", "#c084fc", "#f472b6", "#38bdf8"][i % 5],
              boxShadow: `0 0 ${6 + i % 4}px ${["#a78bfa", "#8b5cf6", "#c084fc", "#f472b6", "#38bdf8"][i % 5]}`,
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
              border: `1px solid ${["#a78bfa22", "#8b5cf622", "#c084fc22", "#f472b622"][i]}`,
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
              className="mx-auto flex items-center justify-center rounded-3xl text-5xl"
              style={{
                width: "96px", height: "96px",
                background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                border: "5px solid #253057", boxShadow: "0 8px 0 #6d28d9",
              }}
            >🧪</div>

            <h1 className="font-display text-5xl text-slate-900 mt-7" style={{ textShadow: "0 2px 0 rgba(37,48,87,0.08)" }}>
              Code-Mix Lab
            </h1>

            <p className="font-body text-lg text-slate-600 mt-4 leading-relaxed">
              Analisis fenomena code-mixing dalam percakapan sehari-hari remaja Indonesia.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {[
                { icon: "🔬", title: "10 Kasus Nyata", desc: "Pesan campuran bahasa Indonesia-Inggris dari percakapan sehari-hari" },
                { icon: "🧩", title: "Analisis Mendalam", desc: "Identifikasi jenis code-mixing, padanan baku, dan dampak linguistik" },
                { icon: "⚡", title: "+12 XP per Jawaban", desc: "Setiap analisis benar meningkatkan skor kesadaran bahasamu" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-[14px] bg-white p-4 text-left" style={{ border: "1px solid rgba(37,48,87,0.1)" }}>
                  <div
                    className="flex shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ width: "48px", height: "48px", background: "rgba(139,92,246,0.15)" }}
                  >{f.icon}</div>
                  <div>
                    <p className="font-body text-base font-semibold text-slate-600 m-0">{f.title}</p>
                    <p className="font-body text-sm text-slate-500 m-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { gameAudio.startMusic("mystery"); gameAudio.sfx("click"); setPhase("play"); }}
              className="font-display mt-8 w-full cursor-pointer rounded-2xl py-5 text-2xl font-bold tracking-wide text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                border: "5px solid #253057", boxShadow: "0 8px 0 #6d28d9",
              }}
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
      <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem", textAlign: "center", animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div style={{ fontSize: "4rem" }}>🏆</div>
          <h1 style={{ fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: 900, color: "#1e293b", margin: "16px 0 0" }}>Selesai!</h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#64748b", margin: "4px 0 0" }}>Code-Mix Lab</p>

          <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[
              { value: xp, label: "XP Earned", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
              { value: `${accuracy}%`, label: "Akurasi", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              { value: `${answers.filter(Boolean).length}/${QUESTIONS.length}`, label: "Benar", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "14px 8px", borderRadius: "14px", background: s.bg, border: `1px solid ${s.color}20` }}>
                <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 800, color: "#64748b", margin: "4px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
            <button onClick={() => { setPhase("play"); setCurrentQ(0); setScore(0); setSelected(null); setShowFeedback(false); setAnswers([]); }} style={{
              flex: 1, padding: "12px", borderRadius: "14px", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
              color: "#334155", border: "1px solid rgba(255,255,255,0.1)", background: "#ffffff", cursor: "pointer",
            }}>🔄 Main Lagi</button>
            <button onClick={() => router.push("/games")} style={{
              flex: 1, padding: "12px", borderRadius: "14px", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
              color: "#1e293b", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #8b5cf6, #a855f7)", boxShadow: "0 4px 0 #6d28d9, inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>ke Arcade →</button>
          </div>
        </div>
        <style>{`@keyframes scaleIn { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      <GameBackButton />
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
        <button onClick={() => router.push("/games")} style={{
          padding: "6px 12px", borderRadius: "8px", fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
          color: "#64748b", border: "1px solid rgba(255,255,255,0.1)", background: "#ffffff", cursor: "pointer",
        }}>✕</button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.1em", color: "#a855f7", textTransform: "uppercase", margin: 0 }}>🧪 Code-Mix Lab</p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#334155", margin: "2px 0 0" }}>{currentQ + 1} / {QUESTIONS.length}</p>
        </div>
        <div style={{
          padding: "6px 12px", borderRadius: "8px",
          background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)",
          fontFamily: "'Righteous', sans-serif", fontSize: "0.75rem", fontWeight: 900, color: "#c084fc",
        }}>{xp} XP</div>
      </div>

      {/* Question area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px 24px" }}>
        <div key={currentQ} style={{ width: "100%", maxWidth: "36rem", animation: "slideUp 0.4s ease-out both" }}>
          {/* Mixed message card */}
          <div style={{
            padding: "18px", borderRadius: "18px",
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "#a855f7", textTransform: "uppercase", margin: 0 }}>🔬 Pesan campuran</p>
            <div style={{
              marginTop: "10px", padding: "14px", borderRadius: "12px",
              background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)",
            }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>&quot;{q.mixedMessage}&quot;</p>
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: "14px 0 0", lineHeight: 1.6 }}>{q.question}</p>
          </div>

          {/* Options */}
          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.correctAnswer;
              const isSelected = opt === selected;
              let border = "1px solid rgba(30,41,59,0.12)";
              let bg = "rgba(248,250,252,0.9)";
              let textColor = "#334155";
              if (showFeedback && isCorrect) { border = "2px solid #10b981"; bg = "rgba(16,185,129,0.12)"; textColor = "#34d399"; }
              else if (showFeedback && isSelected && !isCorrect) { border = "2px solid #f43f5e"; bg = "rgba(244,63,94,0.12)"; textColor = "#fb7185"; }

              return (
                <button key={i} onClick={() => !showFeedback && handleAnswer(opt)} disabled={showFeedback}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    padding: "14px 16px", borderRadius: "14px", border, background: bg,
                    cursor: showFeedback ? "not-allowed" : "pointer", textAlign: "left",
                    transition: "all 0.2s", opacity: showFeedback && !isCorrect && !isSelected ? 0.5 : 1,
                  }}
                >
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                    background: showFeedback && isCorrect ? "rgba(16,185,129,0.2)" : showFeedback && isSelected && !isCorrect ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 900, color: textColor,
                  }}>{String.fromCharCode(65 + i)}.</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", fontWeight: 700, color: textColor, lineHeight: 1.6 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              marginTop: "14px", padding: "14px", borderRadius: "14px",
              background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)",
              animation: "fadeIn 0.3s ease-out both",
            }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 800, color: "#a855f7", margin: 0 }}>💡 Penjelasan:</p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.65)", margin: "6px 0 0", lineHeight: 1.6 }}>{q.explanation}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
