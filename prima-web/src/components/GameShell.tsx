"use client";

import { useState } from "react";
import { gameAudio } from "@/lib/gameAudio";
import InstallPrompt from "@/components/InstallPrompt";

const CLOUDS = [
  { top: "7%", size: 110, dur: 70, delay: 0, o: 0.95 },
  { top: "16%", size: 70, dur: 95, delay: -25, o: 0.85 },
  { top: "27%", size: 140, dur: 120, delay: -55, o: 0.9 },
  { top: "38%", size: 80, dur: 85, delay: -14, o: 0.7 },
];

export default function GameShell({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(gameAudio.muted);

  const toggleMusic = () => {
    const m = !muted;
    setMuted(m);
    gameAudio.setMuted(m);
    if (!m) gameAudio.resume();
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      {/* Layer 0: Bright circuit sky — fixed, subtle */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
        background: "linear-gradient(180deg, #4aa8ff 0%, #7cc4ff 40%, #b8e4ff 62%, #d9f1ff 71%, #8ccf96 72.5%, #6cc07b 100%)",
      }}>
        {/* Sun — kecil & subtle */}
        <div style={{
          position: "absolute", top: "5%", right: "7%", width: 72, height: 72, borderRadius: "50%",
          background: "radial-gradient(circle, #fff7c2 0%, #FFD34D 60%, rgba(255,211,77,0) 75%)",
          filter: "drop-shadow(0 0 26px rgba(255,211,77,0.4))",
        }} />
        {/* Clouds — lembut */}
        {CLOUDS.map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, top: c.top, opacity: c.o * 0.55,
            animation: `cloudDrift ${c.dur}s linear infinite`, animationDelay: `${c.delay}s`,
          }}>
            <div style={{
              width: c.size, height: c.size * 0.34, background: "#ffffff", borderRadius: 999,
              filter: "blur(2px)",
              boxShadow: `${c.size * 0.22}px ${-c.size * 0.1}px 0 #ffffff, ${-c.size * 0.2}px ${-c.size * 0.06}px 0 rgba(255,255,255,0.9)`,
            }} />
          </div>
        ))}
        {/* Kart melintas di rumput */}
        <div style={{ position: "absolute", bottom: "6%", left: 0, fontSize: 58, animation: "shellDrive 15s linear infinite", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}>
          🏎️
        </div>
        <div style={{ position: "absolute", bottom: "22%", left: 0, fontSize: 42, opacity: 0.8, animation: "shellDrive 24s 7s linear infinite", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.2))" }}>
          🚙
        </div>
        {/* Balon melayang */}
        <div style={{ position: "absolute", left: "8%", top: "14%", fontSize: 48, animation: "shellBob 9s ease-in-out infinite" }}>🎈</div>
        <div style={{ position: "absolute", left: "84%", top: "32%", fontSize: 40, animation: "shellBob 12s 3s ease-in-out infinite" }}>🎈</div>
        {/* Burung */}
        <div style={{ position: "absolute", left: 0, top: "20%", fontSize: 32, opacity: 0.7, animation: "cloudDrift 38s linear infinite" }}>🕊️</div>
      </div>

      {/* Layer 1: Global music toggle */}
      <button onClick={toggleMusic} style={{
        position: "fixed", top: 12, right: 12, zIndex: 200,
        width: 46, height: 46, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.85)",
        background: "linear-gradient(180deg, #a855f7, #7c3aed)",
        fontSize: "1.15rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", boxShadow: "0 4px 0 #4c1d95, 0 8px 18px rgba(124,58,237,0.45)",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        title={muted ? "Nyalakan musik" : "Matikan musik"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Layer 2: Content */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", width: "100%" }}>
        {children}
      </div>

      <InstallPrompt />

      <style>{`
        @keyframes cloudDrift { 0% { transform: translateX(-30vw); } 100% { transform: translateX(130vw); } }
        @keyframes shellDrive {
          0% { transform: translateX(-15vw); }
          100% { transform: translateX(108vw); }
        }
        @keyframes shellBob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-22px) rotate(5deg); } }
      `}</style>
    </div>
  );
}
