"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpeningScreen() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 25%, #B3E5FC 50%, #C8E6C9 75%, #81C784 100%)",
      }}
    >
      {/* Floating CSS Clouds */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
      </div>

      {/* CSS City Skyline */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 2, height: "35%" }}>
        <div className="building b1" />
        <div className="building b2" />
        <div className="building b3" />
        <div className="building b4" />
        <div className="building b5" />
        <div className="building b6" />
        <div className="building b7" />
        <div className="building b8" />
        <div className="building b9" />
        <div className="building b10" />
        <div className="building b11" />
        <div className="building b12" />
        {/* Road */}
        <div className="road" />
        {/* Grass */}
        <div className="grass" />
      </div>

      {/* Main Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 10 }}
      >
        <div style={{ animation: "logoDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <h1 className="logo-text">
            PRIMA<span className="logo-plus">+</span>
          </h1>
        </div>

        <p className="tagline-text" style={{ animation: "fadeUp 0.7s 0.3s ease-out both" }}>
          BAHASA KITA. PILIHAN KITA.
        </p>

        <button
          onClick={() => router.push("/intro")}
          className="cta-btn"
          style={{ animation: "fadeUp 0.7s 0.8s ease-out both" }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
        >
          MULAI
        </button>

        <p className="footer-label" style={{ animation: "fadeIn 0.8s 1.2s ease-out both" }}>
          OPSI 2026
        </p>
      </div>

      <style>{`
        /* ── Logo ── */
        .logo-text {
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
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
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
          font-size: clamp(0.8rem, 2.8vw, 1.2rem);
          font-weight: 900;
          letter-spacing: 0.28em;
          color: #FFFFFF;
          text-shadow: -2px -2px 0 #1565C0, 2px -2px 0 #1565C0, -2px 2px 0 #1565C0, 2px 2px 0 #1565C0, 0 3px 8px rgba(0,0,0,0.3);
          margin-top: 0.5rem;
          position: relative;
          z-index: 10;
        }

        /* ── CTA Button ── */
        .cta-btn {
          margin-top: 2.8rem;
          padding: 1.1rem 3rem;
          font-family: "Righteous", "Arial Black", "Impact", sans-serif;
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
          font-family: "Nunito", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 1px 4px rgba(0,0,0,0.25);
          z-index: 10;
        }

        /* ── Floating Clouds ── */
        .cloud {
          position: absolute;
          background: white;
          border-radius: 50px;
          opacity: 0.9;
          filter: blur(1px);
        }
        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        .cloud-1 {
          width: 120px; height: 40px;
          top: 8%; left: 10%;
          animation: cloudDrift1 18s linear infinite;
        }
        .cloud-1::before { width: 50px; height: 50px; top: -25px; left: 20px; }
        .cloud-1::after { width: 70px; height: 60px; top: -30px; left: 45px; }

        .cloud-2 {
          width: 90px; height: 30px;
          top: 15%; left: 55%;
          animation: cloudDrift2 22s linear infinite;
        }
        .cloud-2::before { width: 40px; height: 40px; top: -20px; left: 15px; }
        .cloud-2::after { width: 55px; height: 45px; top: -22px; left: 35px; }

        .cloud-3 {
          width: 150px; height: 45px;
          top: 5%; left: 70%;
          animation: cloudDrift1 25s linear infinite;
          animation-delay: -8s;
        }
        .cloud-3::before { width: 60px; height: 55px; top: -28px; left: 25px; }
        .cloud-3::after { width: 80px; height: 65px; top: -32px; left: 55px; }

        .cloud-4 {
          width: 100px; height: 35px;
          top: 22%; left: 30%;
          animation: cloudDrift2 20s linear infinite;
          animation-delay: -5s;
        }
        .cloud-4::before { width: 45px; height: 45px; top: -22px; left: 18px; }
        .cloud-4::after { width: 60px; height: 50px; top: -25px; left: 40px; }

        .cloud-5 {
          width: 80px; height: 28px;
          top: 12%; left: 85%;
          animation: cloudDrift1 16s linear infinite;
          animation-delay: -3s;
        }
        .cloud-5::before { width: 35px; height: 35px; top: -18px; left: 12px; }
        .cloud-5::after { width: 48px; height: 40px; top: -20px; left: 30px; }

        @keyframes cloudDrift1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
        @keyframes cloudDrift2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100vw - 200px)); }
        }

        /* ── CSS City Skyline ── */
        .building {
          position: absolute;
          bottom: 60px;
          border-radius: 8px 8px 0 0;
          border: 2px solid rgba(255,255,255,0.3);
          border-bottom: none;
        }
        .b1  { width: 60px; height: 140px; left: 2%;   background: linear-gradient(180deg, #EF5350, #C62828); }
        .b2  { width: 45px; height: 180px; left: 8%;   background: linear-gradient(180deg, #42A5F5, #1565C0); }
        .b3  { width: 70px; height: 120px; left: 14%;  background: linear-gradient(180deg, #66BB6A, #2E7D32); }
        .b4  { width: 50px; height: 200px; left: 22%;  background: linear-gradient(180deg, #FFA726, #E65100); }
        .b5  { width: 55px; height: 160px; left: 30%;  background: linear-gradient(180deg, #AB47BC, #6A1B9A); }
        .b6  { width: 40px; height: 220px; left: 38%;  background: linear-gradient(180deg, #26C6DA, #00838F); }
        .b7  { width: 65px; height: 150px; left: 45%;  background: linear-gradient(180deg, #FFEE58, #F9A825); }
        .b8  { width: 48px; height: 190px; left: 53%;  background: linear-gradient(180deg, #EC407A, #AD1457); }
        .b9  { width: 55px; height: 130px; left: 60%;  background: linear-gradient(180deg, #5C6BC0, #283593); }
        .b10 { width: 70px; height: 170px; left: 68%;  background: linear-gradient(180deg, #4CAF50, #1B5E20); }
        .b11 { width: 45px; height: 210px; left: 78%;  background: linear-gradient(180deg, #FF7043, #BF360C); }
        .b12 { width: 60px; height: 145px; left: 86%;  background: linear-gradient(180deg, #29B6F6, #0277BD); }

        .road {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          background: linear-gradient(180deg, #607D8B, #455A64);
          border-top: 3px solid #78909C;
        }
        .road::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 3px;
          background: repeating-linear-gradient(90deg, #FFD54F 0px, #FFD54F 30px, transparent 30px, transparent 50px);
          transform: translateY(-50%);
        }
        .grass {
          position: absolute;
          bottom: 24px;
          left: 0;
          right: 0;
          height: 36px;
          background: linear-gradient(180deg, #66BB6A, #43A047);
          border-top: 3px solid rgba(255,255,255,0.3);
        }

        /* ── Keyframes ── */
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
