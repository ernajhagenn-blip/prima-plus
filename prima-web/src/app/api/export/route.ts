import { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/session";
import { fetchRows, DATASET_KEYS, type DatasetKey } from "@/lib/exportData";

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

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: "Tidak berwenang" }, { status: 401 });
  }

  const dataset = (req.nextUrl.searchParams.get("dataset") as DatasetKey | null) ?? "participants";
  const key: DatasetKey = DATASET_KEYS.includes(dataset) ? dataset : "participants";

  const rows = await fetchRows(key);
  const body = "﻿" + toCsv(rows);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prima_${key}.csv"`,
    },
  });
}
