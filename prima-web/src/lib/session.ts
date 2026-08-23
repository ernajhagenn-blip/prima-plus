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
  const id = Number(cookieStore.get(PARTICIPANT_COOKIE)?.value ?? 0);
  if (id <= 0) return null;
  const row = await getParticipant(id);
  if (!row) return null;
  return row as unknown as SessionParticipant;
}

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "1";
}
