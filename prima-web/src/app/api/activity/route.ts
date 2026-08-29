import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/utils/supabase/server";
import { PARTICIPANT_COOKIE } from "@/lib/constants";

// Menerima hasil aktivitas siswa (chat, mini-game, kart, quiz, feedback) dari
// client component dan menyimpannya ke Supabase via service-role client (server-only).
// Body: { kind: "chat"|"activity"|"feedback", payload: {...} }
// participant_id diambil dari cookie httpOnly (server-side, tidak bisa dibaca JS)

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON tidak valid" }, { status: 400 });
  }

  const kind = body?.kind;
  const payload = body?.payload ?? {};

  const cookieStore = await cookies();
  const pidVal = cookieStore.get(PARTICIPANT_COOKIE)?.value;

  if (!pidVal) {
    return NextResponse.json({ ok: false, error: "partisipan tidak terdaftar" }, { status: 401 });
  }

  let pid: number | null = null;
  if (pidVal.startsWith("{")) {
    try {
      const parsed = JSON.parse(pidVal);
      pid = Number(parsed.id);
    } catch {}
  } else {
    pid = Number(pidVal);
  }

  if (!pid || !Number.isFinite(pid) || pid <= 0) {
    return NextResponse.json({ ok: false, error: "partisipan tidak terdaftar" }, { status: 401 });
  }

  const sb = createServiceClient();

  // pastikan partisipan benar-benar ada (cegah spoofing id dari client)
  const { data: pRow, error: pErr } = await sb
    .from("participants")
    .select("id")
    .eq("id", pid)
    .maybeSingle();
  if (pErr || !pRow) {
    return NextResponse.json({ ok: false, error: "partisipan tidak ditemukan" }, { status: 401 });
  }

  try {
    if (kind === "chat") {
      const { error } = await sb.from("chat_answers").insert({
        participant_id: pid,
        scenario_index: Number(payload.scenario_index ?? 0),
        scenario_title: String(payload.scenario_title ?? ""),
        domain: payload.domain != null ? String(payload.domain) : null,
        chosen_text: payload.chosen_text != null ? String(payload.chosen_text) : null,
        tone: payload.tone != null ? String(payload.tone) : null,
        is_correct: payload.is_correct === 1 || payload.is_correct === true ? 1 : 0,
        reflections: Array.isArray(payload.reflections) ? payload.reflections : [],
      });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (kind === "activity") {
      const { error } = await sb.from("activity_log").insert({
        participant_id: pid,
        activity_key: String(payload.activity_key ?? "unknown"),
        activity_type: String(payload.activity_type ?? "mini_game"),
        score: payload.score != null ? Number(payload.score) : null,
        accuracy: payload.accuracy != null ? Number(payload.accuracy) : null,
        correct: payload.correct != null ? Number(payload.correct) : null,
        total: payload.total != null ? Number(payload.total) : null,
        duration_ms: payload.duration_ms != null ? Number(payload.duration_ms) : null,
        detail_json: payload.detail ?? {},
      });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (kind === "feedback") {
      const { error } = await sb.from("feedback").insert({
        participant_id: pid,
        message: String(payload.message ?? ""),
        favorite_part: payload.favorite_part != null ? String(payload.favorite_part) : null,
      });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "kind tidak dikenali" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "server error" }, { status: 500 });
  }
}
