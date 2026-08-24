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
      <Link href="/" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>

      <div className="mt-3 rounded-3xl border-2 border-rose-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-3 py-1 text-xs font-black text-white shadow-md">
          {episode.subtitle}
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">
          {episode.title}
        </h1>
      </div>

      <div className="mt-4 space-y-3">
        {episode.panels.map((panel, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border-2 border-rose-100 bg-white/60 p-4 shadow-md backdrop-blur-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-black text-white shadow-sm">
              {panel.speaker.slice(0, 3)}
            </div>
            <div>
              <p className="text-xs font-bold text-rose-500">{panel.speaker}</p>
              <p className="text-sm text-gray-800">{panel.text}</p>
            </div>
          </div>
        ))}
      </div>

      {p ? (
        <EpisodeDecision episode={episode} />
      ) : (
        <div className="mt-5 rounded-3xl border-2 border-rose-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
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
            className="text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/episode/${next.id}`}
            className="text-xs font-bold text-red-500 hover:text-red-600"
          >
            Episode berikutnya →
          </Link>
        ) : (
          <Link href="/profil" className="text-xs font-bold text-red-500 hover:text-red-600">
            Lihat Profil →
          </Link>
        )}
      </div>
    </div>
  );
}
