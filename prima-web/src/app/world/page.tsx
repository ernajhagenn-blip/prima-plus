"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Loc {
  id: string;
  name: string;
  sub: string;
  desc: string;
  icon: string;
  href: string;
  color: string;
  glow: string;
}

const LOCS: Loc[] = [
  { id: "kart", name: "KART ARENA", sub: "Stadium", desc: "Sirkuit balapan utama. Pilih kartmu dan buktikan kepekaan bahasamu di kecepatan tinggi.", icon: "🏁", href: "/select", color: "linear-gradient(135deg,#ef4444,#f97316)", glow: "rgba(239,68,68,0.5)" },
  { id: "arcade", name: "ARCADE", sub: "Gedung Permainan", desc: "Permainan ringan tentang kata dan konteks. Cepat, seru, dan penuh jebakan kecil.", icon: "🎮", href: "/games/word-switch", color: "linear-gradient(135deg,#8b5cf6,#d946ef)", glow: "rgba(217,70,239,0.5)" },
  { id: "challenge", name: "CHALLENGE", sub: "Arena Futuristik", desc: "Menara tantangan enam lantai. Hanya pemikir kritis yang sampai puncak.", icon: "🧠", href: "/games/challenge-tower", color: "linear-gradient(135deg,#0ea5e9,#06b6d4)", glow: "rgba(6,182,212,0.5)" },
  { id: "story", name: "STORY WORLD", sub: "Portal Cerita", desc: "Kembali ke awal perjalanan: data, fenomena, dan ruang edukasi.", icon: "📖", href: "/story", color: "linear-gradient(135deg,#22c55e,#84cc16)", glow: "rgba(34,197,94,0.5)" },
  { id: "feedback", name: "FEEDBACK", sub: "Observatorium", desc: "Ruang melihat perjalananmu: skor, kartu, dan refleksi.", icon: "💬", href: "/feedback", color: "linear-gradient(135deg,#f59e0b,#fbbf24)", glow: "rgba(245,158,11,0.5)" },
];

export default function WorldPage() {
  const [sel, setSel] = useState<Loc | null>(null);
  const router = useRouter();

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "radial-gradient(ellipse at 50% 120%, #4c1d95 0%, #1e1b4b 45%, #0b0d22 80%)", padding: "clamp(16px,3vmin,36px)", display: "flex", flexDirection: "column", alignItems: "center", overflowX: "hidden" }}>
      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(11px,2vmin,13px)", letterSpacing: "0.3em", color: "#a78bfa", margin: "0 0 4px", textAlign: "center" }}>
        SELAMAT DATANG DI
      </p>
      <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(30px,6.5vmin,52px)", color: "white", margin: "0 0 6px", textShadow: "0 0 30px rgba(168,85,247,0.6), 0 4px 0 #1c1030" }}>
        PRIMA WORLD
      </h1>
      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(12px,2.2vmin,15px)", color: "rgba(255,255,255,0.55)", margin: "0 0 26px", textAlign: "center", maxWidth: 520, lineHeight: 1.5 }}>
        Pilih tempat yang ingin kamu masuki. Setiap gedung menyimpan pengalaman yang berbeda.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(12px,2.4vmin,20px)", maxWidth: 980, perspective: "1200px" }}>
        {LOCS.map((loc, i) => {
          const active = sel?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSel(loc)}
              style={{
                width: "clamp(160px, 26vmin, 200px)",
                background: active ? loc.color : "rgba(255,255,255,0.05)",
                border: active ? "3px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.15)",
                borderRadius: 22,
                padding: "20px 14px 16px",
                cursor: "pointer",
                textAlign: "center",
                transform: active ? "translateY(-10px) scale(1.05)" : "translateY(0) scale(1)",
                boxShadow: active ? `0 14px 44px ${loc.glow}` : "0 6px 20px rgba(0,0,0,0.35)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                animation: `riseIn 0.5s ${i * 0.09}s ease both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                fontSize: "clamp(34px,6.5vmin,48px)", marginBottom: 8,
                filter: active ? "drop-shadow(0 4px 10px rgba(0,0,0,0.4))" : "grayscale(0.3)",
                transform: active ? "scale(1.15)" : "scale(1)", transition: "all 0.3s",
              }}>
                {loc.icon}
              </div>
              <p style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(13px,2.4vmin,16px)", color: active ? "white" : "rgba(255,255,255,0.92)", margin: "0 0 3px", textShadow: active ? "0 2px 6px rgba(0,0,0,0.4)" : "none", letterSpacing: "0.03em" }}>
                {loc.name}
              </p>
              <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(9px,1.7vmin,11px)", color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.08em" }}>
                {loc.sub}
              </p>
            </button>
          );
        })}
      </div>

      <div style={{ width: "100%", maxWidth: 560, minHeight: 130, marginTop: 24 }}>
        {sel && (
          <div key={sel.id} style={{ background: "rgba(10,12,30,0.75)", borderRadius: 18, padding: "17px 22px", border: `2px solid ${sel.glow.replace("0.5", "0.6")}`, backdropFilter: "blur(10px)", animation: "riseIn 0.35s ease both" }}>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 12, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>
              {sel.icon} {sel.sub.toUpperCase()}
            </p>
            <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "0 0 15px", lineHeight: 1.55 }}>
              {sel.desc}
            </p>
            <button
              onClick={() => { router.push(sel.href); }}
              style={{ width: "100%", padding: "13px 0", borderRadius: 13, background: sel.color, border: "2px solid rgba(255,255,255,0.5)", color: "white", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: `0 6px 22px ${sel.glow}`, transition: "transform 0.12s" }}
              onPointerDown={(e) => { e.currentTarget.style.transform = "translateY(3px)"; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              MASUK {sel.name} ▶
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes riseIn { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
    </main>
  );
}
