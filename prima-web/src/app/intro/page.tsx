"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";

const JENJANG_LIST = [
  { key: "SMP", label: "SMP/MTs", classes: ["VII", "VIII", "IX"] },
  { key: "SMA", label: "SMA/MA", classes: ["X", "XI", "XII"] },
];

export default function IntroPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(startJourney, undefined);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [kelas, setKelas] = useState("");
  const [customKelas, setCustomKelas] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [school, setSchool] = useState("");

  const selectedKelas = showCustom ? customKelas : kelas;
  const currentClasses = JENJANG_LIST.find((j) => j.key === jenjang)?.classes ?? [];

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Floating clouds */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
      </div>

      <div className="w-full max-w-sm relative" style={{ zIndex: 10 }}>
        {/* Avatar */}
        <div className="mb-3 flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{
              background: "linear-gradient(135deg, #FFD54F, #FFA726)",
              boxShadow: "0 4px 0 #F57F17, 0 8px 20px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.4)",
              border: "3px solid rgba(255,255,255,0.5)",
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            {step === 1 ? "🎮" : step === 2 ? "🎓" : "🚀"}
          </div>
        </div>

        {/* Title */}
        <div className="mb-2 text-center">
          <p className="text-sm font-black text-blue-600">
            {step === 1 ? "Hei! Siapa kamu?" : step === 2 ? "Kelas berapa?" : "Sekolah mana?"}
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            border: "3px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <form action={formAction}>
            {/* STEP 1: Name */}
            {step === 1 && (
              <div className="animate-fade-in">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap kamu..."
                  className="w-full rounded-xl border-2 border-cyan-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  autoFocus
                />
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={() => setStep(2)}
                  className="mt-3 w-full rounded-xl py-3 text-sm font-black text-white disabled:opacity-40"
                  style={{
                    background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)",
                    boxShadow: "0 4px 0 #8B0000, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                    border: "2px solid #C62828",
                  }}
                >
                  LANJUT →
                </button>
              </div>
            )}

            {/* STEP 2: Kelas */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  {JENJANG_LIST.map((j) => (
                    <button
                      key={j.key}
                      type="button"
                      onClick={() => { setJenjang(j.key); setKelas(""); setShowCustom(false); }}
                      className="rounded-xl border-2 py-3 text-sm font-bold transition-all"
                      style={{
                        border: jenjang === j.key ? "3px solid #42A5F5" : "2px solid #e0e0e0",
                        background: jenjang === j.key ? "linear-gradient(135deg, #BBDEFB, #E3F2FD)" : "white",
                        color: jenjang === j.key ? "#1565C0" : "#757575",
                      }}
                    >
                      {j.key === "SMP" ? "🏫" : "🎓"} {j.label}
                    </button>
                  ))}
                </div>

                {jenjang && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {currentClasses.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setKelas(c); setShowCustom(false); }}
                        className="rounded-xl border-2 py-2.5 text-sm font-bold transition-all"
                        style={{
                          border: kelas === c && !showCustom ? "3px solid #FF7043" : "2px solid #e0e0e0",
                          background: kelas === c && !showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "white",
                          color: kelas === c && !showCustom ? "#E65100" : "#757575",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className="rounded-xl border-2 py-2.5 text-sm font-bold transition-all"
                      style={{
                        border: showCustom ? "3px solid #FF7043" : "2px solid #e0e0e0",
                        background: showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "white",
                        color: showCustom ? "#E65100" : "#757575",
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                )}

                {showCustom && (
                  <input
                    value={customKelas}
                    onChange={(e) => setCustomKelas(e.target.value)}
                    placeholder="Tulis kelas kamu..."
                    className="mt-2 w-full rounded-xl border-2 border-orange-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400"
                  />
                )}

                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="rounded-xl px-4 py-3 text-sm font-bold" style={{ border: "2px solid #e0e0e0", background: "white", color: "#757575" }}>←</button>
                  <button
                    type="button"
                    disabled={!selectedKelas}
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl py-3 text-sm font-black text-white disabled:opacity-40"
                    style={{
                      background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)",
                      boxShadow: "0 4px 0 #8B0000, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                      border: "2px solid #C62828",
                    }}
                  >
                    LANJUT →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: School */}
            {step === 3 && (
              <div className="animate-fade-in">
                <input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Nama sekolah..."
                  className="w-full rounded-xl border-2 border-green-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-400"
                  autoFocus
                />
                {state && "error" in state ? (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">⚠️ {state.error}</p>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => setStep(2)} className="rounded-xl px-4 py-3 text-sm font-bold" style={{ border: "2px solid #e0e0e0", background: "white", color: "#757575" }}>←</button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl py-3 text-sm font-black text-white transition-all hover:shadow-lg"
                    style={{
                      background: "linear-gradient(180deg, #66BB6A 0%, #43A047 100%)",
                      boxShadow: "0 4px 0 #2E7D32, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                      border: "2px solid #388E3C",
                    }}
                  >
                    🚀 MASUK PRIMA+!
                  </button>
                </div>
              </div>
            )}

            {/* Hidden fields — ALWAYS rendered */}
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="kelas" value={selectedKelas} />
            <input type="hidden" name="school" value={school} />
          </form>
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold text-white/80">
          Dunia ini bakal beda tiap orang. Yuk mulai.
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .cloud { position: absolute; background: white; border-radius: 50px; opacity: 0.6; }
        .cloud::before, .cloud::after { content: ""; position: absolute; background: white; border-radius: 50%; }
        .c1 { width: 90px; height: 28px; top: 10%; left: 10%; animation: drift 18s linear infinite; }
        .c1::before { width: 38px; height: 38px; top: -20px; left: 14px; }
        .c1::after { width: 52px; height: 44px; top: -22px; left: 34px; }
        .c2 { width: 70px; height: 22px; top: 16%; left: 55%; animation: drift 22s linear infinite; animation-delay: -5s; }
        .c2::before { width: 30px; height: 30px; top: -16px; left: 10px; }
        .c2::after { width: 40px; height: 34px; top: -18px; left: 26px; }
        .c3 { width: 100px; height: 30px; top: 6%; left: 80%; animation: drift 16s linear infinite; animation-delay: -8s; }
        .c3::before { width: 42px; height: 42px; top: -22px; left: 18px; }
        .c3::after { width: 56px; height: 48px; top: -24px; left: 40px; }
        @keyframes drift { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-100vw - 200px)); } }
      `}</style>
    </main>
  );
}
