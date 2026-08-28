import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/session";
import { AdminLogin } from "@/components/AdminLogin";
import { ADMIN_COOKIE } from "@/lib/constants";

export const metadata = { title: "Admin PRIMA+" };
export const dynamic = "force-dynamic";

const DATASETS = [
  { key: "participants", label: "Data Registrasi & Status" },
  { key: "pretest", label: "Jawaban Pretest" },
  { key: "game", label: "Jawaban Kuis PRIMA+" },
  { key: "posttest", label: "Jawaban Posttest" },
  { key: "respons", label: "Angket Respons" },
];

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <AdminLogin />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Panel Admin PRIMA+</h1>
          <p className="text-sm text-gray-600">
            Data responden dikumpulkan otomatis ke Google Sheets.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Keluar
          </button>
        </form>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Status Koneksi Data</h2>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">
            Data responden terkirim otomatis ke Google Sheets saat registrasi, pretest, kuis, posttest, dan respons.
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Unduh Data (CSV)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Jalankan <code className="rounded bg-gray-100 px-1 font-mono">npm run dev</code> di komputer lokal, lalu akses link berikut untuk unduh CSV:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DATASETS.map((ds) => (
            <a
              key={ds.key}
              href={`/api/export?dataset=${ds.key}`}
              className="inline-block rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              {ds.label}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-bold text-blue-900">Cara Melihat Data Lengkap</h2>
        <ol className="mt-3 space-y-2 text-sm text-blue-800">
          <li><strong>1.</strong> Buka Google Sheet yang terhubung via env <code className="rounded bg-blue-100 px-1">GOOGLE_SHEETS_URL</code></li>
          <li><strong>2.</strong> Data real-time: Registrasi, Pretest, Kuis, Posttest, Angket Respons</li>
          <li><strong>3.</strong> Untuk export lokal: jalankan <code className="rounded bg-blue-100 px-1">npm run dev</code> lingga <code className="rounded bg-blue-100 px-1">localhost:3000/admin</code></li>
        </ol>
      </div>
    </div>
  );
}
