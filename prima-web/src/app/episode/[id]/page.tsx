import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

const SPEAKER_COLORS: Record<string, { bg: string; text: string }> = {
  NARA: { bg: "#42A5F5", text: "#42A5F5" },
  RAGA: { bg: "#FFA726", text: "#FFA726" },
  KIRA: { bg: "#AB47BC", text: "#AB47BC" },
  BIMO: { bg: "#66BB6A", text: "#66BB6A" },
  ALYA: { bg: "#26C6DA", text: "#26C6DA" },
  DAVA: { bg: "#EF5350", text: "#EF5350" },
  MIRA: { bg: "#EC407A", text: "#EC407A" },
  SENA: { bg: "#FFD54F", text: "#FFD54F" },
  NARATOR: { bg: "#78909C", text: "#78909C" },
  MENTOR: { bg: "#FF7043", text: "#FF7043" },
};

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const epId = Number(id);
  const episode = EPISODES.find((e) => e.id === epId);
  if (!episode) notFound();

  const p = await currentParticipant();
  const prev = EPISODES.find((e) => e.id === epId - 1);
  const next = EPISODES.find((e) => e.id === epId + 1);

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "50rem", margin: "0 auto" }}>
        {/* Top nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <Link href="/world" style={{
            padding: "6px 14px", borderRadius: "10px", textDecoration: "none",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
            color: "#c084fc",
          }}>← PRIMA CITY</Link>
          <span style={{
            padding: "6px 14px", borderRadius: "10px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
          }}>Episode {episode.id}/6</span>
        </div>

        {/* Episode header */}
        <div style={{
          padding: "18px", borderRadius: "18px", marginBottom: "16px",
          background: "linear-gradient(135deg, rgba(244,63,94,0.25), rgba(251,146,60,0.25))",
          border: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <span style={{
              display: "inline-block", padding: "3px 10px", borderRadius: "6px",
              background: "rgba(255,255,255,0.15)", fontFamily: "'Nunito', sans-serif",
              fontSize: "0.6rem", fontWeight: 800, color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>{episode.subtitle}</span>
            <h1 style={{
              fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
              fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
              margin: "8px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}>{episode.title}</h1>
          </div>
        </div>

        {/* Main content: two-column on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", gap: "16px" }}>
          {/* Left: Dialogue */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {episode.panels.map((panel, i) => {
              const sp = SPEAKER_COLORS[panel.speaker] || SPEAKER_COLORS.NARATOR;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  padding: "12px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)",
                  animation: `slideIn 0.3s ${i * 0.06}s ease-out both`,
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                    background: `linear-gradient(135deg, ${sp.bg}, ${sp.bg}cc)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800,
                    color: "white",
                  }}>{panel.speaker.slice(0, 3)}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800,
                      letterSpacing: "0.08em", color: sp.text, textTransform: "uppercase", margin: 0,
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

          {/* Right: Decision + actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {p ? (
              <EpisodeDecision episode={episode} />
            ) : (
              <div style={{
                padding: "16px", borderRadius: "16px",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "white", margin: 0 }}>
                  📝 Buat profil dulu buat simpan progres
                </p>
                <div style={{ marginTop: "10px" }}><RegisterForm /></div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              {prev ? (
                <Link href={`/episode/${prev.id}`} style={{
                  padding: "8px 14px", borderRadius: "10px", textDecoration: "none",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                }}>← {prev.title.slice(0, 18)}...</Link>
              ) : <span />}
              {next ? (
                <Link href={`/journey/${next.id}`} style={{
                  padding: "8px 14px", borderRadius: "10px", textDecoration: "none",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  boxShadow: "0 3px 0 #5b21b6, 0 4px 12px rgba(124,58,237,0.3)",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 800,
                  color: "white",
                }}>Episode berikutnya →</Link>
              ) : (
                <Link href="/world" style={{
                  padding: "8px 14px", borderRadius: "10px", textDecoration: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 3px 0 #047857, 0 4px 12px rgba(16,185,129,0.3)",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 800,
                  color: "white",
                }}>Kembali ke PRIMA City →</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { 0% { opacity: 0; transform: translateX(-10px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
