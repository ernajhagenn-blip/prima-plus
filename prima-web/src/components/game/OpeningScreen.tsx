"use client";

import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CHARACTERS = [
  { name: "NARA", color: "#ef4444" },
  { name: "RAGA", color: "#3b82f6" },
  { name: "KIRA", color: "#a855f7" },
  { name: "BIMO", color: "#22c55e" },
  { name: "ALYA", color: "#f472b6" },
  { name: "DAVA", color: "#f97316" },
  { name: "MIRA", color: "#06b6d4" },
  { name: "SENA", color: "#eab308" },
];

function CloudLayer() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        top: `${5 + Math.random() * 30}%`,
        size: 0.6 + Math.random() * 1.2,
        speed: 30 + Math.random() * 50,
        delay: -(Math.random() * 60),
        opacity: 0.5 + Math.random() * 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
      {clouds.map((c) => (
        <div
          key={c.id}
          className="cloud"
          style={{
            top: c.top,
            transform: `scale(${c.size})`,
            animationDuration: `${c.speed}s`,
            animationDelay: `${c.delay}s`,
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SparkleParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${5 + Math.random() * 60}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 2 + 1.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function CharacterIcons() {
  const radius = 120;

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
              className="character-icon"
              style={{
                position: "absolute",
                left: `${x - 14}px`,
                top: `${y - 14}px`,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: char.color,
                border: "2.5px solid white",
                boxShadow: `0 2px 8px rgba(0,0,0,0.25), 0 0 0 2px ${char.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: '"Arial Black", sans-serif',
                fontSize: "0.6rem",
                fontWeight: 900,
                color: "white",
                letterSpacing: "0.02em",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
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
      style={{ background: "#87CEEB" }}
      onMouseMove={handleMouseMove}
    >
      <div className="sky-gradient" />
      <div className="grass-layer" />
      <div className="grass-hills" />

      <CloudLayer />
      <SparkleParticles />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          zIndex: 15,
          transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 3}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div style={{ animation: "logoDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <h1 className="logo-text" style={{ transform: `translateX(${mousePos.x * -6}px) translateY(${mousePos.y * -4}px)` }}>
            PRIMA<span className="logo-plus">+</span>
          </h1>
        </div>

        <p
          className="tagline-text"
          style={{ animation: "fadeUp 0.7s 0.3s ease-out both" }}
        >
          BAHASA KITA. PILIHAN KITA.
        </p>

        <CharacterIcons />

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
        .sky-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #5EC6FF 0%, #7DD3FC 15%, #87CEEB 30%, #A8D8EA 50%, #B8E6B8 70%, #4CAF50 82%, #388E3C 88%, #2E7D32 100%);
          z-index: 0;
        }
        .grass-layer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 18%;
          background: linear-gradient(180deg, #4CAF50 0%, #388E3C 40%, #2E7D32 100%);
          z-index: 1;
          border-radius: 50% 50% 0 0 / 20% 20% 0 0;
        }
        .grass-hills {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 14%;
          background: linear-gradient(180deg, #66BB6A 0%, #43A047 50%, #2E7D32 100%);
          z-index: 1;
          border-radius: 40% 60% 0 0 / 30% 30% 0 0;
        }
        .cloud {
          position: absolute;
          width: 180px; height: 60px;
          background: white;
          border-radius: 60px;
          animation: cloudDrift linear infinite;
          z-index: 2;
        }
        .cloud::before {
          content: "";
          position: absolute;
          top: -28px; left: 28px;
          width: 80px; height: 80px;
          background: white;
          border-radius: 50%;
        }
        .cloud::after {
          content: "";
          position: absolute;
          top: -16px; left: 80px;
          width: 56px; height: 56px;
          background: white;
          border-radius: 50%;
        }
        @keyframes cloudDrift {
          from { left: -220px; }
          to { left: calc(100% + 220px); }
        }
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,230,100,0.9) 40%, rgba(255,215,0,0) 70%);
          animation: sparkleAnim 2s ease-in-out infinite;
          z-index: 3;
        }
        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        .character-ring { animation: spinRingSlow 30s linear infinite; }
        @keyframes spinRingSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .character-icon { animation: iconBounce 3s ease-in-out infinite; }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
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
          text-shadow: -2px -2px 0 #1A237E, 2px -2px 0 #1A237E, -2px 2px 0 #1A237E, 2px 2px 0 #1A237E, -2px 0 0 #1A237E, 2px 0 0 #1A237E, 0 -2px 0 #1A237E, 0 2px 0 #1A237E, 0 4px 12px rgba(0,0,0,0.3);
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
          color: rgba(255,255,255,0.7);
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
