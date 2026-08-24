import { requireParticipantAt } from "@/lib/flow";
import { LIKERT_OPTIONS } from "@/lib/data";
import { getPretestItems } from "@/lib/db";
import { submitPretest } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function PretestPage() {
  const p = await requireParticipantAt("/pretest");
  const items = getPretestItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-3xl border-2 border-cyan-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-xs font-black text-white shadow-md">
          TAHAP 1 / 4
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">Pretest Loyalitas Berbahasa</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Kuesioner ini mengukur sikap dan loyalitas berbahasa Indonesia sebelum
          menggunakan PRIMA+. Tidak ada jawaban benar atau salah.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-cyan-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
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