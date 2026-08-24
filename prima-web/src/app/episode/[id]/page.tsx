import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

const SPEAKER_COLORS: Record<string, { bg: string; light: string; text: string }> = {
  NARA: { bg: "#42A5F5", light: "#E3F2FD", text: "#1565C0" },
  RAGA: { bg: "#FFA726", light: "#FFF3E0", text: "#E65100" },
  KIRA: { bg: "#AB47BC", light: "#F3E5F5", text: "#7B1FA2" },
  BIMO: { bg: "#66BB6A", light: "#E8F5E9", text: "#2E7D32" },
  ALYA: { bg: "#26C6DA", light: "#E0F7FA", text: "#00838F" },
  DAVA: { bg: "#EF5350", light: "#FFEBEE", text: "#C62828" },
  MIRA: { bg: "#EC407A", light: "#FCE4EC", text: "#AD1457" },
  SENA: { bg: "#FFD54F", light: "#FFFDE7", text: "#F57F17" },
  NARATOR: { bg: "#78909C", light: "#ECEFF1", text: "#455A64" },
  MENTOR: { bg: "#FF7043", light: "#FBE9E7", text: "#BF360C" },
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
    <div className="w-full px-3 py-3 sm:px-5 lg:px-8 max-w-7xl mx-auto">
      {/* Top nav */}
      <div className="mb-3 flex items-center justify-between">
        <Link href="/world" className="inline-flex items-center gap-1.5 rounded-xl bg-white/60 px-3 py-1.5 text-xs font-black text-blue-600 shadow-sm backdrop-blur-sm transition hover:bg-white/80">
          ← PRIMA CITY
        </Link>
        <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold text-gray-500 backdrop-blur-sm">
          Episode {episode.id}/6
        </span>
      </div>

      {/* Episode header card */}
      <div
        className="mb-4 overflow-hidden rounded-2xl shadow-lg"
        style={{
          background: "linear-gradient(135deg, #EF5350 0%, #FF7043 50%, #FFB300 100%)",
          border: "3px solid rgba(255,255,255,0.4)",
          boxShadow: "0 4px 0 #BF360C, 0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div className="relative p-4 sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
              {episode.subtitle}
            </span>
            <h1 className="mt-2 text-xl font-black text-white drop-shadow-md sm:text-2xl">
              {episode.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main content: two-column on desktop */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Left: Dialogue — takes 3 columns */}
        <div className="space-y-2 lg:col-span-3">
          {episode.panels.map((panel, i) => {
            const sp = SPEAKER_COLORS[panel.speaker] || SPEAKER_COLORS.NARATOR;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 transition-all"
                style={{
                  background: sp.light,
                  border: `2px solid ${sp.bg}30`,
                  animation: `slideIn 0.3s ${i * 0.08}s ease-out both`,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-black text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${sp.bg}, ${sp.bg}cc)` }}
                >
                  {panel.speaker.slice(0, 3)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: sp.text }}>
                    {panel.speaker}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-800">{panel.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Decision + actions — takes 2 columns */}
        <div className="space-y-3 lg:col-span-2">
          {p ? (
            <EpisodeDecision episode={episode} />
          ) : (
            <div className="rounded-2xl border-2 border-blue-200 bg-white/80 p-4 shadow-md backdrop-blur-md">
              <p className="text-xs font-black text-gray-800">📝 Buat profil dulu untuk simpan progres</p>
              <div className="mt-2">
                <RegisterForm />
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-2">
            {prev ? (
              <Link href={`/episode/${prev.id}`} className="rounded-xl bg-white/60 px-4 py-2 text-[11px] font-bold text-gray-500 shadow-sm backdrop-blur-sm transition hover:bg-white/80">
                ← {prev.title.slice(0, 20)}...
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/journey/${next.id}`} className="rounded-xl px-4 py-2 text-[11px] font-black text-white shadow-md transition hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #EF5350, #FF7043)", boxShadow: "0 3px 0 #BF360C, 0 4px 12px rgba(0,0,0,0.15)" }}>
                Episode berikutnya →
              </Link>
            ) : (
              <Link href="/world" className="rounded-xl px-4 py-2 text-[11px] font-black text-white shadow-md transition hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #66BB6A, #43A047)", boxShadow: "0 3px 0 #2E7D32, 0 4px 12px rgba(0,0,0,0.15)" }}>
                Kembali ke PRIMA City →
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { 0% { opacity: 0; transform: translateX(-12px); } 100% { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
