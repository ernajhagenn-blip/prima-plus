import { requireParticipantAt } from "@/lib/flow";
import { getEduModules } from "@/lib/db";
import { completeEdu } from "@/app/actions";
import EduModuleList from "@/components/EduModuleList";

export default async function EdukasiPage() {
  const p = await requireParticipantAt("/edukasi");
  const modules = getEduModules();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="relative mb-6 overflow-hidden rounded-3xl border-2 border-red-200 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-gradient-to-b from-red-500 to-pink-500" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-black text-white shadow-md">
          📚 KNOWLEDGE CENTER
        </span>
        <h1 className="mt-2 text-2xl font-black text-gray-900">
          🧠 Materi Kesadaran BerBahasa
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
        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-900 backdrop-blur-sm shadow-md">
          ⚠️ Belum ada materi edukasi. Silakan lanjut ke kuis.
        </div>
      ) : (
        <EduModuleList modules={modules} />
      )}

      <form action={completeEdu} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-pink-500 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:from-red-700 hover:to-pink-600 hover:shadow-xl active:scale-[0.98]"
          style={{ boxShadow: "0 4px 0 #B71C1C, inset 0 2px 0 rgba(255,255,255,0.3)" }}
        >
          🚀 Saya sudah membaca semua modul — Lanjut ke Kuis →
        </button>
      </form>
    </div>
  );
}
