import { requireParticipantAt } from "@/lib/flow";
import { getEduModules } from "@/lib/db";
import { completeEdu } from "@/app/actions";
import EduModuleList from "@/components/EduModuleList";

export default async function EdukasiPage() {
  const p = await requireParticipantAt("/edukasi");
  const modules = getEduModules();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          Tahap Edukasi
        </p>
        <h1 className="mt-1 text-2xl font-black text-gray-900">
          Materi Kesadaran BerBahasa
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {p.name} · Kelas {p.kelas}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Bacalah keenam modul berikut dengan saksama. Setiap modul berisi kasus
          nyata yang relevan dengan kehidupan sehari-harimu. Setelah selesai,
          lanjut ke kuis untuk menguji pemahamanmu.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Belum ada materi edukasi. Silakan lanjut ke kuis.
        </div>
      ) : (
        <EduModuleList modules={modules} />
      )}

      <form action={completeEdu} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-red-800 hover:to-red-700 hover:shadow-lg active:scale-[0.98]"
        >
          Saya sudah membaca semua modul — Lanjut ke Kuis →
        </button>
      </form>
    </div>
  );
}
