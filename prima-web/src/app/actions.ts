"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getParticipant,
  getPretestItems,
  getGameScenarios,
  getResponseItems,
  gameOptionsToTextSync,
  textToGameOptions,
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
} from "@/lib/db";
import { createServiceClient } from "@/utils/supabase/server";
import { PARTICIPANT_COOKIE, ADMIN_COOKIE } from "@/lib/constants";
import { LIKERT_OPTIONS } from "@/lib/data";
import { pageForStage } from "@/lib/flow";
import { isAdminAuthed } from "@/lib/session";
import { logRegistration, logPretest, logGame, logPosttest, logRespons } from "@/lib/googleSheets";

// SERVER-ONLY. Semua tulis data lewat Server Action → pakai service role
// (bypass RLS). Siswa anonim (cookie), tidak pakai Supabase Auth.
// Baca data penelitian digate oleh isAdminAuthed (cookie ADMIN_COOKIE).
const svc = () => createServiceClient();

async function requireParticipant() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PARTICIPANT_COOKIE)?.value ?? "";
  if (!raw) return null;

  // Fallback mode: cookie contains JSON
  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as { id: number; code: string; name: string; kelas: string; stage: string };
    } catch {
      return null;
    }
  }

  // DB mode
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) return null;
  try {
    const p = await getParticipant(id);
    if (!p) return null;
    return p as { id: number; code: string; name: string; kelas: string; stage: string };
  } catch {
    return null;
  }
}

function scoreValue(answer: string | null): number {
  const opt = LIKERT_OPTIONS.find((o) => o.value === answer);
  return opt?.score ?? 0;
}

async function nextParticipantCode(): Promise<string> {
  // service client untuk count
  const { createServiceClient } = await import("@/utils/supabase/server");
  const sb = createServiceClient();
  const { count, error } = await sb.from("participants").select("*", { count: "exact", head: true });
  if (error) throw error;
  return `PRIMA-${String((count ?? 0) + 1).padStart(3, "0")}`;
}

export async function registerParticipant(prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();
  if (!name || !kelas) {
    return { error: "Nama dan kelas wajib diisi." };
  }

  const code = await nextParticipantCode();
  const { data, error } = await svc()
    .from("participants")
    .insert({ code, name, kelas, stage: "registered" })
    .select("id")
    .single();
  if (error) return { error: "Gagal menyimpan peserta: " + error.message };

  const participantId = Number((data as { id: number }).id);
  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(participantId), {
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

  let participantId: number;
  let code: string;

  try {
    code = await nextParticipantCode();
    const { data, error } = await svc()
      .from("participants")
      .insert({ code, name, kelas, stage: "registered" })
      .select("id, code")
      .single();
    if (error) throw error;
    participantId = Number((data as { id: number; code: string }).id);
    code = (data as { code: string }).code;
  } catch (e) {
    // Fallback: no Supabase, store in cookie as JSON
    code = `PRIMA-${String(Math.floor(Math.random() * 900) + 100)}`;
    participantId = Date.now();
    const participantObj = { id: participantId, code, name, kelas, stage: "registered" };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(participantObj), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
    logRegistration({ code, name, kelas, timestamp: new Date().toISOString() });
    redirect("/story");
  }

  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, String(participantId), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
  });

  logRegistration({ code, name, kelas, timestamp: new Date().toISOString() });
  redirect("/story");
}

export async function submitPretest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const items = await getPretestItems();
  const answers: { item_id: number; dimension: string; answer: string; score: number }[] = [];
  for (const item of items) {
    const value = String(formData.get(`q${item.id}`) ?? "");
    if (!value) return { error: `Pertanyaan nomor ${item.id} belum dijawab.` };
    answers.push({ item_id: item.id, dimension: item.dimension, answer: value, score: scoreValue(value) });
  }

  const total = answers.reduce((s, a) => s + a.score, 0);

  try {
    const sb = svc();
    const { count } = await sb.from("pretest_answers").select("*", { count: "exact", head: true }).eq("participant_id", p.id);
    if (count && count > 0) return { error: "Pretest sudah dikerjakan." };

    const { error: insErr } = await sb.from("pretest_answers").insert(
      answers.map((a) => ({ participant_id: p.id, item_id: a.item_id, dimension: a.dimension, answer: a.answer, score: a.score })),
    );
    if (insErr) return { error: "Gagal menyimpan pretest: " + insErr.message };

    const { error: updErr } = await sb.from("participants").update({ stage: "pretest_done", pretest_total: total }).eq("id", p.id);
    if (updErr) return { error: "Gagal update status: " + updErr.message };
  } catch {
    // Fallback: update cookie stage
    const updated = { ...p, stage: "pretest_done" };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(updated), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
  }

  logPretest({ code: p.code, name: p.name, kelas: p.kelas, total, answers, timestamp: new Date().toISOString() });
  redirect("/edukasi");
}

export async function submitGame(formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const scenarios = await getGameScenarios();
  const max = scenarios.length;
  const rows: { scenario_id: number; construct: string; chosen: string | null; is_correct: number | null }[] = [];

  for (const scenario of scenarios) {
    if (scenario.options.length === 0) continue;
    const chosen = String(formData.get(`s${scenario.id}`) ?? "");
    const opt = scenario.options.find((o) => o.key === chosen);
    const correct = opt?.correct ?? false;
    rows.push({
      scenario_id: scenario.id,
      construct: scenario.construct,
      chosen: opt ? `${opt.key}. ${opt.text}` : null,
      is_correct: opt ? (correct ? 1 : 0) : null,
    });
  }

  const reflection = String(formData.get("reflection") ?? "").trim();
  if (!reflection) return { error: "Refleksi pada kasus terakhir wajib diisi." };

  const score = rows.filter((r) => r.is_correct === 1).length;

  try {
    const sb = svc();
    const { count } = await sb.from("game_answers").select("*", { count: "exact", head: true }).eq("participant_id", p.id);
    if (count && count > 0) return { error: "Kuis PRIMA+ sudah dikerjakan." };

    const { error: insErr } = await sb.from("game_answers").insert(
      rows.map((r) => ({ participant_id: p.id, scenario_id: r.scenario_id, construct: r.construct, chosen: r.chosen, is_correct: r.is_correct })),
    );
    if (insErr) return { error: "Gagal menyimpan kuis: " + insErr.message };

    const { error: updErr } = await sb
      .from("participants")
      .update({ stage: "game_done", game_score: score, game_max: max, reflection })
      .eq("id", p.id);
    if (updErr) return { error: "Gagal update status: " + updErr.message };
  } catch {
    const updated = { ...p, stage: "game_done", game_score: score, game_max: max, reflection };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(updated), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
  }

  logGame({
    code: p.code, name: p.name, kelas: p.kelas, score, max,
    answers: rows.map((r) => ({ scenario_id: r.scenario_id, construct: r.construct, chosen: r.chosen || "", correct: r.is_correct === 1 })),
    reflection, timestamp: new Date().toISOString(),
  });
  redirect("/posttest");
}

export async function submitPosttest(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const items = await getPretestItems();
  const answers: { item_id: number; dimension: string; answer: string; score: number }[] = [];
  for (const item of items) {
    const value = String(formData.get(`q${item.id}`) ?? "");
    if (!value) return { error: `Pertanyaan nomor ${item.id} belum dijawab.` };
    answers.push({ item_id: item.id, dimension: item.dimension, answer: value, score: scoreValue(value) });
  }

  const total = answers.reduce((s, a) => s + a.score, 0);

  try {
    const sb = svc();
    const { count } = await sb.from("posttest_answers").select("*", { count: "exact", head: true }).eq("participant_id", p.id);
    if (count && count > 0) return { error: "Posttest sudah dikerjakan." };

    const { error: insErr } = await sb.from("posttest_answers").insert(
      answers.map((a) => ({ participant_id: p.id, item_id: a.item_id, dimension: a.dimension, answer: a.answer, score: a.score })),
    );
    if (insErr) return { error: "Gagal menyimpan posttest: " + insErr.message };

    const { error: updErr } = await sb.from("participants").update({ stage: "posttest_done", posttest_total: total }).eq("id", p.id);
    if (updErr) return { error: "Gagal update status: " + updErr.message };
  } catch {
    const updated = { ...p, stage: "posttest_done" };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(updated), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
  }

  logPosttest({ code: p.code, name: p.name, kelas: p.kelas, total, answers, timestamp: new Date().toISOString() });
  redirect("/respons");
}

export async function submitRespons(prevState: unknown, formData: FormData) {
  const p = await requireParticipant();
  if (!p) return { error: "Sesi tidak ditemukan. Silakan daftar ulang." };

  const items = await getResponseItems();
  const answers: { item_id: number; answer: string; score: number }[] = [];
  for (const item of items) {
    const value = String(formData.get(`r${item.id}`) ?? "");
    if (!value) return { error: `Pernyataan nomor ${item.id} belum dijawab.` };
    const score = ["1", "2", "3", "4"].includes(value) ? Number(value) : scoreValue(value);
    answers.push({ item_id: item.id, answer: value, score });
  }

  try {
    const sb = svc();
    const { count } = await sb.from("response_answers").select("*", { count: "exact", head: true }).eq("participant_id", p.id);
    if (count && count > 0) return { error: "Angket respons sudah dikerjakan." };

    const { error: insErr } = await sb.from("response_answers").insert(
      answers.map((a) => ({ participant_id: p.id, item_id: a.item_id, answer: a.answer, score: a.score })),
    );
    if (insErr) return { error: "Gagal menyimpan angket: " + insErr.message };

    const { error: updErr } = await sb.from("participants").update({ stage: "done" }).eq("id", p.id);
    if (updErr) return { error: "Gagal update status: " + updErr.message };
  } catch {
    const updated = { ...p, stage: "done" };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(updated), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
  }

  logRespons({
    code: p.code, name: p.name, kelas: p.kelas,
    answers: answers.map((a) => ({ item_id: a.item_id, dimension: "", answer: a.answer })),
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
  cookieStore.set(ADMIN_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 4 });
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
  try {
    const sb = svc();
    const { error } = await sb.from("participants").update({ stage: "educated" }).eq("id", p.id);
    if (error) throw error;
  } catch {
    const updated = { ...p, stage: "educated" };
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE, JSON.stringify(updated), {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
  }
  redirect("/game");
}

export async function createEduModule(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title && body) await createEduModuleDb(title, dimension, body);
  redirect("/admin");
}

export async function updateEduModule(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const dimension = String(formData.get("dimension") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (id && title && body) await updateEduModuleDb(id, title, dimension, body);
  redirect("/admin");
}

export async function deleteEduModule(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteEduModuleDb(id);
  redirect("/admin");
}

// ---- Pretest / posttest items ----
export async function createPretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (dimension && statement) await createPretestItemDb(dimension, statement);
  redirect("/admin");
}
export async function updatePretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const dimension = String(formData.get("dimension") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && dimension && statement) await updatePretestItemDb(id, dimension, statement);
  redirect("/admin");
}
export async function deletePretestItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deletePretestItemDb(id);
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
    await createGameScenarioDb(construct, case_type, task, situation, options, feedback);
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
    await updateGameScenarioDb(id, construct, case_type, task, situation, options, feedback);
  }
  redirect("/admin");
}
export async function deleteGameScenario(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteGameScenarioDb(id);
  redirect("/admin");
}

// ---- Game reflection questions ----
export async function createReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const question = String(formData.get("question") ?? "").trim();
  if (question) await createReflectionQuestionDb(question);
  redirect("/admin");
}
export async function updateReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const question = String(formData.get("question") ?? "").trim();
  if (id && question) await updateReflectionQuestionDb(id, question);
  redirect("/admin");
}
export async function deleteReflectionQuestion(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  if (id > 0) await deleteReflectionQuestionDb(id);
  redirect("/admin");
}

// ---- Response items ----
export async function createResponseItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const statement = String(formData.get("statement") ?? "").trim();
  if (statement) await createResponseItemDb(statement);
  redirect("/admin");
}
export async function updateResponseItem(formData: FormData): Promise<void> {
  if (!(await isAdminAuthed())) redirect("/admin");
  const id = Number(formData.get("id") ?? 0);
  const statement = String(formData.get("statement") ?? "").trim();
  if (id && statement) await updateResponseItemDb(id, statement);
  redirect("/admin");
}
export async function deleteResponseItem(formData: FormData): Promise<void> {
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
  try {
    await awardEpisodeDb(p.id, epId, card, skill);
    if (card) await awardCardDb(p.id, card);
  } catch (e) {
    console.error("awardEpisodeAction DB error (skipped):", e);
  }
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
  try {
    if (game) await recordGameScoreDb(p.id, game, score);
    if (card) await awardCardDb(p.id, card);
  } catch (e) {
    console.error("recordGameAction DB error (skipped):", e);
  }
  redirect("/world");
}

export async function defeatBossAction(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/intro");
  try {
    await setBossDefeatedDb(p.id, true);
    await awardCardDb(p.id, "Bahasa sebagai Jembatan");
  } catch (e) {
    console.error("defeatBossAction DB error (skipped):", e);
  }
  redirect("/world");
}

export async function submitFinalQuiz(formData: FormData): Promise<void> {
  const p = await requireParticipant();
  if (!p) redirect("/world");
  const score = Number(formData.get("score") ?? 0);
  try {
    await recordGameScoreDb(p.id, "final_quiz", score);
  } catch (e) {
    console.error("submitFinalQuiz DB error (skipped):", e);
  }
  redirect("/feedback");
}
