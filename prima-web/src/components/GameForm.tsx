"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitGame } from "@/app/actions";
import type { Scenario } from "@/lib/data";

export function GameForm({
  scenarios,
  reflectionQuestions,
}: {
  scenarios: Scenario[];
  reflectionQuestions: string[];
}) {
  const QUIZ_SCENARIOS = scenarios;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const reflectionRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const scenario = QUIZ_SCENARIOS[index];
  const isReflection = index >= QUIZ_SCENARIOS.length;
  const correctCount = Object.entries(selections).filter(([sid, key]) => {
    const s = QUIZ_SCENARIOS.find((x) => String(x.id) === sid);
    return s?.options.find((o) => o.key === key)?.correct;
  }).length;

  function choose(key: string) {
    if (locked) return;
    setChosen(key);
    setLocked(true);
    setSelections((prev) => ({ ...prev, [scenario.id]: key }));
  }

  function next() {
    if (index < QUIZ_SCENARIOS.length - 1) {
      setIndex((i) => i + 1);
      setChosen(null);
      setLocked(false);
    } else {
      setIndex(QUIZ_SCENARIOS.length);
    }
    setError(null);
  }

  function submit() {
    const parts = reflectionQuestions.map(
      (_, i) => reflectionRefs.current[i]?.value.trim() ?? "",
    );
    if (parts.some((p) => !p)) {
      setError("Isi keempat pertanyaan refleksi terlebih dahulu.");
      return;
    }
    const formData = new FormData();
    for (const [sid, key] of Object.entries(selections)) {
      formData.append(`s${sid}`, key);
    }
    formData.append("reflection", parts.map((p, i) => `Q${i + 1}: ${p}`).join(" | "));
    startTransition(async () => {
      const res = await submitGame(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/posttest");
        router.refresh();
      }
    });
  }

  const cardStyle: React.CSSProperties = {
    padding: "18px", borderRadius: "16px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
          Kasus {Math.min(index + 1, QUIZ_SCENARIOS.length + 1)} dari {QUIZ_SCENARIOS.length + 1}
        </span>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#c084fc" }}>
          Skor: {correctCount}
        </span>
      </div>

      {!isReflection ? (
        <div key={scenario.id} style={cardStyle}>
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: "8px",
            background: "rgba(244,63,94,0.15)", fontFamily: "'Nunito', sans-serif",
            fontSize: "0.65rem", fontWeight: 700, color: "#f472b6",
          }}>{scenario.construct}</span>
          <h2 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "1.1rem", fontWeight: 900, color: "white", margin: "10px 0 0",
          }}>{scenario.caseType}</h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.6)", margin: "6px 0 0",
          }}>{scenario.task}</p>
          <div style={{
            padding: "12px 14px", borderRadius: "10px", marginTop: "12px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontStyle: "italic",
          }}>{scenario.situation}</div>

          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {scenario.options.map((opt) => {
              const isChosen = chosen === opt.key;
              let border = "1px solid rgba(255,255,255,0.08)";
              let bg = "rgba(255,255,255,0.03)";
              let textColor = "rgba(255,255,255,0.7)";
              let badgeBg = "rgba(255,255,255,0.1)";
              if (locked) {
                if (opt.correct) { border = "2px solid #10b981"; bg = "rgba(16,185,129,0.12)"; textColor = "#34d399"; badgeBg = "rgba(16,185,129,0.2)"; }
                else if (isChosen) { border = "2px solid #f43f5e"; bg = "rgba(244,63,94,0.12)"; textColor = "#fb7185"; badgeBg = "rgba(244,63,94,0.2)"; }
                else { opacity: 0.4 }
              } else if (isChosen) {
                border = "2px solid #f43f5e"; bg = "rgba(244,63,94,0.12)"; textColor = "#fb7185";
              }
              return (
                <button key={opt.key} type="button" onClick={() => choose(opt.key)} disabled={locked}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    padding: "12px 14px", borderRadius: "12px", border, background: bg,
                    cursor: locked ? "not-allowed" : "pointer", textAlign: "left",
                    transition: "all 0.2s", opacity: locked && !opt.correct && !isChosen ? 0.4 : 1,
                  }}
                >
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                    background: badgeBg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 900, color: textColor,
                  }}>{opt.key.toUpperCase()}</span>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
                    color: textColor, lineHeight: 1.5,
                  }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {locked ? (
            <div style={{
              marginTop: "14px", padding: "12px 14px", borderRadius: "12px",
              background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.15)",
            }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#fbbf24", margin: 0 }}>
                {chosen && scenario.options.find((o) => o.key === chosen)?.correct
                  ? "Tepat! Pilihanmu sesuai konteks."
                  : "Coba perhatikan kembali konteksnya."}
              </p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "6px 0 0", lineHeight: 1.5 }}>
                {scenario.feedback}
              </p>
            </div>
          ) : null}

          {locked ? (
            <button type="button" onClick={next} style={{
              marginTop: "14px", padding: "10px 24px", borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 800,
              color: "white", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 3px 0 #5b21b6, 0 4px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
              {index < QUIZ_SCENARIOS.length - 1 ? "Kasus Berikutnya →" : "Lanjut ke Refleksi →"}
            </button>
          ) : null}
        </div>
      ) : (
        <div style={cardStyle}>
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: "8px",
            background: "rgba(139,92,246,0.15)", fontFamily: "'Nunito', sans-serif",
            fontSize: "0.65rem", fontWeight: 700, color: "#c084fc",
          }}>REFLECT — Why Did You Choose It?</span>
          <h2 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "1.1rem", fontWeight: 900, color: "white", margin: "10px 0 0",
          }}>Refleksi Pilihan Bahasa</h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.6)", margin: "6px 0 0",
          }}>Jawablah keempat pertanyaan berikut untuk mengubah kuis menjadi proses language awareness.</p>

          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {reflectionQuestions.map((q, i) => (
              <div key={i}>
                <label style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700,
                  color: "rgba(255,255,255,0.8)", display: "block", marginBottom: "6px",
                }}>{i + 1}. {q}</label>
                <textarea
                  ref={(el) => { reflectionRefs.current[i] = el; }}
                  rows={3} required placeholder="Tuliskan jawabanmu…"
                  style={{
                    width: "100%", borderRadius: "10px", padding: "10px 14px",
                    fontSize: "0.8rem", fontWeight: 600, color: "white",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    outline: "none", resize: "vertical", boxSizing: "border-box",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <div style={{
          marginTop: "12px", padding: "10px 14px", borderRadius: "10px",
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)",
          fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#fca5a5",
        }}>⚠️ {error}</div>
      ) : null}

      {isReflection ? (
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button type="button" onClick={submit} disabled={isPending} style={{
            width: "100%", padding: "12px", borderRadius: "12px",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
            color: "white", border: "none", cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.5 : 1,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 3px 0 #5b21b6, 0 4px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}>
            {isPending ? "Menyimpan…" : "Selesai Kuis → Lanjut ke Posttest"}
          </button>
          <button type="button" onClick={() => {
            setIndex(QUIZ_SCENARIOS.length - 1);
            setChosen(selections[QUIZ_SCENARIOS[QUIZ_SCENARIOS.length - 1].id] ?? null);
            setLocked(true);
            setError(null);
          }} style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
            color: "rgba(255,255,255,0.4)", background: "none", border: "none",
            cursor: "pointer", textDecoration: "underline",
          }}>← Kembali ke kasus sebelumnya</button>
        </div>
      ) : null}
    </div>
  );
}
