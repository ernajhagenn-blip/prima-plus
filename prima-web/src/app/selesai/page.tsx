import { requireParticipantAt } from "@/lib/flow";
import { getParticipant } from "@/lib/db";

export default async function SelesaiPage() {
  const p = await requireParticipantAt("/selesai");
  const full = (await getParticipant(p.id)) as unknown as {
    code: string;
    pretest_total: number | null;
    posttest_total: number | null;
    game_score: number | null;
    game_max: number | null;
  } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-black text-gray-900">
          Terima kasih, {p.name}!
        </h1>
        <p className="mt-1 text-gray-600">
          Seluruh tahapan penelitian telah selesai. Jawabanmu sudah tersimpan
          dengan kode responden{" "}
          <span className="font-bold text-gray-900">{full?.code}</span>.
        </p>

        <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-gray-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Skor Pretest (maks. 80)</span>
            <span className="font-bold text-gray-900">{full?.pretest_total ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Skor Kuis PRIMA+</span>
            <span className="font-bold text-gray-900">
              {full?.game_score ?? "-"} / {full?.game_max ?? "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Skor Posttest (maks. 80)</span>
            <span className="font-bold text-gray-900">{full?.posttest_total ?? "-"}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Kamu dapat menutup jendela ini. Terima kasih telah membantu penelitian
          kesadaran berbahasa remaja di lingkungan sekolah.
        </p>
      </div>
    </div>
  );
}