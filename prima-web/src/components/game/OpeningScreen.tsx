"use client";

import { useRouter } from "next/navigation";

export default function OpeningScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <div style={{ animation: "logoDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <h1 className="logo-text">
          PRIMA<span className="logo-plus">+</span>
        </h1>
      </div>

      {/* Tagline */}
      <p className="tagline-text" style={{ animation: "fadeUp 0.7s 0.3s ease-out both" }}>
        BAHASA KITA. PILIHAN KITA.
      </p>

      {/* CTA */}
      <button
        onClick={() => router.push("/intro")}
        className="cta-btn"
        style={{ animation: "fadeUp 0.7s 0.8s ease-out both" }}
      >
        ▶ MULAI
      </button>

      {/* Footer */}
      <p className="footer-label" style={{ animation: "fadeIn 0.8s 1.2s ease-out both" }}>
        OPSI 2026
      </p>

      <style>{`
        .logo-text {
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
          font-size: clamp(4rem, 18vw, 12rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.04em;
          background: linear-gradient(180deg, #FFF176 0%, #FFEE58 10%, #FFD740 25%, #FFC107 45%, #FFB300 60%, #FFA000 80%, #FF8F00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 0 #E65100) drop-shadow(0 3px 0 #E65100) drop-shadow(0 4px 0 #BF360C) drop-shadow(0 5px 0 #BF360C) drop-shadow(0 6px 0 #8D2006) drop-shadow(0 8px 0 #4E1700) drop-shadow(0 14px 32px rgba(0,0,0,0.35)) drop-shadow(0 0 50px rgba(255,193,7,0.5));
        }
        .logo-plus {
          background: linear-gradient(180deg, #FF7043 0%, #F44336 50%, #D32F2F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tagline-text {
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
          font-size: clamp(0.7rem, 2.5vw, 1.1rem);
          font-weight: 900;
          letter-spacing: 0.28em;
          color: #FFFFFF;
          text-shadow: -2px -2px 0 #1565C0, 2px -2px 0 #1565C0, -2px 2px 0 #1565C0, 2px 2px 0 #1565C0, 0 3px 8px rgba(0,0,0,0.3);
          margin-top: 0.5rem;
        }
        .cta-btn {
          margin-top: 2.5rem;
          padding: 1rem 3rem;
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          background: linear-gradient(180deg, #EF5350 0%, #F44336 20%, #E53935 45%, #D32F2F 65%, #C62828 85%, #B71C1C 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          text-shadow: 0 2px 4px rgba(0,0,0,0.35);
          box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15);
          animation: ctaPulse 2.8s ease-in-out infinite;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 0 #8B0000, 0 9px 0 #6B0000, 0 14px 32px rgba(0,0,0,0.35), 0 0 40px rgba(255,82,82,0.5), inset 0 2px 0 rgba(255,255,255,0.35);
        }
        .cta-btn:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 #8B0000, inset 0 2px 0 rgba(255,255,255,0.2);
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.35); }
          50% { box-shadow: 0 5px 0 #8B0000, 0 7px 0 #6B0000, 0 10px 24px rgba(0,0,0,0.3), 0 0 30px rgba(255,82,82,0.35), inset 0 2px 0 rgba(255,255,255,0.35); }
        }
        .footer-label {
          position: fixed;
          bottom: 1.5rem;
          left: 0;
          right: 0;
          text-align: center;
          font-family: "Nunito", sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.6);
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        @keyframes logoDrop {
          0% { opacity: 0; transform: translateY(-80px) scale(0.7) rotate(-5deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
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
