"use client";

import { useActionState, useState } from "react";
import { registerParticipant } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

const KELAS_OPTIONS = ["X", "XI"];

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerParticipant, null);
  const [kelas, setKelas] = useState("X");

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-700">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Contoh: Andini Putri"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div>
        <label htmlFor="kelas" className="mb-1 block text-sm font-semibold text-gray-700">
          Kelas
        </label>
        <div className="grid grid-cols-2 gap-3">
          {KELAS_OPTIONS.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 font-semibold transition ${
                kelas === k
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="kelas"
                value={k}
                checked={kelas === k}
                onChange={() => setKelas(k)}
                className="sr-only"
              />
              Kelas {k}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold">Alur yang akan kamu ikuti:</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Pretest — 20 pernyataan tentang loyalitas berbahasa</li>
          <li>Kuis PRIMA+ — 5 kasus bahasa dengan umpan balik</li>
          <li>Posttest — 20 pernyataan yang sama</li>
          <li>Angket respons — pengalaman menggunakan PRIMA+</li>
        </ol>
      </div>

      <SubmitButton label="Mulai Mengerjakan" pendingLabel="Mendaftar…" />
      {pending ? <p className="text-center text-sm text-gray-500">Menyimpan data…</p> : null}
    </form>
  );
}