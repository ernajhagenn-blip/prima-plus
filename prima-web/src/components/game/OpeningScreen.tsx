"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OpeningScreen() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 300);
    const t2 = setTimeout(() => setShowBtn(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", width: "100%", padding: "1.5rem", textAlign: "center",
      opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease-out",
    }}>
      {/* Logo container */}
      <div style={{
        animation: "logoEntrance 1s cubic-bezier(0.34,1.56,0.64,1) both",
        marginBottom: "0.5rem",
      }}>
        {/* Decorative ring */}
        <div style={{
          width: "160px", height: "160px", borderRadius: "50%", margin: "0 auto 1rem",
          background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3), rgba(6,182,212,0.3))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(124,58,237,0.3), 0 0 120px rgba(236,72,153,0.15)",
          animation: "ringPulse 3s ease-in-out infinite",
        }}>
          <div style={{
            width: "130px", height: "130px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.2), inset 0 4px 0 rgba(255,255,255,0.15)",
          }}>
            <span style={{ fontSize: "4rem", lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>🎮</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
          fontSize: "clamp(3.5rem, 14vw, 7rem)", fontWeight: 900, lineHeight: 1,
          letterSpacing: "0.04em",
          background: "linear-gradient(135deg, #c084fc 0%, #f472b6 35%, #fb923c 65%, #facc15 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.3)) drop-shadow(0 8px 24px rgba(124,58,237,0.4))",
        }}>
          PRIMA<span style={{
            background: "linear-gradient(135deg, #f472b6, #ef4444)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>+</span>
        </h1>
      </div>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
        fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.7)", marginTop: "0.25rem",
        animation: "fadeSlideUp 0.8s 0.5s ease-out both",
      }}>
        KESADARAN BERBAHASA REMAJA
      </p>

      {/* Subtitle */}
      <p style={{
        fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.6rem, 1.8vw, 0.8rem)",
        fontWeight: 600, letterSpacing: "0.15em",
        color: "rgba(255,255,255,0.4)", marginTop: "0.5rem",
        animation: "fadeSlideUp 0.8s 0.7s ease-out both",
      }}>
        OPSI 2026 · SOCIAL HUMANITIES
      </p>

      {/* CTA Button */}
      {showBtn && (
        <button
          onClick={() => router.push("/intro")}
          style={{
            marginTop: "2.5rem", padding: "1rem 3.5rem",
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: 900, letterSpacing: "0.1em",
            color: "white", border: "none", borderRadius: "16px", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
            boxShadow: "0 4px 0 #5b21b6, 0 6px 0 #4c1d95, 0 12px 32px rgba(124,58,237,0.4), inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.15)",
            animation: "btnEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 7px 0 #5b21b6, 0 9px 0 #4c1d95, 0 16px 40px rgba(124,58,237,0.5), 0 0 40px rgba(168,85,247,0.4), inset 0 2px 0 rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 0 #5b21b6, 0 6px 0 #4c1d95, 0 12px 32px rgba(124,58,237,0.4), inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.15)";
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(2px)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
        >
          ▶ MULAI BERPETUALANG
        </button>
      )}

      {/* Version */}
      <p style={{
        position: "fixed", bottom: "1.5rem", left: 0, right: 0, textAlign: "center",
        fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 700,
        letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)",
      }}>
        v1.0.0 · BAHASA KITA, PILIHAN KITA
      </p>

      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: translateY(-60px) scale(0.5) rotate(-10deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(124,58,237,0.3), 0 0 120px rgba(236,72,153,0.15); }
          50% { transform: scale(1.05); box-shadow: 0 0 80px rgba(124,58,237,0.4), 0 0 160px rgba(236,72,153,0.2); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnEntrance {
          0% { opacity: 0; transform: translateY(30px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
