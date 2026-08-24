import { requireParticipantAt } from "@/lib/flow";
import { LIKERT_OPTIONS } from "@/lib/data";
import { getPretestItems } from "@/lib/db";
import { submitPosttest } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function PosttestPage() {
  const p = await requireParticipantAt("/posttest");
  const items = getPretestItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="relative mb-6 overflow-hidden rounded-3xl border-2 border-orange-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-orange-400 to-red-500" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-3 py-1 text-xs font-black text-white shadow-md">
          🔥 TAHAP 3 / 4
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">📝 Posttest Loyalitas Berbahasa</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Kuesioner ini mengukur sikap dan loyalitas berbahasa Indonesia setelah
          menggunakan PRIMA+. Jawablah sesuai keadaanmu saat ini.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-orange-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-orange-400 to-red-500" />
        <QuestionnaireForm
          action={submitPosttest}
          items={items}
          options={LIKERT_OPTIONS}
          namePrefix="q"
          instructions="Pilihlah salah satu: SS = Sangat Setuju, S = Setuju, TS = Tidak Setuju, STS = Sangat Tidak Setuju."
          submitLabel="🏆 Simpan Jawaban Posttest"
          dimensionByItem={Object.fromEntries(items.map((i) => [i.id, i.dimension]))}
        />
      </div>
    </div>
  );
}
