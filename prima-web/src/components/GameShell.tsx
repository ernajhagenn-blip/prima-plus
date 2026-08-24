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
    <div className="game-shell">
      {/* Animated background */}
      <div className="game-bg">
        <div className="bg-layer sky" />
        <div className="bg-layer ground" />
        {/* Floating clouds */}
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="cloud c4" />
        <div className="cloud c5" />
        {/* Road lines */}
        <div className="road-lines">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="road-line" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
        {/* Floating stars */}
        <div className="stars">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="star" style={{ left: `${8 + i * 8}%`, animationDelay: `${i * 0.4}s`, fontSize: `${0.6 + Math.random() * 0.6}rem` }}>
              {i % 3 === 0 ? "✦" : i % 3 === 1 ? "★" : "✦"}
            </div>
          ))}
        </div>
        {/* Sparkle particles */}
        <div className="sparkles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sparkle" style={{ left: `${15 + i * 15}%`, animationDelay: `${i * 0.7}s` }} />
          ))}
        </div>
      </div>

      {/* Music toggle */}
      <button onClick={toggleMusic} className="music-btn" title={muted ? "Nyalakan musik" : "Matikan musik"}>
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Content */}
      <div className="game-content">
        {children}
      </div>

      <style>{`
        .game-shell {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .game-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .bg-layer { position: absolute; inset: 0; }
        .sky { background: linear-gradient(180deg, #4FC3F7 0%, #81D4FA 25%, #B3E5FC 50%, #E1F5FE 70%, #C8E6C9 100%); }
        .ground { background: linear-gradient(180deg, transparent 75%, #A5D6A7 85%, #81C784 100%); }

        .cloud {
          position: absolute;
          background: rgba(255,255,255,0.7);
          border-radius: 50px;
          filter: blur(1px);
        }
        .cloud::before, .cloud::after {
          content: "";
          position: absolute;
          background: inherit;
          border-radius: 50%;
        }
        .c1 { width: 120px; height: 36px; top: 8%; animation: cloudDrift 25s linear infinite; }
        .c1::before { width: 50px; height: 50px; top: -28px; left: 20px; }
        .c1::after { width: 68px; height: 56px; top: -30px; left: 46px; }
        .c2 { width: 90px; height: 28px; top: 14%; animation: cloudDrift 30s linear infinite; animation-delay: -8s; }
        .c2::before { width: 40px; height: 40px; top: -22px; left: 14px; }
        .c2::after { width: 54px; height: 44px; top: -24px; left: 36px; }
        .c3 { width: 140px; height: 40px; top: 5%; animation: cloudDrift 22s linear infinite; animation-delay: -14s; }
        .c3::before { width: 56px; height: 56px; top: -30px; left: 22px; }
        .c3::after { width: 76px; height: 62px; top: -32px; left: 50px; }
        .c4 { width: 80px; height: 24px; top: 18%; animation: cloudDrift 28s linear infinite; animation-delay: -4s; }
        .c4::before { width: 34px; height: 34px; top: -18px; left: 12px; }
        .c4::after { width: 46px; height: 38px; top: -20px; left: 28px; }
        .c5 { width: 100px; height: 30px; top: 10%; animation: cloudDrift 32s linear infinite; animation-delay: -18s; }
        .c5::before { width: 42px; height: 42px; top: -22px; left: 16px; }
        .c5::after { width: 56px; height: 46px; top: -24px; left: 38px; }

        @keyframes cloudDrift {
          0% { transform: translateX(calc(100vw + 200px)); }
          100% { transform: translateX(-200px); }
        }

        .road-lines {
          position: absolute;
          bottom: 12%;
          left: 0;
          width: 100%;
          height: 4px;
          display: flex;
          gap: 40px;
        }
        .road-line {
          width: 60px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          animation: roadMove 2s linear infinite;
        }
        @keyframes roadMove {
          0% { transform: translateX(100vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(-100px); opacity: 0; }
        }

        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .star {
          position: absolute;
          top: 5%;
          color: #FFD54F;
          text-shadow: 0 0 8px rgba(255,213,79,0.6);
          animation: starFloat 3s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.3); opacity: 0.8; }
        }

        .sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .sparkle {
          position: absolute;
          top: 40%;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: sparkleFloat 4s ease-in-out infinite;
          opacity: 0;
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(-30px); }
        }

        .music-btn {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 100;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.3);
          backdrop-filter: blur(8px);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .music-btn:hover {
          background: rgba(255,255,255,0.5);
          transform: scale(1.1);
        }

        .game-content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
