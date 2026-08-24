"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SceneErrorBoundary from "./SceneErrorBoundary";

const HookScene = dynamic(() => import("./HookScene"), { ssr: false });

const LINES = [
  { who: "RAGA", text: "Guys, nanti habis kelas kita meeting di kafe ya. Jangan lupa bawa laptop.", color: "#FF8A2A" },
  { who: "KIRA", text: "Sure, tapi aku belum finish tugasnya. Deadline-nya kapan sih?", color: "#E83E9F" },
  { who: "ALYA", text: "Yaudah, nanti aku update jadwalnya di grup. Santai aja.", color: "#19BFEA" },
  { who: "NARA", text: "Eh. Tunggu. Kamu sadar nggak? Barusan kita ngomong kayak gimana?", color: "#173B8F" },
  { who: "RAGA", text: "Hah? Normal kan? Emangnya kenapa?", color: "#FF8A2A" },
  { who: "NARA", text: "Coba dengerin lagi: 'meeting', 'finish', 'deadline', 'update'. Satu kalimat, empat bahasa asing. Kamu pilih itu karena butuh, atau karena kebiasaan?", color: "#173B8F" },
];

export default function HookScreen() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [freeze, setFreeze] = useState(false);

  if (freeze) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E1F5FE 100%)",
        }}
      >
        <SceneErrorBoundary label="Hook Scene">
          <HookScene />
        </SceneErrorBoundary>

        <div style={{ animation: "freezeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both", position: "relative", zIndex: 10 }}>
          <p
            className="text-4xl font-black leading-tight sm:text-6xl"
            style={{
              color: "#1A237E",
              textShadow: "0 2px 0 #FFD54F, 0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            PERNAH NGGAK KAMU BICARA KAYAK GITU?
          </p>
          <p className="mt-4 text-sm text-gray-700 max-w-lg mx-auto">
            Bahasa bukan cuma soal kata. Cara kita bicara bentuk siapa kita — dan ke siapa kita lagi bicara.
            Pertanyaannya: kamu MEMILIH, atau cuma IKUT KEBIASAAN?
          </p>
          <button
            onClick={() => router.push("/journey/1")}
            className="mt-8 rounded-2xl px-10 py-4 text-lg font-black text-white transition-all duration-200"
            style={{
              background: "linear-gradient(180deg, #EF5350 0%, #F44336 20%, #E53935 45%, #D32F2F 65%, #C62828 85%, #B71C1C 100%)",
              boxShadow: "0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15)",
            }}
          >
            ▶ MASUK KE DUNIA PRIMA
          </button>
        </div>

        <style>{`
          @keyframes freezeIn {
            0% { opacity: 0; transform: scale(0.6); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  const line = LINES[i];

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 25%, #B3E5FC 50%, #E1F5FE 75%, #C8E6C9 100%)",
      }}
    >
      <SceneErrorBoundary label="Hook Scene">
        <HookScene />
      </SceneErrorBoundary>

      <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ zIndex: 5 }}>
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-3 space-y-2">
            {LINES.slice(0, i + 1).map((l, idx) => {
              const isCurrent = idx === i;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border p-4 transition-all duration-300"
                  style={{
                    background: isCurrent ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                    borderColor: isCurrent ? l.color + "66" : "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(12px)",
                    boxShadow: isCurrent ? `0 4px 16px rgba(0,0,0,0.1), 0 0 20px ${l.color}22` : "none",
                    animation: isCurrent ? "bubbleSlide 0.4s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
                    opacity: isCurrent ? 1 : 0.6,
                    transform: isCurrent ? "none" : "scale(0.97)",
                  }}
                >
                  <p className="text-xs font-black tracking-widest" style={{ color: l.color }}>
                    {l.who}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-800">&quot;{l.text}&quot;</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => (i === 0 ? setFreeze(true) : setI((v) => v - 1))}
              className="rounded-xl px-5 py-2 text-sm font-bold text-white backdrop-blur-md transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.3)",
                border: "2px solid rgba(255,255,255,0.4)",
                boxShadow: "0 3px 0 rgba(0,0,0,0.1)",
              }}
            >
              {i === 0 ? "Lewati ▶" : "←"}
            </button>
            <button
              onClick={() => (i === LINES.length - 1 ? setFreeze(true) : setI((v) => v + 1))}
              className="rounded-xl px-6 py-2 text-sm font-black text-white transition-all duration-200"
              style={{
                background: "linear-gradient(180deg, #EF5350 0%, #F44336 20%, #E53935 45%, #D32F2F 65%, #C62828 85%, #B71C1C 100%)",
                boxShadow: "0 3px 0 #8B0000, 0 4px 12px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
              }}
            >
              Lanjut →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bubbleSlide {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
