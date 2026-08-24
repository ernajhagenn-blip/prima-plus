"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { startJourney } from "@/app/actions";

const JENJANG_LIST = [
  { key: "SMP", label: "SMP/MTs", classes: ["VII", "VIII", "IX"], icon: "🏫" },
  { key: "SMA", label: "SMA/MA", classes: ["X", "XI", "XII"], icon: "🎓" },
];

const STEP_ICONS = ["👤", "🏫", "✅"];

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
      minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      {/* Back button */}
      <button onClick={() => step === 1 ? router.push("/") : setStep(step - 1)} style={{
        position: "fixed", top: 12, left: 12, zIndex: 50,
        width: 44, height: 44, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)", fontSize: "1.2rem", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.7)", transition: "all 0.2s",
      }}>
        ←
      </button>

      {/* Progress indicator */}
      <div style={{
        display: "flex", gap: "8px", marginBottom: "1.5rem",
        animation: "fadeSlideUp 0.6s ease-out both",
      }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{
            width: s <= step ? "40px" : "12px", height: "6px", borderRadius: "3px",
            background: s <= step
              ? "linear-gradient(90deg, #7c3aed, #ec4899)"
              : "rgba(255,255,255,0.15)",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: s <= step ? "0 0 12px rgba(124,58,237,0.4)" : "none",
          }} />
        ))}
      </div>

      {/* Step icon */}
      <div style={{
        width: "80px", height: "80px", borderRadius: "20px", marginBottom: "1rem",
        background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))",
        border: "2px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2.5rem",
        animation: "iconBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        boxShadow: "0 4px 20px rgba(124,58,237,0.2)",
      }} key={step}>
        {STEP_ICONS[step - 1]}
      </div>

      {/* Step title */}
      <h2 style={{
        fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
        fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
        textAlign: "center", marginBottom: "0.25rem",
        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        animation: "fadeSlideUp 0.5s 0.1s ease-out both",
      }}>
        {step === 1 ? "Siapa Namamu?" : step === 2 ? "Kelas Berapa?" : "Sekolah Mana?"}
      </h2>
      <p style={{
        fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600,
        color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem", textAlign: "center",
        animation: "fadeSlideUp 0.5s 0.2s ease-out both",
      }}>
        {step === 1 ? "Isi namamu buat mulai petualangan" : step === 2 ? "Pilih jenjang & kelas" : "Terakhir, nama sekolahmu"}
      </p>

      {/* Form card */}
      <div style={{
        width: "100%", maxWidth: "24rem", borderRadius: "24px", padding: "1.5rem",
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        animation: "cardEntrance 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <form action={formAction}>
          {/* STEP 1: Name */}
          {step === 1 && (
            <div style={{ animation: "stepIn 0.4s ease-out both" }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap..."
                autoFocus
                style={{
                  width: "100%", borderRadius: "14px", padding: "14px 16px",
                  fontSize: "0.95rem", fontWeight: 600, color: "white",
                  background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.1)",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                style={{
                  marginTop: "1rem", width: "100%", padding: "14px", borderRadius: "14px",
                  fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.05em",
                  color: "white", border: "none", cursor: name.trim() ? "pointer" : "not-allowed",
                  opacity: name.trim() ? 1 : 0.4,
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  boxShadow: "0 4px 0 #5b21b6, 0 6px 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  transition: "all 0.15s",
                }}
              >
                LANJUT →
              </button>
            </div>
          )}

          {/* STEP 2: Kelas */}
          {step === 2 && (
            <div style={{ animation: "stepIn 0.4s ease-out both" }}>
              {/* Jenjang */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {JENJANG_LIST.map((j) => (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => { setJenjang(j.key); setKelas(""); setShowCustom(false); }}
                    style={{
                      padding: "12px", borderRadius: "14px", fontSize: "0.85rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      border: jenjang === j.key ? "2px solid #a855f7" : "2px solid rgba(255,255,255,0.1)",
                      background: jenjang === j.key ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                      color: jenjang === j.key ? "#c084fc" : "rgba(255,255,255,0.6)",
                      boxShadow: jenjang === j.key ? "0 0 16px rgba(168,85,247,0.2)" : "none",
                    }}
                  >
                    {j.icon} {j.label}
                  </button>
                ))}
              </div>

              {/* Kelas buttons */}
              {jenjang && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "10px" }}>
                  {currentClasses.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setKelas(c); setShowCustom(false); }}
                      style={{
                        padding: "10px 0", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s",
                        border: kelas === c && !showCustom ? "2px solid #ec4899" : "2px solid rgba(255,255,255,0.1)",
                        background: kelas === c && !showCustom ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.05)",
                        color: kelas === c && !showCustom ? "#f472b6" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustom(true)}
                    style={{
                      padding: "10px 0", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s",
                      border: showCustom ? "2px solid #ec4899" : "2px solid rgba(255,255,255,0.1)",
                      background: showCustom ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.05)",
                      color: showCustom ? "#f472b6" : "rgba(255,255,255,0.6)",
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
                  autoFocus
                  style={{
                    marginTop: "10px", width: "100%", borderRadius: "10px", padding: "10px 14px",
                    fontSize: "0.85rem", fontWeight: 600, color: "white",
                    background: "rgba(255,255,255,0.08)", border: "2px solid rgba(236,72,153,0.3)",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  padding: "12px 16px", borderRadius: "14px", fontSize: "0.85rem", fontWeight: 700,
                  border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)", cursor: "pointer",
                }}>←</button>
                <button
                  type="button"
                  disabled={!selectedKelas}
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "14px", fontSize: "0.9rem", fontWeight: 900,
                    color: "white", border: "none", cursor: selectedKelas ? "pointer" : "not-allowed",
                    opacity: selectedKelas ? 1 : 0.4,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    boxShadow: "0 4px 0 #5b21b6, 0 6px 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
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
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Nama sekolah..."
                autoFocus
                style={{
                  width: "100%", borderRadius: "14px", padding: "14px 16px",
                  fontSize: "0.95rem", fontWeight: 600, color: "white",
                  background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.1)",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(16,185,129,0.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
              {state && "error" in state ? (
                <p style={{
                  marginTop: "10px", padding: "10px 14px", borderRadius: "10px",
                  fontSize: "0.8rem", fontWeight: 700, color: "#fca5a5",
                  background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)",
                }}>⚠️ {state.error}</p>
              ) : null}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setStep(2)} style={{
                  padding: "12px 16px", borderRadius: "14px", fontSize: "0.85rem", fontWeight: 700,
                  border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)", cursor: "pointer",
                }}>←</button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "14px", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 900,
                    color: "white", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 4px 0 #047857, 0 6px 16px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                    transition: "all 0.15s",
                  }}
                >
                  🚀 MASUK PRIMA+
                </button>
              </div>
            </div>
          )}

          {/* Hidden fields */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="kelas" value={selectedKelas} />
          <input type="hidden" name="school" value={school} />
        </form>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(24px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes iconBounce {
          0% { opacity: 0; transform: scale(0.3) rotate(-15deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes stepIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
