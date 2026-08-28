import Link from "next/link";
import { redirect } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { getWorldProgress } from "@/lib/db";
import { SKILLS, EPISODES, LANGUAGE_CARDS } from "@/lib/data";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const p = await currentParticipant();
  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="text-xs font-bold text-blue-500 hover:text-blue-600">
          ← PRIMA CITY
        </Link>
        <div className="mt-4 rounded-3xl border-2 border-blue-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
          <h1 className="text-lg font-black text-gray-900">Profil Pemain</h1>
          <p className="mt-1 text-sm text-gray-600">
            Buat profil untuk melacak skill, kartu, dan progres kesadaran
            berbahasamu.
          </p>
          <div className="mt-3">
            <RegisterForm />
          </div>
        </div>
      </div>
    );
  }

  const prog = await getWorldProgress(p.id);
  const ownedSkills = new Set(prog.skills);
  const ownedCards = new Set(prog.cards);
  const eps = new Set(prog.episodesDone);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>

      <div className="mt-3 rounded-3xl border-2 border-blue-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <h1 className="text-xl font-black text-gray-900">{p.name}</h1>
        <p className="text-sm text-gray-500">
          {p.kelas} · Kode {p.code}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Episode" value={`${prog.episodesDone.length}/${EPISODES.length}`} />
          <Stat label="Kartu" value={`${prog.cards.length}/${LANGUAGE_CARDS.length}`} />
          <Stat label="Skill" value={`${prog.skills.length}/${SKILLS.length}`} />
          <Stat label="Boss" value={prog.bossDefeated ? "✓" : "—"} />
        </div>
      </div>

      <Section title="Pohon Skill">
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map((s) => {
            const on = ownedSkills.has(s.key);
            return (
              <div
                key={s.key}
                className={`rounded-xl border-2 p-3 transition-all ${
                  on ? "border-green-300 bg-green-50/70 shadow-md backdrop-blur-sm" : "border-gray-200 bg-white/50"
                }`}
              >
                <p className="text-sm font-bold text-gray-900">
                  {on ? "✓ " : "○ "}
                  {s.name}
                </p>
                <p className="mt-1 text-xs text-gray-600">{s.meaning}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Episode Selesai">
        <div className="space-y-2">
          {EPISODES.map((e) => (
            <div
              key={e.id}
              className={`flex items-center justify-between rounded-xl border-2 p-3 transition-all ${
                eps.has(e.id)
                  ? "border-green-300 bg-green-50/70 shadow-md backdrop-blur-sm"
                  : "border-gray-200 bg-white/50"
              }`}
            >
              <span className="text-sm text-gray-800">{e.title}</span>
              {eps.has(e.id) ? (
                <span className="text-xs font-bold text-green-600">✓ selesai</span>
              ) : (
                <Link
                  href={`/episode/${e.id}`}
                  className="text-xs font-bold text-red-500 hover:text-red-600"
                >
                  mainkan →
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skor Mini-Game">
        <div className="space-y-1 text-sm text-gray-700">
          {Object.keys(prog.gameScores).length === 0 ? (
            <p className="text-xs text-gray-400">Belum ada skor.</p>
          ) : (
            Object.entries(prog.gameScores).map(([g, s]) => (
              <p key={g}>
                <span className="font-semibold">{g}</span>: {s}
              </p>
            ))
          )}
        </div>
      </Section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/episode/1"
          className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-xs font-black text-white shadow-md transition hover:shadow-lg"
          style={{ boxShadow: "0 3px 0 #B71C1C, inset 0 2px 0 rgba(255,255,255,0.3)" }}
        >
          Lanjut Episode
        </Link>
        <Link
          href="/games/language-kart"
          className="rounded-xl border-2 border-red-400 bg-white/60 px-4 py-2 text-xs font-bold text-red-500 backdrop-blur-sm transition hover:bg-white/80"
        >
          Main Game
        </Link>
        <Link
          href="/boss"
          className="rounded-xl border-2 border-purple-300 bg-white/60 px-4 py-2 text-xs font-bold text-purple-500 backdrop-blur-sm transition hover:bg-white/80"
        >
          Tantang Boss
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-cyan-200 bg-white/60 p-3 text-center backdrop-blur-sm shadow-sm">
      <p className="text-lg font-black text-red-500">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-black uppercase tracking-wide text-gray-500">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
