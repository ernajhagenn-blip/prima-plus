"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SceneErrorBoundary from "@/components/game/SceneErrorBoundary";

const OpeningScene = dynamic(() => import("./OpeningScene"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0"
      style={{
        background:
          "linear-gradient(180deg, #87CEEB 0%, #5BA3D9 40%, #3A7BD5 70%, #4CAF50 85%, #388E3C 100%)",
      }}
    />
  ),
});

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

/* ─── Cloud Layer (CSS only, multiple clouds) ─── */
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
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 2 }}
    >
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

/* ─── Sparkle Particles ─── */
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
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 3 }}
    >
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

/* ─── Character Icons around logo ─── */
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
            <motion.div
              key={char.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.8 + i * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 12,
              }}
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
              }}
            >
              {char.name[0]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main OpeningScreen ─── */
export default function OpeningScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* Timer fallback: always show overlay after 1.5s */
  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(true), 1500);
    return () => clearTimeout(t);
  }, []);

  /* Also show overlay when 3D scene loads */
  useEffect(() => {
    if (ready) setShowOverlay(true);
  }, [ready]);

  const handleReady = useCallback(() => setReady(true), []);

  /* Parallax on mouse move */
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
      {/* ── Bright sky gradient background ── */}
      <div className="sky-gradient" />

      {/* ── Green grass bottom ── */}
      <div className="grass-layer" />
      <div className="grass-hills" />

      {/* ── 3D Scene (behind everything) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <SceneErrorBoundary label="Opening">
          <OpeningScene onReady={handleReady} />
        </SceneErrorBoundary>
      </div>

      {/* ── Clouds ── */}
      <CloudLayer />

      {/* ── Sparkle particles ── */}
      <SparkleParticles />

      {/* ── Loading state ── */}
      <AnimatePresence>
        {!showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 flex items-end justify-center pb-16"
            style={{ zIndex: 20 }}
          >
            <div className="loading-pill">
              <span className="kart-spin">🏎️</span>
              <span className="loading-label">MEMUAT DUNIA PRIMA…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main overlay ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{
              zIndex: 15,
              transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 3}px)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* PRIMA+ Logo */}
            <motion.div
              initial={{ y: -120, opacity: 0, rotate: -12 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 120,
                damping: 8,
                mass: 1,
              }}
            >
              <h1 className="logo-text" style={{ transform: `translateX(${mousePos.x * -6}px) translateY(${mousePos.y * -4}px)` }}>
                PRIMA<span className="logo-plus">+</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
              className="tagline-text"
            >
              BAHASA KITA. PILIHAN KITA.
            </motion.p>

            {/* Character icons */}
            <CharacterIcons />

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 1.0,
                type: "spring",
                stiffness: 150,
                damping: 10,
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92, y: 2 }}
              onClick={() => router.push("/intro")}
              className="cta-btn"
            >
              ▶ MULAI PETUALANGAN
            </motion.button>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="footer-label"
            >
              PRIMA+ · OPSI 2026 · SMA
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global styles ── */}
      <style>{`
        /* ── Sky gradient background ── */
        .sky-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #5EC6FF 0%,
            #7DD3FC 15%,
            #87CEEB 30%,
            #A8D8EA 50%,
            #B8E6B8 70%,
            #4CAF50 82%,
            #388E3C 88%,
            #2E7D32 100%
          );
          z-index: 0;
        }

        /* ── Grass bottom ── */
        .grass-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 18%;
          background: linear-gradient(180deg, #4CAF50 0%, #388E3C 40%, #2E7D32 100%);
          z-index: 1;
          border-radius: 50% 50% 0 0 / 20% 20% 0 0;
        }

        .grass-hills {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 14%;
          background: linear-gradient(180deg, #66BB6A 0%, #43A047 50%, #2E7D32 100%);
          z-index: 1;
          border-radius: 40% 60% 0 0 / 30% 30% 0 0;
        }

        /* ── Clouds ── */
        .cloud {
          position: absolute;
          width: 180px;
          height: 60px;
          background: white;
          border-radius: 60px;
          animation: cloudDrift linear infinite;
          z-index: 2;
        }

        .cloud::before {
          content: "";
          position: absolute;
          top: -28px;
          left: 28px;
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
        }

        .cloud::after {
          content: "";
          position: absolute;
          top: -16px;
          left: 80px;
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 50%;
        }

        @keyframes cloudDrift {
          from { left: -220px; }
          to { left: calc(100% + 220px); }
        }

        /* ── Sparkle particles ── */
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 230, 100, 0.9) 40%,
            rgba(255, 215, 0, 0) 70%
          );
          animation: sparkleAnim 2s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        /* ── Character ring ── */
        .character-ring {
          animation: spinRingSlow 30s linear infinite;
        }

        @keyframes spinRingSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .character-icon {
          animation: iconBounce 3s ease-in-out infinite;
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* ── PRIMA+ Logo (bright yellow/orange 3D text) ── */
        .logo-text {
          font-family: "Arial Black", "Impact", "Trebuchet MS", sans-serif;
          font-size: clamp(5rem, 20vw, 13rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.04em;
          color: #FFD700;
          background: linear-gradient(
            180deg,
            #FFF176 0%,
            #FFEE58 10%,
            #FFD740 25%,
            #FFC107 45%,
            #FFB300 60%,
            #FFA000 80%,
            #FF8F00 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter:
            drop-shadow(0 2px 0 #E65100)
            drop-shadow(0 3px 0 #E65100)
            drop-shadow(0 4px 0 #BF360C)
            drop-shadow(0 5px 0 #BF360C)
            drop-shadow(0 6px 0 #8D2006)
            drop-shadow(0 7px 0 #8D2006)
            drop-shadow(0 8px 0 #4E1700)
            drop-shadow(0 10px 0 #3E1200)
            drop-shadow(0 14px 32px rgba(0, 0, 0, 0.35))
            drop-shadow(0 0 50px rgba(255, 193, 7, 0.5));
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

        /* ── Tagline ── */
        .tagline-text {
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(0.8rem, 2.8vw, 1.2rem);
          font-weight: 900;
          letter-spacing: 0.28em;
          color: #FFFFFF;
          text-shadow:
            -2px -2px 0 #1A237E,
            2px -2px 0 #1A237E,
            -2px 2px 0 #1A237E,
            2px 2px 0 #1A237E,
            -2px 0 0 #1A237E,
            2px 0 0 #1A237E,
            0 -2px 0 #1A237E,
            0 2px 0 #1A237E,
            0 4px 12px rgba(0, 0, 0, 0.3);
          margin-top: 0.5rem;
          position: relative;
          z-index: 10;
        }

        /* ── CTA Button (red glossy 3D) ── */
        .cta-btn {
          margin-top: 2.8rem;
          padding: 1.1rem 3rem;
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(1.05rem, 3.2vw, 1.4rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          background: linear-gradient(
            180deg,
            #EF5350 0%,
            #F44336 20%,
            #E53935 45%,
            #D32F2F 65%,
            #C62828 85%,
            #B71C1C 100%
          );
          border: none;
          border-radius: 16px;
          cursor: pointer;
          position: relative;
          z-index: 10;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
          box-shadow:
            0 5px 0 #8B0000,
            0 7px 0 #6B0000,
            0 10px 24px rgba(0, 0, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.35),
            inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          animation: ctaPulse 2.8s ease-in-out infinite;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .cta-btn:hover {
          box-shadow:
            0 7px 0 #8B0000,
            0 9px 0 #6B0000,
            0 14px 32px rgba(0, 0, 0, 0.35),
            0 0 40px rgba(255, 82, 82, 0.5),
            inset 0 2px 0 rgba(255, 255, 255, 0.35),
            inset 0 -2px 0 rgba(0, 0, 0, 0.15);
        }

        .cta-btn:active {
          transform: translateY(3px);
          box-shadow:
            0 2px 0 #8B0000,
            0 3px 8px rgba(0, 0, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
        }

        @keyframes ctaPulse {
          0%, 100% {
            box-shadow:
              0 5px 0 #8B0000,
              0 7px 0 #6B0000,
              0 10px 24px rgba(0, 0, 0, 0.3),
              0 0 0 rgba(255, 82, 82, 0),
              inset 0 2px 0 rgba(255, 255, 255, 0.35),
              inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          }
          50% {
            box-shadow:
              0 5px 0 #8B0000,
              0 7px 0 #6B0000,
              0 10px 24px rgba(0, 0, 0, 0.3),
              0 0 30px rgba(255, 82, 82, 0.35),
              inset 0 2px 0 rgba(255, 255, 255, 0.35),
              inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          }
        }

        /* ── Footer ── */
        .footer-label {
          position: absolute;
          bottom: 2.2rem;
          font-family: "Arial", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          z-index: 10;
        }

        /* ── Loading pill ── */
        .loading-pill {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.8rem;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 9999px;
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .kart-spin {
          display: inline-block;
          font-size: 1.35rem;
          animation: kartSpin 0.75s linear infinite;
        }

        @keyframes kartSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-label {
          font-family: "Arial", sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
}
