"use client";

import { useEffect, useRef, useState } from "react";

export default function GameShell({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    setMuted(!muted);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      {/* Layer 0: Background — fixed, never covers content */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
        background: "linear-gradient(180deg, #0a0e27 0%, #1a1f4e 30%, #2d1b69 60%, #0a0e27 100%)",
      }}>
        {/* Animated nebula blobs */}
        <div className="nebula n1" />
        <div className="nebula n2" />
        <div className="nebula n3" />

        {/* Floating stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="star-field" style={{
            left: `${(i * 3.3) % 100}%`,
            top: `${(i * 7.1) % 100}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 + (i % 4)}s`,
          }} />
        ))}

        {/* Shooting stars */}
        <div className="shooting-star ss1" />
        <div className="shooting-star ss2" />
        <div className="shooting-star ss3" />
      </div>

      {/* Layer 1: Music button — always on top */}
      <button onClick={toggleMusic} style={{
        position: "fixed", top: 12, right: 12, zIndex: 200,
        width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
        fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
        title={muted ? "Nyalakan musik" : "Matikan musik"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Layer 2: Content — always above everything */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", width: "100%" }}>
        {children}
      </div>

      <style>{`
        .nebula {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: nebulaPulse 8s ease-in-out infinite;
        }
        .n1 { width: 400px; height: 400px; top: 10%; left: 20%; background: #7c3aed; animation-delay: 0s; }
        .n2 { width: 350px; height: 350px; top: 50%; right: 10%; background: #ec4899; animation-delay: 3s; }
        .n3 { width: 300px; height: 300px; bottom: 10%; left: 40%; background: #06b6d4; animation-delay: 5s; }

        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.15); }
        }

        .star-field {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: starTwinkle 3s ease-in-out infinite;
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .shooting-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(255,255,255,0.6);
          opacity: 0;
        }
        .shooting-star::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4));
          transform-origin: right center;
          transform: rotate(0deg);
        }
        .ss1 { top: 15%; animation: shoot 4s 1s linear infinite; }
        .ss2 { top: 35%; animation: shoot 5s 3s linear infinite; }
        .ss3 { top: 55%; animation: shoot 6s 5s linear infinite; }

        @keyframes shoot {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 1; }
          20% { transform: translateX(-300px) translateY(100px); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
