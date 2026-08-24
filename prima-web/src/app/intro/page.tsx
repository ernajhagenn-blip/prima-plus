"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";

const JENJANG_LIST = [
  { key: "SMP", label: "SMP/MTs", classes: ["VII", "VIII", "IX"], emoji: "🏫" },
  { key: "SMA", label: "SMA/MA", classes: ["X", "XI", "XII"], emoji: "🎓" },
];

const AVATARS = ["🧑‍🚀", "🧑‍🎨", "🧑‍💻", "🧑‍🔬"];

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
    <main
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 25%, #B3E5FC 50%, #C8E6C9 75%, #81C784 100%)",
        color: "#212121",
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div className="intro-cloud ic1" />
        <div className="intro-cloud ic2" />
        <div className="intro-cloud ic3" />
      </div>

      <div className="w-full max-w-sm" style={{ position: "relative", zIndex: 10 }}>
        <div className="mb-3 flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
            style={{
              background: "linear-gradient(135deg, #FFD54F, #FFA726)",
              boxShadow: "0 4px 0 #F57F17, 0 8px 20px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.4)",
              border: "3px solid rgba(255,255,255,0.5)",
              animation: "floatBounce 2s ease-in-out infinite",
            }}
          >
            {step === 1 ? "🎮" : step === 2 ? "🎓" : step === 3 ? "🏫" : "🚀"}
          </div>
        </div>

        <div className="mb-2 text-center">
          <p className="text-sm font-black" style={{ color: "#1565C0" }}>
            {step === 1 ? "Hei! Siapa kamu?" : step === 2 ? "Kelas berapa?" : step === 3 ? "Sekolah mana?" : "Yuk mulai!"}
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(16px)",
            border: "3px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          {step === 1 && (
            <div key="1" className="animate-slide-in-left">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu..."
                className="w-full rounded-xl border-2 border-cyan-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-cyan-400"
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

          {step === 2 && (
            <div key="2" className="animate-slide-in-left">
              <div className="grid grid-cols-2 gap-2">
                {JENJANG_LIST.map((j) => (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => { setJenjang(j.key); setKelas(""); setShowCustom(false); }}
                    className="rounded-xl border-2 py-3 text-sm font-bold transition"
                    style={{
                      border: jenjang === j.key ? "3px solid #42A5F5" : "2px solid rgba(0,0,0,0.08)",
                      background: jenjang === j.key ? "linear-gradient(135deg, #BBDEFB, #E3F2FD)" : "rgba(255,255,255,0.8)",
                      color: jenjang === j.key ? "#1565C0" : "#757575",
                    }}
                  >
                    {j.emoji} {j.label}
                  </button>
                ))}
              </div>

              {jenjang && (
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-2">
                    {currentClasses.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setKelas(c); setShowCustom(false); }}
                        className="rounded-xl border-2 py-2.5 text-sm font-bold transition"
                        style={{
                          border: kelas === c && !showCustom ? "3px solid #FF7043" : "2px solid rgba(0,0,0,0.08)",
                          background: kelas === c && !showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "rgba(255,255,255,0.8)",
                          color: kelas === c && !showCustom ? "#E65100" : "#757575",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className="rounded-xl border-2 py-2.5 text-sm font-bold transition"
                      style={{
                        border: showCustom ? "3px solid #FF7043" : "2px solid rgba(0,0,0,0.08)",
                        background: showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "rgba(255,255,255,0.8)",
                        color: showCustom ? "#E65100" : "#757575",
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                  {showCustom && (
                    <input
                      value={customKelas}
                      onChange={(e) => setCustomKelas(e.target.value)}
                      placeholder="Tulis kelas kamu..."
                      className="mt-2 w-full rounded-xl border-2 border-orange-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400"
                    />
                  )}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="rounded-xl px-4 py-3 text-sm" style={{ border: "2px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.8)", color: "#757575" }}>←</button>
                <button
                  type="button"
                  disabled={!selectedKelas}
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl py-3 text-sm font-black text-white disabled:opacity-40"
                  style={{ background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)", boxShadow: "0 4px 0 #8B0000, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)", border: "2px solid #C62828" }}
                >
                  LANJUT →
                </button>
              </div>
              <input type="hidden" name="kelas" value={selectedKelas} />
            </div>
          )}

          {step === 3 && (
            <div key="3" className="animate-slide-in-left">
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Nama sekolah..."
                className="w-full rounded-xl border-2 border-green-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-400"
                autoFocus
              />
              {state && "error" in state ? (
                <p className="mt-2 text-xs font-bold" style={{ color: "#EF5350" }}>⚠️ {state.error}</p>
              ) : null}
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="rounded-xl px-4 py-3 text-sm" style={{ border: "2px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.8)", color: "#757575" }}>←</button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl py-3 text-sm font-black text-white transition hover:shadow-lg"
                  style={{ background: "linear-gradient(180deg, #66BB6A 0%, #43A047 100%)", boxShadow: "0 4px 0 #2E7D32, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)", border: "2px solid #388E3C" }}
                >
                  🚀 MASUK PRIMA+!
                </button>
              </div>
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="school" value={school} />
            </div>
          )}
        </form>

        <p className="mt-3 text-center text-xs font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
          Dunia ini bakal beda tiap orang. Yuk mulai.
        </p>
      </div>

      <style>{`
        @keyframes floatBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .intro-cloud { position: absolute; background: white; border-radius: 50px; opacity: 0.5; }
        .intro-cloud::before, .intro-cloud::after { content: ""; position: absolute; background: white; border-radius: 50%; }
        .ic1 { width: 100px; height: 32px; top: 8%; left: 8%; animation: introCloudDrift 20s linear infinite; }
        .ic1::before { width: 42px; height: 42px; top: -22px; left: 16px; }
        .ic1::after { width: 58px; height: 48px; top: -24px; left: 38px; }
        .ic2 { width: 80px; height: 26px; top: 14%; left: 60%; animation: introCloudDrift 24s linear infinite; animation-delay: -6s; }
        .ic2::before { width: 34px; height: 34px; top: -18px; left: 12px; }
        .ic2::after { width: 46px; height: 38px; top: -20px; left: 30px; }
        .ic3 { width: 110px; height: 36px; top: 5%; left: 82%; animation: introCloudDrift 18s linear infinite; animation-delay: -10s; }
        .ic3::before { width: 48px; height: 48px; top: -24px; left: 20px; }
        .ic3::after { width: 64px; height: 52px; top: -26px; left: 44px; }
        @keyframes introCloudDrift { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-100vw - 200px)); } }
      `}</style>
    </main>
  );
}
