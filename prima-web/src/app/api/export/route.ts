import { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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

type DatasetKey = "participants" | "pretest" | "game" | "posttest" | "respons";

async function fetchDataset(dataset: DatasetKey): Promise<Record<string, unknown>[]> {
  switch (dataset) {
    case "participants": {
      const rows = await prisma.participant.findMany({ orderBy: { id: "asc" } });
      return rows.map((r: typeof rows[0]) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        kelas: r.kelas,
        stage: r.stage,
        pretest_total: r.pretestTotal,
        posttest_total: r.posttestTotal,
        game_score: r.gameScore,
        game_max: r.gameMax,
        reflection: r.reflection,
        created_at: r.createdAt,
      }));
    }
    case "pretest": {
      const rows = await prisma.pretestAnswer.findMany({
        orderBy: [{ participantId: "asc" }, { itemId: "asc" }],
        include: { participant: { select: { code: true, name: true, kelas: true } } },
      });
      return rows.map((a: typeof rows[0]) => ({
        code: a.participant.code,
        name: a.participant.name,
        kelas: a.participant.kelas,
        item_id: a.itemId,
        dimension: a.dimension,
        answer: a.answer,
        score: a.score,
      }));
    }
    case "game": {
      const rows = await prisma.gameAnswer.findMany({
        orderBy: [{ participantId: "asc" }, { scenarioId: "asc" }],
        include: { participant: { select: { code: true, name: true, kelas: true } } },
      });
      return rows.map((a: typeof rows[0]) => ({
        code: a.participant.code,
        name: a.participant.name,
        kelas: a.participant.kelas,
        scenario_id: a.scenarioId,
        construct: a.construct,
        chosen: a.chosen,
        is_correct: a.isCorrect,
      }));
    }
    case "posttest": {
      const rows = await prisma.posttestAnswer.findMany({
        orderBy: [{ participantId: "asc" }, { itemId: "asc" }],
        include: { participant: { select: { code: true, name: true, kelas: true } } },
      });
      return rows.map((a: typeof rows[0]) => ({
        code: a.participant.code,
        name: a.participant.name,
        kelas: a.participant.kelas,
        item_id: a.itemId,
        dimension: a.dimension,
        answer: a.answer,
        score: a.score,
      }));
    }
    case "respons": {
      const rows = await prisma.responseAnswer.findMany({
        orderBy: [{ participantId: "asc" }, { itemId: "asc" }],
        include: { participant: { select: { code: true, name: true, kelas: true } } },
      });
      return rows.map((a: typeof rows[0]) => ({
        code: a.participant.code,
        name: a.participant.name,
        kelas: a.participant.kelas,
        item_id: a.itemId,
        answer: a.answer,
        score: a.score,
      }));
    }
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: "Tidak berwenang" }, { status: 401 });
  }

  const dataset = (req.nextUrl.searchParams.get("dataset") as DatasetKey | null) ?? "participants";
  const rows = await fetchDataset(dataset);

  const body = "\uFEFF" + toCsv(rows);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prima_${dataset}.csv"`,
    },
  });
}