"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";

const CLASSES = ["X", "XI", "XII"];

const AVATAR_EMOJIS = ["🧑‍🚀", "🧑‍🎨", "🧑‍💻", "🧑‍🔬"];

export default function IntroPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(startJourney, undefined);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [school, setSchool] = useState("");

  return (
    <main
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 25%, #B3E5FC 50%, #C8E6C9 75%, #81C784 100%)",
        color: "#212121",
      }}
    >
      {/* Floating Clouds */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <div className="intro-cloud ic1" />
        <div className="intro-cloud ic2" />
        <div className="intro-cloud ic3" />
      </div>

      <div className="w-full max-w-md" style={{ position: "relative", zIndex: 10 }}>
        <div className="mb-4 flex justify-center">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full text-6xl"
            style={{
              background: "linear-gradient(135deg, #FFD54F, #FFA726)",
              boxShadow: "0 6px 0 #F57F17, 0 10px 24px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.4)",
              border: "3px solid rgba(255,255,255,0.5)",
              animation: "floatBounce 2s ease-in-out infinite",
            }}
          >
            {AVATAR_EMOJIS[step - 1]}
          </div>
        </div>

        <div className="mb-3 text-center">
          <p
            className="text-sm font-black"
            style={{
              color: "#1565C0",
              textShadow: "0 1px 4px rgba(255,255,255,0.8)",
            }}
          >
            Hei! Selamat datang di PRIMA+.
          </p>
          <p className="text-xs" style={{ color: "#616161" }}>
            Sebelum mulai, kenalan dulu, ya.
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            border: "3px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.8)",
          }}
        >
          {step === 1 && (
            <div key="1" className="animate-slide-in-left">
              <p className="text-lg font-bold" style={{ color: "#212121" }}>Siapa kamu?</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu…"
                className="mt-3 w-full rounded-xl px-4 py-3 outline-none"
                style={{
                  border: "2px solid rgba(79,195,247,0.4)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#212121",
                }}
              />
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="mt-4 w-full rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                style={{
                  background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)",
                  boxShadow: "0 4px 0 #8B0000, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                  border: "2px solid #C62828",
                }}
              >
                LANJUT
              </button>
            </div>
          )}

          {step === 2 && (
            <div key="2" className="animate-slide-in-left">
              <p className="text-lg font-bold" style={{ color: "#212121" }}>Kelas berapa sekarang?</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {CLASSES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setKelas(c)}
                    className="rounded-xl py-4 text-sm font-bold transition"
                    style={{
                      border: kelas === c ? "3px solid #42A5F5" : "2px solid rgba(0,0,0,0.08)",
                      background: kelas === c ? "linear-gradient(135deg, #BBDEFB, #E3F2FD)" : "rgba(255,255,255,0.8)",
                      color: kelas === c ? "#1565C0" : "#757575",
                      boxShadow: kelas === c ? "0 3px 0 #1565C0, 0 4px 12px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input type="hidden" value={kelas} />
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    border: "2px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.8)",
                    color: "#757575",
                  }}
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={!kelas}
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                  style={{
                    background: "linear-gradient(180deg, #EF5350 0%, #D32F2F 100%)",
                    boxShadow: "0 4px 0 #8B0000, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                    border: "2px solid #C62828",
                  }}
                >
                  LANJUT
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div key="3" className="animate-slide-in-left">
              <p className="text-lg font-bold" style={{ color: "#212121" }}>Sekolah mana?</p>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Nama sekolah…"
                className="mt-3 w-full rounded-xl px-4 py-3 outline-none"
                style={{
                  border: "2px solid rgba(79,195,247,0.4)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#212121",
                }}
              />
              {state && "error" in state ? (
                <p className="mt-2 text-xs" style={{ color: "#EF5350" }}>{state.error}</p>
              ) : null}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    border: "2px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.8)",
                    color: "#757575",
                  }}
                >
                  ←
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition hover:shadow-lg"
                  style={{
                    background: "linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)",
                    boxShadow: "0 4px 0 #01579B, 0 6px 16px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.3)",
                    border: "2px solid #0277BD",
                  }}
                >
                  MASUK PRIMA WORLD →
                </button>
              </div>
            </div>
          )}

          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="kelas" value={kelas} />
          <input type="hidden" name="school" value={school} />
        </form>

        <p className="mt-4 text-center text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Dunia ini bakal beda tiap orang. Yuk mulai.
        </p>
      </div>

      <style>{`
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .intro-cloud {
          position: absolute;
          background: white;
          border-radius: 50px;
          opacity: 0.5;
        }
        .intro-cloud::before,
        .intro-cloud::after {
          content: "";
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        .ic1 {
          width: 100px; height: 32px;
          top: 8%; left: 8%;
          animation: introCloudDrift 20s linear infinite;
        }
        .ic1::before { width: 42px; height: 42px; top: -22px; left: 16px; }
        .ic1::after { width: 58px; height: 48px; top: -24px; left: 38px; }

        .ic2 {
          width: 80px; height: 26px;
          top: 14%; left: 60%;
          animation: introCloudDrift 24s linear infinite;
          animation-delay: -6s;
        }
        .ic2::before { width: 34px; height: 34px; top: -18px; left: 12px; }
        .ic2::after { width: 46px; height: 38px; top: -20px; left: 30px; }

        .ic3 {
          width: 110px; height: 36px;
          top: 5%; left: 82%;
          animation: introCloudDrift 18s linear infinite;
          animation-delay: -10s;
        }
        .ic3::before { width: 48px; height: 48px; top: -24px; left: 20px; }
        .ic3::after { width: 64px; height: 52px; top: -26px; left: 44px; }

        @keyframes introCloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100vw - 200px)); }
        }
      `}</style>
    </main>
  );
}
