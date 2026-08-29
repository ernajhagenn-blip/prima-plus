"use client";

import { useState } from "react";
import Link from "next/link";
import { recordGameAction } from "@/app/actions";
import { useJourney } from "@/lib/store";
import { KARTS } from "@/components/game/karts";
import KartRace3DWeb from "@/components/games/KartRace3DWeb";

function posLabel(n: number) {
  if (n === 1) return "1 (Juara)";
  if (n === 2) return "2";
  if (n === 3) return "3";
  return String(n);
}

type QuizDetail = { domain: string; indicator: string; question: string; chosen: string; chosenText: string; isCorrect: boolean; feedback: string };

export default function LanguageKartPage() {
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalPosition, setFinalPosition] = useState(8);
  const [quizDetails, setQuizDetails] = useState<QuizDetail[]>([]);
  const kartKey = useJourney((s) => s.kartKey);
  const kart = KARTS.find((k) => k.key === kartKey) ?? KARTS[0];

  if (done) {
    return (
      <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "#0b0d22", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ padding: "30px 34px", borderRadius: 20, background: "rgba(24,26,58,0.97)", border: "2px solid rgba(255,211,77,0.45)", textAlign: "center", maxWidth: 420, width: "100%" }}>
          <p style={{ fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: "1.7rem", fontWeight: 900, color: "#FFD34D", margin: 0 }}>
            {finalPosition === 1 ? "🏆 Juara Grand Prix!" : "Balapan Selesai"}
          </p>
          <div style={{ display: "flex", gap: 18, justifyContent: "center", margin: "18px 0" }}>
            <div>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>POSISI</p>
              <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.4rem", color: "white", fontWeight: 900, margin: 0 }}>{posLabel(finalPosition)}</p>
            </div>
            <div>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>SKOR</p>
              <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.4rem", color: "#4ade80", fontWeight: 900, margin: 0 }}>{finalScore}</p>
            </div>
            <div>
              <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>TANTANGAN</p>
              <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.4rem", color: "#22d3ee", fontWeight: 900, margin: 0 }}>{finalCorrect} benar</p>
            </div>
          </div>
          <p style={{ fontFamily: "Arial, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "6px 0 20px", lineHeight: 1.5 }}>
            Setiap tantangan yang kamu jawab melatih kepekaan memilih ragam bahasa. Hasil ini tersimpan pada profil latihanmu.
          </p>
          <form action={recordGameAction}>
            <input type="hidden" name="game" value="language_kart" />
            <input type="hidden" name="score" value={finalScore} />
            <input type="hidden" name="card" value="Pengendali Kata" />
            <input type="hidden" name="quizDetails" value={JSON.stringify(quizDetails)} />
            <button type="submit" style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Righteous', 'Arial Black', sans-serif", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
              Simpan & Kembali
            </button>
          </form>
          <Link href="/world" style={{ display: "block", marginTop: 12, fontFamily: "Arial, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            Kembali ke PRIMA CITY
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden", background: "#0b0d22" }}>
      <KartRace3DWeb
        onComplete={(score, correct, position, details) => {
          setFinalScore(score);
          setFinalCorrect(correct);
          setFinalPosition(position);
          setQuizDetails(details);
          setDone(true);
        }}
        kartBody={kart.body}
        kartAccent={kart.accent}
      />
    </main>
  );
}
