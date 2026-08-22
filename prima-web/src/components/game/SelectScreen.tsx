"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HEROES } from "@/components/game/Hero";
import { useJourney } from "@/lib/store";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const SelectScene = dynamic(() => import("@/components/game/SelectScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gradient-to-b from-[#1ea5e9] to-[#a5f3fc]" />,
});

export default function SelectScreen() {
  const router = useRouter();
  const characterKey = useJourney((s) => s.characterKey);
  const setCharacter = useJourney((s) => s.setCharacter);
  const selected = HEROES.find((h) => h.key === characterKey) ?? HEROES[0];

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-[#0a0f2c] to-[#131a47]">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white">← Kembali</button>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200/70">PILIH KARAKTER</p>
        <div className="w-16" />
      </div>

      <div className="relative mx-auto h-[42vh] w-full max-w-md">
        <SceneErrorBoundary label="Pilih Karakter">
          <SelectScene config={selected} />
        </SceneErrorBoundary>
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/40 px-3 py-1 text-sm font-black text-white">
          P1
        </div>
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-white">
          <p className="text-lg font-black" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{selected.name}</p>
          <p className="text-xs text-white/80">{selected.trait}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {HEROES.map((h) => {
            const active = h.key === characterKey;
            return (
              <motion.button
                key={h.key}
                onClick={() => setCharacter(h.key)}
                whileHover={{ scale: 1.04 }}
                className={`rounded-2xl border-2 p-3 text-left ${active ? "border-yellow-400 bg-white/15" : "border-white/10 bg-white/5"}`}
                style={{ boxShadow: active ? "0 0 20px rgba(250,204,21,0.5)" : undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">{h.name}</span>
                  {active && <span className="rounded bg-yellow-400 px-1 text-[10px] font-black text-[#3b0764]">P1</span>}
                </div>
                <div className="mt-1 flex gap-1">
                  <span className="h-3 w-3 rounded-full" style={{ background: h.body }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: h.accent }} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setCharacter(selected.key); router.push("/kart"); }}
          className="mx-auto block w-full max-w-md rounded-2xl bg-gradient-to-r from-rose-500 to-yellow-400 py-4 text-center text-lg font-black text-[#3b0764] shadow-[0_6px_0_#9a3412]"
          style={{ WebkitTextStroke: "1px #7c2d12" }}
        >
          READY ▶
        </motion.button>
      </div>
    </div>
  );
}
