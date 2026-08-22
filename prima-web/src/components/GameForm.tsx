"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitGame } from "@/app/actions";
import type { Scenario } from "@/lib/data";

export function GameForm({
  scenarios,
  reflectionQuestions,
}: {
  scenarios: Scenario[];
  reflectionQuestions: string[];
}) {
  const QUIZ_SCENARIOS = scenarios;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const reflectionRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const scenario = QUIZ_SCENARIOS[index];
  const isReflection = index >= QUIZ_SCENARIOS.length;
  const correctCount = Object.entries(selections).filter(([sid, key]) => {
    const s = QUIZ_SCENARIOS.find((x) => String(x.id) === sid);
    return s?.options.find((o) => o.key === key)?.correct;
  }).length;

  function choose(key: string) {
    if (locked) return;
    setChosen(key);
    setLocked(true);
    setSelections((prev) => ({ ...prev, [scenario.id]: key }));
  }

  function next() {
    if (index < QUIZ_SCENARIOS.length - 1) {
      setIndex((i) => i + 1);
      setChosen(null);
      setLocked(false);
    } else {
      setIndex(QUIZ_SCENARIOS.length);
    }
    setError(null);
  }

  function submit() {
    const parts = reflectionQuestions.map(
      (_, i) => reflectionRefs.current[i]?.value.trim() ?? "",
    );
    if (parts.some((p) => !p)) {
      setError("Isi keempat pertanyaan refleksi terlebih dahulu.");
      return;
    }
    const formData = new FormData();
    for (const [sid, key] of Object.entries(selections)) {
      formData.append(`s${sid}`, key);
    }
    formData.append("reflection", parts.map((p, i) => `Q${i + 1}: ${p}`).join(" | "));
    startTransition(async () => {
      const res = await submitGame(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/posttest");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Kasus {Math.min(index + 1, QUIZ_SCENARIOS.length + 1)} dari {QUIZ_SCENARIOS.length + 1}
        </span>
        <span>Skor sementara: {correctCount}</span>
      </div>

      {!isReflection ? (
        <div key={scenario.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            {scenario.construct}
          </span>
          <h2 className="mt-3 text-lg font-bold text-gray-900">{scenario.caseType}</h2>
          <p className="mt-1 text-sm text-gray-600">{scenario.task}</p>
          <p className="mt-3 rounded-lg bg-gray-50 px-4 py-3 italic text-gray-700">
            {scenario.situation}
          </p>

          <div className="mt-4 space-y-3">
            {scenario.options.map((opt) => {
              const isChosen = chosen === opt.key;
              let style = "border-gray-300 hover:border-gray-400";
              if (locked) {
                if (opt.correct) style = "border-green-600 bg-green-50 text-green-800";
                else if (isChosen) style = "border-red-600 bg-red-50 text-red-800";
                else style = "border-gray-200 opacity-60";
              } else if (isChosen) {
                style = "border-red-600 bg-red-50 text-red-700";
              }
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => choose(opt.key)}
                  disabled={locked}
                  className={`flex w-full items-start gap-3 rounded-lg border-2 px-4 py-3 text-left text-sm transition ${style} disabled:cursor-not-allowed`}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                    {opt.key.toUpperCase()}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {locked ? (
            <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">
                {chosen && scenario.options.find((o) => o.key === chosen)?.correct
                  ? "Tepat! Pilihanmu sesuai konteks."
                  : "Coba perhatikan kembali konteksnya."}
              </p>
              <p className="mt-1">{scenario.feedback}</p>
            </div>
          ) : null}

          {locked ? (
            <button
              type="button"
              onClick={next}
              className="mt-4 rounded-lg bg-red-700 px-6 py-2.5 font-semibold text-white transition hover:bg-red-800"
            >
              {index < QUIZ_SCENARIOS.length - 1 ? "Kasus Berikutnya →" : "Lanjut ke Refleksi →"}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            REFLECT — Why Did You Choose It?
          </span>
          <h2 className="mt-3 text-lg font-bold text-gray-900">Refleksi Pilihan Bahasa</h2>
          <p className="mt-1 text-sm text-gray-600">
            Jawablah keempat pertanyaan berikut untuk mengubah kuis menjadi proses language awareness.
          </p>

          <div className="mt-4 space-y-4">
            {reflectionQuestions.map((q, i) => (
              <div key={i}>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {i + 1}. {q}
                </label>
                <textarea
                  ref={(el) => {
                    reflectionRefs.current[i] = el;
                  }}
                  rows={3}
                  required
                  placeholder="Tuliskan jawabanmu…"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      ) : null}

      {isReflection ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="w-full rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Selesai Kuis → Lanjut ke Posttest"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIndex(QUIZ_SCENARIOS.length - 1);
              setChosen(selections[QUIZ_SCENARIOS[QUIZ_SCENARIOS.length - 1].id] ?? null);
              setLocked(true);
              setError(null);
            }}
            className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
          >
            ← Kembali ke kasus sebelumnya
          </button>
        </div>
      ) : null}
    </div>
  );
}
