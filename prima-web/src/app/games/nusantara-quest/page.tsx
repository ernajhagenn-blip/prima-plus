import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { GAME_NUSANTARA_QUEST } from "@/lib/data";
import ScenarioGame from "@/components/ScenarioGame";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function NusantaraQuestPage() {
  const p = await currentParticipant();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          NUSANTARA ISLAND · Game 8
        </p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          Nusantara Quest
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Jelajahi peran Bahasa Indonesia sebagai jembatan antardaerah yang
          setara, berdampingan dengan bahasa daerah & budaya.
        </p>
      </div>
      {p ? (
        <ScenarioGame
          title="Nusantara Quest"
          subtitle="NUSANTARA ISLAND"
          intro=""
          scenarios={GAME_NUSANTARA_QUEST}
          gameKey="nusantara_quest"
          cardReward="Jembatan Antardaerah"
        />
      ) : (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-900">Buat profil untuk menyimpan skor</p>
          <div className="mt-3">
            <RegisterForm />
          </div>
        </div>
      )}
    </div>
  );
}
