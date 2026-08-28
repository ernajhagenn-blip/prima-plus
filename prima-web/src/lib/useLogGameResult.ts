"use client";

import { useEffect, useRef } from "react";
import { logActivity } from "@/lib/logActivity";

// Hook: catat hasil permainan ke Supabase sekali saja saat result tampil.
// activityKey = path/key unik game (mis. "context-match", "language-kart", "quiz").
// payload minimal: { score, accuracy, correct, total, durationMs, detail }
export function useLogGameResult(
  activityKey: string,
  activityType: "mini_game" | "kart" | "quiz" | "world",
  showResult: boolean,
  payload: Record<string, unknown>,
) {
  const fired = useRef(false);
  useEffect(() => {
    if (!showResult || fired.current) return;
    fired.current = true;
    void logActivity("activity", { activity_key: activityKey, activity_type: activityType, ...payload });
  }, [showResult, activityKey, activityType, payload]);
}
