"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";

const NAVY = "#253057";

interface Loc {
  id: string;
  name: string;
  sub: string;
  desc: string;
  icon: string;
  href: string;
  gradient: string;
  shadow: string;
}

const LOCS: Loc[] = [
  { id: "kart", name: "Kart Arena", sub: "Stadium", desc: "Sirkuit balapan utama. Pilih kartmu dan buktikan kepekaan bahasamu di kecepatan tinggi.", icon: "🏁", href: "/select", gradient: "linear-gradient(135deg,#f87171,#f97316)", shadow: "#c2410c" },
  { id: "arcade", name: "Arcade", sub: "Gedung Permainan", desc: "Permainan ringan tentang kata dan konteks. Cepat, seru, dan penuh jebakan kecil.", icon: "🎮", href: "/games", gradient: "linear-gradient(135deg,#a78bfa,#d946ef)", shadow: "#a21caf" },
  { id: "challenge", name: "Challenge", sub: "Arena Futuristik", desc: "Menara tantangan enam lantai. Hanya pemikir kritis yang sampai puncak.", icon: "🧠", href: "/games/challenge-tower", gradient: "linear-gradient(135deg,#38bdf8,#06b6d4)", shadow: "#0e7490" },
  { id: "story", name: "Story World", sub: "Portal Cerita", desc: "Kembali ke awal perjalanan: data, fenomena, dan ruang edukasi.", icon: "📖", href: "/story", gradient: "linear-gradient(135deg,#4ade80,#16a34a)", shadow: "#15803d" },
  { id: "feedback", name: "Feedback", sub: "Observatorium", desc: "Ruang melihat perjalananmu: skor, kartu, dan refleksi.", icon: "💬", href: "/feedback", gradient: "linear-gradient(135deg,#fbbf24,#f59e0b)", shadow: "#b45309" },
];

export default function WorldPage() {
  const [sel, setSel] = useState<Loc | null>(null);
  const router = useRouter();

  useEffect(() => {
    const kick = () => { gameAudio.startMusic("arcade"); window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => { window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); gameAudio.stopMusic(); };
  }, []);

  return (
    <main style={{
      width: "100vw", minHeight: "100vh", margin: 0, position: "relative", zIndex: 1,
      padding: "clamp(18px,3.5vmin,40px) clamp(14px,3vmin,32px)",
      display: "flex", flexDirection: "column", alignItems: "center", overflowX: "hidden",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(18px,3vmin,30px)", animation: "worldFadeIn 0.8s ease both" }}>
        <p style={{
          fontFamily: "'Righteous',sans-serif", fontSize: "clamp(13px,2.2vmin,17px)",
          letterSpacing: "0.35em", margin: "0 0 6px", fontWeight: 700,
          background: "linear-gradient(90deg, #a78bfa, #ec4899, #f97316)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 2px 4px rgba(124,58,237,0.3))",
        }}>
          SELAMAT DATANG DI
        </p>
        <h1 style={{
          fontFamily: "'Righteous','Arial Black',sans-serif",
          fontSize: "clamp(40px,8vmin,68px)",
          margin: "0 0 10px", lineHeight: 1.05,
          background: "linear-gradient(135deg, #fbbf24 0%, #f97316 25%, #ec4899 50%, #a78bfa 75%, #38bdf8 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "worldShimmer 4s ease-in-out infinite",
          filter: "drop-shadow(0 4px 0 rgba(37,48,87,0.5)) drop-shadow(0 8px 20px rgba(236,72,153,0.35))",
        }}>
          PRIMA WORLD
        </h1>
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.92)", border: `3px solid ${NAVY}`, borderRadius: 18,
          boxShadow: `0 5px 0 ${NAVY}, 0 10px 24px rgba(37,48,87,0.15)`,
          padding: "10px 24px",
        }}>
          <p style={{
            fontFamily: "'Nunito',sans-serif", fontSize: "clamp(14px,2.4vmin,17px)",
            fontWeight: 800, color: "#334155", margin: 0, textAlign: "center",
          }}>
            Pilih tempat yang ingin kamu masuki — setiap gedung punya petualangan berbeda!
          </p>
        </div>
      </div>

      {/* Building cards */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "clamp(14px,2.6vmin,24px)", width: "100%", maxWidth: 1180,
      }}>
        {LOCS.map((loc, i) => {
          const active = sel?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => { gameAudio.sfx("select"); setSel(loc); }}
              style={{
                flex: "1 1 200px", maxWidth: 260,
                background: "white",
                border: `5px solid ${NAVY}`,
                borderRadius: 26,
                padding: "22px 18px 18px",
                cursor: "pointer",
                textAlign: "center",
                transform: active ? "translateY(-10px) scale(1.04)" : "translateY(0)",
                boxShadow: active ? `0 14px 0 ${NAVY}, 0 22px 40px rgba(37,48,87,0.3)` : `0 9px 0 ${NAVY}, 0 14px 26px rgba(37,48,87,0.22)`,
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                animation: `riseIn 0.5s ${i * 0.09}s ease both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                width: "clamp(74px,11vmin,92px)", height: "clamp(74px,11vmin,92px)",
                margin: "0 auto 12px", borderRadius: 24,
                background: loc.gradient,
                border: `4px solid ${NAVY}`,
                boxShadow: `0 6px 0 ${loc.shadow}, inset 0 4px 0 rgba(255,255,255,0.45)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(36px,6vmin,48px)",
                transform: active ? "scale(1.08) rotate(-4deg)" : "scale(1)",
                transition: "all 0.25s",
              }}>
                {loc.icon}
              </div>
              <p style={{
                fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(19px,3.2vmin,24px)",
                color: "#1e293b", margin: "0 0 4px", letterSpacing: "0.02em",
              }}>
                {loc.name}
              </p>
              <span style={{
                display: "inline-block",
                fontFamily: "'Nunito',sans-serif", fontSize: "clamp(11px,1.8vmin,13px)",
                fontWeight: 800, color: "white", letterSpacing: "0.06em",
                background: loc.gradient, border: `3px solid ${NAVY}`,
                borderRadius: 999, padding: "3px 14px",
              }}>
                {loc.sub.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div style={{ width: "100%", maxWidth: 640, minHeight: 150, marginTop: 26 }}>
        {sel && (
          <div key={sel.id} style={{
            background: "white", borderRadius: 24, padding: "20px 26px",
            border: `5px solid ${NAVY}`, boxShadow: `0 10px 0 ${NAVY}, 0 18px 36px rgba(37,48,87,0.25)`,
            animation: "riseIn 0.3s ease both",
          }}>
            <p style={{
              fontFamily: "'Righteous',sans-serif", fontSize: 14, letterSpacing: "0.14em",
              color: "#64748b", margin: "0 0 8px", fontWeight: 700,
            }}>
              {sel.icon} {sel.sub.toUpperCase()}
            </p>
            <p style={{
              fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700,
              color: "#334155", margin: "0 0 18px", lineHeight: 1.6,
            }}>
              {sel.desc}
            </p>
            <button
              onClick={() => { gameAudio.sfx("click"); router.push(sel.href); }}
              style={{
                width: "100%", padding: "16px 0", borderRadius: 18,
                background: sel.gradient, border: `5px solid ${NAVY}`,
                color: "white", fontFamily: "'Righteous','Arial Black',sans-serif",
                fontSize: 19, cursor: "pointer",
                boxShadow: `0 7px 0 ${sel.shadow}`,
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = "translateY(5px)"; e.currentTarget.style.boxShadow = `0 2px 0 ${sel.shadow}`; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 7px 0 ${sel.shadow}`; }}
            >
              MASUK {sel.name.toUpperCase()} ?
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes riseIn { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes worldShimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes worldFadeIn { 0% { opacity: 0; transform: translateY(-16px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </main>
  );
}
