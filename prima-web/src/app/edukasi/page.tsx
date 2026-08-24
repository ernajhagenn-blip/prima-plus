import { requireParticipantAt } from "@/lib/flow";
import { getEduModules } from "@/lib/db";
import { completeEdu } from "@/app/actions";
import EduModuleList from "@/components/EduModuleList";

export default async function EdukasiPage() {
  const p = await requireParticipantAt("/edukasi");
  const modules = getEduModules();

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <div style={{
          marginBottom: "1.5rem", padding: "1.5rem", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(16,185,129,0.2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
            background: "linear-gradient(180deg, #10b981, #06b6d4)", borderRadius: "20px 0 0 20px" }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "8px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
            color: "white", letterSpacing: "0.05em",
          }}>📚 KNOWLEDGE CENTER</span>
          <h1 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
            margin: "8px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>🧠 Materi Kesadaran BerBahasa</h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700,
            color: "rgba(255,255,255,0.5)", margin: "4px 0 0",
          }}>{p.name} · Kelas {p.kelas}</p>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.6)", margin: "12px 0 0", lineHeight: 1.6,
          }}>
            Bacalah keenam modul berikut dengan saksama. Setiap modul berisi kasus
            nyata yang relevan dengan kehidupan sehari-harimu.
          </p>
        </div>

        {modules.length === 0 ? (
          <div style={{
            padding: "1.5rem", borderRadius: "20px",
            background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(251,191,36,0.2)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 700,
            color: "#fbbf24",
          }}>⚠️ Belum ada materi edukasi. Silakan lanjut ke kuis.</div>
        ) : (
          <EduModuleList modules={modules} />
        )}

        <form action={completeEdu} style={{ marginTop: "1.5rem" }}>
          <button type="submit" style={{
            width: "100%", padding: "14px", borderRadius: "16px",
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "0.9rem", fontWeight: 900, color: "white", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #10b981, #059669)",
            boxShadow: "0 4px 0 #047857, 0 6px 16px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            transition: "all 0.15s",
          }}>
            🚀 Saya sudah membaca semua modul — Lanjut ke Kuis →
          </button>
        </form>
      </div>
    </div>
  );
}
