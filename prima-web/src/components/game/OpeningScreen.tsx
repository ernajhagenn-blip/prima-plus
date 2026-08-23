"use client";

import { useState, useEffect, useMemo } from "react";
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
          "linear-gradient(135deg, #080c24 0%, #12082e 40%, #0d1a4a 70%, #080c24 100%)",
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

/* ─── Sparkle Particles (pure CSS) ─── */
function SparkleParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 6,
        duration: Math.random() * 2 + 1.5,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 2 }}
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

/* ─── Rotating Character Dots ─── */
function CharacterDots() {
  const radius = 40;

  return (
    <div className="relative mt-8 h-24 w-24" style={{ zIndex: 10 }}>
      <div
        className="character-ring"
        style={{
          width: 80,
          height: 80,
          position: "relative",
          margin: "0 auto",
        }}
      >
        {CHARACTERS.map((char, i) => {
          const angle =
            (i / CHARACTERS.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 2.4 + i * 0.08,
                duration: 0.35,
                type: "spring",
                stiffness: 320,
                damping: 14,
              }}
              title={char.name}
              className="absolute rounded-full"
              style={{
                width: 11,
                height: 11,
                backgroundColor: char.color,
                boxShadow: `0 0 8px ${char.color}, 0 0 18px ${char.color}55`,
                left: `calc(50% + ${x}px - 5.5px)`,
                top: `calc(50% + ${y}px - 5.5px)`,
              }}
            />
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

  /* Timer fallback: always show overlay after 1.5 s */
  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(true), 1500);
    return () => clearTimeout(t);
  }, []);

  /* Also show overlay when 3D scene loads (whichever is first wins) */
  useEffect(() => {
    if (ready) setShowOverlay(true);
  }, [ready]);

  const handleReady = () => setReady(true);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#080c24" }}
    >
      {/* ── Animated gradient background ── */}
      <div className="animated-gradient" />

      {/* ── 3D Scene (behind everything) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <SceneErrorBoundary label="Opening">
          <OpeningScene onReady={handleReady} />
        </SceneErrorBoundary>
      </div>

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

      {/* ── Main overlay — ALWAYS visible ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ zIndex: 15 }}
          >
            {/* PRIMA+ Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 170,
                damping: 10,
                mass: 0.8,
              }}
            >
              <h1 className="logo-text">
                PRIMA<span className="logo-plus">+</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
              className="tagline-text"
            >
              BAHASA KITA. PILIHAN KITA.
            </motion.p>

            {/* Character dots circle */}
            <CharacterDots />

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => router.push("/intro")}
              className="cta-btn"
            >
              ▶ MULAI PETUALANGAN
            </motion.button>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="footer-label"
            >
              PRIMA+ · OPSI 2026 · SMA
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global styles ── */}
      <style>{`
        /* ── Animated gradient background ── */
        .animated-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #080c24 0%,
            #12082e 18%,
            #0d1a4a 36%,
            #1a0a2e 54%,
            #0a0e30 72%,
            #080c24 100%
          );
          background-size: 300% 300%;
          animation: gradientShift 14s ease infinite;
          z-index: 0;
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 0%; }
          25%  { background-position: 100% 0%; }
          50%  { background-position: 100% 100%; }
          75%  { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }

        /* ── Sparkle particles ── */
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(253, 224, 71, 0.95) 0%,
            rgba(253, 224, 71, 0) 70%
          );
          animation: sparkleAnim 2s ease-in-out infinite;
        }

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0); }
          50%      { opacity: 1; transform: scale(1); }
        }

        /* ── Character ring rotation ── */
        .character-ring {
          animation: spinRing 26s linear infinite;
        }

        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── PRIMA+ Logo (3D text-shadow stack + gradient fill) ── */
        .logo-text {
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(4.5rem, 18vw, 11rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.03em;
          background: linear-gradient(
            180deg,
            #fde047 0%,
            #fbbf24 40%,
            #fb923c 70%,
            #f97316 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter:
            drop-shadow(0 1px 0 #b45309)
            drop-shadow(0 2px 0 #b45309)
            drop-shadow(0 3px 0 #92400e)
            drop-shadow(0 4px 0 #92400e)
            drop-shadow(0 5px 0 #78350f)
            drop-shadow(0 6px 0 #78350f)
            drop-shadow(0 8px 0 #451a03)
            drop-shadow(0 12px 28px rgba(0, 0, 0, 0.6))
            drop-shadow(0 0 44px rgba(253, 224, 71, 0.4));
          position: relative;
          z-index: 10;
        }

        .logo-plus {
          background: linear-gradient(180deg, #67e8f9 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Tagline ── */
        .tagline-text {
          font-family: "Arial", "Helvetica Neue", sans-serif;
          font-size: clamp(0.72rem, 2.5vw, 1.1rem);
          font-weight: 700;
          letter-spacing: 0.32em;
          color: #ffffff;
          text-shadow:
            0 0 14px rgba(255, 255, 255, 0.45),
            0 0 36px rgba(255, 255, 255, 0.12),
            0 2px 10px rgba(0, 0, 0, 0.6);
          margin-top: 0.3rem;
          position: relative;
          z-index: 10;
        }

        /* ── CTA Button ── */
        .cta-btn {
          margin-top: 2.2rem;
          padding: 1rem 2.8rem;
          font-family: "Arial Black", "Impact", sans-serif;
          font-size: clamp(1rem, 3vw, 1.35rem);
          font-weight: 900;
          letter-spacing: 0.06em;
          color: #431407;
          background: linear-gradient(
            135deg,
            #f97316 0%,
            #fb923c 35%,
            #fbbf24 65%,
            #fde047 100%
          );
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          position: relative;
          z-index: 10;
          box-shadow:
            0 6px 0 #9a3412,
            0 10px 28px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
          animation: ctaPulse 2.5s ease-in-out infinite;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow:
            0 9px 0 #9a3412,
            0 16px 36px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(253, 224, 71, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
        }

        .cta-btn:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 #9a3412,
            0 4px 10px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        @keyframes ctaPulse {
          0%, 100% {
            box-shadow:
              0 6px 0 #9a3412,
              0 10px 28px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(253, 224, 71, 0),
              inset 0 1px 0 rgba(255, 255, 255, 0.45);
          }
          50% {
            box-shadow:
              0 6px 0 #9a3412,
              0 10px 28px rgba(0, 0, 0, 0.45),
              0 0 28px rgba(253, 224, 71, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.45);
          }
        }

        /* ── Footer ── */
        .footer-label {
          position: absolute;
          bottom: 2.5rem;
          font-family: "Arial", sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.32);
          z-index: 10;
        }

        /* ── Loading pill ── */
        .loading-pill {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.8rem;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 9999px;
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .kart-spin {
          display: inline-block;
          font-size: 1.35rem;
          animation: kartSpin 0.75s linear infinite;
        }

        @keyframes kartSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .loading-label {
          font-family: "Arial", sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}
