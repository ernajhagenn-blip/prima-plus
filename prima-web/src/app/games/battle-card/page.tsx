import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { GAME_BATTLE_CARD } from "@/lib/data";
import ScenarioGame from "@/components/ScenarioGame";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function BattleCardPage() {
  const p = await currentParticipant();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          PRIMA CIRCUIT · Game 6
        </p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          Language Battle Card
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Hadapi mitos tentang bahasa dengan argumen rasional, bukan serangan.
          Latih Critical Choice & Language Identity.
        </p>
      </div>
      {p ? (
        <ScenarioGame
          title="Language Battle Card"
          subtitle="PRIMA CIRCUIT"
          intro=""
          scenarios={GAME_BATTLE_CARD}
          gameKey="battle_card"
          cardReward="Kebanggaan Bahasa"
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
