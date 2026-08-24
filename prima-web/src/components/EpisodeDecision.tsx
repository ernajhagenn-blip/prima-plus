"use client";

import { useState } from "react";
import { awardEpisodeAction } from "@/app/actions";
import type { Episode, EpisodeOption } from "@/lib/data";

const LAYER_META: Record<string, { icon: string; color: string }> = {
  observation: { icon: "👁️", color: "#42A5F5" },
  context: { icon: "📍", color: "#AB47BC" },
  languageEffect: { icon: "💬", color: "#EF5350" },
  alternative: { icon: "🔄", color: "#66BB6A" },
  reflection: { icon: "🤔", color: "#FFA726" },
  transfer: { icon: "🎯", color: "#26C6DA" },
};

const LAYER_LABELS: Record<string, string> = {
  observation: "Observasi",
  context: "Konteks",
  languageEffect: "Efek Bahasa",
  alternative: "Alternatif",
  reflection: "Refleksi",
  transfer: "Transfer",
};

export default function EpisodeDecision({ episode }: { episode: Episode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const chosen = episode.options.find((o) => o.key === selected) ?? null;

  return (
    <div style={{
      padding: "16px", borderRadius: "18px",
      background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
      border: "1px solid rgba(251,191,36,0.15)",
    }}>
      {/* Question */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "14px" }}>
        <span style={{ fontSize: "1.1rem" }}>❓</span>
        <div>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800,
            letterSpacing: "0.08em", color: "#fbbf24", textTransform: "uppercase", margin: 0,
          }}>Keputusan</p>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700,
            color: "rgba(255,255,255,0.9)", margin: "4px 0 0", lineHeight: 1.5,
          }}>{episode.decisionPrompt}</p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {episode.options.map((o, i) => {
          const isSelected = selected === o.key;
          const letters = ["A", "B", "C", "D"];
          return (
            <label key={o.key} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "12px", cursor: "pointer",
              border: isSelected ? "2px solid #f43f5e" : "1px solid rgba(255,255,255,0.08)",
              background: isSelected ? "rgba(244,63,94,0.15)" : "rgba(255,255,255,0.03)",
              transition: "all 0.2s",
            }}>
              <input type="radio" name="opt" value={o.key} checked={isSelected}
                onChange={() => { setSelected(o.key); setRevealed(false); }}
                style={{ display: "none" }}
              />
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                background: isSelected ? "linear-gradient(135deg, #f43f5e, #e11d48)" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 900,
                color: "white",
              }}>{letters[i]}</div>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}>{o.text}</span>
            </label>
          );
        })}
      </div>

      {/* Submit button */}
      {!revealed && (
        <button
          type="button"
          disabled={!selected}
          onClick={() => setRevealed(true)}
          style={{
            marginTop: "12px", width: "100%", padding: "12px", borderRadius: "12px",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 800,
            color: "white", border: "none", cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.4,
            background: "linear-gradient(135deg, #f43f5e, #e11d48)",
            boxShadow: "0 3px 0 #be123c, 0 4px 12px rgba(244,63,94,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >💡 Lihat Umpan Balik</button>
      )}

      {/* Feedback panel */}
      {revealed && chosen && (
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", animation: "feedbackIn 0.4s ease-out both" }}>
          {/* Verdict badge */}
          <div style={{
            display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "8px",
            background: chosen.best ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #f97316, #ea580c)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800, color: "white",
            boxShadow: chosen.best ? "0 2px 0 #047857" : "0 2px 0 #c2410c",
          }}>
            {chosen.best ? "✅ Pilihan Paling Sadar" : "⚡ Pilihan Terkait Kebiasaan"}
          </div>

          {/* Feedback layers */}
          <div style={{
            padding: "12px", borderRadius: "14px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {(["observation", "context", "languageEffect", "alternative", "reflection", "transfer"] as const).map((k) => {
              const meta = LAYER_META[k];
              return (
                <div key={k} style={{
                  display: "flex", alignItems: "flex-start", gap: "8px",
                  padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: "0.85rem", marginTop: "2px" }}>{meta.icon}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 800,
                      letterSpacing: "0.08em", color: meta.color, textTransform: "uppercase", margin: 0,
                    }}>{LAYER_LABELS[k]}</p>
                    <p style={{
                      fontFamily: "'Nunito', sans-serif", fontSize: "0.72rem", fontWeight: 600,
                      color: "rgba(255,255,255,0.65)", margin: "3px 0 0", lineHeight: 1.5,
                    }}>{chosen.feedback[k]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Claim reward */}
          <form action={awardEpisodeAction}>
            <input type="hidden" name="episodeId" value={episode.id} />
            <input type="hidden" name="card" value={episode.cardReward} />
            <input type="hidden" name="skill" value={episode.skillReward} />
            <button type="submit" style={{
              width: "100%", padding: "12px", borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 800,
              color: "#78350f", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 3px 0 #b45309, 0 4px 12px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}>🎁 Klaim Hadiah & Lanjut →</button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes feedbackIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
