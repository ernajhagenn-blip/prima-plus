import { redirect } from "next/navigation";
import { currentParticipant, type SessionParticipant } from "@/lib/session";

export function pageForStage(stage: string): string {
  switch (stage) {
    case "registered":
      return "/pretest";
    case "pretest_done":
      return "/edukasi";
    case "educated":
      return "/game";
    case "game_done":
      return "/posttest";
    case "posttest_done":
      return "/respons";
    case "done":
      return "/selesai";
    default:
      return "/";
  }
}

export async function requireParticipantAt(expected: string): Promise<SessionParticipant> {
  const p = await currentParticipant();
  if (!p) redirect("/");
  const target = pageForStage(p.stage);
  if (target !== expected) redirect(target);
  return p;
}
