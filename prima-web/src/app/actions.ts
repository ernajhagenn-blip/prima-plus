"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
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
  awardEpisode as awardEpisodeDb,
  recordGameScore as recordGameScoreDb,
  awardCard as awardCardDb,
  setBossDefeated as setBossDefeatedDb,
} from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { PARTICIPANT_COOKIE, ADMIN_COOKIE } from "@/lib/constants";
import { LIKERT_OPTIONS, EPISODES } from "@/lib/data";
import { pageForStage } from "@/lib/flow";
import { isAdminAuthed } from "@/lib/session";

async function requireParticipant() {
  const cookieStore = await cookies();
  const id = Number(cookieStore.get(PARTICIPANT_COOKIE)?.value ?? 0);
  const p = id > 0 ? await getParticipant(id) : undefined;
  if (!p) return null;
  return p as { id: number; name: string; kelas: string; stage: Stage };
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

  const count = await prisma.participant.count();
  const code = `PRIMA-${String(count + 1).padStart(3, "0")}`;
  const created = await prisma.participant.create({
    data: { code, name, kelas, stage: "registered" },
  });

  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(created.id), {
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

  const count = await prisma.participant.count();
  const code = `PRIMA-${String(count + 1).padStart(3, "0")}`;
  const created = await prisma.participant.create({
    data: { code, name, kelas, stage: "registered" },
  });

  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(created.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect("/hook");
}

export async function submitPretest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; dimension: string; answer: string; score: number }[] = [];
  const pretestItems = await getPretestItems();
  for (const item of pretestItems) {
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

  const existing = await prisma.pretestAnswer.count({ where: { participantId: p.id } });
  if (existing > 0) {
    return { error: "Pretest sudah dikerjakan." };
  }

  await runTx(async (tx) => {
    for (const a of answers) {
      await tx.pretestAnswer.create({
        data: {
          participantId: p.id,
          itemId: a.item_id,
          dimension: a.dimension,
          answer: a.answer,
          score: a.score,
        },
      });
    }
    const total = answers.reduce((s, a) => s + a.score, 0);
    await tx.participant.update({
      where: { id: p.id },
      data: { stage: "pretest_done", pretestTotal: total },
    });
  });

  redirect("/edukasi");
}

export async function submitGame(formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const existing = await prisma.gameAnswer.count({ where: { participantId: p.id } });
  if (existing > 0) {
    return { error: "Kuis PRIMA+ sudah dikerjakan." };
  }

  let score = 0;
  const scenarios = await getGameScenarios();
  const max = scenarios.length;
  const rows: { scenario_id: number; construct: string; chosen: string | null; is_correct: number | null }[] = [];

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

  await runTx(async (tx) => {
    for (const r of rows) {
      await tx.gameAnswer.create({
        data: {
          participantId: p.id,
          scenarioId: r.scenario_id,
          construct: r.construct,
          chosen: r.chosen,
          isCorrect: r.is_correct,
        },
      });
    }
    await tx.participant.update({
      where: { id: p.id },
      data: { stage: "game_done", gameScore: score, gameMax: max, reflection },
    });
  });

  redirect("/posttest");
}

export async function submitPosttest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; dimension: string; answer: string; score: number }[] = [];
  const pretestItems = await getPretestItems();
  for (const item of pretestItems) {
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

  const existing = await prisma.posttestAnswer.count({ where: { participantId: p.id } });
  if (existing > 0) {
    return { error: "Posttest sudah dikerjakan." };
  }

  await runTx(async (tx) => {
    for (const a of answers) {
      await tx.posttestAnswer.create({
        data: {
          participantId: p.id,
          itemId: a.item_id,
          dimension: a.dimension,
          answer: a.answer,
          score: a.score,
        },
      });
    }
    const total = answers.reduce((s, a) => s + a.score, 0);
    await tx.participant.update({
      where: { id: p.id },
      data: { stage: "posttest_done", posttestTotal: total },
    });
  });

  redirect("/respons");
}

export async function submitRespons(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const answers: { item_id: number; answer: string; score: number }[] = [];
  const responseItems = await getResponseItems();
  for (const item of responseItems) {
    const value = String(formData.get(`r${item.id}`) ?? "");
    if (!value) {
      return { error: `Pernyataan nomor ${item.id} belum dijawab.` };
    }
    const score = ["1", "2", "3", "4"].includes(value)
      ? Number(value)
      : scoreValue(value);
    answers.push({ item_id: item.id, answer: value, score });
  }

  const existing = await prisma.responseAnswer.count({ where: { participantId: p.id } });
  if (existing > 0) {
    return { error: "Angket respons sudah dikerjakan." };
  }

  await runTx(async (tx) => {
    for (const a of answers) {
      await tx.responseAnswer.create({
        data: {
          participantId: p.id,
          itemId: a.item_id,
          answer: a.answer,
          score: a.score,
        },
      });
    }
    await tx.participant.update({
      where: { id: p.id },
      data: { stage: "done" },
    });
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
  await prisma.participant.update({
    where: { id: p.id },
    data: { stage: "educated" },
  });
  redirect("/game");
}

export async function createEduModuleAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title && body) await createEduModuleDb(title, dimension, body);
  redirect("/admin");
}

export async function updateEduModuleAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (id && title && body) await updateEduModuleDb(id, title, dimension, body);
  redirect("/admin");
}

export async function deleteEduModuleAction(formData: FormData) {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteEduModuleDb(id);
  redirect("/admin");
}

// ---- Pretest / posttest items ----
export async function createPretestItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (dimension && statement) await createPretestItemDb(dimension, statement);
  redirect("/admin");
}
export async function updatePretestItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && dimension && statement) await updatePretestItemDb(id, dimension, statement);
  redirect("/admin");
}
export async function deletePretestItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deletePretestItemDb(id);
  redirect("/admin");
}

// ---- Game scenarios ----
export async function createGameScenarioAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const construct = String(formData.get("construct") ?? "").trim();
  const case_type = String(formData.get("case_type") ?? "").trim();
  const task = String(formData.get("task") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
  const optionsText = String(formData.get("options") ?? "");
  const feedback = String(formData.get("feedback") ?? "").trim();
  const options = textToGameOptions(optionsText);
  if (construct && case_type && task && situation && options.length > 0 && feedback) {
    await createGameScenarioDb(construct, case_type, task, situation, options, feedback);
  }
  redirect("/admin");
}
export async function updateGameScenarioAction(formData: FormData): Promise<void> {
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
    await updateGameScenarioDb(id, construct, case_type, task, situation, options, feedback);
  }
  redirect("/admin");
}
export async function deleteGameScenarioAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteGameScenarioDb(id);
  redirect("/admin");
}

// ---- Game reflection questions ----
export async function createReflectionQuestionAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const question = String(formData.get("question") ?? "").trim();
  if (question) await createReflectionQuestionDb(question);
  redirect("/admin");
}
export async function updateReflectionQuestionAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const question = String(formData.get("question") ?? "").trim();
  if (id && question) await updateReflectionQuestionDb(id, question);
  redirect("/admin");
}
export async function deleteReflectionQuestionAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteReflectionQuestionDb(id);
  redirect("/admin");
}

// ---- Response items ----
export async function createResponseItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const statement = String(formData.get("statement") ?? "").trim();
  if (statement) await createResponseItemDb(statement);
  redirect("/admin");
}
export async function updateResponseItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && statement) await updateResponseItemDb(id, statement);
  redirect("/admin");
}
export async function deleteResponseItemAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteResponseItemDb(id);
  redirect("/admin");
}

// Generic delete dispatcher (avoids per-type action-id collisions in the form tree).
export async function adminDelete(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const kind = String(formData.get("kind") ?? "");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) {
    if (kind === "edu") await deleteEduModuleDb(id);
    else if (kind === "pretest") await deletePretestItemDb(id);
    else if (kind === "game") await deleteGameScenarioDb(id);
    else if (kind === "reflection") await deleteReflectionQuestionDb(id);
    else if (kind === "response") await deleteResponseItemDb(id);
  }
  redirect("/admin");
}

// ============================================================================
// PRIMA WORLD — progres pemain (terpisah dari instrumen penelitian)
// ============================================================================

export async function awardEpisodeAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/");
  const epId = Number(formData.get("episodeId") ?? 0);
  const card = String(formData.get("card") ?? "");
  const skill = String(formData.get("skill") ?? "");
  await awardEpisodeDb(p.id, epId, card, skill);
  if (card) await awardCardDb(p.id, card);
  const next = EPISODES.find((e) => e.id === epId + 1);
  if (next) redirect(`/journey/${next.id}`);
  redirect("/world");
}

export async function recordGameAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) return;
  const game = String(formData.get("game") ?? "");
  const score = Number(formData.get("score") ?? 0);
  const card = String(formData.get("card") ?? "");
  if (game) await recordGameScoreDb(p.id, game, score);
  if (card) await awardCardDb(p.id, card);
}

export async function defeatBossAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) return;
  await setBossDefeatedDb(p.id, true);
  await awardCardDb(p.id, "Bahasa sebagai Jembatan");
}

export async function submitFinalQuiz(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/world");
  const score = Number(formData.get("score") ?? 0);
  await recordGameScoreDb(p.id, "final_quiz", score);
  redirect("/feedback");
}
