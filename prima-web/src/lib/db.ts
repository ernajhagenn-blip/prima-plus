import { createServiceClient } from "@/utils/supabase/server";
import {
  EDU_SEED,
  LOYALTY_ITEMS,
  SCENARIOS,
  GAME_REFLECTION_QUESTIONS,
  RESPONSE_ITEMS,
} from "@/lib/data";
import type { Scenario, ScenarioOption } from "@/lib/data";

// Semua akses data lewat Supabase (server-only). Tidak ada lagi SQLite lokal.
// Siswa submit via publishable (anon) key (insert). Admin/read/export via service role.
// Fungsi content getter tetap return konstanta data.ts sebagai fallback defensif
// bila env Supabase belum diset (dev tanpa koneksi), agar UI tetap jalan.

export type Stage =
  | "registered"
  | "pretest_done"
  | "educated"
  | "game_done"
  | "posttest_done"
  | "done";

// ---------------------------------------------------------------------------
// CONTENT — edu modules, pretest/posttest items, game scenarios, reflection, respons
// ---------------------------------------------------------------------------

export interface EduModuleRow {
  id: number;
  sort_order: number;
  title: string;
  dimension: string;
  body: string;
}

export async function getEduModules(): Promise<EduModuleRow[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("edu_modules")
      .select("id, sort_order, title, dimension, body")
      .order("sort_order")
      .order("id");
    if (error) throw error;
    if (data && data.length > 0) {
      return data as EduModuleRow[];
    }
  } catch {
    // fallback konstanta
  }
  return EDU_SEED.map((m, i) => ({ id: i + 1, sort_order: i + 1, title: m.title, dimension: m.dimension, body: m.body }));
}

export async function getEduModule(id: number): Promise<EduModuleRow | undefined> {
  const rows = await getEduModules();
  return rows.find((r) => r.id === id);
}

export async function createEduModule(title: string, dimension: string, body: string): Promise<number> {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("edu_modules")
    .insert({ title, dimension, body })
    .select("id")
    .single();
  if (error) throw error;
  return Number((data as { id: number }).id);
}

export async function updateEduModule(id: number, title: string, dimension: string, body: string): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("edu_modules").update({ title, dimension, body }).eq("id", id);
  if (error) throw error;
}

export async function deleteEduModule(id: number): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("edu_modules").delete().eq("id", id);
  if (error) throw error;
}

// ---- Pretest / posttest items (instrumen Likert) ----
export interface PretestItemRow {
  id: number;
  sort_order: number;
  dimension: string;
  statement: string;
}

export async function getPretestItems(): Promise<PretestItemRow[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("pretest_items")
      .select("id, sort_order, dimension, statement")
      .order("sort_order")
      .order("id");
    if (error) throw error;
    if (data && data.length > 0) return data as PretestItemRow[];
  } catch {
    // fallback
  }
  return LOYALTY_ITEMS.map((it, i) => ({ id: i + 1, sort_order: i + 1, dimension: it.dimension, statement: it.statement }));
}

export async function createPretestItem(dimension: string, statement: string): Promise<number> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("pretest_items").insert({ dimension, statement }).select("id").single();
  if (error) throw error;
  return Number((data as { id: number }).id);
}

export async function updatePretestItem(id: number, dimension: string, statement: string): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("pretest_items").update({ dimension, statement }).eq("id", id);
  if (error) throw error;
}

export async function deletePretestItem(id: number): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("pretest_items").delete().eq("id", id);
  if (error) throw error;
}

// ---- Game scenarios ----
export interface GameScenarioRow {
  id: number;
  sort_order: number;
  construct: string;
  case_type: string;
  task: string;
  situation: string;
  options: ScenarioOption[];
  feedback: string;
}

export async function gameOptionsToText(options: ScenarioOption[]): Promise<string> {
  return options.map((o) => `${o.key}|${o.text}|${o.correct}`).join("\n");
}

// synchronous helper (pure) — tetap dipakai oleh actions.ts textToGameOptions
export function gameOptionsToTextSync(options: ScenarioOption[]): string {
  return options.map((o) => `${o.key}|${o.text}|${o.correct}`).join("\n");
}

export function textToGameOptions(text: string): ScenarioOption[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const idx = l.indexOf("|");
      const idx2 = l.indexOf("|", idx + 1);
      const key = l.slice(0, idx).trim();
      const body = l.slice(idx + 1, idx2 === -1 ? undefined : idx2).trim();
      const correct = idx2 === -1 ? "false" : l.slice(idx2 + 1).trim();
      return { key, text: body, correct: correct === "true" };
    });
}

export async function getGameScenarios(): Promise<Scenario[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("game_scenarios")
      .select("id, sort_order, construct, case_type, task, situation, options_json, feedback")
      .order("sort_order")
      .order("id");
    if (error) throw error;
    if (data && data.length > 0) {
      return (data as unknown as { id: number; sort_order: number; construct: string; case_type: string; task: string; situation: string; options_json: string; feedback: string }[]).map(
        (r) => ({
          id: r.id,
          construct: r.construct,
          caseType: r.case_type,
          task: r.task,
          situation: r.situation,
          options: JSON.parse(r.options_json) as ScenarioOption[],
          feedback: r.feedback,
        }),
      );
    }
  } catch {
    // fallback
  }
  return SCENARIOS.map((s, i) => ({ id: i + 1, construct: s.construct, caseType: s.caseType, task: s.task, situation: s.situation, options: s.options, feedback: s.feedback }));
}

export async function createGameScenario(
  construct: string,
  case_type: string,
  task: string,
  situation: string,
  options: ScenarioOption[],
  feedback: string,
): Promise<number> {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("game_scenarios")
    .insert({ construct, case_type, task, situation, options_json: JSON.stringify(options), feedback })
    .select("id")
    .single();
  if (error) throw error;
  return Number((data as { id: number }).id);
}

export async function updateGameScenario(
  id: number,
  construct: string,
  case_type: string,
  task: string,
  situation: string,
  options: ScenarioOption[],
  feedback: string,
): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb
    .from("game_scenarios")
    .update({ construct, case_type, task, situation, options_json: JSON.stringify(options), feedback })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteGameScenario(id: number): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("game_scenarios").delete().eq("id", id);
  if (error) throw error;
}

// ---- Game reflection questions ----
export interface ReflectionQuestionRow {
  id: number;
  sort_order: number;
  question: string;
}

export async function getGameReflectionQuestions(): Promise<ReflectionQuestionRow[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("game_reflection_questions")
      .select("id, sort_order, question")
      .order("sort_order")
      .order("id");
    if (error) throw error;
    if (data && data.length > 0) return data as ReflectionQuestionRow[];
  } catch {
    // fallback
  }
  return GAME_REFLECTION_QUESTIONS.map((q, i) => ({ id: i + 1, sort_order: i + 1, question: q }));
}

export async function createReflectionQuestion(question: string): Promise<number> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("game_reflection_questions").insert({ question }).select("id").single();
  if (error) throw error;
  return Number((data as { id: number }).id);
}

export async function updateReflectionQuestion(id: number, question: string): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("game_reflection_questions").update({ question }).eq("id", id);
  if (error) throw error;
}

export async function deleteReflectionQuestion(id: number): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("game_reflection_questions").delete().eq("id", id);
  if (error) throw error;
}

// ---- Response items (angket respons) ----
export interface ResponseItemRow {
  id: number;
  sort_order: number;
  statement: string;
}

export async function getResponseItems(): Promise<ResponseItemRow[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("response_items")
      .select("id, sort_order, statement")
      .order("sort_order")
      .order("id");
    if (error) throw error;
    if (data && data.length > 0) return data as ResponseItemRow[];
  } catch {
    // fallback
  }
  return RESPONSE_ITEMS.map((it, i) => ({ id: i + 1, sort_order: i + 1, statement: it.statement }));
}

export async function createResponseItem(statement: string): Promise<number> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("response_items").insert({ statement }).select("id").single();
  if (error) throw error;
  return Number((data as { id: number }).id);
}

export async function updateResponseItem(id: number, statement: string): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("response_items").update({ statement }).eq("id", id);
  if (error) throw error;
}

export async function deleteResponseItem(id: number): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("response_items").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// PARTICIPANTS (research data)
// ---------------------------------------------------------------------------

export async function getParticipant(id: number): Promise<Record<string, unknown> | undefined> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("participants").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export async function getParticipants(): Promise<Record<string, unknown>[]> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("participants").select("*").order("id");
  if (error) throw error;
  return (data ?? []) as Record<string, unknown>[];
}

export async function getParticipantCount(): Promise<number> {
  const sb = createServiceClient();
  const { count, error } = await sb.from("participants").select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// WORLD PROGRESS (PRIMA CITY) — JSONB
// ---------------------------------------------------------------------------

export interface WorldProgress {
  participantId: number;
  episodesDone: number[];
  cards: string[];
  skills: string[];
  gameScores: Record<string, number>;
  bossDefeated: boolean;
}

export async function getWorldProgress(pid: number): Promise<WorldProgress> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("world_progress").select("*").eq("participant_id", pid).maybeSingle();
  if (error) throw error;
  if (!data) {
    return { participantId: pid, episodesDone: [], cards: [], skills: [], gameScores: {}, bossDefeated: false };
  }
  const j = (s: unknown, d: unknown) => {
    try {
      return typeof s === "string" ? JSON.parse(s) : s;
    } catch {
      return d;
    }
  };
  const row = data as {
    episodes_done: unknown;
    cards: unknown;
    skills: unknown;
    game_scores: unknown;
    boss_defeated: boolean;
  };
  return {
    participantId: pid,
    episodesDone: j(row.episodes_done, []) as number[],
    cards: j(row.cards, []) as string[],
    skills: j(row.skills, []) as string[],
    gameScores: j(row.game_scores, {}) as Record<string, number>,
    bossDefeated: row.boss_defeated === true,
  };
}

async function saveProgress(p: WorldProgress): Promise<void> {
  const sb = createServiceClient();
  const { error } = await sb.from("world_progress").upsert(
    {
      participant_id: p.participantId,
      episodes_done: JSON.stringify(p.episodesDone),
      cards: JSON.stringify(p.cards),
      skills: JSON.stringify(p.skills),
      game_scores: JSON.stringify(p.gameScores),
      boss_defeated: p.bossDefeated,
    },
    { onConflict: "participant_id" },
  );
  if (error) throw error;
}

export async function awardEpisode(pid: number, episodeId: number, card: string, skill: string): Promise<void> {
  const p = await getWorldProgress(pid);
  if (!p.episodesDone.includes(episodeId)) p.episodesDone.push(episodeId);
  if (card && !p.cards.includes(card)) p.cards.push(card);
  if (skill && !p.skills.includes(skill)) p.skills.push(skill);
  await saveProgress(p);
}

export async function awardCard(pid: number, card: string): Promise<void> {
  const p = await getWorldProgress(pid);
  if (card && !p.cards.includes(card)) p.cards.push(card);
  await saveProgress(p);
}

export async function recordGameScore(pid: number, game: string, score: number): Promise<void> {
  const p = await getWorldProgress(pid);
  p.gameScores[game] = Math.max(p.gameScores[game] ?? 0, score);
  await saveProgress(p);
}

export async function setBossDefeated(pid: number, defeated = true): Promise<void> {
  const p = await getWorldProgress(pid);
  p.bossDefeated = defeated;
  await saveProgress(p);
}
