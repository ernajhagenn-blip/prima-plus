import { requireParticipantAt } from "@/lib/flow";
import { getParticipant } from "@/lib/db";

export default async function SelesaiPage() {
  const p = await requireParticipantAt("/selesai");
  const full = getParticipant(p.id) as unknown as {
    code: string;
    pretest_total: number | null;
    posttest_total: number | null;
    game_score: number | null;
    game_max: number | null;
  } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border-2 border-green-200 bg-white/70 p-8 text-center shadow-lg backdrop-blur-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-lg" style={{ background: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)", boxShadow: "0 6px 0 #2E7D32, inset 0 2px 0 rgba(255,255,255,0.3)" }}>
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-black text-gray-900">
          Selesai juga, {p.name}!
        </h1>
        <p className="mt-1 text-gray-600">
          Semua skor udah tersimpan. Kode respondenmu:{" "}
          <span className="font-bold text-gray-900">{full?.code}</span>.
        </p>

        <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-white/60 p-4 text-left text-sm backdrop-blur-sm border border-green-100">
          <div className="flex justify-between">
            <span className="text-gray-600">Pretest (maks. 80)</span>
            <span className="font-bold text-gray-900">{full?.pretest_total ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kuis PRIMA+</span>
            <span className="font-bold text-gray-900">
              {full?.game_score ?? "-"} / {full?.game_max ?? "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Posttest (maks. 80)</span>
            <span className="font-bold text-gray-900">{full?.posttest_total ?? "-"}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Kamu bisa tutup ini. Makasih udah ikutan!
        </p>
      </div>
    </div>
  );
}
