import { requireParticipantAt } from "@/lib/flow";
import { getGameScenarios, getGameReflectionQuestions } from "@/lib/db";
import { GameForm } from "@/components/GameForm";

export default async function GamePage() {
  const p = await requireParticipantAt("/game");
  const scenarios = await getGameScenarios();
  const reflectionQuestions = (await getGameReflectionQuestions()).map((r) => r.question);

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <div style={{
          marginBottom: "1.5rem", padding: "1.5rem", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(168,85,247,0.2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
            background: "linear-gradient(180deg, #8b5cf6, #ec4899)", borderRadius: "20px 0 0 20px" }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "8px",
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
            color: "white", letterSpacing: "0.05em",
          }}>⚔️ TAHAP 2 / 4</span>
          <h1 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
            margin: "8px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>🎮 Kuis PRIMA+</h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700,
            color: "rgba(255,255,255,0.5)", margin: "4px 0 0",
          }}>Responden: {p.name} · Kelas {p.kelas}</p>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.6)", margin: "12px 0 0", lineHeight: 1.6,
          }}>
            Baca setiap kasus bahasa, pilih respons yang paling sesuai dengan konteks,
            lalu pelajari umpan baliknya.
          </p>
        </div>

        <div style={{
          padding: "1.5rem", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(168,85,247,0.2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
            background: "linear-gradient(180deg, #8b5cf6, #ec4899)", borderRadius: "20px 0 0 20px" }} />
          <GameForm scenarios={scenarios} reflectionQuestions={reflectionQuestions} />
        </div>
      </div>
    </div>
  );
}
