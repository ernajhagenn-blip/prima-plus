import { prisma } from "@/lib/prisma";
import {
  EDU_SEED,
  LOYALTY_ITEMS,
  SCENARIOS,
  GAME_REFLECTION_QUESTIONS,
  RESPONSE_ITEMS,
} from "@/lib/data";
import type { Scenario, ScenarioOption } from "@/lib/data";

export { prisma as getDb };

export type Stage =
  | "registered"
  | "pretest_done"
  | "educated"
  | "game_done"
  | "posttest_done"
  | "done";

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const [eduCount, pretestCount, scenarioCount, reflectionCount, responseCount] =
    await Promise.all([
      prisma.eduModule.count(),
      prisma.pretestItem.count(),
      prisma.gameScenario.count(),
      prisma.gameReflectionQuestion.count(),
      prisma.responseItem.count(),
    ]);

  if (eduCount === 0) {
    await prisma.eduModule.createMany({
      data: EDU_SEED.map((m, i) => ({
        sortOrder: i + 1,
        title: m.title,
        dimension: m.dimension,
        body: m.body,
      })),
    });
  }
  if (pretestCount === 0) {
    await prisma.pretestItem.createMany({
      data: LOYALTY_ITEMS.map((it, i) => ({
        sortOrder: i + 1,
        dimension: it.dimension,
        statement: it.statement,
      })),
    });
  }
  if (scenarioCount === 0) {
    await prisma.gameScenario.createMany({
      data: SCENARIOS.map((s, i) => ({
        sortOrder: i + 1,
        construct: s.construct,
        caseType: s.caseType,
        task: s.task,
        situation: s.situation,
        optionsJson: JSON.stringify(s.options),
        feedback: s.feedback,
      })),
    });
  }
  if (reflectionCount === 0) {
    await prisma.gameReflectionQuestion.createMany({
      data: GAME_REFLECTION_QUESTIONS.map((q, i) => ({
        sortOrder: i + 1,
        question: q,
      })),
    });
  }
  if (responseCount === 0) {
    await prisma.responseItem.createMany({
      data: RESPONSE_ITEMS.map((it, i) => ({
        sortOrder: i + 1,
        statement: it.statement,
      })),
    });
  }
  seeded = true;
}

// ---- Interfaces ----

export interface EduModuleRow {
  id: number;
  sort_order: number;
  title: string;
  dimension: string;
  body: string;
}

export interface PretestItemRow {
  id: number;
  sort_order: number;
  dimension: string;
  statement: string;
}

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

export interface ReflectionQuestionRow {
  id: number;
  sort_order: number;
  question: string;
}

export interface ResponseItemRow {
  id: number;
  sort_order: number;
  statement: string;
}

export interface WorldProgress {
  participantId: number;
  episodesDone: number[];
  cards: string[];
  skills: string[];
  gameScores: Record<string, number>;
  bossDefeated: boolean;
}

// ---- Helper functions (unchanged) ----

export function gameOptionsToText(options: ScenarioOption[]): string {
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

// ---- EduModule CRUD ----

export async function getEduModules(): Promise<EduModuleRow[]> {
  await ensureSeeded();
  const rows = await prisma.eduModule.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return rows.map((r) => ({
    id: r.id,
    sort_order: r.sortOrder,
    title: r.title,
    dimension: r.dimension,
    body: r.body,
  }));
}

export async function getEduModule(id: number): Promise<EduModuleRow | undefined> {
  await ensureSeeded();
  const r = await prisma.eduModule.findUnique({ where: { id } });
  if (!r) return undefined;
  return {
    id: r.id,
    sort_order: r.sortOrder,
    title: r.title,
    dimension: r.dimension,
    body: r.body,
  };
}

export async function createEduModule(title: string, dimension: string, body: string): Promise<number> {
  const max = await prisma.eduModule.aggregate({ _max: { sortOrder: true } });
  const r = await prisma.eduModule.create({
    data: { sortOrder: (max._max.sortOrder ?? 0) + 1, title, dimension, body },
  });
  return r.id;
}

export async function updateEduModule(id: number, title: string, dimension: string, body: string): Promise<void> {
  await prisma.eduModule.update({ where: { id }, data: { title, dimension, body } });
}

export async function deleteEduModule(id: number): Promise<void> {
  await prisma.eduModule.delete({ where: { id } });
}

// ---- Pretest Items (instrumen Likert) ----

export async function getPretestItems(): Promise<PretestItemRow[]> {
  await ensureSeeded();
  const rows = await prisma.pretestItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return rows.map((r) => ({
    id: r.id,
    sort_order: r.sortOrder,
    dimension: r.dimension,
    statement: r.statement,
  }));
}

export async function createPretestItem(dimension: string, statement: string): Promise<number> {
  const max = await prisma.pretestItem.aggregate({ _max: { sortOrder: true } });
  const r = await prisma.pretestItem.create({
    data: { sortOrder: (max._max.sortOrder ?? 0) + 1, dimension, statement },
  });
  return r.id;
}

export async function updatePretestItem(id: number, dimension: string, statement: string): Promise<void> {
  await prisma.pretestItem.update({ where: { id }, data: { dimension, statement } });
}

export async function deletePretestItem(id: number): Promise<void> {
  await prisma.pretestItem.delete({ where: { id } });
}

// ---- Game Scenarios ----

export async function getGameScenarios(): Promise<Scenario[]> {
  await ensureSeeded();
  const rows = await prisma.gameScenario.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return rows.map((r) => ({
    id: r.id,
    construct: r.construct,
    caseType: r.caseType,
    task: r.task,
    situation: r.situation,
    options: JSON.parse(r.optionsJson) as ScenarioOption[],
    feedback: r.feedback,
  }));
}

export async function createGameScenario(
  construct: string,
  case_type: string,
  task: string,
  situation: string,
  options: ScenarioOption[],
  feedback: string,
): Promise<number> {
  const max = await prisma.gameScenario.aggregate({ _max: { sortOrder: true } });
  const r = await prisma.gameScenario.create({
    data: {
      sortOrder: (max._max.sortOrder ?? 0) + 1,
      construct,
      caseType: case_type,
      task,
      situation,
      optionsJson: JSON.stringify(options),
      feedback,
    },
  });
  return r.id;
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
  await prisma.gameScenario.update({
    where: { id },
    data: { construct, caseType: case_type, task, situation, optionsJson: JSON.stringify(options), feedback },
  });
}

export async function deleteGameScenario(id: number): Promise<void> {
  await prisma.gameScenario.delete({ where: { id } });
}

// ---- Game Reflection Questions ----

export async function getGameReflectionQuestions(): Promise<ReflectionQuestionRow[]> {
  await ensureSeeded();
  const rows = await prisma.gameReflectionQuestion.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return rows.map((r) => ({
    id: r.id,
    sort_order: r.sortOrder,
    question: r.question,
  }));
}

export async function createReflectionQuestion(question: string): Promise<number> {
  const max = await prisma.gameReflectionQuestion.aggregate({ _max: { sortOrder: true } });
  const r = await prisma.gameReflectionQuestion.create({
    data: { sortOrder: (max._max.sortOrder ?? 0) + 1, question },
  });
  return r.id;
}

export async function updateReflectionQuestion(id: number, question: string): Promise<void> {
  await prisma.gameReflectionQuestion.update({ where: { id }, data: { question } });
}

export async function deleteReflectionQuestion(id: number): Promise<void> {
  await prisma.gameReflectionQuestion.delete({ where: { id } });
}

// ---- Response Items (angket respons) ----

export async function getResponseItems(): Promise<ResponseItemRow[]> {
  await ensureSeeded();
  const rows = await prisma.responseItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return rows.map((r) => ({
    id: r.id,
    sort_order: r.sortOrder,
    statement: r.statement,
  }));
}

export async function createResponseItem(statement: string): Promise<number> {
  const max = await prisma.responseItem.aggregate({ _max: { sortOrder: true } });
  const r = await prisma.responseItem.create({
    data: { sortOrder: (max._max.sortOrder ?? 0) + 1, statement },
  });
  return r.id;
}

export async function updateResponseItem(id: number, statement: string): Promise<void> {
  await prisma.responseItem.update({ where: { id }, data: { statement } });
}

export async function deleteResponseItem(id: number): Promise<void> {
  await prisma.responseItem.delete({ where: { id } });
}

// ---- Participants ----

export async function getParticipant(id: number) {
  return prisma.participant.findUnique({ where: { id } });
}

export async function getParticipantByCode(code: string) {
  return prisma.participant.findUnique({ where: { code } });
}

// ---- Transactions ----

export async function runTx<T>(fn: (tx: any) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn);
}

// ---- Reset (no-op with Prisma) ----

export function resetDb() {
  // no-op
}

// ---- World Progress ----

function parseJson<T>(s: string, fallback: T): T {
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function getWorldProgress(pid: number): Promise<WorldProgress> {
  const row = await prisma.worldProgress.findUnique({ where: { participantId: pid } });
  if (!row) {
    await prisma.worldProgress.upsert({
      where: { participantId: pid },
      create: { participantId: pid },
      update: {},
    });
    return {
      participantId: pid,
      episodesDone: [],
      cards: [],
      skills: [],
      gameScores: {},
      bossDefeated: false,
    };
  }
  return {
    participantId: pid,
    episodesDone: parseJson<number[]>(row.episodesDone, []),
    cards: parseJson<string[]>(row.cards, []),
    skills: parseJson<string[]>(row.skills, []),
    gameScores: parseJson<Record<string, number>>(row.gameScores, {}),
    bossDefeated: row.bossDefeated,
  };
}

async function saveProgress(p: WorldProgress): Promise<void> {
  await prisma.worldProgress.upsert({
    where: { participantId: p.participantId },
    create: {
      participantId: p.participantId,
      episodesDone: JSON.stringify(p.episodesDone),
      cards: JSON.stringify(p.cards),
      skills: JSON.stringify(p.skills),
      gameScores: JSON.stringify(p.gameScores),
      bossDefeated: p.bossDefeated,
    },
    update: {
      episodesDone: JSON.stringify(p.episodesDone),
      cards: JSON.stringify(p.cards),
      skills: JSON.stringify(p.skills),
      gameScores: JSON.stringify(p.gameScores),
      bossDefeated: p.bossDefeated,
    },
  });
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
