"use client";

import { useState } from "react";
import { awardEpisodeAction } from "@/app/actions";
import type { Episode, EpisodeOption } from "@/lib/data";

const LAYER_LABELS: Record<keyof EpisodeOption["feedback"], string> = {
  observation: "Observasi",
  context: "Konteks",
  languageEffect: "Efek Bahasa",
  alternative: "Alternatif",
  reflection: "Refleksi",
  transfer: "Transfer",
};

export default function EpisodeDecision({
  episode,
}: {
  episode: Episode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const chosen = episode.options.find((o) => o.key === selected) ?? null;

  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-red-700">
          Keputusan
        </h3>
        <p className="mt-2 text-sm font-medium text-gray-800">
          {episode.decisionPrompt}
        </p>
        <div className="mt-4 space-y-2">
          {episode.options.map((o) => (
            <label
              key={o.key}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                selected === o.key
                  ? "border-red-500 bg-white shadow"
                  : "border-gray-200 bg-white hover:border-red-300"
              }`}
            >
              <input
                type="radio"
                name="opt"
                value={o.key}
                checked={selected === o.key}
                onChange={() => {
                  setSelected(o.key);
                  setRevealed(false);
                }}
                className="mt-1"
              />
              <span className="text-gray-800">{o.text}</span>
            </label>
          ))}
        </div>

        {!revealed && (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setRevealed(true)}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Lihat Umpan Balik
          </button>
        )}
      </div>

      {revealed && chosen && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div
            className={`mb-3 inline-block rounded-lg px-3 py-1 text-xs font-bold ${
              chosen.best
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {chosen.best ? "Pilihan Paling Sadar" : "Pilihan Terkait Kebiasaan"}
          </div>
          <div className="space-y-3">
            {(Object.keys(LAYER_LABELS) as (keyof EpisodeOption["feedback"])[]).map(
              (k) => (
                <div key={k}>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {LAYER_LABELS[k]}
                  </p>
                  <p className="text-sm text-gray-700">{chosen.feedback[k]}</p>
                </div>
              ),
            )}
          </div>

          <form action={awardEpisodeAction} className="mt-5">
            <input type="hidden" name="episodeId" value={episode.id} />
            <input type="hidden" name="card" value={episode.cardReward} />
            <input type="hidden" name="skill" value={episode.skillReward} />
            <button
              type="submit"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Klaim Hadiah & Lanjut →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
