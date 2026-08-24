import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES, CHARACTERS } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

const COLOR: Record<string, string> = Object.fromEntries(
  CHARACTERS.map((c) => [c.key, c.color])
);

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const epId = Number(id);
  const episode = EPISODES.find((e) => e.id === epId);
  if (!episode) notFound();

  const p = await currentParticipant();
  const total = EPISODES.length;

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        {/* Top nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <Link href="/world" style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
            color: "#c084fc", textDecoration: "none",
          }}>← PRIMA CITY</Link>
          <span style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
          }}>Episode {epId}/{total}</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #7c3aed, #ec4899)", width: `${(epId / total) * 100}%` }} />
        </div>

        {/* Episode header */}
        <div style={{
          padding: "16px", borderRadius: "16px", marginBottom: "16px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: "6px",
            background: "rgba(255,255,255,0.1)", fontFamily: "'Nunito', sans-serif",
            fontSize: "0.6rem", fontWeight: 800, color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>{episode.subtitle}</span>
          <h1 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
            margin: "8px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>{episode.title}</h1>
        </div>

        {/* Dialogue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {episode.panels.map((panel, i) => {
            const color = COLOR[panel.speaker] ?? "#78909C";
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                padding: "12px", borderRadius: "14px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)",
                animation: `slideIn 0.3s ${i * 0.06}s ease-out both`,
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800,
                  color: "white",
                }}>{panel.speaker.slice(0, 3)}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800,
                    letterSpacing: "0.08em", color: color, textTransform: "uppercase", margin: 0,
                  }}>{panel.speaker}</p>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
                    color: "rgba(255,255,255,0.85)", margin: "4px 0 0", lineHeight: 1.6,
                  }}>{panel.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision */}
        {p ? (
          <EpisodeDecision episode={episode} />
        ) : (
          <div style={{
            padding: "1.25rem", borderRadius: "16px",
            background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "white", margin: 0 }}>
              📝 Buat profil dulu buat simpan progres
            </p>
            <div style={{ marginTop: "10px" }}><RegisterForm /></div>
          </div>
        )}

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
          {epId > 1 ? (
            <Link href={`/journey/${epId - 1}`} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
              color: "rgba(255,255,255,0.4)", textDecoration: "none",
            }}>← Episode sebelumnya</Link>
          ) : <span />}
          <Link href="/world" style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
            color: "rgba(255,255,255,0.4)", textDecoration: "none",
          }}>Peta →</Link>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { 0% { opacity: 0; transform: translateX(-10px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
