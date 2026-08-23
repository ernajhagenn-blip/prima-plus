"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KARTS, STAT_META } from "@/components/game/karts";
import { useJourney } from "@/lib/store";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const KartScene = dynamic(() => import("@/components/game/KartScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gradient-to-b from-[#0a0f2c] to-[#131a47]" />
  ),
});

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
      <span className="w-20 text-right text-[11px] font-bold uppercase tracking-wider text-white/50">
        {label}
      </span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${gradient}`}
          style={{ boxShadow: `0 0 12px ${color}55` }}
        />
      </div>
      <span className="w-6 text-center text-xs font-black" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function KartSelectScreen() {
  const router = useRouter();
  const kartKey = useJourney((s) => s.kartKey);
  const setKart = useJourney((s) => s.setKart);
  const selected = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#060b1e] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-[160px] transition-colors duration-700"
          style={{ background: `${selected.body}18` }}
        />
        <div
          className="absolute bottom-0 right-0 h-64 w-64 rounded-full blur-[120px] transition-colors duration-700"
          style={{ background: `${selected.accent}12` }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          ← Kembali
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-300/50">
            GARAGE
          </p>
          <h1 className="text-lg font-black text-white">Pilih Kart</h1>
        </div>
        <div className="w-20" />
      </div>

      {/* 3D Preview */}
      <div className="relative z-10 mx-auto h-[34vh] w-full max-w-lg">
        <SceneErrorBoundary label="Kart Preview">
          <KartScene config={selected} interactive />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 pb-2 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p
                className="text-xl font-black"
                style={{ textShadow: `0 2px 20px ${selected.body}88` }}
              >
                {selected.name}
              </p>
              <p className="mt-0.5 text-xs text-white/50">{selected.trait}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-1 text-[10px] text-white/25">↔ Geser untuk memutar</p>
        </div>
      </div>

      {/* Kart selector + stats */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Kart cards */}
          <div className="grid grid-cols-4 gap-2">
            {KARTS.map((k) => {
              const active = k.key === selected.key;
              return (
                <motion.button
                  key={k.key}
                  onClick={() => setKart(k.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative overflow-hidden rounded-xl border-2 p-2.5 text-left transition-all ${
                    active
                      ? "border-white/40 bg-white/10"
                      : "border-white/5 bg-white/[0.03] hover:border-white/15"
                  }`}
                  style={{
                    boxShadow: active ? `0 0 24px ${k.body}44, inset 0 1px 0 rgba(255,255,255,0.1)` : undefined,
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="kart-glow"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${k.body}22, ${k.accent}11)`,
                      }}
                    />
                  )}
                  <div className="relative flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-sm shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${k.body}, ${k.accent})`,
                        boxShadow: `0 2px 8px ${k.body}66`,
                      }}
                    />
                    <span className="text-xs font-bold text-white">{k.name}</span>
                  </div>
                  <p className="relative mt-1 text-[10px] text-white/35">{k.trait}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Stats panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: selected.body, boxShadow: `0 0 8px ${selected.body}88` }}
                />
                <span className="text-xs font-black uppercase tracking-wider text-white/40">
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setKart(selected.key);
            router.push("/games/language-kart");
          }}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl py-4 text-lg font-black text-[#0a0f2c] shadow-[0_6px_0_#9a3412] transition-shadow hover:shadow-[0_8px_0_#9a3412]"
          style={{
            background: `linear-gradient(135deg, ${selected.body}, ${selected.accent})`,
          }}
        >
          GAS KE LINTASAN
          <span className="text-xl">▶</span>
        </motion.button>
      </div>
    </div>
  );
}
