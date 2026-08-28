import { requireParticipantAt } from "@/lib/flow";
import { getParticipant } from "@/lib/db";

export default async function SelesaiPage() {
  const p = await requireParticipantAt("/selesai");
  const full = await getParticipant(p.id) as unknown as {
    code: string;
    pretest_total: number | null;
    posttest_total: number | null;
    game_score: number | null;
    game_max: number | null;
  } | null;

  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{
        width: "100%", maxWidth: "28rem", padding: "2rem", borderRadius: "24px", textAlign: "center",
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(16,185,129,0.2)",
        animation: "cardEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 1rem",
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.5rem", boxShadow: "0 4px 0 #047857, 0 8px 24px rgba(16,185,129,0.3)",
        }}>🎉</div>
        <h1 style={{
          fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
          fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 900, color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)", margin: 0,
        }}>🏆 Selesai juga, {p.name}!</h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
          color: "rgba(255,255,255,0.6)", margin: "8px 0 0",
        }}>
          Semua skor udah tersimpan. Kode: <span style={{ color: "#c084fc", fontWeight: 800 }}>{full?.code}</span>
        </p>

        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { icon: "🎯", label: "Pretest", value: `${full?.pretest_total ?? "-"}`, gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
            { icon: "⚔️", label: "Kuis PRIMA+", value: `${full?.game_score ?? "-"} / ${full?.game_max ?? "-"}`, gradient: "linear-gradient(135deg, #8b5cf6, #c084fc)" },
            { icon: "🔥", label: "Posttest", value: `${full?.posttest_total ?? "-"}`, gradient: "linear-gradient(135deg, #f97316, #ef4444)" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: "12px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem",
                }}>{item.icon}</div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
              </div>
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1rem", fontWeight: 900, color: "white" }}>{item.value}</span>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 600,
          color: "rgba(255,255,255,0.35)", marginTop: "1.5rem",
        }}>Kamu bisa tutup ini. Makasih udah ikutan! 🎊</p>
      </div>

      <style>{`
        @keyframes cardEntrance {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
