import { requireParticipantAt } from "@/lib/flow";
import { LIKERT_OPTIONS } from "@/lib/data";
import { getPretestItems } from "@/lib/db";
import { submitPosttest } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function PosttestPage() {
  const p = await requireParticipantAt("/posttest");
  const items = await getPretestItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Posttest Loyalitas Berbahasa</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas} — tahap 3 dari 4
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Kuesioner ini mengukur sikap dan loyalitas berbahasa Indonesia setelah
          menggunakan PRIMA+. Jawablah sesuai keadaanmu saat ini.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <QuestionnaireForm
          action={submitPosttest}
          items={items}
          options={LIKERT_OPTIONS}
          namePrefix="q"
          instructions="Pilihlah salah satu: SS = Sangat Setuju, S = Setuju, TS = Tidak Setuju, STS = Sangat Tidak Setuju."
          submitLabel="Simpan Jawaban Posttest"
          dimensionByItem={Object.fromEntries(items.map((i) => [i.id, i.dimension]))}
        />
      </div>
    </div>
  );
}