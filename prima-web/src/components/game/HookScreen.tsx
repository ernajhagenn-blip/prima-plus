"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const HookScene = dynamic(() => import("@/components/game/HookScene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-[#1ea5e9] to-[#a5f3fc]" />,
});

const LINES = [
  { who: "RAGA", text: "Guys, nanti habis kelas kita meeting di kafe ya. Jangan lupa bawa laptop." },
  { who: "KIRA", text: "Sure, tapi aku belum finish tugasnya. Deadline-nya kapan sih?" },
  { who: "ALYA", text: "Yaudah, nanti aku update jadwalnya di grup. Santai aja." },
  { who: "NARA", text: "Eh. Tunggu. Kamu sadar nggak? Barusan kita ngomong kayak gimana?" },
  { who: "RAGA", text: "Hah? Normal kan? Emangnya kenapa?" },
  { who: "NARA", text: "Coba dengerin lagi: 'meeting', 'finish', 'deadline', 'update'. Satu kalimat, empat bahasa asing. Kamu pilih itu karena butuh, atau karena kebiasaan?" },
];

export default function HookScreen() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [freeze, setFreeze] = useState(false);

  if (freeze) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 px-6 text-center backdrop-blur-md">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl">
            <p
              className="text-4xl font-black leading-tight text-gray-900 sm:text-6xl"
              style={{ textShadow: "0 2px 12px rgba(59,130,246,0.3)" }}
            >
              PERNAH NGGAK KAMU BICARA KAYAK GITU?
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Bahasa bukan cuma soal kata. Cara kita bicara bentuk siapa kita — dan ke siapa kita lagi bicara.
              Pertanyaannya: kamu MEMILIH, atau cuma IKUT KEBIASAAN?
            </p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/journey/1")}
            className="mt-8 rounded-2xl bg-gradient-to-r from-rose-400 to-yellow-400 px-10 py-4 text-lg font-black text-white shadow-lg shadow-orange-300/30 transition hover:shadow-orange-400/40"
          >
            ▶ MASUK KE DUNIA PRIMA
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const line = LINES[i];
  return (
    <div className="fixed inset-0 overflow-hidden">
      <SceneErrorBoundary label="Hook">
        <HookScene />
      </SceneErrorBoundary>
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-blue-200 bg-white/70 p-4 backdrop-blur-md"
            >
              <p className="text-xs font-black tracking-widest text-blue-500">{line.who}</p>
              <p className="mt-1 text-lg font-bold text-gray-800">"{line.text}"</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex justify-between">
            <button
              onClick={() => (i === 0 ? setFreeze(true) : setI((v) => v - 1))}
              className="rounded-xl bg-gray-200/80 px-5 py-2 text-sm font-bold text-gray-600"
            >
              {i === 0 ? "Lewati ▶" : "←"}
            </button>
            <button
              onClick={() => (i === LINES.length - 1 ? setFreeze(true) : setI((v) => v + 1))}
              className="rounded-xl bg-gradient-to-r from-rose-400 to-yellow-400 px-6 py-2 text-sm font-black text-white shadow-md"
            >
              Lanjut →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
