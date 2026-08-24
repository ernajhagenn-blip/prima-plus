"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SceneErrorBoundary from "./SceneErrorBoundary";

const OpeningScene = dynamic(() => import("./OpeningScene"), { ssr: false });

const CHARACTERS = [
  { name: "NARA", color: "#EF5350" },
  { name: "RAGA", color: "#FFA726" },
  { name: "KIRA", color: "#AB47BC" },
  { name: "BIMO", color: "#66BB6A" },
  { name: "ALYA", color: "#42A5F5" },
  { name: "DAVA", color: "#FFEE58" },
  { name: "MIRA", color: "#26C6DA" },
  { name: "SENA", color: "#EC407A" },
];

function CharacterRing() {
  const radius = 100;
  return (
    <div className="relative mt-4 h-2 w-full" style={{ zIndex: 10 }}>
      <div className="character-ring" style={{ position: "relative", width: 0, height: 0, margin: "0 auto" }}>
        {CHARACTERS.map((char, i) => {
          const angle = (i / CHARACTERS.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={char.name}
              title={char.name}
              style={{
                position: "absolute",
                left: `${x - 16}px`,
                top: `${y - 16}px`,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${char.color}, ${char.color}cc)`,
                border: "3px solid white",
                boxShadow: `0 3px 0 ${char.color}88, 0 4px 12px rgba(0,0,0,0.25), 0 0 20px ${char.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: '"Arial Black", sans-serif',
                fontSize: "0.65rem",
                fontWeight: 900,
                color: "white",
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {char.name[0]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OpeningScreen() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E1F5FE 100%)" }}
      onMouseMove={handleMouseMove}
    >
      <SceneErrorBoundary label="Opening Scene">
        <OpeningScene />
      </SceneErrorBoundary>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          zIndex: 15,
          transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 3}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div style={{ animation: "logoDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <h1
            className="logo-text"
            style={{ transform: `translateX(${mousePos.x * -6}px) translateY(${mousePos.y * -4}px)` }}
          >
            PRIMA<span className="logo-plus">+</span>
          </h1>
        </div>

        <p className="tagline-text" style={{ animation: "fadeUp 0.7s 0.3s ease-out both" }}>
          BAHASA KITA. PILIHAN KITA.
        </p>

        <CharacterRing />

        <button
          onClick={() => router.push("/intro")}
          className="cta-btn"
          style={{ animation: "fadeUp 0.7s 0.8s ease-out both" }}
        >
          ▶ MULAI PETUALANGAN
        </button>

        <p className="footer-label" style={{ animation: "fadeIn 0.8s 1.2s ease-out both" }}>
          PRIMA+ · OPSI 2026 · SMA
        </p>
      </div>

      <style>{`
        .character-ring { animation: spinRingSlow 30s linear infinite; }
        @keyframes spinRingSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .logo-text {
          font-family: "Arial Black", "Impact", "Trebuchet MS", sans-serif;
          font-size: clamp(5rem, 20vw, 13rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.04em;
          color: #FFD700;
          background: linear-gradient(180deg, #FFF176 0%, #FFEE58 10%, #FFD740 25%, #FFC107 45%, #FFB300 60%, #FFA000 80%, #FF8F00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 0 #E65100) drop-shadow(0 3px 0 #E65100) drop-shadow(0 4px 0 #BF360C) drop-shadow(0 5px 0 #BF360C) drop-shadow(0 6px 0 #8D2006) drop-shadow(0 7px 0 #8D2006) drop-shadow(0 8px 0 #4E1700) drop-shadow(0 10px 0 #3E1200) drop-shadow(0 14px 32px rgba(0,0,0,0.35)) drop-shadow(0 0 50px rgba(255,193,7,0.5));
          position: relative;
          z-index: 10;
          text-shadow: none;
        }
        .logo-plus {
          background: linear-gradient(180deg, #FF7043 0%, #F44336 50%, #D32F2F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tagline-text {
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(0.8rem, 2.8vw, 1.2rem);
          font-weight: 900;
          letter-spacing: 0.28em;
          color: #FFFFFF;
          text-shadow: -2px -2px 0 #1565C0, 2px -2px 0 #1565C0, -2px 2px 0 #1565C0, 2px 2px 0 #1565C0, 0 3px 8px rgba(0,0,0,0.3);
          margin-top: 0.5rem;
          position: relative;
          z-index: 10;
        }
        .cta-btn {
          margin-top: 2.8rem;
          padding: 1.1rem 3rem;
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(1.05rem, 3.2vw, 1.4rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          background: linear-gradient(180deg, #EF5350 0%, #F44336 20%, #E53935 45%, #D32F2F 65%, #C62828 85%, #B71C1C 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          position: relative;
          z-index: 10;
          text-shadow: 0 2px 4px rgba(0,0,0,0.35);
          box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15);
          animation: ctaPulse 2.8s ease-in-out infinite;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 0 #8B0000, 0 9px 0 #6B0000, 0 14px 32px rgba(0,0,0,0.35), 0 0 40px rgba(255,82,82,0.5), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15);
        }
        .cta-btn:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 #8B0000, 0 3px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1);
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), 0 0 0 rgba(255,82,82,0), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15); }
          50% { box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), 0 0 30px rgba(255,82,82,0.35), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15); }
        }
        .footer-label {
          position: absolute;
          bottom: 2.2rem;
          font-family: "Arial", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 1px 4px rgba(0,0,0,0.25);
          z-index: 10;
        }
        @keyframes logoDrop {
          0% { opacity: 0; transform: translateY(-100px) scale(0.7) rotate(-8deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
