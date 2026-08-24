"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CHARACTERS: Record<string, { emoji: string; color: string; gradient: string }> = {
  RAGA: { emoji: " orange", color: "#FF8A2A", gradient: "linear-gradient(135deg, #FF8A2A, #F4511E)" },
  KIRA: { emoji: " pink", color: "#E83E9F", gradient: "linear-gradient(135deg, #E83E9F, #AD1457)" },
  ALYA: { emoji: " blue", color: "#19BFEA", gradient: "linear-gradient(135deg, #19BFEA, #0277BD)" },
  MENTOR: { emoji: " gold", color: "#FFD54F", gradient: "linear-gradient(135deg, #FFD54F, #FFA000)" },
};

const LINES = [
  { who: "RAGA", text: "Eh, tadi aku dengerin obrolan kita." },
  { who: "KIRA", text: "Terus?" },
  { who: "RAGA", text: "Kita campur-campur terus. Bahasa Indonesia, Inggris, sedikit Sunda." },
  { who: "ALYA", text: "Memangnya kenapa?" },
  { who: "RAGA", text: "Nggak kenapa. Cuma… pernah nggak kita mikir, kenapa?" },
  { who: "MENTOR", text: "Menarik. Kapan terakhir kali kamu sadar memilih kata?" },
];

export default function HookScreen() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  if (showFinal) {
    return (
      <div style={{
        minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
      }}>
        <div style={{ animation: "finalReveal 0.8s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3rem", boxShadow: "0 0 40px rgba(124,58,237,0.4)",
          }}>💡</div>
          <h2 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "white",
            lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}>
            KAMU BICARA<br />KAYAK GITU?
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
            fontWeight: 600, color: "rgba(255,255,255,0.6)", maxWidth: "28rem",
            margin: "1rem auto 0", lineHeight: 1.7,
          }}>
            Bahasa kita beda tiap situasi. Nggak selalu sadar, tapi selalu memilih.
            Sekarang coba tanya: <span style={{ color: "#c084fc" }}>kamu milih karena butuh, atau karena udah kebiasaan?</span>
          </p>
        </div>

        <button
          onClick={() => router.push("/journey/1")}
          style={{
            marginTop: "2.5rem", padding: "1rem 3rem",
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", fontWeight: 900, letterSpacing: "0.05em",
            color: "white", border: "none", borderRadius: "16px", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 4px 0 #5b21b6, 0 6px 0 #4c1d95, 0 12px 32px rgba(124,58,237,0.4), inset 0 2px 0 rgba(255,255,255,0.25)",
            animation: "btnPulse 2s ease-in-out infinite",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          ▶ MASUK KE DUNIA PRIMA
        </button>

        <style>{`
          @keyframes finalReveal {
            0% { opacity: 0; transform: scale(0.7); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes btnPulse {
            0%, 100% { box-shadow: 0 4px 0 #5b21b6, 0 6px 0 #4c1d95, 0 12px 32px rgba(124,58,237,0.4), inset 0 2px 0 rgba(255,255,255,0.25); }
            50% { box-shadow: 0 4px 0 #5b21b6, 0 6px 0 #4c1d95, 0 12px 32px rgba(124,58,237,0.4), 0 0 40px rgba(168,85,247,0.3), inset 0 2px 0 rgba(255,255,255,0.25); }
          }
        `}</style>
      </div>
    );
  }

  const line = LINES[i];
  const char = CHARACTERS[line.who];
  const isLast = i === LINES.length - 1;

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
      justifyContent: "flex-end", padding: "1.5rem", paddingBottom: "2rem",
    }}>
      {/* Skip button */}
      <button
        onClick={() => setShowFinal(true)}
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 50,
          padding: "8px 16px", borderRadius: "10px",
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
          letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
          cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      >
        SKIP ▶
      </button>

      {/* Character indicator */}
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -70%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        opacity: 0.15, pointerEvents: "none",
      }}>
        <div style={{
          width: "120px", height: "120px", borderRadius: "50%",
          background: char.gradient, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "3.5rem", boxShadow: `0 0 60px ${char.color}40`,
          animation: "charFloat 3s ease-in-out infinite",
        }}>
          {line.who === "RAGA" ? "🗣️" : line.who === "KIRA" ? "💬" : line.who === "ALYA" ? "🤔" : "✨"}
        </div>
      </div>

      {/* Dialogue box */}
      <div style={{ maxWidth: "40rem", margin: "0 auto", width: "100%" }}>
        {LINES.slice(0, i + 1).map((l, idx) => {
          const c = CHARACTERS[l.who];
          const isCurrent = idx === i;
          return (
            <div key={idx} style={{
              marginBottom: "8px", padding: "14px 18px", borderRadius: "16px",
              background: isCurrent ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isCurrent ? c.color + "40" : "rgba(255,255,255,0.05)"}`,
              backdropFilter: "blur(12px)",
              boxShadow: isCurrent ? `0 4px 20px rgba(0,0,0,0.2), 0 0 30px ${c.color}15` : "none",
              opacity: isCurrent ? 1 : 0.4,
              transform: isCurrent ? "none" : "scale(0.98)",
              transition: "all 0.3s ease-out",
              animation: isCurrent ? "bubbleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "3px 10px", borderRadius: "8px",
                background: `${c.color}20`, marginBottom: "6px",
              }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%", background: c.color,
                  boxShadow: `0 0 8px ${c.color}80`,
                }} />
                <span style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
                  letterSpacing: "0.08em", color: c.color, textTransform: "uppercase",
                }}>{l.who}</span>
              </div>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.85rem, 2vw, 1rem)",
                fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0,
              }}>&quot;{l.text}&quot;</p>
            </div>
          );
        })}

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
          <button
            onClick={() => (i === 0 ? setShowFinal(true) : setI((v) => v - 1))}
            style={{
              padding: "10px 20px", borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700,
              color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", cursor: "pointer",
            }}
          >
            {i === 0 ? "Lewati ▶" : "← Kembali"}
          </button>
          <button
            onClick={() => (isLast ? setShowFinal(true) : setI((v) => v + 1))}
            style={{
              padding: "10px 24px", borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 800,
              color: "white", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: `0 3px 0 #5b21b6, 0 4px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isLast ? "Masuk ▶" : "Lanjut →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bubbleIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes charFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
