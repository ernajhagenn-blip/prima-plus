import { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/session";
import { getDb } from "@/lib/db";

function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "Tidak ada data.\n";
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

const DATASETS = {
  participants: `SELECT p.id, p.code, p.name, p.kelas, p.stage, p.pretest_total, p.posttest_total, p.game_score, p.game_max, p.reflection, p.created_at
    FROM participants p ORDER BY p.id`,
  pretest: `SELECT p.code, p.name, p.kelas, a.item_id, a.dimension, a.answer, a.score
    FROM pretest_answers a JOIN participants p ON p.id = a.participant_id ORDER BY a.participant_id, a.item_id`,
  game: `SELECT p.code, p.name, p.kelas, a.scenario_id, a.construct, a.chosen, a.is_correct
    FROM game_answers a JOIN participants p ON p.id = a.participant_id ORDER BY a.participant_id, a.scenario_id`,
  posttest: `SELECT p.code, p.name, p.kelas, a.item_id, a.dimension, a.answer, a.score
    FROM posttest_answers a JOIN participants p ON p.id = a.participant_id ORDER BY a.participant_id, a.item_id`,
  respons: `SELECT p.code, p.name, p.kelas, a.item_id, a.answer, a.score
    FROM response_answers a JOIN participants p ON p.id = a.participant_id ORDER BY a.participant_id, a.item_id`,
} as const;

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: "Tidak berwenang" }, { status: 401 });
  }

  const dataset = req.nextUrl.searchParams.get("dataset") as keyof typeof DATASETS | null;
  const sql = dataset && dataset in DATASETS ? DATASETS[dataset] : DATASETS.participants;

  const rows = getDb().prepare(sql).all() as Record<string, unknown>[];

  const filename = dataset && dataset in DATASETS ? dataset : "participants";
  const body = "\uFEFF" + toCsv(rows);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prima_${filename}.csv"`,
    },
  });
}