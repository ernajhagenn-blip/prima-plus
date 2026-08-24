"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HEROES } from "@/components/game/Hero";
import { useJourney } from "@/lib/store";

const HAT_EMOJI: Record<string, string> = {
  cap: "🧢",
  crown: "👑",
  beanie: "🎿",
  band: "🎀",
  none: "✨",
};

const ITEM_EMOJI: Record<string, string> = {
  flag: "🚩",
  phone: "📱",
  book: "📖",
  star: "⭐",
  mic: "🎤",
  none: "",
};

export default function SelectScreen() {
  const router = useRouter();
  const characterKey = useJourney((s) => s.characterKey);
  const setCharacter = useJourney((s) => s.setCharacter);
  const selected = HEROES.find((h) => h.key === characterKey) ?? HEROES[0];
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #5EC6FF 0%, #7DD3FC 20%, #A8D8EA 45%, #E0F2FE 65%, #BAE6FD 100%)",
      }}
    >
      <div className="flex items-center justify-between p-4" style={{ zIndex: 10 }}>
        <button
          onClick={() => router.back()}
          className="rounded-xl bg-white/70 px-4 py-2 text-sm font-bold text-gray-600 backdrop-blur-md shadow-sm"
        >
          ← Kembali
        </button>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">
          PILIH KARAKTER
        </p>
        <div className="w-16" />
      </div>

      <div className="relative mx-auto flex flex-1 flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
        {/* Big preview of selected character */}
        <div
          className="mb-6 flex flex-col items-center"
          style={{ animation: "charPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
          key={selected.key}
        >
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full text-6xl"
            style={{
              background: `linear-gradient(135deg, ${selected.body}, ${selected.accent})`,
              boxShadow: `0 8px 0 ${selected.body}88, 0 12px 30px rgba(0,0,0,0.2), 0 0 40px ${selected.accent}44`,
              border: "4px solid rgba(255,255,255,0.5)",
            }}
          >
            <span className="drop-shadow-lg">{HAT_EMOJI[selected.hat] || "✨"}</span>
            {selected.item !== "none" && (
              <span
                className="absolute -right-1 -top-1 text-2xl"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
              >
                {ITEM_EMOJI[selected.item]}
              </span>
            )}
          </div>
          <p className="mt-3 text-2xl font-black text-gray-800" style={{ textShadow: "0 1px 4px rgba(255,255,255,0.8)" }}>
            {selected.name}
          </p>
          <p className="mt-1 max-w-xs text-center text-sm text-gray-600">{selected.trait}</p>
          <div className="mt-2 flex gap-2">
            <span className="h-4 w-4 rounded-full" style={{ background: selected.body, border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
            <span className="h-4 w-4 rounded-full" style={{ background: selected.accent, border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

        {/* Character grid */}
        <div className="grid w-full max-w-lg grid-cols-4 gap-3">
          {HEROES.map((h) => {
            const active = h.key === characterKey;
            const isHovered = h.key === hovered;
            return (
              <button
                key={h.key}
                onClick={() => setCharacter(h.key)}
                onMouseEnter={() => setHovered(h.key)}
                onMouseLeave={() => setHovered(null)}
                className="char-card relative flex flex-col items-center rounded-2xl p-3 transition-all duration-200"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${h.body}22, ${h.accent}22)`
                    : "rgba(255,255,255,0.6)",
                  border: active ? `3px solid ${h.body}` : "2px solid rgba(255,255,255,0.5)",
                  boxShadow: active
                    ? `0 4px 0 ${h.body}66, 0 6px 16px rgba(0,0,0,0.15), 0 0 20px ${h.accent}33`
                    : isHovered
                    ? "0 4px 12px rgba(0,0,0,0.1)"
                    : "0 2px 6px rgba(0,0,0,0.06)",
                  transform: active ? "translateY(-4px)" : isHovered ? "translateY(-2px)" : "none",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${h.body}, ${h.accent})`,
                    boxShadow: `0 2px 8px ${h.body}44`,
                  }}
                >
                  {h.name[0]}
                </div>
                <span className="mt-1 text-[11px] font-bold text-gray-700">{h.name}</span>
                {active && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                    style={{ background: "linear-gradient(135deg, #facc15, #f59e0b)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4" style={{ zIndex: 10 }}>
        <button
          onClick={() => {
            setCharacter(selected.key);
            router.push("/kart");
          }}
          className="mx-auto block w-full max-w-md rounded-2xl py-4 text-center text-lg font-black text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #EF5350 0%, #F44336 40%, #FF9800 100%)",
            boxShadow: "0 5px 0 #BF360C, 0 8px 20px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.3)",
          }}
        >
          READY ▶
        </button>
      </div>

      <style>{`
        @keyframes charPop {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        .char-card { cursor: pointer; }
      `}</style>
    </div>
  );
}
