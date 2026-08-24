import { requireParticipantAt } from "@/lib/flow";
import { getResponseItems } from "@/lib/db";
import { submitRespons } from "@/app/actions";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

const RESPONSE_OPTIONS = [
  { value: "1", label: "1 (STS)" },
  { value: "2", label: "2 (TS)" },
  { value: "3", label: "3 (S)" },
  { value: "4", label: "4 (SS)" },
];

export default async function ResponsPage() {
  const p = await requireParticipantAt("/respons");
  const items = getResponseItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="relative mb-6 overflow-hidden rounded-3xl border-2 border-green-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-green-400 to-emerald-500" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-xs font-black text-white shadow-md">
          ✨ TAHAP 4 / 4
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">💬 Angket Respons/Refleksi</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Sampaikan pengalamanmu menggunakan PRIMA+ pada pernyataan berikut.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-green-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-green-400 to-emerald-500" />
        <QuestionnaireForm
          action={submitRespons}
          items={items}
          options={RESPONSE_OPTIONS}
          namePrefix="r"
          instructions="Pilihlah salah satu: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Setuju, 4 = Sangat Setuju."
          submitLabel="🎯 Simpan Angket Respons"
        />
      </div>
    </div>
  );
}
