"use client";

import { useState } from "react";
import { gameAudio } from "@/lib/gameAudio";

export default function GameSoundToggle() {
  const [muted, setMuted] = useState(gameAudio.muted);
  return (
    <button
      onClick={() => { const m = !muted; setMuted(m); gameAudio.setMuted(m); }}
      aria-label={muted ? "Nyalakan suara" : "Bisukan suara"}
      style={{
        position: "fixed", top: 14, right: 14, zIndex: 60,
        width: 44, height: 44, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.35)",
        background: "rgba(22,16,48,0.65)", backdropFilter: "blur(10px)",
        fontSize: 18, cursor: "pointer", color: "white",
        boxShadow: "0 4px 0 rgba(12,8,32,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
