import { cookies } from "next/headers";
import { AdminLogin } from "@/components/AdminLogin";
import { createServiceClient } from "@/utils/supabase/server";
import { DATASET_META, fetchRows, colLabel, type DatasetKey } from "@/lib/exportData";

export const metadata = { title: "Admin PRIMA+" };
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "prima_admin";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ds?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = cookieStore.get(ADMIN_COOKIE)?.value === "1";

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <AdminLogin />
      </div>
    );
  }

  async function logout() {
    "use server";
    const cs = await cookies();
    cs.delete(ADMIN_COOKIE);
  }

  const sp = await searchParams;
  const dsParam = sp.ds as DatasetKey | undefined;
  const active: DatasetKey =
    DATASET_META.find((d) => d.key === dsParam)?.key ?? "participants";

  let stats: {
    total: number;
    done: number;
    avgPretest: number | null;
    avgPosttest: number | null;
    avgGame: number | null;
    chat: number;
    activity: number;
    feedback: number;
  } = { total: 0, done: 0, avgPretest: null, avgPosttest: null, avgGame: null, chat: 0, activity: 0, feedback: 0 };

  try {
    const sb = createServiceClient();
    const [{ count: total }, { count: done }, pre, post, game, { count: chat }, { count: activity }, { count: feedback }] = await Promise.all([
      sb.from("participants").select("*", { count: "exact", head: true }),
      sb.from("participants").select("*", { count: "exact", head: true }).eq("stage", "done"),
      sb.from("participants").select("pretest_total").not("pretest_total", "is", null),
      sb.from("participants").select("posttest_total").not("posttest_total", "is", null),
      sb.from("participants").select("game_score").not("game_score", "is", null),
      sb.from("chat_answers").select("*", { count: "exact", head: true }),
      sb.from("activity_log").select("*", { count: "exact", head: true }),
      sb.from("feedback").select("*", { count: "exact", head: true }),
    ]);
    const avg = (rows: { [k: string]: number | null }[] | null, col: string) => {
      if (!rows || rows.length === 0) return null;
      const vals = rows.map((r) => r[col]).filter((v): v is number => typeof v === "number");
      if (vals.length === 0) return null;
      return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) / 100;
    };
    stats = {
      total: total ?? 0,
      done: done ?? 0,
      avgPretest: avg(pre?.data as any, "pretest_total"),
      avgPosttest: avg(post?.data as any, "posttest_total"),
      avgGame: avg(game?.data as any, "game_score"),
      chat: chat ?? 0,
      activity: activity ?? 0,
      feedback: feedback ?? 0,
    };
  } catch {
    // biarkan stats default bila koneksi gagal
  }

  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  let rows: Record<string, unknown>[] = [];
  try {
    rows = await fetchRows(active);
  } catch {
    rows = [];
  }
  const cols = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-xl shadow-md">
              📊
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
                Panel Admin PRIMA+
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Data responden tersimpan di Supabase — terpusat & bisa dianalisis.
              </p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Keluar
            </button>
          </form>
        </header>

        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <StatCard label="Total Responden" value={String(stats.total)} accent="red" icon="👥" />
          <StatCard label="Selesai Penuh" value={String(stats.done)} accent="emerald" icon="✅" sub={`${pct}% dari total`} />
          <StatCard label="Rata² Pretest" value={stats.avgPretest !== null ? String(stats.avgPretest) : "—"} accent="sky" icon="📝" />
          <StatCard label="Rata² Posttest" value={stats.avgPosttest !== null ? String(stats.avgPosttest) : "—"} accent="violet" icon="📈" />
          <StatCard label="Log Aktivitas" value={String(stats.activity)} accent="sky" icon="🎮" sub="mini-game & quiz" />
          <StatCard label="Chat & Refleksi" value={String(stats.chat)} accent="violet" icon="💬" sub="jawaban skenario" />
          <StatCard label="Feedback" value={String(stats.feedback)} accent="emerald" icon="💡" sub="saran siswa" />
          <StatCard label="Rata² Skor Game" value={stats.avgGame !== null ? String(stats.avgGame) : "—"} accent="red" icon="🏆" />
        </section>

        {/* Dataset tabs + table */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-base">📋</span>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">Daftar Data</h2>
            <span className="text-xs text-slate-400">
              ({rows.length} baris · {active})
            </span>
            <a
              href={`/api/export?dataset=${active}`}
              className="ml-auto rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-800"
            >
              ⬇ Unduh CSV
            </a>
          </div>

          {/* Tabs */}
          <div className="-mx-1 mt-3 flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {DATASET_META.map((d) => (
              <a
                key={d.key}
                href={`/admin?ds=${d.key}`}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  d.key === active
                    ? "bg-red-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d.label}
              </a>
            ))}
          </div>

          {/* Table */}
          <div className="mt-4 max-h-[60vh] overflow-auto rounded-xl border border-slate-200">
            {rows.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">Belum ada data pada dataset ini.</p>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-100">
                  <tr>
                    {cols.map((c) => (
                      <th key={c} className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-bold text-slate-600">
                        {colLabel(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      {cols.map((c) => (
                        <td key={c} className="max-w-[260px] truncate border-b border-slate-100 px-3 py-1.5 align-top text-slate-700" title={String(row[c] ?? "")}>
                          {String(row[c] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Klik tab di atas untuk ganti dataset. Tombol &quot;Unduh CSV&quot; ekspor dataset aktif (BOM UTF-8, bisa dibuka Excel Indonesia).
          </p>
        </section>

        {/* Notes */}
        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <h2 className="text-base font-bold text-blue-900">Catatan</h2>
          <ol className="mt-3 space-y-2 text-sm text-blue-800">
            <li><strong>1.</strong> Data masuk otomatis ke Supabase saat siswa registrasi, pretest, kuis, posttest, respons, <em>dan</em> setiap aktivitas game/chat/feedback.</li>
            <li><strong>2.</strong> Siswa anonim (cookie), tanpa akun — sesuai etika penelitian OPSI.</li>
            <li><strong>3.</strong> CRUD konten (modul/soal) tersimpan permanen di Supabase bila diubah via form.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

const ACCENTS: Record<string, { ring: string; text: string; bg: string }> = {
  red: { ring: "ring-red-100", text: "text-red-600", bg: "bg-red-50" },
  emerald: { ring: "ring-emerald-100", text: "text-emerald-600", bg: "bg-emerald-50" },
  sky: { ring: "ring-sky-100", text: "text-sky-600", bg: "bg-sky-50" },
  violet: { ring: "ring-violet-100", text: "text-violet-600", bg: "bg-violet-50" },
};

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: keyof typeof ACCENTS;
  icon: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ${a.ring}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${a.bg}`}>{icon}</span>
      </div>
      <p className={`mt-2 text-3xl font-black ${a.text}`}>{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p> : null}
    </div>
  );
}
