// Seed konten PRIMA+ ke Supabase. Jalankan: npx tsx scripts/seed-content.ts
// Membaca .env.local untuk NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
// Idempoten: melewati tabel yang sudah berisi baris (tidak duplikat).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  EDU_SEED,
  LOYALTY_ITEMS,
  SCENARIOS,
  GAME_REFLECTION_QUESTIONS,
  RESPONSE_ITEMS,
} from "../src/lib/data";

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* .env.local opsional di CI, fallback ke process.env */
  }
  return { ...(process.env as Record<string, string>), ...out };
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Kurang env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function seed(
  table: string,
  rows: Record<string, unknown>[],
  label: string,
) {
  if (rows.length === 0) {
    console.log(`- ${label}: kosong di data.ts, lewati`);
    return;
  }
  const { count } = await sb.from(table).select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    console.log(`- ${label}: sudah ada ${count} baris, lewati`);
    return;
  }
  const { error } = await sb.from(table).insert(rows);
  if (error) {
    console.error(`✗ ${label}: GAGAL — ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ ${label}: ${rows.length} baris dimasukkan`);
}

async function main() {
  console.log("Seed konten PRIMA+ → Supabase");

  await seed(
    "edu_modules",
    EDU_SEED.map((m, i) => ({
      sort_order: i + 1,
      title: m.title,
      dimension: m.dimension,
      body: m.body,
    })),
    "Modul Edukasi",
  );

  await seed(
    "pretest_items",
    LOYALTY_ITEMS.map((it, i) => ({
      sort_order: i + 1,
      dimension: it.dimension,
      statement: it.statement,
    })),
    "Item Pretest (Likert)",
  );

  await seed(
    "game_scenarios",
    SCENARIOS.map((s, i) => ({
      sort_order: i + 1,
      construct: s.construct,
      case_type: s.caseType,
      task: s.task,
      situation: s.situation,
      options_json: JSON.stringify(s.options),
      feedback: s.feedback,
    })),
    "Skenario Game",
  );

  await seed(
    "game_reflection_questions",
    GAME_REFLECTION_QUESTIONS.map((q, i) => ({
      sort_order: i + 1,
      question: q,
    })),
    "Pertanyaan Refleksi Game",
  );

  await seed(
    "response_items",
    RESPONSE_ITEMS.map((it, i) => ({
      sort_order: i + 1,
      statement: it.statement,
    })),
    "Item Angket Respons",
  );

  console.log("Selesai.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
