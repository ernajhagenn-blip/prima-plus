import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import {
  GAME_CHAT_CRASH,
  GAME_CAPTION_GARAGE,
  GAME_BATTLE_CARD,
  GAME_MEANING_DETECTIVE,
  GAME_CONTEXT_SWITCH,
  GAME_CODE_MIX,
  SCENARIOS,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const GAMES = [
  { href: "/games/language-kart", name: "Language Kart", zone: "MAIN GAME · PRIMA CIRCUIT", desc: "Race melewati checkpoint situasi bahasa." },
  { href: "/games/code-mix-mirror", name: "Code-Mix Mirror", zone: "PRIMA CIRCUIT", desc: "Lihat kebiasaan bahasamu." },
  { href: "/games/context-switch", name: "Context Switch", zone: "PRIMA CIRCUIT", desc: "Ubah satu pesan untuk empat situasi." },
  { href: "/games/chat-crash", name: "Chat Crash", zone: "PRIMA CIRCUIT", desc: "Perbaiki komunikasi yang salah." },
  { href: "/games/caption-garage", name: "Caption Garage", zone: "MEDIA LAB", desc: "Buat pesan yang tepat untuk audiensmu." },
  { href: "/games/meaning-detective", name: "Meaning Detective", zone: "SOCIAL STREET", desc: "Cari maksud di balik sebuah pesan." },
  { href: "/games/battle-card", name: "Language Battle", zone: "PRIMA CIRCUIT", desc: "Pertahankan pilihanmu dengan alasan." },
  { href: "/games/lompat-kata", name: "Lompat Kata", zone: "SOCIAL STREET", desc: "Platformer: lompat, kumpul kata, tembus finish." },
];

export default async function GamesIndexPage() {
  const p = await currentParticipant();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/world" className="text-xs font-semibold text-cyan-300">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Mini Games & Arena</h1>
        <p className="mt-1 text-sm text-gray-600">
          Satu kart utama dan enam tantangan. Main bebas — progres tersimpan.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {GAMES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-red-500"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">
              {g.zone}
            </p>
            <p className="mt-1 text-base font-bold text-gray-900">{g.name}</p>
            <p className="mt-1 text-xs text-gray-600">{g.desc}</p>
          </Link>
        ))}
      </div>

      {!p && (
        <p className="mt-4 text-xs text-gray-400">
          Buat profil di PRIMA CITY untuk menyimpan skor & kartu.
        </p>
      )}
    </div>
  );
}
