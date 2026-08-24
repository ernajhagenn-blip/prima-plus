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
      <Link href="/" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-3xl border-2 border-purple-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-3 py-1 text-xs font-black text-white shadow-md">
          FUTURE DISTRICT
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">
          Boss: AUTO-PILOT
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          AUTO-PILOT adalah boss simbolik yang selalu menjawab &quot;karena semua orang
          begitu&quot;. Kalahkan dia dalam 6 ronde dengan membuktikan bahwa bahasa
          adalah keputusan sadar, bukan kebiasaan otomatis.
        </p>
      </div>
      {p ? (
        <BossBattle rounds={BOSS_ROUNDS} />
      ) : (
        <div className="mt-5 rounded-3xl border-2 border-purple-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
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
