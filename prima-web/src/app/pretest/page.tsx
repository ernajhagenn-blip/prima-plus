import { requireParticipantAt } from "@/lib/flow";
import { LIKERT_OPTIONS } from "@/lib/data";
import { getPretestItems } from "@/lib/db";
import { submitPretest } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function PretestPage() {
  const p = await requireParticipantAt("/pretest");
  const items = await getPretestItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Pretest Loyalitas Berbahasa</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas} — tahap 1 dari 4
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Kuesioner ini mengukur sikap dan loyalitas berbahasa Indonesia sebelum
          menggunakan PRIMA+. Tidak ada jawaban benar atau salah.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <QuestionnaireForm
          action={submitPretest}
          items={items}
          options={LIKERT_OPTIONS}
          namePrefix="q"
          instructions="Pilihlah salah satu: SS = Sangat Setuju, S = Setuju, TS = Tidak Setuju, STS = Sangat Tidak Setuju."
          submitLabel="Simpan Jawaban Pretest"
          dimensionByItem={Object.fromEntries(items.map((i) => [i.id, i.dimension]))}
        />
      </div>
    </div>
  );
}