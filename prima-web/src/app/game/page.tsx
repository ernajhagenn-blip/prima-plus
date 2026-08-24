import { requireParticipantAt } from "@/lib/flow";
import { getGameScenarios, getGameReflectionQuestions } from "@/lib/db";
import { GameForm } from "@/components/GameForm";

export default async function GamePage() {
  const p = await requireParticipantAt("/game");
  const scenarios = getGameScenarios();
  const reflectionQuestions = getGameReflectionQuestions().map((r) => r.question);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-3xl border-2 border-purple-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 px-3 py-1 text-xs font-black text-white shadow-md">
          TAHAP 2 / 4
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">Kuis PRIMA+</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Baca setiap kasus bahasa, pilih respons yang paling sesuai dengan konteks,
          lalu pelajari umpan baliknya. Terakhir, tuliskan alasan singkat pada bagian
          refleksi.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-purple-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <GameForm scenarios={scenarios} reflectionQuestions={reflectionQuestions} />
      </div>
    </div>
  );
}