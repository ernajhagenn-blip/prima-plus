import { redirect } from "next/navigation";
import { currentParticipant } from "@/lib/session";
import { getWorldProgress } from "@/lib/db";
import { EPISODES } from "@/lib/data";
import WorldHub from "@/components/game/WorldHub";

export const dynamic = "force-dynamic";

export default async function WorldPage() {
  const p = await currentParticipant();
  if (!p) redirect("/");

  const prog = getWorldProgress(p.id);
  const total = EPISODES.length;
  const episodesDone = prog.episodesDone.length;

  return (
    <WorldHub
      episodesDone={episodesDone}
      total={total}
      cards={prog.cards.length}
      gameScores={prog.gameScores}
    />
  );
}
