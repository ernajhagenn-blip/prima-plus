import { isAdminAuthed } from "@/lib/session";
import { getEduModules, getPretestItems, getGameScenarios, getGameReflectionQuestions, getResponseItems } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { AdminLogin } from "@/components/AdminLogin";
import {
  adminLogout,
  createEduModuleAction,
  updateEduModuleAction,
  createPretestItemAction,
  updatePretestItemAction,
  createGameScenarioAction,
  updateGameScenarioAction,
  createReflectionQuestionAction,
  updateReflectionQuestionAction,
  createResponseItemAction,
  updateResponseItemAction,
  adminDelete,
} from "@/app/actions";
import { GAME_CONSTRUCTS, LOYALTY_DIMENSIONS } from "@/lib/data";

const STAGE_LABEL: Record<string, string> = {
  registered: "Baru daftar",
  pretest_done: "Pretest selesai",
  educated: "Edukasi selesai",
  game_done: "Kuis selesai",
  posttest_done: "Posttest selesai",
  done: "Selesai",
};

export const metadata = { title: "Admin PRIMA+" };

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <AdminLogin />
      </div>
    );
  }

  const participants = await prisma.participant.findMany({ orderBy: { id: "asc" } });
  const rows = participants.map((r: typeof participants[0]) => ({
    id: r.id,
    code: r.code,
    name: r.name,
    kelas: r.kelas,
    stage: r.stage,
    pretest_total: r.pretestTotal,
    posttest_total: r.posttestTotal,
    game_score: r.gameScore,
    game_max: r.gameMax,
    created_at: r.createdAt,
  }));

  const summaryRow = await prisma.participant.aggregate({
    _count: { id: true },
    _avg: { pretestTotal: true, posttestTotal: true },
  });
  const doneCount = await prisma.participant.count({ where: { stage: "done" } });
  const summary = {
    total: summaryRow._count.id,
    selesai: doneCount,
    avg_pre: summaryRow._avg.pretestTotal,
    avg_post: summaryRow._avg.posttestTotal,
  };

  const eduModules = await getEduModules();
  const pretestItems = await getPretestItems();
  const gameScenarios = await getGameScenarios();
  const reflectionQuestions = await getGameReflectionQuestions();
  const responseItems = await getResponseItems();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Panel Admin PRIMA+</h1>
          <p className="text-sm text-gray-600">
            Data responden tersimpan di database PostgreSQL (sisi server).
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Keluar
          </button>
        </form>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-2xl font-black text-gray-900">{String(summary.total)}</p>
          <p className="text-xs text-gray-500">Total responden</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-2xl font-black text-gray-900">{String(summary.selesai)}</p>
          <p className="text-xs text-gray-500">Selesai 4 tahap</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-2xl font-black text-gray-900">
            {summary.avg_pre === null ? "-" : Number(summary.avg_pre).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">Rata-rata pretest</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-2xl font-black text-gray-900">
            {summary.avg_post === null ? "-" : Number(summary.avg_post).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">Rata-rata posttest</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["participants", "Responden"],
          ["pretest", "Jawaban Pretest"],
          ["game", "Jawaban Kuis PRIMA+"],
          ["posttest", "Jawaban Posttest"],
          ["respons", "Angket Respons"],
        ].map(([key, label]) => (
          <a
            key={key}
            href={`/api/export?dataset=${key}`}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Ekspor CSV — {label}
          </a>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Kelola Materi Edukasi</h2>
        <p className="mt-1 text-sm text-gray-600">
          Materi ini tampil di halaman responden sebelum kuis. Bisa ditambah, diubah, dan dihapus.
        </p>

        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">
            + Tambah modul baru
          </summary>
          <form action={createEduModuleAction} className="mt-3 space-y-3">
            <input
              name="title"
              placeholder="Judul modul"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <input
              name="dimension"
              placeholder="Dimensi / tag (mis. Pemilihan ragam)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <textarea
              name="body"
              placeholder="Isi materi (pisahkan paragraf dengan baris kosong)"
              required
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Modul
            </button>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {eduModules.map((m, i) => (
            <div key={m.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">
                Modul {i + 1} · {m.dimension}
              </p>
              <p className="font-semibold text-gray-900">{m.title}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 underline">
                  Ubah modul ini
                </summary>
                <form action={updateEduModuleAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={String(m.id)} />
                  <input
                    name="title"
                    defaultValue={m.title}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <input
                    name="dimension"
                    defaultValue={m.dimension}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <textarea
                    name="body"
                    defaultValue={m.body}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </details>
              <form action={adminDelete} className="mt-2">
                <input type="hidden" name="kind" value="edu" />
                <input type="hidden" name="id" value={String(m.id)} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus modul ini
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Kelola Butir Pretest &amp; Posttest</h2>
        <p className="mt-1 text-sm text-gray-600">
          Butir kuesioner loyalitas (skala SS–STS). Dipakai di pretest dan posttest.
        </p>

        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">
            + Tambah butir baru
          </summary>
          <form action={createPretestItemAction} className="mt-3 space-y-3">
            <select
              name="dimension"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">Pilih dimensi…</option>
              {LOYALTY_DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <textarea
              name="statement"
              placeholder="Pernyataan kuesioner"
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Butir
            </button>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {pretestItems.map((it, i) => (
            <div key={it.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">
                Butir {i + 1} · {it.dimension}
              </p>
              <p className="font-semibold text-gray-900">{it.statement}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 underline">
                  Ubah butir ini
                </summary>
                <form action={updatePretestItemAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={String(it.id)} />
                  <select
                    name="dimension"
                    required
                    defaultValue={it.dimension}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  >
                    {LOYALTY_DIMENSIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="statement"
                    defaultValue={it.statement}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </details>
              <form action={adminDelete} className="mt-2">
                <input type="hidden" name="kind" value="pretest" />
                <input type="hidden" name="id" value={String(it.id)} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus butir ini
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Kelola Kasus Kuis PRIMA+</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tiap kasus berisi situasi, pilihan jawaban (format baris:{" "}
          <code>key|teks|true/false</code>), dan umpan balik.
        </p>

        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">
            + Tambah kasus baru
          </summary>
          <form action={createGameScenarioAction} className="mt-3 space-y-3">
            <select
              name="construct"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">Pilih konstruk…</option>
              {GAME_CONSTRUCTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              name="case_type"
              placeholder="Tipe kasus (mis. Chat grup, Caption, Wawancara)"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <input
              name="task"
              placeholder="Tugas singkat untuk responden"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <textarea
              name="situation"
              placeholder="Teks situasi/kasus"
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <textarea
              name="options"
              placeholder={"Satu baris per pilihan.\nContoh:\na|Saya tetap pakai bahasa Indonesia.|true\nb|Saya pakai bahasa Inggris biar keren.|false"}
              required
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-red-500 focus:outline-none"
            />
            <textarea
              name="feedback"
              placeholder="Umpan balik setelah menjawab"
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Kasus
            </button>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {gameScenarios.map((s, i) => (
            <div key={s.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">
                Kasus {i + 1} · {s.construct} · {s.caseType}
              </p>
              <p className="font-semibold text-gray-900">{s.task}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 underline">
                  Ubah kasus ini
                </summary>
                <form action={updateGameScenarioAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={String(s.id)} />
                  <select
                    name="construct"
                    required
                    defaultValue={s.construct}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  >
                    {GAME_CONSTRUCTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    name="case_type"
                    defaultValue={s.caseType}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <input
                    name="task"
                    defaultValue={s.task}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <textarea
                    name="situation"
                    defaultValue={s.situation}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <textarea
                    name="options"
                    defaultValue={s.options.map((o) => `${o.key}|${o.text}|${o.correct}`).join("\n")}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-red-500 focus:outline-none"
                  />
                  <textarea
                    name="feedback"
                    defaultValue={s.feedback}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </details>
              <form action={adminDelete} className="mt-2">
                <input type="hidden" name="kind" value="game" />
                <input type="hidden" name="id" value={String(s.id)} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus kasus ini
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Kelola Pertanyaan Refleksi Kuis</h2>
        <p className="mt-1 text-sm text-gray-600">
          Pertanyaan terbuka yang tampil di akhir kuis (empat kotak refleksi).
        </p>

        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">
            + Tambah pertanyaan
          </summary>
          <form action={createReflectionQuestionAction} className="mt-3 space-y-3">
            <textarea
              name="question"
              placeholder="Pertanyaan refleksi"
              required
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Pertanyaan
            </button>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {reflectionQuestions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">Refleksi {i + 1}</p>
              <p className="font-semibold text-gray-900">{q.question}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 underline">
                  Ubah pertanyaan ini
                </summary>
                <form action={updateReflectionQuestionAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={String(q.id)} />
                  <textarea
                    name="question"
                    defaultValue={q.question}
                    required
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </details>
              <form action={adminDelete} className="mt-2">
                <input type="hidden" name="kind" value="reflection" />
                <input type="hidden" name="id" value={String(q.id)} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus pertanyaan ini
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Kelola Butir Angket Respons</h2>
        <p className="mt-1 text-sm text-gray-600">
          Pernyataan pada tahap akhir (skala 1–4).
        </p>

        <details className="mt-4 rounded-lg border border-gray-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-700">
            + Tambah butir baru
          </summary>
          <form action={createResponseItemAction} className="mt-3 space-y-3">
            <textarea
              name="statement"
              placeholder="Pernyataan angket respons"
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Butir
            </button>
          </form>
        </details>

        <div className="mt-4 space-y-3">
          {responseItems.map((it, i) => (
            <div key={it.id} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-800">Butir {i + 1}</p>
              <p className="font-semibold text-gray-900">{it.statement}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-500 underline">
                  Ubah butir ini
                </summary>
                <form action={updateResponseItemAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={String(it.id)} />
                  <textarea
                    name="statement"
                    defaultValue={it.statement}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </details>
              <form action={adminDelete} className="mt-2">
                <input type="hidden" name="kind" value="response" />
                <input type="hidden" name="id" value={String(it.id)} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Hapus butir ini
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pretest</th>
              <th className="px-4 py-3">Kuis</th>
              <th className="px-4 py-3">Posttest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-t border-gray-100">
                <td className="px-4 py-3 font-mono text-xs">{String(r.code)}</td>
                <td className="px-4 py-3 font-medium">{String(r.name)}</td>
                <td className="px-4 py-3">{String(r.kelas)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {STAGE_LABEL[String(r.stage)] ?? String(r.stage)}
                  </span>
                </td>
                <td className="px-4 py-3">{r.pretest_total === null ? "-" : String(r.pretest_total)}</td>
                <td className="px-4 py-3">
                  {r.game_score === null ? "-" : `${String(r.game_score)}/${String(r.game_max)}`}
                </td>
                <td className="px-4 py-3">{r.posttest_total === null ? "-" : String(r.posttest_total)}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Belum ada responden.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}