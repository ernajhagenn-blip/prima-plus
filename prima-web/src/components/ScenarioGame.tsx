"use client";

import { useState } from "react";
import { recordGameAction } from "@/app/actions";
import { logActivity } from "@/lib/logActivity";
import type { Scenario } from "@/lib/data";

export default function ScenarioGame({
  title,
  subtitle,
  intro,
  scenarios,
  gameKey,
  cardReward,
}: {
  title: string;
  subtitle: string;
  intro: string;
  scenarios: Scenario[];
  gameKey: string;
  cardReward?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const sc = scenarios[idx];
  const isLast = idx === scenarios.length - 1;

  function choose(key: string) {
    if (picked) return;
    setPicked(key);
    if (sc.options.find((o) => o.key === key)?.correct) {
      setCorrectCount((c) => c + 1);
    }
  }

  function next() {
    if (isLast) {
      setDone(true);
      void logActivity("activity", {
        activity_key: gameKey,
        activity_type: "mini_game",
        score: correctCount,
        accuracy: scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0,
        correct: correctCount,
        total: scenarios.length,
        detail: { title, subtitle },
      });
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }

  if (done) {
    const score = correctCount;
    const max = scenarios.length;
    return (
      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-black text-green-700">Selesai! 🏁</h3>
        <p className="mt-2 text-sm text-gray-700">
          Skor bahasa sadar: <strong>{score}</strong> dari {max} checkpoint.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {score === max
            ? "Luar biasa — kamu konsisten memilih ragam yang tepat!"
            : "Terus latih konteks, kejelasan, dan kesantunan di tiap situasi."}
        </p>
        <form action={recordGameAction} className="mt-4">
          <input type="hidden" name="game" value={gameKey} />
          <input type="hidden" name="score" value={score} />
          {cardReward ? (
            <input type="hidden" name="card" value={cardReward} />
          ) : null}
          <button
            type="submit"
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Simpan Skor & Klaim Kartu →
          </button>
        </form>
      </div>
    );
  }

  const pickedOpt = sc.options.find((o) => o.key === picked);

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-red-700">
          {sc.caseType}
        </span>
        <span className="text-xs text-gray-400">
          Checkpoint {idx + 1}/{scenarios.length}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-800">{sc.situation}</p>
      <p className="mt-1 text-sm text-gray-600">{sc.task}</p>

      <div className="mt-4 space-y-2">
        {sc.options.map((o) => {
          const state =
            picked && o.key === picked
              ? o.correct
                ? "correct"
                : "wrong"
              : picked && o.correct
                ? "correct-dim"
                : "";
          return (
            <button
              key={o.key}
              type="button"
              disabled={!!picked}
              onClick={() => choose(o.key)}
              className={`block w-full rounded-xl border p-3 text-left text-sm transition ${
                state === "correct"
                  ? "border-green-500 bg-green-50"
                  : state === "wrong"
                    ? "border-red-400 bg-red-50"
                    : state === "correct-dim"
                      ? "border-green-300 bg-green-50/60"
                      : "border-gray-200 hover:border-red-300"
              } ${picked ? "" : "cursor-pointer"}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>

      {picked && pickedOpt && (
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <p
            className={`text-xs font-bold ${
              pickedOpt.correct ? "text-green-700" : "text-red-600"
            }`}
          >
            {pickedOpt.correct ? "Tepat" : "Belum tepat"}
          </p>
          <p className="mt-1 text-sm text-gray-700">{sc.feedback}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            {isLast ? "Lihat Hasil" : "Checkpoint Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}
