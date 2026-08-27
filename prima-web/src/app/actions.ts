"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getDb,
  getParticipant,
  runTx,
  type Stage,
  getPretestItems,
  getGameScenarios,
  getResponseItems,
} from "@/lib/db";
import {
  createEduModule as createEduModuleDb,
  updateEduModule as updateEduModuleDb,
  deleteEduModule as deleteEduModuleDb,
} from "@/lib/db";
import {
  createPretestItem as createPretestItemDb,
  updatePretestItem as updatePretestItemDb,
  deletePretestItem as deletePretestItemDb,
  createGameScenario as createGameScenarioDb,
  updateGameScenario as updateGameScenarioDb,
  deleteGameScenario as deleteGameScenarioDb,
  createReflectionQuestion as createReflectionQuestionDb,
  updateReflectionQuestion as updateReflectionQuestionDb,
  deleteReflectionQuestion as deleteReflectionQuestionDb,
  createResponseItem as createResponseItemDb,
  updateResponseItem as updateResponseItemDb,
  deleteResponseItem as deleteResponseItemDb,
  textToGameOptions,
} from "@/lib/db";
import { PARTICIPANT_COOKIE, ADMIN_COOKIE } from "@/lib/constants";
import { LIKERT_OPTIONS } from "@/lib/data";
import { pageForStage } from "@/lib/flow";
import { isAdminAuthed } from "@/lib/session";
import { logRegistration, logPretest, logGame, logPosttest, logRespons } from "@/lib/googleSheets";

async function requireParticipant() {
  const cookieStore = await cookies();
  const id = Number(cookieStore.get(PARTICIPANT_COOKIE)?.value ?? 0);
  const p = id > 0 ? getParticipant(id) : undefined;
  if (!p) return null;
  return p as { id: number; code: string; name: string; kelas: string; stage: Stage };
}

function scoreValue(answer: string | null): number {
  const opt = LIKERT_OPTIONS.find((o) => o.value === answer);
  return opt?.score ?? 0;
}



export async function registerParticipant(prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();
  if (!name || !kelas) {
    return { error: "Nama dan kelas wajib diisi." };
  }

  const db = getDb();
  const count = (
    db.prepare("SELECT COUNT(*) AS n FROM participants").get() as { n: number }
  ).n;
  const code = `PRIMA-${String(count + 1).padStart(3, "0")}`;

  const info = db
    .prepare(
      "INSERT INTO participants (code, name, kelas, stage) VALUES (?, ?, ?, 'registered')",
    )
    .run(code, name, kelas);
  const id = Number(info.lastInsertRowid);

  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect("/");
}

export async function startJourney(prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();
  if (!name || !kelas) {
    return { error: "Nama dan kelas wajib diisi." };
  }

  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) AS n FROM participants").get() as { n: number }).n;
  const code = `PRIMA-${String(count + 1).padStart(3, "0")}`;
  const info = db
    .prepare("INSERT INTO participants (code, name, kelas, stage) VALUES (?, ?, ?, 'registered')")
    .run(code, name, kelas);
  const id = Number(info.lastInsertRowid);

  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  logRegistration({
    code,
    name,
    kelas,
    timestamp: new Date().toISOString(),
  });

  redirect("/story");
}

export async function submitPretest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; dimension: string; answer: string; score: number }[] =
    [];
  for (const item of getPretestItems()) {
    const value = String(formData.get(`q${item.id}`) ?? "");
    if (!value) {
      return { error: `Pertanyaan nomor ${item.id} belum dijawab.` };
    }
    answers.push({
      item_id: item.id,
      dimension: item.dimension,
      answer: value,
      score: scoreValue(value),
    });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT COUNT(*) AS n FROM pretest_answers WHERE participant_id = ?")
    .get(p.id) as { n: number };
  if (existing.n > 0) {
    return { error: "Pretest sudah dikerjakan." };
  }

  const insert = db.prepare(
    "INSERT INTO pretest_answers (participant_id, item_id, dimension, answer, score) VALUES (?, ?, ?, ?, ?)",
  );
  runTx(db, () => {
    for (const a of answers) {
      insert.run(p.id, a.item_id, a.dimension, a.answer, a.score);
    }
    const total = answers.reduce((s, a) => s + a.score, 0);
    db.prepare("UPDATE participants SET stage = 'pretest_done', pretest_total = ? WHERE id = ?").run(
      total,
      p.id,
    );
  });

  logPretest({
    code: p.code,
    name: p.name,
    kelas: p.kelas,
    total: answers.reduce((s, a) => s + a.score, 0),
    answers,
    timestamp: new Date().toISOString(),
  });

  redirect("/edukasi");
}

export async function submitGame(formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const db = getDb();
  const existing = db
    .prepare("SELECT COUNT(*) AS n FROM game_answers WHERE participant_id = ?")
    .get(p.id) as { n: number };
  if (existing.n > 0) {
    return { error: "Kuis PRIMA+ sudah dikerjakan." };
  }

  let score = 0;
  const scenarios = getGameScenarios();
  const max = scenarios.length;
  const rows: { scenario_id: number; construct: string; chosen: string | null; is_correct: number | null }[] =
    [];

  for (const scenario of scenarios) {
    if (scenario.options.length === 0) continue;
    const chosen = String(formData.get(`s${scenario.id}`) ?? "");
    const opt = scenario.options.find((o) => o.key === chosen);
    const correct = opt?.correct ?? false;
    if (correct) score += 1;
    rows.push({
      scenario_id: scenario.id,
      construct: scenario.construct,
      chosen: opt ? `${opt.key}. ${opt.text}` : null,
      is_correct: opt ? (correct ? 1 : 0) : null,
    });
  }

  const reflection = String(formData.get("reflection") ?? "").trim();
  if (!reflection) {
    return { error: "Refleksi pada kasus terakhir wajib diisi." };
  }

  const insert = db.prepare(
    "INSERT INTO game_answers (participant_id, scenario_id, construct, chosen, is_correct) VALUES (?, ?, ?, ?, ?)",
  );
  runTx(db, () => {
    for (const r of rows) {
      insert.run(p.id, r.scenario_id, r.construct, r.chosen, r.is_correct);
    }
    db.prepare(
      "UPDATE participants SET stage = 'game_done', game_score = ?, game_max = ?, reflection = ? WHERE id = ?",
    ).run(score, max, reflection, p.id);
  });

  logGame({
    code: p.code,
    name: p.name,
    kelas: p.kelas,
    score,
    max,
    answers: rows.map((r) => ({
      scenario_id: r.scenario_id,
      chosen: r.chosen || "",
      correct: r.is_correct === 1,
    })),
    timestamp: new Date().toISOString(),
  });

  redirect("/posttest");
}

export async function submitPosttest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; dimension: string; answer: string; score: number }[] =
    [];
  for (const item of getPretestItems()) {
    const value = String(formData.get(`q${item.id}`) ?? "");
    if (!value) {
      return { error: `Pertanyaan nomor ${item.id} belum dijawab.` };
    }
    answers.push({
      item_id: item.id,
      dimension: item.dimension,
      answer: value,
      score: scoreValue(value),
    });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT COUNT(*) AS n FROM posttest_answers WHERE participant_id = ?")
    .get(p.id) as { n: number };
  if (existing.n > 0) {
    return { error: "Posttest sudah dikerjakan." };
  }

  const insert = db.prepare(
    "INSERT INTO posttest_answers (participant_id, item_id, dimension, answer, score) VALUES (?, ?, ?, ?, ?)",
  );
  runTx(db, () => {
    for (const a of answers) {
      insert.run(p.id, a.item_id, a.dimension, a.answer, a.score);
    }
    const total = answers.reduce((s, a) => s + a.score, 0);
    db.prepare(
      "UPDATE participants SET stage = 'posttest_done', posttest_total = ? WHERE id = ?",
    ).run(total, p.id);
  });

  logPosttest({
    code: p.code,
    name: p.name,
    kelas: p.kelas,
    total: answers.reduce((s, a) => s + a.score, 0),
    answers,
    timestamp: new Date().toISOString(),
  });

  redirect("/respons");
}

export async function submitRespons(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; answer: string; score: number }[] = [];
  for (const item of getResponseItems()) {
    const value = String(formData.get(`r${item.id}`) ?? "");
    if (!value) {
      return { error: `Pernyataan nomor ${item.id} belum dijawab.` };
    }
    const score = ["1", "2", "3", "4"].includes(value)
      ? Number(value)
      : scoreValue(value);
    answers.push({ item_id: item.id, answer: value, score });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT COUNT(*) AS n FROM response_answers WHERE participant_id = ?")
    .get(p.id) as { n: number };
  if (existing.n > 0) {
    return { error: "Angket respons sudah dikerjakan." };
  }

  const insert = db.prepare(
    "INSERT INTO response_answers (participant_id, item_id, answer, score) VALUES (?, ?, ?, ?)",
  );
  runTx(db, () => {
    for (const a of answers) {
      insert.run(p.id, a.item_id, a.answer, a.score);
    }
    db.prepare("UPDATE participants SET stage = 'done' WHERE id = ?").run(p.id);
  });

  logRespons({
    code: p.code,
    name: p.name,
    kelas: p.kelas,
    answers: answers.map((a) => ({
      item_id: a.item_id,
      dimension: "",
      answer: a.answer,
    })),
    timestamp: new Date().toISOString(),
  });

  redirect("/selesai");
}

export async function adminLogin(prevState: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { error: "Kata sandi salah atau belum dikonfigurasi (ADMIN_PASSWORD)." };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function completeEdu(_formData: FormData) {
  void _formData;
  const p = await requireParticipant();
  if (!p) redirect("/");
  if (p.stage !== "pretest_done") redirect(pageForStage(p.stage));
  getDb().prepare("UPDATE participants SET stage = 'educated' WHERE id = ?").run(p.id);
  redirect("/game");
}

export async function createEduModule(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title && body) createEduModuleDb(title, dimension, body);
  redirect("/admin");
}

export async function updateEduModule(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (id && title && body) updateEduModuleDb(id, title, dimension, body);
  redirect("/admin");
}

export async function deleteEduModule(formData: FormData) {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) deleteEduModuleDb(id);
  redirect("/admin");
}

// ---- Pretest / posttest items ----
export async function createPretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (dimension && statement) createPretestItemDb(dimension, statement);
  redirect("/admin");
}
export async function updatePretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && dimension && statement) updatePretestItemDb(id, dimension, statement);
  redirect("/admin");
}
export async function deletePretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) deletePretestItemDb(id);
  redirect("/admin");
}

// ---- Game scenarios ----
export async function createGameScenario(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const construct = String(formData.get("construct") ?? "").trim();
  const case_type = String(formData.get("case_type") ?? "").trim();
  const task = String(formData.get("task") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
  const optionsText = String(formData.get("options") ?? "");
  const feedback = String(formData.get("feedback") ?? "").trim();
  const options = textToGameOptions(optionsText);
  if (construct && case_type && task && situation && options.length > 0 && feedback) {
    createGameScenarioDb(construct, case_type, task, situation, options, feedback);
  }
  redirect("/admin");
}
export async function updateGameScenario(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const construct = String(formData.get("construct") ?? "").trim();
  const case_type = String(formData.get("case_type") ?? "").trim();
  const task = String(formData.get("task") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
  const optionsText = String(formData.get("options") ?? "");
  const feedback = String(formData.get("feedback") ?? "").trim();
  const options = textToGameOptions(optionsText);
  if (id && construct && case_type && task && situation && options.length > 0 && feedback) {
    updateGameScenarioDb(id, construct, case_type, task, situation, options, feedback);
  }
  redirect("/admin");
}
export async function deleteGameScenario(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) deleteGameScenarioDb(id);
  redirect("/admin");
}

// ---- Game reflection questions ----
export async function createReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const question = String(formData.get("question") ?? "").trim();
  if (question) createReflectionQuestionDb(question);
  redirect("/admin");
}
export async function updateReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const question = String(formData.get("question") ?? "").trim();
  if (id && question) updateReflectionQuestionDb(id, question);
  redirect("/admin");
}
export async function deleteReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) deleteReflectionQuestionDb(id);
  redirect("/admin");
}

// ---- Response items ----
export async function createResponseItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const statement = String(formData.get("statement") ?? "").trim();
  if (statement) createResponseItemDb(statement);
  redirect("/admin");
}
export async function updateResponseItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && statement) updateResponseItemDb(id, statement);
  redirect("/admin");
}
export async function deleteResponseItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) deleteResponseItemDb(id);
  redirect("/admin");
}

// Generic delete dispatcher (avoids per-type action-id collisions in the form tree).
export async function adminDelete(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const kind = String(formData.get("kind") ?? "");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) {
    if (kind === "edu") deleteEduModuleDb(id);
    else if (kind === "pretest") deletePretestItemDb(id);
    else if (kind === "game") deleteGameScenarioDb(id);
    else if (kind === "reflection") deleteReflectionQuestionDb(id);
    else if (kind === "response") deleteResponseItemDb(id);
  }
  redirect("/admin");
}

// ============================================================================
// PRIMA WORLD — progres pemain (terpisah dari instrumen penelitian)
// ============================================================================
import {
  awardEpisode as awardEpisodeDb,
  recordGameScore as recordGameScoreDb,
  awardCard as awardCardDb,
  setBossDefeated as setBossDefeatedDb,
} from "@/lib/db";
import { EPISODES } from "@/lib/data";

export async function awardEpisodeAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/");
  const epId = Number(formData.get("episodeId") ?? 0);
  const card = String(formData.get("card") ?? "");
  const skill = String(formData.get("skill") ?? "");
  awardEpisodeDb(p.id, epId, card, skill);
  if (card) awardCardDb(p.id, card);
  const next = EPISODES.find((e) => e.id === epId + 1);
  if (next) redirect(`/journey/${next.id}`);
  redirect("/world");
}

export async function recordGameAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/intro");
  const game = String(formData.get("game") ?? "");
  const score = Number(formData.get("score") ?? 0);
  const card = String(formData.get("card") ?? "");
  if (game) recordGameScoreDb(p.id, game, score);
  if (card) awardCardDb(p.id, card);
  redirect("/world");
}

export async function defeatBossAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/intro");
  setBossDefeatedDb(p.id, true);
  awardCardDb(p.id, "Bahasa sebagai Jembatan");
  redirect("/world");
}

export async function submitFinalQuiz(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/world");
  const score = Number(formData.get("score") ?? 0);
  recordGameScoreDb(p.id, "final_quiz", score);
  redirect("/feedback");
}