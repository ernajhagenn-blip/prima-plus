import Link from "next/link";
import { notFound } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { EPISODES } from "@/lib/data";
import EpisodeDecision from "@/components/EpisodeDecision";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          {episode.subtitle}
        </p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          {episode.title}
        </h1>
      </div>

      <div className="mt-4 space-y-3">
        {episode.panels.map((panel, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-700 text-xs font-black text-white">
              {panel.speaker.slice(0, 3)}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">{panel.speaker}</p>
              <p className="text-sm text-gray-800">{panel.text}</p>
            </div>
          </div>
        ))}
      </div>

      {p ? (
        <EpisodeDecision episode={episode} />
      ) : (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-900">
            Buat profil untuk menyimpan progres episode
          </p>
          <div className="mt-3">
            <RegisterForm />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {prev ? (
          <Link
            href={`/episode/${prev.id}`}
            className="text-xs font-semibold text-gray-500"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/episode/${next.id}`}
            className="text-xs font-semibold text-red-700"
          >
            Episode berikutnya →
          </Link>
        ) : (
          <Link href="/profil" className="text-xs font-semibold text-red-700">
            Lihat Profil →
          </Link>
        )}
      </div>
    </div>
  );
}
