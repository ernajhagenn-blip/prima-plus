import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

const SPEAKER_COLORS: Record<string, string> = {
  NARA: "#42A5F5",
  RAGA: "#FFA726",
  KIRA: "#AB47BC",
  BIMO: "#66BB6A",
  ALYA: "#26C6DA",
  DAVA: "#EF5350",
  MIRA: "#EC407A",
  SENA: "#FFD54F",
  NARATOR: "#78909C",
  MENTOR: "#FF7043",
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
    <div className="mx-auto max-w-2xl px-3 py-4">
      <Link href="/world" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700">
        ← PRIMA CITY
      </Link>

      <div className="mt-2 rounded-2xl border-2 border-rose-200 bg-white/80 p-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
            EP {episode.id}/6
          </span>
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-600">
            {episode.subtitle}
          </span>
        </div>
        <h1 className="mt-1 text-base font-black text-gray-900">{episode.title}</h1>
      </div>

      <div className="mt-3 space-y-2">
        {episode.panels.map((panel, i) => {
          const color = SPEAKER_COLORS[panel.speaker] || "#78909C";
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl border-2 p-3 shadow-sm backdrop-blur-sm"
              style={{
                borderColor: `${color}30`,
                background: `linear-gradient(135deg, ${color}08, ${color}04)`,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
              >
                {panel.speaker.slice(0, 3)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black" style={{ color }}>{panel.speaker}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-800">{panel.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {p ? (
        <EpisodeDecision episode={episode} />
      ) : (
        <div className="mt-3 rounded-2xl border-2 border-rose-200 bg-white/80 p-4 shadow-md backdrop-blur-md">
          <p className="text-xs font-black text-gray-800">📝 Buat profil dulu untuk simpan progres</p>
          <div className="mt-2">
            <RegisterForm />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {prev ? (
          <Link href={`/episode/${prev.id}`} className="text-[11px] font-bold text-gray-400 hover:text-gray-600">← {prev.title}</Link>
        ) : <span />}
        {next ? (
          <Link href={`/journey/${next.id}`} className="rounded-xl bg-gradient-to-r from-red-400 to-orange-400 px-4 py-2 text-[11px] font-black text-white shadow-md hover:shadow-lg">Episode berikutnya →</Link>
        ) : (
          <Link href="/world" className="rounded-xl bg-gradient-to-r from-green-400 to-teal-400 px-4 py-2 text-[11px] font-black text-white shadow-md hover:shadow-lg">Kembali ke PRIMA City →</Link>
        )}
      </div>
    </div>
  );
}
