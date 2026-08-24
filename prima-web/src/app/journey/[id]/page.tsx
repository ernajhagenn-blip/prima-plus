import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES, CHARACTERS } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import KaraAvatar from "@/components/KaraAvatar";
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
    <div className="relative min-h-[100dvh] px-4 py-8 text-gray-800">
      <div className="pointer-events-none absolute left-1/3 top-10 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/world" className="text-xs font-semibold text-blue-500">← PRIMA CITY</Link>
          <span className="text-xs text-gray-400">Episode {epId}/{total}</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-rose-400" style={{ width: `${(epId / total) * 100}%` }} />
        </div>

        <div className="mt-5 flex gap-4">
          <div className="hidden shrink-0 sm:block">
            <KaraAvatar className="h-40 w-40" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-500">{episode.subtitle}</p>
            <h1 className="mt-1 text-xl font-black text-gray-900">{episode.title}</h1>

            <div className="mt-4 space-y-3">
              {episode.panels.map((panel, i) => {
                const isKara = panel.speaker === "KARA";
                const color = COLOR[panel.speaker] ?? "#94a3b8";
                return (
                  <div key={i} className={`flex gap-3 ${isKara ? "flex-row-reverse text-right" : ""}`}>
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                      style={{ backgroundColor: color }}
                    >
                      {panel.speaker.slice(0, 3)}
                    </div>
                    <div className={`rounded-2xl border border-gray-200 bg-white/70 p-3 text-sm backdrop-blur-md ${isKara ? "ml-auto" : ""}`}>
                      <p className="text-[10px] font-bold" style={{ color }}>{panel.speaker}</p>
                      <p className="text-gray-700">{panel.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {p ? (
          <EpisodeDecision episode={episode} />
        ) : (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white/70 p-5 backdrop-blur-md">
            <p className="text-sm font-bold text-gray-800">Buat profil untuk menyimpan progres episode</p>
            <div className="mt-3"><RegisterForm /></div>
          </div>
        )}

        {epId > 1 && (
          <Link href={`/journey/${epId - 1}`} className="mt-6 inline-block text-xs text-gray-400">
            ← Episode sebelumnya
          </Link>
        )}
      </div>
    </div>
  );
}
