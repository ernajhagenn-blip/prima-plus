import { requireParticipantAt } from "@/lib/flow";
import { getGameScenarios, getGameReflectionQuestions } from "@/lib/db";
import { GameForm } from "@/components/GameForm";

export default async function GamePage() {
  const p = await requireParticipantAt("/game");
  const scenarios = await getGameScenarios();
  const reflectionQuestions = (await getGameReflectionQuestions()).map((r) => r.question);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Kuis PRIMA+</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas} — tahap 2 dari 4
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Baca setiap kasus bahasa, pilih respons yang paling sesuai dengan konteks,
          lalu pelajari umpan baliknya. Terakhir, tuliskan alasan singkat pada bagian
          refleksi.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <GameForm scenarios={scenarios} reflectionQuestions={reflectionQuestions} />
      </div>
    </div>
  );
}