"use client";

import { useState } from "react";
import Link from "next/link";
import { recordGameAction } from "@/app/actions";
import { useJourney } from "@/lib/store";
import { KARTS } from "@/components/game/karts";
import KartRace3D from "@/components/games/KartRace3D";

export default function LanguageKartPage() {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [eduScore, setEduScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const kartKey = useJourney((s) => s.kartKey);
  const kart = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  if (done) {
    return (
      <main style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, background: "#050510", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "32px 40px", borderRadius: 20, background: "rgba(15,15,45,0.95)", border: "1px solid rgba(124,58,237,0.4)", textAlign: "center", maxWidth: 400, width: "90%" }}>
          <p style={{ fontFamily: "'Arial Black'", fontSize: "1.8rem", fontWeight: 900, color: "white", margin: 0 }}>SELESAI!</p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", margin: "16px 0" }}>
            <div>
              <p style={{ fontFamily: "Arial", fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0 }}>SKOR BALAP</p>
              <p style={{ fontFamily: "'Arial Black'", fontSize: "1.5rem", color: "#22d3ee", fontWeight: 900 }}>{score}</p>
            </div>
            <div>
              <p style={{ fontFamily: "Arial", fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0 }}>JAWABAN BENAR</p>
              <p style={{ fontFamily: "'Arial Black'", fontSize: "1.5rem", color: "#22c55e", fontWeight: 900 }}>{totalCorrect}</p>
            </div>
          </div>
          <p style={{ fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "8px 0 20px" }}>
            {score >= 120 ? "Luar biasa! Kamu penguasa bahasa Indonesia!" : score >= 60 ? "Bagus! Masih bisa lebih baik lagi." : "Ayo terus belajar bahasa Indonesia!"}
          </p>
          <form action={recordGameAction}>
            <input type="hidden" name="game" value="language_kart" />
            <input type="hidden" name="score" value={score} />
            <input type="hidden" name="card" value="Pengendali Kata" />
            <button type="submit" style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Arial Black'", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>
              Simpan & Kembali
            </button>
          </form>
          <Link href="/world" style={{ display: "block", marginTop: 12, fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            ← Kembali ke PRIMA CITY
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", background: "#050510" }}>
      <KartRace3D
        onComplete={(s, edu, correct) => {
          setScore(s);
          setEduScore(edu);
          setTotalCorrect(correct);
          setDone(true);
        }}
        kartBody={kart.body}
        kartAccent={kart.accent}
      />
    </main>
  );
}
