import { createServiceClient } from "@/utils/supabase/server";

export type DatasetKey =
  | "participants"
  | "pretest"
  | "game"
  | "posttest"
  | "respons"
  | "activity"
  | "chat"
  | "feedback";

export const DATASET_KEYS: DatasetKey[] = [
  "participants",
  "pretest",
  "game",
  "posttest",
  "respons",
  "activity",
  "chat",
  "feedback",
];

export const DATASET_META: { key: DatasetKey; label: string; desc: string }[] = [
  { key: "participants", label: "Data Registrasi & Status", desc: "Kode, nama, kelas, tahap, skor" },
  { key: "pretest", label: "Jawaban Pretest", desc: "15 pernyataan loyalitas (sebelum)" },
  { key: "game", label: "Jawaban Kuis PRIMA+", desc: "8 kasus pilihan konteks" },
  { key: "posttest", label: "Jawaban Posttest", desc: "15 pernyataan loyalitas (sesudah)" },
  { key: "respons", label: "Angket Respons", desc: "10 pernyataan tanggapan" },
  { key: "activity", label: "Log Aktivitas Game", desc: "Skor & akurasi tiap mini-game/quiz" },
  { key: "chat", label: "Jawaban Chat & Refleksi", desc: "Pilihan skenario + refleksi diri" },
  { key: "feedback", label: "Feedback Siswa", desc: "Saran & bagian favorit" },
];

export async function fetchRows(key: DatasetKey): Promise<Record<string, unknown>[]> {
  const sb = createServiceClient();
  switch (key) {
    case "participants":
      return (await sb.from("participants").select("*").order("id")).data ?? [];
    case "pretest":
      return (
        (await sb.from("pretest_answers").select("participant_id, item_id, dimension, answer, score, participants(code, name, kelas)").order("participant_id").order("item_id")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        item_id: r.item_id,
        dimension: r.dimension,
        answer: r.answer,
        score: r.score,
      }));
    case "game":
      return (
        (await sb.from("game_answers").select("participant_id, scenario_id, construct, chosen, is_correct, participants(code, name, kelas)").order("participant_id").order("scenario_id")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        scenario_id: r.scenario_id,
        construct: r.construct,
        chosen: r.chosen ?? "",
        is_correct: r.is_correct,
      }));
    case "posttest":
      return (
        (await sb.from("posttest_answers").select("participant_id, item_id, dimension, answer, score, participants(code, name, kelas)").order("participant_id").order("item_id")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        item_id: r.item_id,
        dimension: r.dimension,
        answer: r.answer,
        score: r.score,
      }));
    case "respons":
      return (
        (await sb.from("response_answers").select("participant_id, item_id, answer, score, participants(code, name, kelas)").order("participant_id").order("item_id")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        item_id: r.item_id,
        answer: r.answer,
        score: r.score,
      }));
    case "activity":
      return (
        (await sb.from("activity_log").select("participant_id, activity_key, activity_type, score, accuracy, correct, total, duration_ms, detail_json, created_at, participants(code, name, kelas)").order("participant_id").order("created_at")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        activity_key: r.activity_key,
        activity_type: r.activity_type,
        score: r.score,
        accuracy: r.accuracy,
        correct: r.correct,
        total: r.total,
        duration_ms: r.duration_ms,
        detail: JSON.stringify(r.detail_json),
        created_at: r.created_at,
      }));
    case "chat":
      return (
        (await sb.from("chat_answers").select("participant_id, scenario_index, scenario_title, domain, chosen_text, tone, is_correct, reflections, participants(code, name, kelas)").order("participant_id").order("scenario_index")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        scenario_index: r.scenario_index,
        scenario_title: r.scenario_title,
        domain: r.domain ?? "",
        chosen_text: r.chosen_text ?? "",
        tone: r.tone ?? "",
        is_correct: r.is_correct,
        reflections: JSON.stringify(r.reflections),
      }));
    case "feedback":
      return (
        (await sb.from("feedback").select("participant_id, message, favorite_part, created_at, participants(code, name, kelas)").order("participant_id").order("created_at")).data ?? []
      ).map((r: any) => ({
        code: r.participants?.code ?? "",
        name: r.participants?.name ?? "",
        kelas: r.participants?.kelas ?? "",
        message: r.message,
        favorite_part: r.favorite_part ?? "",
        created_at: r.created_at,
      }));
  }
}

const LABELS: Record<string, string> = {
  id: "ID", code: "Kode", name: "Nama", kelas: "Kelas", stage: "Tahap",
  pretest_total: "Pretest", posttest_total: "Posttest", game_score: "Skor Game",
  game_max: "Max", reflection: "Refleksi", created_at: "Waktu",
  item_id: "No", dimension: "Dimensi", answer: "Jawaban", score: "Skor",
  scenario_id: "Skenario", construct: "Konstruk", chosen: "Pilihan", is_correct: "Benar",
  activity_key: "Game", activity_type: "Tipe", accuracy: "Akurasi",
  correct: "Benar", total: "Total", duration_ms: "Durasi(ms)", detail: "Detail",
  scenario_index: "Idx", scenario_title: "Skenario", domain: "Domain", chosen_text: "Teks", tone: "Nada",
  reflections: "Refleksi", message: "Pesan", favorite_part: "Favorit",
};

export function colLabel(key: string): string {
  return LABELS[key] ?? key;
}
