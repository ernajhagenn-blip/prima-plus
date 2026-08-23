import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import {
  EDU_SEED,
  LOYALTY_ITEMS,
  SCENARIOS,
  GAME_REFLECTION_QUESTIONS,
  RESPONSE_ITEMS,
} from "@/lib/data";
import type { Scenario, ScenarioOption } from "@/lib/data";

const PRIMA_ROOT = process.env.PRIMA_ROOT || "D:\\opsi2026\\prima-web";
const DATA_DIR = path.join(PRIMA_ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "prima.db");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function toPlainList<T>(rows: any[]): T[] {
  return rows.map((r) => ({ ...r })) as T[];
}
function toPlainOne<T>(row: any): T {
  return row ? ({ ...row } as T) : (row as T);
}

export type Stage =
  | "registered"
  | "pretest_done"
  | "educated"
  | "game_done"
  | "posttest_done"
  | "done";

function createTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      kelas TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'registered',
      pretest_total INTEGER,
      posttest_total INTEGER,
      game_score INTEGER,
      game_max INTEGER,
      reflection TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS world_progress (
      participant_id INTEGER PRIMARY KEY,
      episodes_done TEXT NOT NULL DEFAULT '[]',
      cards TEXT NOT NULL DEFAULT '[]',
      skills TEXT NOT NULL DEFAULT '[]',
      game_scores TEXT NOT NULL DEFAULT '{}',
      boss_defeated INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (participant_id) REFERENCES participants(id)
    );

    CREATE TABLE IF NOT EXISTS pretest_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      dimension TEXT NOT NULL,
      answer TEXT NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (participant_id) REFERENCES participants(id)
    );

    CREATE TABLE IF NOT EXISTS game_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      scenario_id INTEGER NOT NULL,
      construct TEXT NOT NULL,
      chosen TEXT,
      is_correct INTEGER,
      FOREIGN KEY (participant_id) REFERENCES participants(id)
    );

    CREATE TABLE IF NOT EXISTS posttest_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      dimension TEXT NOT NULL,
      answer TEXT NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (participant_id) REFERENCES participants(id)
    );

    CREATE TABLE IF NOT EXISTS response_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      answer TEXT NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY (participant_id) REFERENCES participants(id)
    );

    CREATE TABLE IF NOT EXISTS edu_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      title TEXT NOT NULL,
      dimension TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pretest_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      dimension TEXT NOT NULL,
      statement TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      construct TEXT NOT NULL,
      case_type TEXT NOT NULL,
      task TEXT NOT NULL,
      situation TEXT NOT NULL,
      options_json TEXT NOT NULL,
      feedback TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game_reflection_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      question TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS response_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      statement TEXT NOT NULL
    );
  `);
}

function seedEduModules(db: DatabaseSync) {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM edu_modules").get() as { n: number };
  if (n > 0) return;
  const ins = db.prepare(
    "INSERT INTO edu_modules (sort_order, title, dimension, body) VALUES (?, ?, ?, ?)",
  );
  EDU_SEED.forEach((m, i) => ins.run(i + 1, m.title, m.dimension, m.body));
}

function seedContentTables(db: DatabaseSync) {
  if ((db.prepare("SELECT COUNT(*) AS n FROM pretest_items").get() as { n: number }).n === 0) {
    const ins = db.prepare("INSERT INTO pretest_items (sort_order, dimension, statement) VALUES (?, ?, ?)");
    LOYALTY_ITEMS.forEach((it, i) => ins.run(i + 1, it.dimension, it.statement));
  }
  if ((db.prepare("SELECT COUNT(*) AS n FROM game_scenarios").get() as { n: number }).n === 0) {
    const ins = db.prepare(
      "INSERT INTO game_scenarios (sort_order, construct, case_type, task, situation, options_json, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    SCENARIOS.forEach((s, i) =>
      ins.run(i + 1, s.construct, s.caseType, s.task, s.situation, JSON.stringify(s.options), s.feedback),
    );
  }
  if ((db.prepare("SELECT COUNT(*) AS n FROM game_reflection_questions").get() as { n: number }).n === 0) {
    const ins = db.prepare("INSERT INTO game_reflection_questions (sort_order, question) VALUES (?, ?)");
    GAME_REFLECTION_QUESTIONS.forEach((q, i) => ins.run(i + 1, q));
  }
  if ((db.prepare("SELECT COUNT(*) AS n FROM response_items").get() as { n: number }).n === 0) {
    const ins = db.prepare("INSERT INTO response_items (sort_order, statement) VALUES (?, ?)");
    RESPONSE_ITEMS.forEach((it, i) => ins.run(i + 1, it.statement));
  }
}

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!db) {
    ensureDir();
    db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL;");
    db.exec("PRAGMA foreign_keys = ON;");
    createTables(db);
    seedEduModules(db);
    seedContentTables(db);
  }
  return db;
}

export interface EduModuleRow {
  id: number;
  sort_order: number;
  title: string;
  dimension: string;
  body: string;
}

export function getEduModules(): EduModuleRow[] {
  return toPlainList<EduModuleRow>(
    getDb()
      .prepare("SELECT id, sort_order, title, dimension, body FROM edu_modules ORDER BY sort_order, id")
      .all() as any,
  );
}

export function getEduModule(id: number): EduModuleRow | undefined {
  return toPlainOne<EduModuleRow | undefined>(
    getDb()
      .prepare("SELECT id, sort_order, title, dimension, body FROM edu_modules WHERE id = ?")
      .get(id) as any,
  );
}

export function createEduModule(title: string, dimension: string, body: string): number {
  const info = getDb()
    .prepare("INSERT INTO edu_modules (sort_order, title, dimension, body) VALUES ((SELECT COALESCE(MAX(sort_order),0)+1 FROM edu_modules), ?, ?, ?)")
    .run(title, dimension, body);
  return Number(info.lastInsertRowid);
}

export function updateEduModule(id: number, title: string, dimension: string, body: string): void {
  getDb()
    .prepare("UPDATE edu_modules SET title = ?, dimension = ?, body = ? WHERE id = ?")
    .run(title, dimension, body, id);
}

export function deleteEduModule(id: number): void {
  getDb().prepare("DELETE FROM edu_modules WHERE id = ?").run(id);
}

// ---- Pretest / posttest items (instrumen Likert, dipakai pretest & posttest) ----
export interface PretestItemRow {
  id: number;
  sort_order: number;
  dimension: string;
  statement: string;
}
export function getPretestItems(): PretestItemRow[] {
  return toPlainList<PretestItemRow>(
    getDb()
      .prepare("SELECT id, sort_order, dimension, statement FROM pretest_items ORDER BY sort_order, id")
      .all() as any,
  );
}
export function createPretestItem(dimension: string, statement: string): number {
  const info = getDb()
    .prepare("INSERT INTO pretest_items (sort_order, dimension, statement) VALUES ((SELECT COALESCE(MAX(sort_order),0)+1 FROM pretest_items), ?, ?)")
    .run(dimension, statement);
  return Number(info.lastInsertRowid);
}
export function updatePretestItem(id: number, dimension: string, statement: string): void {
  getDb().prepare("UPDATE pretest_items SET dimension = ?, statement = ? WHERE id = ?").run(dimension, statement, id);
}
export function deletePretestItem(id: number): void {
  getDb().prepare("DELETE FROM pretest_items WHERE id = ?").run(id);
}

// ---- Game scenarios (CHOOSE) ----
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
export function getGameScenarios(): Scenario[] {
  const rows = getDb()
    .prepare("SELECT id, sort_order, construct, case_type, task, situation, options_json, feedback FROM game_scenarios ORDER BY sort_order, id")
    .all() as unknown as { id: number; sort_order: number; construct: string; case_type: string; task: string; situation: string; options_json: string; feedback: string }[];
  return rows.map((r) => ({
    id: r.id,
    construct: r.construct,
    caseType: r.case_type,
    task: r.task,
    situation: r.situation,
    options: JSON.parse(r.options_json) as ScenarioOption[],
    feedback: r.feedback,
  }));
}
export function createGameScenario(
  construct: string,
  case_type: string,
  task: string,
  situation: string,
  options: ScenarioOption[],
  feedback: string,
): number {
  const info = getDb()
    .prepare("INSERT INTO game_scenarios (sort_order, construct, case_type, task, situation, options_json, feedback) VALUES ((SELECT COALESCE(MAX(sort_order),0)+1 FROM game_scenarios), ?, ?, ?, ?, ?, ?)")
    .run(construct, case_type, task, situation, JSON.stringify(options), feedback);
  return Number(info.lastInsertRowid);
}
export function updateGameScenario(
  id: number,
  construct: string,
  case_type: string,
  task: string,
  situation: string,
  options: ScenarioOption[],
  feedback: string,
): void {
  getDb()
    .prepare("UPDATE game_scenarios SET construct = ?, case_type = ?, task = ?, situation = ?, options_json = ?, feedback = ? WHERE id = ?")
    .run(construct, case_type, task, situation, JSON.stringify(options), feedback, id);
}
export function deleteGameScenario(id: number): void {
  getDb().prepare("DELETE FROM game_scenarios WHERE id = ?").run(id);
}

// ---- Game reflection questions (D.6) ----
export interface ReflectionQuestionRow {
  id: number;
  sort_order: number;
  question: string;
}
export function getGameReflectionQuestions(): ReflectionQuestionRow[] {
  return toPlainList<ReflectionQuestionRow>(
    getDb()
      .prepare("SELECT id, sort_order, question FROM game_reflection_questions ORDER BY sort_order, id")
      .all() as any,
  );
}
export function createReflectionQuestion(question: string): number {
  const info = getDb()
    .prepare("INSERT INTO game_reflection_questions (sort_order, question) VALUES ((SELECT COALESCE(MAX(sort_order),0)+1 FROM game_reflection_questions), ?)")
    .run(question);
  return Number(info.lastInsertRowid);
}
export function updateReflectionQuestion(id: number, question: string): void {
  getDb().prepare("UPDATE game_reflection_questions SET question = ? WHERE id = ?").run(question, id);
}
export function deleteReflectionQuestion(id: number): void {
  getDb().prepare("DELETE FROM game_reflection_questions WHERE id = ?").run(id);
}

// ---- Response items (angket respons) ----
export interface ResponseItemRow {
  id: number;
  sort_order: number;
  statement: string;
}
export function getResponseItems(): ResponseItemRow[] {
  return toPlainList<ResponseItemRow>(
    getDb()
      .prepare("SELECT id, sort_order, statement FROM response_items ORDER BY sort_order, id")
      .all() as any,
  );
}
export function createResponseItem(statement: string): number {
  const info = getDb()
    .prepare("INSERT INTO response_items (sort_order, statement) VALUES ((SELECT COALESCE(MAX(sort_order),0)+1 FROM response_items), ?)")
    .run(statement);
  return Number(info.lastInsertRowid);
}
export function updateResponseItem(id: number, statement: string): void {
  getDb().prepare("UPDATE response_items SET statement = ? WHERE id = ?").run(statement, id);
}
export function deleteResponseItem(id: number): void {
  getDb().prepare("DELETE FROM response_items WHERE id = ?").run(id);
}

export function getParticipant(id: number) {
  const row = getDb()
    .prepare("SELECT * FROM participants WHERE id = ?")
    .get(id);
  return toPlainOne<Record<string, unknown> | undefined>(row as any);
}

export function getParticipantByCode(code: string) {
  const row = getDb()
    .prepare("SELECT * FROM participants WHERE code = ?")
    .get(code);
  return toPlainOne<Record<string, unknown> | undefined>(row as any);
}

export function runTx(db: DatabaseSync, fn: () => void) {
  db.exec("BEGIN");
  try {
    fn();
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function resetDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export interface WorldProgress {
  participantId: number;
  episodesDone: number[];
  cards: string[];
  skills: string[];
  gameScores: Record<string, number>;
  bossDefeated: boolean;
}

export function getWorldProgress(pid: number): WorldProgress {
  const row = getDb()
    .prepare("SELECT episodes_done, cards, skills, game_scores, boss_defeated FROM world_progress WHERE participant_id = ?")
    .get(pid) as
    | { episodes_done: string; cards: string; skills: string; game_scores: string; boss_defeated: number }
    | undefined;
  if (!row) {
    getDb()
      .prepare("INSERT OR IGNORE INTO world_progress (participant_id) VALUES (?)")
      .run(pid);
    return { participantId: pid, episodesDone: [], cards: [], skills: [], gameScores: {}, bossDefeated: false };
  }
  const j = (s: string, d: unknown) => {
    try { return JSON.parse(s); } catch { return d; }
  };
  return {
    participantId: pid,
    episodesDone: j(row.episodes_done, []) as number[],
    cards: j(row.cards, []) as string[],
    skills: j(row.skills, []) as string[],
    gameScores: j(row.game_scores, {}) as Record<string, number>,
    bossDefeated: row.boss_defeated === 1,
  };
}

function saveProgress(p: WorldProgress) {
  getDb()
    .prepare(
      "INSERT INTO world_progress (participant_id, episodes_done, cards, skills, game_scores, boss_defeated) VALUES (?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(participant_id) DO UPDATE SET episodes_done=excluded.episodes_done, cards=excluded.cards, skills=excluded.skills, game_scores=excluded.game_scores, boss_defeated=excluded.boss_defeated",
    )
    .run(p.participantId, JSON.stringify(p.episodesDone), JSON.stringify(p.cards), JSON.stringify(p.skills), JSON.stringify(p.gameScores), p.bossDefeated ? 1 : 0);
}

export function awardEpisode(pid: number, episodeId: number, card: string, skill: string) {
  const p = getWorldProgress(pid);
  if (!p.episodesDone.includes(episodeId)) p.episodesDone.push(episodeId);
  if (card && !p.cards.includes(card)) p.cards.push(card);
  if (skill && !p.skills.includes(skill)) p.skills.push(skill);
  saveProgress(p);
}

export function awardCard(pid: number, card: string) {
  const p = getWorldProgress(pid);
  if (card && !p.cards.includes(card)) p.cards.push(card);
  saveProgress(p);
}

export function recordGameScore(pid: number, game: string, score: number) {
  const p = getWorldProgress(pid);
  p.gameScores[game] = Math.max(p.gameScores[game] ?? 0, score);
  saveProgress(p);
}

export function setBossDefeated(pid: number, defeated = true) {
  const p = getWorldProgress(pid);
  p.bossDefeated = defeated;
  saveProgress(p);
}