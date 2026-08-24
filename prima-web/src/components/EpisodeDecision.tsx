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
    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-md">
      {/* Question */}
      <div className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 text-lg">❓</span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Keputusan</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-800">{episode.decisionPrompt}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {episode.options.map((o, i) => {
          const isSelected = selected === o.key;
          const letters = ["A", "B", "C", "D"];
          return (
            <label
              key={o.key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all"
              style={{
                border: isSelected ? "#EF5350" : "#e5e7eb",
                background: isSelected ? "linear-gradient(135deg, #FFF3E0, #FFEBEE)" : "white",
                boxShadow: isSelected ? "0 2px 8px rgba(239,83,80,0.2)" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <input
                type="radio"
                name="opt"
                value={o.key}
                checked={isSelected}
                onChange={() => { setSelected(o.key); setRevealed(false); }}
                className="sr-only"
              />
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #EF5350, #D32F2F)"
                    : "linear-gradient(135deg, #BDBDBD, #9E9E9E)",
                }}
              >
                {letters[i]}
              </div>
              <span className="text-sm font-semibold text-gray-800">{o.text}</span>
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
          className="mt-3 w-full rounded-xl py-3 text-sm font-black text-white disabled:opacity-40"
          style={{
            background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)",
            boxShadow: "0 3px 0 #8B0000, 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
            border: "2px solid #C62828",
          }}
        >
          💡 Lihat Umpan Balik
        </button>
      )}

      {/* Feedback panel */}
      {revealed && chosen && (
        <div className="mt-3 space-y-2" style={{ animation: "feedbackIn 0.4s ease-out both" }}>
          {/* Verdict badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black"
            style={{
              background: chosen.best ? "linear-gradient(135deg, #66BB6A, #43A047)" : "linear-gradient(135deg, #FFA726, #F57C00)",
              color: "white",
              boxShadow: chosen.best ? "0 2px 0 #2E7D32" : "0 2px 0 #E65100",
            }}
          >
            {chosen.best ? "✅ Pilihan Paling Sadar" : "⚡ Pilihan Terkait Kebiasaan"}
          </div>

          {/* Feedback layers */}
          <div className="rounded-xl bg-white/80 p-3 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
            {(["observation", "context", "languageEffect", "alternative", "reflection", "transfer"] as const).map((k) => {
              const meta = LAYER_META[k];
              return (
                <div key={k} className="flex items-start gap-2 border-b border-gray-100 py-2 last:border-0">
                  <span className="mt-0.5 text-sm">{meta.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: meta.color }}>
                      {LAYER_LABELS[k]}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-700">{chosen.feedback[k]}</p>
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
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-black text-white"
              style={{
                background: "linear-gradient(180deg, #FFD54F 0%, #FFA726 50%, #FF8F00 100%)",
                boxShadow: "0 3px 0 #E65100, 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
                border: "2px solid #F57C00",
                color: "#BF360C",
              }}
            >
              🎁 Klaim Hadiah & Lanjut →
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes feedbackIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
