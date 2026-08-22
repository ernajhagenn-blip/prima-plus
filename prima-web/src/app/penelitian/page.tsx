import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { getPretestItems, getResponseItems } from "@/lib/db";
import { LOYALTY_ITEMS } from "@/lib/data";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function PenelitianPage() {
  const p = await currentParticipant();
  const pre = getPretestItems();
  const post = LOYALTY_ITEMS;
  const resp = getResponseItems();

  const steps = [
    { n: 1, name: "Pretest", desc: `Kuesioner awal (${pre.length} pernyataan)` },
    { n: 2, name: "Edukasi", desc: "Materi kesadaran berbahasa" },
    { n: 3, name: "Game (instrumen)", desc: "8 stimulasi situasi" },
    { n: 4, name: "Posttest", desc: `Kuesioner akhir (${post.length} pernyataan)` },
    { n: 5, name: "Respons", desc: `Kuesioner respon (${resp.length} pernyataan)` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>

      <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h1 className="text-xl font-black text-amber-800">
          Instrumen Penelitian OPSI (Terpisah)
        </h1>
        <p className="mt-2 text-sm text-amber-700">
          Halaman ini <strong>terpisah</strong> dari pengalaman bermain PRIMA
          CITY. Data yang kamu isi di sini adalah data penelitian sesungguhnya
          (pretest–posttest & respons) untuk mengukur loyalitas berbahasa. PRIMA+
          tidak menjadikan pretest–posttest sebagai alur utama bermain.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Partisipasi sukarela & anonim. Kamu boleh mengikuti penelitian maupun
          hanya bermain game, keduanya tidak saling mengganti.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
          Alur Instrumen
        </h2>
        <ol className="mt-3 space-y-2">
          {steps.map((s) => (
            <li
              key={s.n}
              className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-black text-white">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-600">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {p ? (
          <Link
            href="/pretest"
            className="mt-4 inline-block rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            Mulai Instrumen Penelitian →
          </Link>
        ) : (
          <div className="mt-4">
            <p className="text-sm font-bold text-gray-900">
              Buat profil dulu untuk mencatat jawaban penelitianmu
            </p>
            <div className="mt-3">
              <RegisterForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
