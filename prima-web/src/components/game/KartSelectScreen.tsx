"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KARTS, STAT_META } from "@/components/game/karts";
import { useJourney } from "@/lib/store";

function StatBar({
  label,
  value,
  color,
  gradient,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  gradient: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.3)" }}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}`}
          style={{
            width: `${value * 10}%`,
            boxShadow: `0 0 12px ${color}55`,
            animation: `barFill 0.8s ${delay}s ease-out both`,
          }}
        />
      </div>
      <span className="w-6 text-center text-xs font-black" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

const KART_EMOJI: Record<string, string> = {
  "SPEED RACER": "🏎️",
  "DRIFT KING": "🌀",
  "HEAVY HAULER": "🚛",
  "QUICK FOX": "🦊",
};

export default function KartSelectScreen() {
  const router = useRouter();
  const kartKey = useJourney((s) => s.kartKey);
  const setKart = useJourney((s) => s.setKart);
  const selected = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
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
        <div className="text-center">
          <p
            className="text-[10px] font-black uppercase tracking-[0.4em]"
            style={{
              color: "#FFD54F",
              textShadow: "0 2px 0 #E65100, 0 3px 8px rgba(0,0,0,0.2)",
            }}
          >
            GARAGE
          </p>
          <h1
            className="text-lg font-black"
            style={{
              color: "#1A237E",
              textShadow: "0 1px 4px rgba(255,255,255,0.6)",
            }}
          >
            Pilih Kart
          </h1>
        </div>
        <div className="w-20" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div
          className="mb-6 flex flex-col items-center"
          key={selected.key}
          style={{ animation: "kartPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          <div
            className="relative flex h-28 w-40 items-center justify-center rounded-2xl text-5xl"
            style={{
              background: `linear-gradient(135deg, ${selected.body}, ${selected.accent})`,
              boxShadow: `0 8px 0 ${selected.body}88, 0 12px 30px rgba(0,0,0,0.2), 0 0 40px ${selected.trail}44`,
              border: "4px solid rgba(255,255,255,0.6)",
            }}
          >
            <span className="drop-shadow-lg">{KART_EMOJI[selected.key] || "🏎️"}</span>
          </div>
          <p
            className="mt-3 text-xl font-black"
            style={{
              color: "#1A237E",
              textShadow: `0 2px 20px ${selected.body}44`,
            }}
          >
            {selected.name}
          </p>
          <p className="mt-1 text-xs text-gray-600">{selected.trait}</p>
        </div>

        <div className="grid w-full max-w-lg grid-cols-4 gap-2">
          {KARTS.map((k) => {
            const active = k.key === selected.key;
            return (
              <button
                key={k.key}
                onClick={() => setKart(k.key)}
                className="relative overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all duration-200"
                style={{
                  cursor: "pointer",
                  background: active
                    ? `linear-gradient(135deg, ${k.body}33, ${k.accent}22)`
                    : "rgba(255,255,255,0.5)",
                  borderColor: active ? k.body : "rgba(255,255,255,0.5)",
                  boxShadow: active
                    ? `0 4px 0 ${k.body}66, 0 6px 16px rgba(0,0,0,0.15), 0 0 20px ${k.body}33`
                    : "0 2px 6px rgba(0,0,0,0.04)",
                  transform: active ? "translateY(-3px)" : "none",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-sm shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${k.body}, ${k.accent})`,
                      boxShadow: `0 2px 8px ${k.body}66`,
                    }}
                  />
                  <span className="text-xs font-bold text-gray-800">{k.name}</span>
                </div>
                <p className="relative mt-1 text-[10px] text-gray-500">{k.trait}</p>
              </button>
            );
          })}
        </div>

        <div
          className="mt-4 w-full max-w-lg rounded-2xl p-4 backdrop-blur-md"
          key={`stats-${selected.key}`}
          style={{
            animation: "fadeUp 0.3s ease-out both",
            background: "rgba(255,255,255,0.5)",
            border: "2px solid rgba(255,255,255,0.4)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: selected.body, boxShadow: `0 0 8px ${selected.body}88` }}
            />
            <span className="text-xs font-black uppercase tracking-wider text-gray-500">
              Statistik {selected.name}
            </span>
          </div>
          <div className="space-y-2.5">
            {STAT_META.map((s, i) => (
              <StatBar
                key={s.key}
                label={s.label}
                value={selected.stats[s.key]}
                color={s.color}
                gradient={s.gradient}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <button
          onClick={() => {
            setKart(selected.key);
            router.push("/games/language-kart");
          }}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl py-4 text-lg font-black text-white transition-all duration-200"
          style={{
            background: `linear-gradient(180deg, ${selected.body} 0%, ${selected.accent} 100%)`,
            boxShadow: `0 5px 0 ${selected.body}88, 0 8px 20px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.3)`,
          }}
        >
          GAS KE LINTASAN
          <span className="text-xl">▶</span>
        </button>
      </div>

      <style>{`
        @keyframes kartPop {
          0% { opacity: 0; transform: scale(0.6) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes barFill {
          0% { width: 0% !important; }
        }
      `}</style>
    </div>
  );
}
