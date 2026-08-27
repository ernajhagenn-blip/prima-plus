"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";
import CircuitIntroScene from "@/components/game/CircuitIntroScene";

const JENJANG_LIST = [
  { key: "SMP", label: "SMP/MTs", classes: ["VII", "VIII", "IX"], icon: "🏫" },
  { key: "SMA", label: "SMA/MA", classes: ["X", "XI", "XII"], icon: "🎓" },
];

const STEP_ICONS = ["👤", "🏫", "✅"];
const STEP_TITLES = ["Siapa Namamu?", "Kelas Berapa?", "Sekolah Mana?"];
const STEP_SUBS = [
  "Isi namamu buat mulai petualangan",
  "Pilih jenjang & kelasmu",
  "Terakhir, nama sekolahmu",
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
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      {/* 3D Circuit Background */}
      <CircuitIntroScene />

      {/* Content overlay */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Back */}
      <button onClick={() => step === 1 ? router.push("/") : setStep(step - 1)} style={{
        position: "fixed", top: 14, left: 14, zIndex: 50,
        width: 48, height: 48, borderRadius: "50%",
        border: "none", background: "rgba(255,255,255,0.92)",
        fontSize: "1.3rem", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#334155", boxShadow: "0 4px 14px rgba(30,60,110,0.18)",
        transition: "transform 0.15s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        ←
      </button>

      {/* Progress */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.4rem", animation: "fadeSlideUp 0.6s ease-out both" }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{
            width: s <= step ? "42px" : "14px", height: "9px", borderRadius: 5,
            background: s <= step ? "linear-gradient(90deg, #8b5cf6, #6d28d9)" : "rgba(255,255,255,0.65)",
            boxShadow: "0 1px 4px rgba(30,60,110,0.15)",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        ))}
      </div>

      {/* Step icon */}
      <div key={step} style={{
        width: "110px", height: "110px", borderRadius: "30px", marginBottom: "1.2rem",
        background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "3.5rem",
        boxShadow: "0 14px 36px rgba(124,58,237,0.45), inset 0 2px 0 rgba(255,255,255,0.35)",
        animation: "iconBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        {STEP_ICONS[step - 1]}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Poppins', 'Nunito', sans-serif",
        fontSize: "clamp(2.4rem, 7vw, 3.4rem)", fontWeight: 800, color: "white",
        textAlign: "center", marginBottom: "0.6rem",
        textShadow: "0 3px 14px rgba(30,50,110,0.45)",
        animation: "fadeSlideUp 0.5s 0.1s ease-out both",
      }}>
        {STEP_TITLES[step - 1]}
      </h2>
      <p style={{
        fontFamily: "'Nunito', sans-serif", fontSize: "1.3rem", fontWeight: 800,
        color: "#1e3a5f", background: "rgba(255,255,255,0.92)", boxShadow: "0 3px 12px rgba(30,60,110,0.15)",
        borderRadius: 999, padding: "12px 32px", marginBottom: "1.6rem",
        textAlign: "center", animation: "fadeSlideUp 0.5s 0.15s ease-out both",
      }}>
        {STEP_SUBS[step - 1]}
      </p>

      {/* Form card */}
      <div style={{
        width: "100%", maxWidth: "32rem", borderRadius: "28px", padding: "2.2rem",
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 18px 44px rgba(30,60,110,0.22)",
        animation: "cardEntrance 0.6s 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <form action={formAction}>
          {/* STEP 1: Name */}
          {step === 1 && (
            <div style={{ animation: "stepIn 0.4s ease-out both" }}>
              <label style={{
                display: "block", fontFamily: "'Nunito', sans-serif", fontSize: "1.15rem",
                fontWeight: 900, color: "#475569", marginBottom: "0.7rem", letterSpacing: "0.05em",
              }}>
                NAMA LENGKAP
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tulis nama lengkapmu..."
                autoFocus
                style={{
                  width: "100%", borderRadius: "18px", padding: "22px 24px",
                  fontSize: "1.35rem", fontWeight: 700, color: "#1e293b",
                  background: "#f8fafc", border: "2px solid #e2e8f0",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#8b5cf6"; e.target.style.boxShadow = "0 0 0 4px rgba(139,92,246,0.14)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                style={{
                  marginTop: "1.6rem", width: "100%", padding: "22px", borderRadius: "20px",
                  fontFamily: "'Poppins', sans-serif", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.03em",
                  color: "white", border: "none", cursor: name.trim() ? "pointer" : "not-allowed",
                  opacity: name.trim() ? 1 : 0.45,
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  boxShadow: "0 10px 28px rgba(124,58,237,0.45)",
                  transition: "all 0.15s",
                }}
                onPointerDown={(e) => { if (name.trim()) e.currentTarget.style.transform = "translateY(2px) scale(0.99)"; }}
                onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
              >
                LANJUT →
              </button>
            </div>
          )}

          {/* STEP 2: Kelas */}
          {step === 2 && (
            <div style={{ animation: "stepIn 0.4s ease-out both" }}>
              <label style={{
                display: "block", fontFamily: "'Nunito', sans-serif", fontSize: "1.15rem",
                fontWeight: 900, color: "#475569", marginBottom: "0.7rem", letterSpacing: "0.05em",
              }}>
                JENJANG
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {JENJANG_LIST.map((j) => (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => { setJenjang(j.key); setKelas(""); setShowCustom(false); }}
                    style={{
                      padding: "18px", borderRadius: "18px", fontSize: "1.25rem", fontWeight: 800,
                      fontFamily: "'Nunito', sans-serif",
                      cursor: "pointer", transition: "all 0.2s",
                      border: jenjang === j.key ? "2px solid #8b5cf6" : "2px solid #e2e8f0",
                      background: jenjang === j.key ? "#f5f3ff" : "#f8fafc",
                      color: "#1e293b",
                      boxShadow: jenjang === j.key ? "0 0 0 4px rgba(139,92,246,0.12)" : "none",
                    }}
                  >
                    {j.icon} {j.label}
                  </button>
                ))}
              </div>

              {jenjang && (
                <>
                  <label style={{
                    display: "block", fontFamily: "'Nunito', sans-serif", fontSize: "1.15rem",
                    fontWeight: 900, color: "#475569", margin: "1.4rem 0 0.7rem", letterSpacing: "0.05em",
                  }}>
                    KELAS
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    {currentClasses.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setKelas(c); setShowCustom(false); }}
                        style={{
                          padding: "16px 0", borderRadius: "16px", fontSize: "1.2rem", fontWeight: 800,
                          fontFamily: "'Nunito', sans-serif",
                          cursor: "pointer", transition: "all 0.2s",
                          border: kelas === c && !showCustom ? "2px solid #ec4899" : "2px solid #e2e8f0",
                          background: kelas === c && !showCustom ? "#fdf2f8" : "#f8fafc",
                          color: "#1e293b",
                          boxShadow: kelas === c && !showCustom ? "0 0 0 4px rgba(236,72,153,0.12)" : "none",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      style={{
                        padding: "16px 0", borderRadius: "16px", fontSize: "1.2rem",
                        cursor: "pointer", transition: "all 0.2s",
                        border: showCustom ? "2px solid #ec4899" : "2px solid #e2e8f0",
                        background: showCustom ? "#fdf2f8" : "#f8fafc",
                        boxShadow: showCustom ? "0 0 0 4px rgba(236,72,153,0.12)" : "none",
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </>
              )}

              {showCustom && (
                <input
                  value={customKelas}
                  onChange={(e) => setCustomKelas(e.target.value)}
                  placeholder="Tulis kelas kamu..."
                  autoFocus
                  style={{
                    marginTop: "14px", width: "100%", borderRadius: "16px", padding: "20px 22px",
                    fontSize: "1.25rem", fontWeight: 700, color: "#1e293b",
                    background: "#f8fafc", border: "2px solid #e2e8f0",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "1.6rem" }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  padding: "18px 26px", borderRadius: "18px", fontSize: "1.3rem", fontWeight: 800,
                  border: "none", background: "#f1f5f9",
                  color: "#475569", cursor: "pointer",
                }}>←</button>
                <button
                  type="button"
                  disabled={!selectedKelas}
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1, padding: "22px", borderRadius: "20px",
                    fontFamily: "'Poppins', sans-serif", fontSize: "1.4rem", fontWeight: 800,
                    color: "white", border: "none", cursor: selectedKelas ? "pointer" : "not-allowed",
                    opacity: selectedKelas ? 1 : 0.45,
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    boxShadow: "0 10px 28px rgba(124,58,237,0.45)",
                  }}
                >
                  LANJUT →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: School */}
          {step === 3 && (
            <div style={{ animation: "stepIn 0.4s ease-out both" }}>
              <label style={{
                display: "block", fontFamily: "'Nunito', sans-serif", fontSize: "1.15rem",
                fontWeight: 900, color: "#475569", marginBottom: "0.7rem", letterSpacing: "0.05em",
              }}>
                NAMA SEKOLAH
              </label>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Contoh: MAN Kotawaringin Timur"
                autoFocus
                style={{
                  width: "100%", borderRadius: "18px", padding: "22px 24px",
                  fontSize: "1.35rem", fontWeight: 700, color: "#1e293b",
                  background: "#f8fafc", border: "2px solid #e2e8f0",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16,185,129,0.14)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              {null}
              <div style={{ display: "flex", gap: "12px", marginTop: "1.6rem" }}>
                <button type="button" onClick={() => setStep(2)} style={{
                  padding: "18px 26px", borderRadius: "18px", fontSize: "1.3rem", fontWeight: 800,
                  border: "none", background: "#f1f5f9",
                  color: "#475569", cursor: "pointer",
                }}>←</button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "22px", borderRadius: "20px",
                    fontFamily: "'Poppins', sans-serif", fontSize: "1.4rem", fontWeight: 800,
                    color: "white", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #34d399, #059669)",
                    boxShadow: "0 10px 28px rgba(5,150,105,0.45)",
                    transition: "all 0.15s",
                  }}
                  onPointerDown={(e) => { e.currentTarget.style.transform = "translateY(2px) scale(0.99)"; }}
                  onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                >
                  🚀 MASUK PRIMA+
                </button>
              </div>
            </div>
          )}

          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="kelas" value={selectedKelas} />
          <input type="hidden" name="school" value={school} />
        </form>
      </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes cardEntrance { 0% { opacity: 0; transform: translateY(24px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes iconBounce { 0% { opacity: 0; transform: scale(0.4) rotate(-10deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes stepIn { 0% { opacity: 0; transform: translateX(18px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
