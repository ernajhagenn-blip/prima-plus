"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const OpeningScene = dynamic(() => import("./OpeningScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-[#1ea5e9] to-[#a5f3fc]" />,
});

function LogoText() {
  return (
    <h1
      className="select-none text-center font-black leading-none"
      style={{
        fontSize: "clamp(3.5rem, 14vw, 9rem)",
        letterSpacing: "0.04em",
        color: "#fde047",
        WebkitTextStroke: "3px #7c2d12",
        textShadow:
          "0 1px 0 #b45309, 0 2px 0 #b45309, 0 3px 0 #92400e, 0 4px 0 #92400e, 0 5px 0 #78350f, 0 6px 0 #78350f, 0 12px 18px rgba(0,0,0,0.5), 0 0 28px rgba(253,224,71,0.55)",
      }}
    >
      PRIMA<span style={{ color: "#67e8f9", WebkitTextStroke: "3px #0c4a6e" }}>+</span>
    </h1>
  );
}

export default function OpeningScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <SceneErrorBoundary label="Opening">
        <OpeningScene onReady={() => setReady(true)} />
      </SceneErrorBoundary>

      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-end justify-center pb-16"
          >
            <p className="rounded-full bg-black/40 px-5 py-2 text-sm font-bold tracking-widest text-white">
              MEMUAT DUNIA PRIMA…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <LogoText />
            <p
              className="mt-2 font-black tracking-[0.18em] text-white"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
            >
              BAHASA KITA. PILIHAN KITA.
            </p>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(253,224,71,0.7)" }}
              whileTap={{ scale: 0.94 }}
              onClick={() => router.push("/intro")}
              className="mt-8 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-400 px-10 py-4 text-xl font-black text-[#3b0764] shadow-[0_8px_0_#9a3412,0_14px_24px_rgba(0,0,0,0.5)]"
              style={{ WebkitTextStroke: "1px #7c2d12" }}
            >
              ▶ MULAI PETUALANGAN
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
