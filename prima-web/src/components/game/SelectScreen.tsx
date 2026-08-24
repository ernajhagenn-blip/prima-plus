"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { HEROES } from "@/components/game/Hero";
import { useJourney } from "@/lib/store";
import SceneErrorBoundary from "./SceneErrorBoundary";

const SelectScene = dynamic(() => import("./SelectScene"), { ssr: false });

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
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E1F5FE 100%)",
      }}
    >
      <SceneErrorBoundary label="Character Select">
        <SelectScene color={selected.body} accent={selected.accent} />
      </SceneErrorBoundary>

      <div className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.3)",
            border: "2px solid rgba(255,255,255,0.4)",
            boxShadow: "0 3px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          ← Kembali
        </button>
        <p
          className="text-xs font-black uppercase tracking-[0.3em]"
          style={{
            color: "#FFD54F",
            textShadow: "0 2px 0 #E65100, 0 3px 8px rgba(0,0,0,0.2)",
          }}
        >
          PILIH KARAKTER
        </p>
        <div className="w-16" />
      </div>

      <div className="relative mx-auto flex flex-1 flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
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
              border: "4px solid rgba(255,255,255,0.6)",
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
          <p
            className="mt-3 text-2xl font-black"
            style={{
              color: "#1A237E",
              textShadow: "0 1px 4px rgba(255,255,255,0.8)",
            }}
          >
            {selected.name}
          </p>
          <p className="mt-1 max-w-xs text-center text-sm text-gray-700">{selected.trait}</p>
          <div className="mt-2 flex gap-2">
            <span className="h-4 w-4 rounded-full" style={{ background: selected.body, border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
            <span className="h-4 w-4 rounded-full" style={{ background: selected.accent, border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

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
                className="relative flex flex-col items-center rounded-2xl p-3 transition-all duration-200"
                style={{
                  cursor: "pointer",
                  background: active
                    ? `linear-gradient(135deg, ${h.body}33, ${h.accent}33)`
                    : "rgba(255,255,255,0.5)",
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
                    style={{
                      background: "linear-gradient(135deg, #FFD54F, #FFA726)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 p-4">
        <button
          onClick={() => {
            setCharacter(selected.key);
            router.push("/kart");
          }}
          className="mx-auto block w-full max-w-md rounded-2xl py-4 text-center text-lg font-black text-white transition-all duration-200"
          style={{
            background: "linear-gradient(180deg, #EF5350 0%, #F44336 20%, #E53935 45%, #D32F2F 65%, #C62828 85%, #B71C1C 100%)",
            boxShadow: "0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15)",
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
      `}</style>
    </div>
  );
}
