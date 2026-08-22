"use client";

import { useState } from "react";
import { defeatBossAction } from "@/app/actions";
import type { BossRound } from "@/lib/data";

export default function BossBattle({
  rounds,
}: {
  rounds: BossRound[];
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wins, setWins] = useState(0);
  const [done, setDone] = useState(false);

  const r = rounds[idx];
  const isLast = idx === rounds.length - 1;

  function choose(key: string) {
    if (picked) return;
    setPicked(key);
    if (r.options.find((o) => o.key === key)?.best) setWins((w) => w + 1);
  }

  function next() {
    if (isLast) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }

  if (done) {
    const defeated = wins >= Math.ceil(rounds.length / 2);
    return (
      <div
        className={`mt-5 rounded-2xl border p-5 ${
          defeated
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <h3 className="text-lg font-black">
          {defeated ? "AUTO-PILOT Dihentikan! 🤖✅" : "AUTO-PILOT Masih Mengemudi"}
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          Ronde sadar dimenangkan: <strong>{wins}</strong> dari {rounds.length}.
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {defeated
            ? "Kamu membuktikan bahwa bahasa adalah keputusan, bukan kebiasaan otomatis."
            : "Latih lagi: mengenali 'karena semua orang begitu' adalah langkah pertama mengambil kendali."}
        </p>
        <form action={defeatBossAction} className="mt-4">
          <button
            type="submit"
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            {defeated ? "Klaim Kemenangan & Kartu →" : "Simpan Progres →"}
          </button>
        </form>
      </div>
    );
  }

  const pickedOpt = r.options.find((o) => o.key === picked);

  return (
    <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-900 p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-300">
          Ronde {r.round}/{rounds.length} · AUTO-PILOT
        </span>
        <span className="text-xs text-gray-400">Menang: {wins}</span>
      </div>
      <p className="mt-2 text-sm text-gray-200">
        <span className="font-bold text-gray-400">Situasi:</span> {r.situation}
      </p>
      <p className="mt-2 rounded-lg bg-gray-800 p-3 text-sm italic text-gray-300">
        “{r.claim}” — <span className="not-italic text-gray-500">AUTO-PILOT</span>
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Dites: {r.tested} · Dilatih: {r.trained}
      </p>

      <div className="mt-4 space-y-2">
        {r.options.map((o) => {
          const state =
            picked && o.key === picked
              ? o.best
                ? "correct"
                : "wrong"
              : picked && o.best
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
                  ? "border-green-400 bg-green-500/20"
                  : state === "wrong"
                    ? "border-red-400 bg-red-500/20"
                    : state === "correct-dim"
                      ? "border-green-400/60 bg-green-500/10"
                      : "border-gray-600 bg-gray-800 hover:border-red-400"
              } ${picked ? "" : "cursor-pointer"}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>

      {picked && pickedOpt && (
        <div className="mt-4 rounded-xl bg-gray-800 p-3">
          <p
            className={`text-xs font-bold ${
              pickedOpt.best ? "text-green-400" : "text-red-300"
            }`}
          >
            {pickedOpt.best ? "Kendali diambil kembali" : "Otomatisasi menang"}
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            {isLast ? "Tantangan Selesai" : "Ronde Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}
