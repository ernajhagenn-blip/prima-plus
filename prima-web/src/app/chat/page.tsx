"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FunBackground from "@/components/FunBackground";
import { SCENARIOS } from "@/lib/chatChapters";
import { gameAudio } from "@/lib/gameAudio";
import GameBackButton from "@/components/GameBackButton";

interface Choice { text: string; fb: string; tone: "good" | "mid" | "bad"; }

function RepostCard() {
  return (
    <div style={{ background: "#fdf6ee", borderRadius: 14, overflow: "hidden", border: "1px solid #e8ddd0", maxWidth: 340, boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}>
      <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700, fontFamily: "Arial,sans-serif" }}>RK</div>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1a1a1a", fontFamily: "Arial,sans-serif" }}>raka memposting ulang</p>
          <p style={{ margin: 0, fontSize: 10, color: "#888", fontFamily: "Arial,sans-serif" }}>another side of me</p>
        </div>
      </div>
      <div style={{ padding: "4px 14px 10px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 12.5, color: "#3a3027", lineHeight: 1.65 }}>
        <p style={{ margin: 0 }}>apabila segala musim telah letih</p>
        <p style={{ margin: 0 }}>menggugurkan usia, sedang sang langit</p>
        <p style={{ margin: 0 }}>sudah habis warna untuk lukiskan petang.</p>
        <p style={{ margin: "8px 0 0" }}>aku biarkan dunia menyangka,</p>
        <p style={{ margin: 0 }}>bahwa aku hanya sekedar</p>
        <p style={{ margin: 0 }}>menitipkan selembar warkah.</p>
        <p style={{ margin: "8px 0 0" }}>meski di antara segala abjad</p>
        <p style={{ margin: 0 }}>yang aku tuliskan, tersembunyi</p>
        <p style={{ margin: 0 }}>sebuah semesta yang tiada</p>
        <p style={{ margin: 0 }}>jemu memilihmu sebagai</p>
        <p style={{ margin: 0 }}>arah terbit setiap cahaya.</p>
      </div>
      <div style={{ display: "flex", gap: 16, padding: "6px 14px 10px", borderTop: "1px solid #ede4d8" }}>
        <span style={{ fontSize: 12, color: "#666" }}>? 1.247</span>
        <span style={{ fontSize: 12, color: "#666" }}>?? 83</span>
        <span style={{ fontSize: 12, color: "#666" }}>? 412</span>
      </div>
    </div>
  );
}

const REFLECTIONS = [
  { q: "Pernah nggak kamu menyisipkan kata asing tanpa sadar? Kata apa, dan kapan biasanya itu terjadi?", ph: "Contoh: 'biasanya pas ngetik cepat di chat...'" },
  { q: "Kenapa menurutmu kata itu terasa lebih nyaman dipakai dibanding padanan Indonesia?", ph: "Tulis jujur, tidak ada yang menilai jawaban ini" },
  { q: "Kalau lawan bicaramu berubah dari teman ke guru, apa yang berubah dari pilihan bahasamu? Kenapa?", ph: "Ceritakan kebiasaanmu sendiri..." },
];

const CHARACTER_COLORS: Record<string, string[]> = {
  Alya: ["#7c3aed", "#a855f7"],
  Raka: ["#0ea5e9", "#38bdf8"],
  Naya: ["#ec4899", "#f472b6"],
  Dina: ["#f59e0b", "#fbbf24"],
  Maiu: ["#10b981", "#34d399"],
  Ajo: ["#6366f1", "#818cf8"],
  Bian: ["#ef4444", "#f87171"],
  "Bu Guru": ["#64748b", "#94a3b8"],
  "Adik Kelas": ["#8b5cf6", "#c084fc"],
};

function getCharColor(name: string) {
  return CHARACTER_COLORS[name] || ["#64748b", "#94a3b8"];
}

export default function ChatPage() {
  const [stage, setStage] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [timer, setTimer] = useState(120);
  const router = useRouter();

  const s = SCENARIOS[stage];
  const allChatDone = stage >= SCENARIOS.length;
  const allReflected = answers.every((a) => a.trim().length > 2);

  const pick = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    gameAudio.sfx("dialog");
    const tone = s.choices[i]?.tone;
    gameAudio.sfx(tone === "good" ? "correct" : tone === "bad" ? "wrong" : "click");
  };

  useEffect(() => {
    if (allChatDone || chosen !== null) return;
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [allChatDone, chosen, timer]);

  useEffect(() => {
    const kick = () => { gameAudio.startMusic("mystery"); window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => { window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); gameAudio.stopMusic(); };
  }, []);

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, position: "relative", zIndex: 1, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <FunBackground variant="night" />
      <GameBackButton />
      {!allChatDone ? (
      <div style={{ width: "100%", maxWidth: 700, display: "flex", flexDirection: "column", minHeight: "100vh", padding: "clamp(16px,4vmin,40px) clamp(14px,3vmin,32px)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "#facc15", background: "rgba(250,204,21,0.12)", borderRadius: 8, padding: "4px 12px", border: "1px solid rgba(250,204,21,0.25)" }}>
                {stage + 1} / {SCENARIOS.length}
              </span>
              <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px" }}>
                {s.domain}
              </span>
            </div>
            <span style={{ fontFamily: "Arial,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              {s.place}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 22, color: timer <= 30 ? "#ef4444" : "#facc15", textShadow: timer <= 30 ? "0 0 12px rgba(239,68,68,0.5)" : "0 0 12px rgba(250,204,21,0.3)", letterSpacing: "0.05em" }}>
              {String(Math.floor(timer / 60)).padStart(1, "0")}:{String(timer % 60).padStart(2, "0")}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(22px,4vmin,30px)", color: "white", margin: "0 0 20px", textShadow: "0 2px 12px rgba(124,58,237,0.4)" }}>
            {s.title}
          </h1>

          {/* Chat Messages - Scrollable */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 20, paddingBottom: 10, maxHeight: "42vh", maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%)" }}>
            {s.msgs.map((m, i) => {
              const left = m.side === "l";
              const colors = left ? getCharColor(m.from) : ["#7c3aed", "#ec4899"];
              if (m.img) {
                return (
                  <div key={i} style={{ alignSelf: "flex-start", maxWidth: "88%", display: "flex", flexDirection: "row", gap: 10, alignItems: "flex-end", animation: `bubbleIn 0.4s ${i * 0.1}s ease both` }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${colors[0]},${colors[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Righteous',sans-serif", fontSize: 12, color: "white", fontWeight: 700, boxShadow: `0 2px 8px ${colors[0]}44` }}>
                      {m.from.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, color: colors[0], fontWeight: 600 }}>{m.from}</span>
                      <RepostCard />
                      <span style={{ fontFamily: "Arial,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{m.text}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} style={{ alignSelf: left ? "flex-start" : "flex-end", maxWidth: left ? "85%" : "82%", display: "flex", flexDirection: left ? "row" : "row-reverse", gap: 10, alignItems: "flex-start", animation: `bubbleIn 0.4s ${i * 0.1}s ease both` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${colors[0]},${colors[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Righteous',sans-serif", fontSize: 12, color: "white", fontWeight: 700, boxShadow: `0 2px 8px ${colors[0]}44` }}>
                    {left ? m.from.slice(0, 2).toUpperCase() : "AKU"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {left && <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, color: colors[0], fontWeight: 600, paddingLeft: 4 }}>{m.from}</span>}
                    <div style={{ background: left ? "rgba(255,255,255,0.95)" : `linear-gradient(135deg,${colors[0]},${colors[1]})`, borderRadius: left ? "4px 20px 20px 20px" : "20px 4px 20px 20px", padding: "12px 16px", boxShadow: left ? "0 2px 12px rgba(0,0,0,0.15)" : `0 2px 12px ${colors[0]}33` }}>
                      <p style={{ fontFamily: "Arial,sans-serif", fontSize: 15, color: left ? "#1e293b" : "white", margin: 0, lineHeight: 1.55, fontWeight: left ? 400 : 500 }}>{m.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decision Card */}
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 18, padding: "16px 20px", border: "2px solid #facc15", boxShadow: "0 4px 20px rgba(250,204,21,0.2), 0 0 40px rgba(250,204,21,0.08)", marginBottom: 16, animation: "bubbleIn 0.4s 0.5s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 12, color: "#92400e", letterSpacing: "0.12em" }}>KEPUTUSAN</span>
              <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, color: "#78350f", background: "#fbbf24", borderRadius: 8, padding: "3px 10px", fontWeight: 700 }}>{s.domain}</span>
            </div>
            <p style={{ fontFamily: "Arial,sans-serif", fontSize: 15, color: "#1e293b", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>{s.ask}</p>
          </div>

          {/* Choices */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.choices.map((c, i) => {
              const isSel = chosen === i;
              const showFb = chosen !== null;
              const toneColor = c.tone === "good" ? "#22c55e" : c.tone === "mid" ? "#f59e0b" : "#ef4444";
              const border = showFb && isSel ? toneColor : "rgba(255,255,255,0.12)";
              const bg = showFb && isSel
                ? c.tone === "good" ? "rgba(34,197,94,0.12)" : c.tone === "mid" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)"
                : "rgba(255,255,255,0.04)";
              return (
                <div key={i} style={{ animation: `bubbleIn 0.35s ${0.55 + i * 0.06}s ease both` }}>
                  <button
                    onClick={() => pick(i)}
                    disabled={chosen !== null}
                    style={{ width: "100%", textAlign: "left", padding: "14px 18px", borderRadius: 14, background: bg, border: `1.5px solid ${border}`, color: "rgba(255,255,255,0.92)", fontFamily: "Arial,sans-serif", fontSize: 14.5, lineHeight: 1.55, cursor: chosen === null ? "pointer" : "default", transition: "all 0.2s", display: "flex", gap: 12, alignItems: "flex-start" }}
                  >
                    <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 13, color: showFb && isSel ? toneColor : "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 1 }}>{String.fromCharCode(65 + i)}.</span>
                    <span>{c.text}</span>
                  </button>
                  {showFb && isSel && (
                    <div style={{ marginTop: 10, marginLeft: 8, padding: "16px 20px", borderRadius: 16, background: "rgba(24,26,58,0.95)", border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "bubbleIn 0.3s ease both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: toneColor, boxShadow: `0 0 8px ${toneColor}66` }} />
                        <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, letterSpacing: "0.12em", color: "#c084fc" }}>HASIL</span>
                      </div>
                      <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.9)", margin: "0 0 12px", lineHeight: 1.6, fontStyle: "italic", whiteSpace: "pre-line" }}>
                        {c.tone === "good" ? "Pilihanmu bekerja dengan baik di konteks ini." : c.tone === "mid" ? "Pesan terkirim — dengan satu hal yang layak kamu perhatikan." : "Pesan terkirim, tapi efeknya berbeda dari yang mungkin kamu niatkan."}
                      </p>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 4 }}>
                        <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, letterSpacing: "0.12em", color: "#c084fc" }}>MENGAPA BEGITU</span>
                        <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "6px 0 0", lineHeight: 1.7, whiteSpace: "pre-line" }}>{c.fb}</p>
                      </div>
                      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(250,204,21,0.06)", border: "1px dashed rgba(250,204,21,0.35)" }}>
                        <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, letterSpacing: "0.12em", color: "#fbbf24" }}>COBA PIKIR LAGI</span>
                        <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.7)", margin: "5px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>{s.reflect}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          {chosen !== null && (
            <button
              onClick={() => { gameAudio.sfx("page"); setChosen(null); setStage(stage + 1); }}
              style={{ marginTop: 16, padding: "16px 0", borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", color: "white", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 16, fontWeight: 900, cursor: "pointer", animation: "bubbleIn 0.3s ease both", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
            >
              {stage === SCENARIOS.length - 1 ? "Refleksi Diri ?" : "SELANJUTNYA →"}
            </button>
          )}
        </div>
      ) : (
        /* Reflection Section */
      <div style={{ width: "100%", maxWidth: 660, display: "flex", flexDirection: "column", minHeight: "100vh", padding: "clamp(16px,4vmin,40px) clamp(14px,3vmin,32px)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 13, letterSpacing: "0.25em", color: "#4ade80", margin: "0 0 8px" }}>
              REFLEKSI
            </p>
            <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(24px,5vmin,34px)", color: "white", margin: "0 0 10px", textShadow: "0 3px 16px rgba(74,222,128,0.3)" }}>
              Sekarang giliranmu
            </h1>
            <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              Tidak ada jawaban benar atau salah. Yang ada hanya kebiasaanmu sendiri.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
            {REFLECTIONS.map((r, i) => (
              <div key={i} style={{ background: "rgba(74,222,128,0.05)", borderRadius: 18, padding: "18px 22px", border: "1px solid rgba(74,222,128,0.2)" }}>
                <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 15, color: "#86efac", margin: "0 0 10px", lineHeight: 1.5 }}>{r.q}</p>
                <textarea
                  value={answers[i]}
                  onChange={(e) => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }}
                  placeholder={r.ph}
                  rows={3}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px", color: "white", fontFamily: "Arial,sans-serif", fontSize: 14.5, resize: "vertical", lineHeight: 1.6, outline: "none" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/world")}
            disabled={!allReflected}
            style={{ marginTop: "auto", padding: "16px 0", borderRadius: 14, background: allReflected ? "linear-gradient(135deg,#16a34a,#4ade80)" : "rgba(255,255,255,0.06)", border: "none", color: allReflected ? "white" : "rgba(255,255,255,0.35)", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 17, fontWeight: 900, cursor: allReflected ? "pointer" : "default", transition: "all 0.3s", boxShadow: allReflected ? "0 4px 20px rgba(74,222,128,0.3)" : "none" }}
          >
            {allReflected ? "Buka PRIMA WORLD" : "Tulis dulu refleksimu untuk melanjutkan"}
          </button>
        </div>
      )}

      <style>{`
        @keyframes bubbleIn { 0% { opacity: 0; transform: translateY(14px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </main>
  );
}
