import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { BOSS_ROUNDS } from "@/lib/data";
import BossBattle from "@/components/BossBattle";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function BossPage() {
  const p = await currentParticipant();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
          FUTURE DISTRICT
        </p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          Boss: AUTO-PILOT
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          AUTO-PILOT adalah boss simbolik yang selalu menjawab “karena semua orang
          begitu”. Kalahkan dia dalam 6 ronde dengan membuktikan bahwa bahasa
          adalah keputusan sadar, bukan kebiasaan otomatis.
        </p>
      </div>
      {p ? (
        <BossBattle rounds={BOSS_ROUNDS} />
      ) : (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-900">
            Buat profil untuk menantang boss
          </p>
          <div className="mt-3">
            <RegisterForm />
          </div>
        </div>
      )}
    </div>
  );
}
