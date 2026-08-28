"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions-admin";
import { SubmitButton } from "@/components/SubmitButton";

export function AdminLogin() {
  const [state, formAction] = useActionState(adminLogin, null);

  return (
    <form action={formAction} className="mx-auto mt-10 max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Masuk Panel Admin</h2>
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-700">
          Kata Sandi Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>
      <SubmitButton label="Masuk" pendingLabel="Memeriksa…" />
    </form>
  );
}