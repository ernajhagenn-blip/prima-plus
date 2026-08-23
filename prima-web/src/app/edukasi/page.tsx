import { requireParticipantAt } from "@/lib/flow";
import { getEduModules } from "@/lib/db";
import { completeEdu } from "@/app/actions";

export default async function EdukasiPage() {
  const p = await requireParticipantAt("/edukasi");
  const modules = await getEduModules();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Materi PRIMA+</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responden: {p.name} · Kelas {p.kelas} — tahap edukasi (sebelum kuis)
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Bacalah materi berikut untuk memahami konsep kesadaran berbahasa. Setelah
          selesai, lanjut ke kuis untuk menguji pemahamanmu.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Belum ada materi edukasi. Silakan lanjut ke kuis.
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((m, i) => (
            <article
              key={m.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">
                Modul {i + 1} · {m.dimension}
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">{m.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                {m.body.split(/\n{2,}/).map((para, k) => (
                  <p key={k}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      <form action={completeEdu} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
        >
          Saya sudah membaca materi — Lanjut ke Kuis →
        </button>
      </form>
    </div>
  );
}
