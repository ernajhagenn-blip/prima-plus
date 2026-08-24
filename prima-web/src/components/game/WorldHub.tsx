"use client";

import { useRouter } from "next/navigation";

const ZONES = [
  { id: "story", icon: "📖", name: "Story Mode", desc: "Pilih jalan ceritamu. Keputusanmu nentuin karakter.", href: "/journey/1", gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", shadow: "#5b21b6" },
  { id: "kart", icon: "🏎️", name: "PRIMA Kart", desc: "Balapan lewat situasi bahasa. Cepat dan jeli!", href: "/select", gradient: "linear-gradient(135deg, #f43f5e, #fb923c)", shadow: "#be123c" },
  { id: "tower", icon: "🗼", name: "Challenge Tower", desc: "6 lantai tantangan. Naik terus atau stuck?", href: "/games/challenge-tower", gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)", shadow: "#6d28d9" },
  { id: "arcade", icon: "🎮", name: "Mini Arcade", desc: "6 mini game seru. Latihan bahasa sambil main.", href: "/games", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)", shadow: "#0891b2" },
  { id: "garage", icon: "🔧", name: "Garage", desc: "Koleksi & upgrade. Makin kuat, makin kenceng.", href: "/kart", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", shadow: "#d97706" },
  { id: "knowledge", icon: "📚", name: "Learn Hub", desc: "Baca dulu biar makin ngerti. Nggak wajib, tapi ngebantu.", href: "/edukasi", gradient: "linear-gradient(135deg, #10b981, #06b6d4)", shadow: "#059669" },
];

export default function WorldHub({
  episodesDone = 0, total = 6, cards = 0,
  gameScores = {} as Record<string, number>, playerName = "",
}: {
  episodesDone?: number; total?: number; cards?: number;
  gameScores?: Record<string, number>; playerName?: string;
}) {
  const router = useRouter();
  const pct = total > 0 ? Math.round((episodesDone / total) * 100) : 0;
  const level = Math.floor(episodesDone / 2) + 1;
  const stars = Object.values(gameScores).reduce((a, b) => a + b, 0) + cards * 5;

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.5rem", animation: "slideDown 0.5s ease-out both",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: "linear-gradient(135deg, #f43f5e, #fb923c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem", boxShadow: "0 3px 0 #be123c, 0 4px 12px rgba(0,0,0,0.3)",
          }}>🧑‍🚀</div>
          <div>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "white",
            }}>{playerName || "Petualang"}</p>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
            }}>Lv.{level} · {stars} ⭐</p>
          </div>
        </div>
        <button onClick={() => router.push("/")} style={{
          padding: "8px 16px", borderRadius: "10px",
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
          color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)", cursor: "pointer",
        }}>🏠 Home</button>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem", animation: "slideDown 0.5s 0.1s ease-out both" }}>
        <h1 style={{
          fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
          fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, color: "white",
          textShadow: "0 2px 0 rgba(0,0,0,0.3), 0 4px 16px rgba(124,58,237,0.3)",
          margin: 0, lineHeight: 1.1,
        }}>
          PRIMA CITY
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700,
          color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", margin: "4px 0 0",
        }}>PILIH PETUALANGANMU!</p>
      </div>

      {/* Progress bar */}
      <div style={{
        maxWidth: "40rem", margin: "0 auto 1.5rem", padding: "14px 18px", borderRadius: "16px",
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: "slideUp 0.5s 0.2s ease-out both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
            color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em",
          }}>🗺️ PROGRESS</span>
          <span style={{
            fontFamily: "'Righteous', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#c084fc",
          }}>{pct}%</span>
        </div>
        <div style={{
          height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: "3px", width: `${pct}%`,
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            transition: "width 1s ease-out",
            boxShadow: "0 0 12px rgba(124,58,237,0.5)",
          }} />
        </div>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Episode: <span style={{ color: "white" }}>{episodesDone}/{total}</span>
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Bintang: <span style={{ color: "#facc15" }}>{stars}</span>
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Kartu: <span style={{ color: "white" }}>{cards}</span>
          </p>
        </div>
      </div>

      {/* Zone grid */}
      <div style={{
        maxWidth: "50rem", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px",
      }}>
        {ZONES.map((zone, i) => (
          <button
            key={zone.id}
            onClick={() => router.push(zone.href)}
            style={{
              borderRadius: "16px", border: "none", cursor: "pointer", textAlign: "left",
              background: zone.gradient, padding: 0, overflow: "hidden",
              boxShadow: `0 4px 0 ${zone.shadow}, 0 8px 20px rgba(0,0,0,0.3)`,
              transition: "all 0.2s",
              animation: `slideUp 0.5s ${0.3 + i * 0.07}s ease-out both`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 0 ${zone.shadow}, 0 12px 28px rgba(0,0,0,0.35)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 0 ${zone.shadow}, 0 8px 20px rgba(0,0,0,0.3)`; }}
          >
            {/* Glossy highlight */}
            <div style={{
              height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
              pointerEvents: "none", borderRadius: "16px 16px 0 0", position: "absolute", top: 0, left: 0, right: 0,
            }} />
            <div style={{ padding: "18px 16px", position: "relative" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", marginBottom: "10px",
              }}>{zone.icon}</div>
              <h2 style={{
                fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
                fontSize: "1rem", fontWeight: 900, color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)", margin: 0, letterSpacing: "0.02em",
              }}>{zone.name}</h2>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: "0.72rem", fontWeight: 600,
                color: "rgba(255,255,255,0.85)", margin: "6px 0 0", lineHeight: 1.5,
              }}>{zone.desc}</p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                marginTop: "10px", padding: "5px 12px", borderRadius: "8px",
                background: "rgba(255,255,255,0.2)",
                fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 800,
                color: "white", letterSpacing: "0.05em",
              }}>
                MASUK <span style={{ transition: "transform 0.2s" }}>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "2rem", animation: "fadeIn 0.8s 1s ease-out both" }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 700,
          letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)",
        }}>PRIMA+ · BAHASA KITA, PILIHAN KITA</p>
      </div>

      <style>{`
        @keyframes slideDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
