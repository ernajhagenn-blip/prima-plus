"use client";

import { useEffect, useRef } from "react";
import { logActivity } from "@/lib/logActivity";

export function useLogGameResult(
  activityKey: string,
  activityType: "mini_game" | "kart" | "quiz" | "world",
  showResult: boolean,
  payload: Record<string, unknown>,
) {
  const fired = useRef(false);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  useEffect(() => {
    if (!showResult || fired.current) return;
    fired.current = true;
    void logActivity("activity", { activity_key: activityKey, activity_type: activityType, ...payloadRef.current });
  }, [showResult, activityKey, activityType]);
}
