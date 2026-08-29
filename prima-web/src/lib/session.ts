import { cookies } from "next/headers";
import { getParticipant } from "@/lib/db";
import { ADMIN_COOKIE, PARTICIPANT_COOKIE } from "@/lib/constants";

export interface SessionParticipant {
  id: number;
  code: string;
  name: string;
  kelas: string;
  stage: string;
}

export async function currentParticipant(): Promise<SessionParticipant | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PARTICIPANT_COOKIE)?.value ?? "";
  if (!raw) return null;

  // Fallback mode: cookie contains JSON participant data
  if (raw.startsWith("{")) {
    try {
      return JSON.parse(raw) as SessionParticipant;
    } catch {
      return null;
    }
  }

  // Supabase mode: cookie contains participant ID
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) return null;
  try {
    const row = await getParticipant(id);
    if (!row) return null;
    return row as unknown as SessionParticipant;
  } catch {
    return null;
  }
}

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}
