"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
          background: "linear-gradient(180deg, #5EC6FF 0%, #E0F2FE 50%, #FFFFFF 100%)",
        }}
      >
        <div style={{ animation: "freezeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
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
          <button
            onClick={() => router.push("/journey/1")}
            className="mt-8 rounded-2xl px-10 py-4 text-lg font-black text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #EF5350 0%, #F44336 40%, #FF9800 100%)",
              boxShadow: "0 5px 0 #BF360C, 0 8px 20px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.3)",
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
        background: "linear-gradient(180deg, #5EC6FF 0%, #7DD3FC 25%, #A8D8EA 50%, #E0F2FE 75%, #BAE6FD 100%)",
      }}
    >
      {/* Decorative speech bubbles in background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 5 }, (_, j) => (
          <div
            key={j}
            className="absolute rounded-3xl bg-white/10"
            style={{
              width: `${60 + j * 30}px`,
              height: `${40 + j * 15}px`,
              left: `${10 + j * 18}%`,
              top: `${8 + j * 12}%`,
              animation: `floatBubble ${4 + j}s ease-in-out infinite alternate`,
              animationDelay: `${j * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Chat area */}
      <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ zIndex: 5 }}>
        <div className="mx-auto w-full max-w-xl">
          {/* All previous messages stacked */}
          <div className="mb-3 space-y-2">
            {LINES.slice(0, i + 1).map((l, idx) => {
              const isCurrent = idx === i;
              return (
                <div
                  key={idx}
                  className="chat-bubble rounded-2xl border p-4 transition-all duration-300"
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
                  <p className="mt-1 text-lg font-bold text-gray-800">"{l.text}"</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => (i === 0 ? setFreeze(true) : setI((v) => v - 1))}
              className="rounded-xl bg-white/70 px-5 py-2 text-sm font-bold text-gray-600 backdrop-blur-md transition hover:bg-white/90"
            >
              {i === 0 ? "Lewati ▶" : "←"}
            </button>
            <button
              onClick={() => (i === LINES.length - 1 ? setFreeze(true) : setI((v) => v + 1))}
              className="rounded-xl px-6 py-2 text-sm font-black text-white shadow-md transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #EF5350 0%, #F44336 40%, #FF9800 100%)",
                boxShadow: "0 3px 0 #BF360C, 0 4px 12px rgba(0,0,0,0.2)",
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
        @keyframes floatBubble {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-15px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
