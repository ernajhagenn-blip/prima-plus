import { requireParticipantAt } from "@/lib/flow";
import { LIKERT_OPTIONS } from "@/lib/data";
import { getPretestItems } from "@/lib/db";
import { submitPosttest } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function PosttestPage() {
  const p = await requireParticipantAt("/posttest");
  const items = await getPretestItems();

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <div style={{
          marginBottom: "1.5rem", padding: "1.5rem", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(249,115,22,0.2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
            background: "linear-gradient(180deg, #f97316, #ef4444)", borderRadius: "20px 0 0 20px" }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "8px",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
            color: "white", letterSpacing: "0.05em",
          }}>🔥 TAHAP 3 / 4</span>
          <h1 style={{
            fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif",
            fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 900, color: "white",
            margin: "8px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>📝 Posttest Loyalitas Berbahasa</h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700,
            color: "rgba(255,255,255,0.5)", margin: "4px 0 0",
          }}>Responden: {p.name} · Kelas {p.kelas}</p>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600,
            color: "rgba(255,255,255,0.6)", margin: "12px 0 0", lineHeight: 1.6,
          }}>
            Kuesioner ini mengukur sikap dan loyalitas berbahasa Indonesia setelah
            menggunakan PRIMA+. Jawablah sesuai keadaanmu saat ini.
          </p>
        </div>

        <div style={{
          padding: "1.5rem", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(249,115,22,0.2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
            background: "linear-gradient(180deg, #f97316, #ef4444)", borderRadius: "20px 0 0 20px" }} />
          <QuestionnaireForm
            action={submitPosttest}
            items={items}
            options={LIKERT_OPTIONS}
            namePrefix="q"
            instructions="Pilihlah salah satu: SS = Sangat Setuju, S = Setuju, TS = Tidak Setuju, STS = Sangat Tidak Setuju."
            submitLabel="🏆 Simpan Jawaban Posttest"
            dimensionByItem={Object.fromEntries(items.map((i) => [i.id, i.dimension]))}
          />
        </div>
      </div>
    </div>
  );
}
