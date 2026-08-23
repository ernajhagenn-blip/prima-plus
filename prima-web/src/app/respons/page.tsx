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
  const items = await getResponseItems();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Angket Respons/Refleksi</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas} — tahap 4 dari 4
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Sampaikan pengalamanmu menggunakan PRIMA+ pada pernyataan berikut.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <QuestionnaireForm
          action={submitRespons}
          items={items}
          options={RESPONSE_OPTIONS}
          namePrefix="r"
          instructions="Pilihlah salah satu: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Setuju, 4 = Sangat Setuju."
          submitLabel="Simpan Angket Respons"
        />
      </div>
    </div>
  );
}