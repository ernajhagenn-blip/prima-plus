"use client";

import { useActionState, useState } from "react";
import { registerParticipant } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

const JENJANG = [
  { label: "SMP/MTs", kelas: ["VII", "VIII", "IX"] },
  { label: "SMA/MA", kelas: ["X", "XI", "XII"] },
];

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerParticipant, null);
  const [jenjang, setJenjang] = useState<"SMP" | "SMA" | "">("");
  const [kelas, setKelas] = useState("");
  const [customKelas, setCustomKelas] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const selectedKelas = showCustom ? customKelas : kelas;

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          ⚠️ {state.error}
        </div>
      ) : null}

      <div>
        <label className="mb-1.5 block text-sm font-black text-gray-800">👤 Nama Lengkap</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Tulis nama kamu..."
          className="w-full rounded-xl border-2 border-cyan-200 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-black text-gray-800">🎓 Jenjang</label>
        <div className="grid grid-cols-2 gap-2">
          {JENJANG.map((j) => (
            <button
              key={j.label}
              type="button"
              onClick={() => { setJenjang(j.label === "SMP/MTs" ? "SMP" : "SMA"); setKelas(""); setShowCustom(false); }}
              className="rounded-xl border-2 py-3 text-sm font-bold transition"
              style={{
                border: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA") ? "3px solid #42A5F5" : "2px solid rgba(0,0,0,0.08)",
                background: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA") ? "linear-gradient(135deg, #BBDEFB, #E3F2FD)" : "rgba(255,255,255,0.8)",
                color: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA") ? "#1565C0" : "#757575",
              }}
            >
              {j.label}
            </button>
          ))}
        </div>
      </div>

      {jenjang && (
        <div>
          <label className="mb-1.5 block text-sm font-black text-gray-800">📋 Kelas</label>
          <div className="grid grid-cols-3 gap-2">
            {JENJANG.find((j) => (jenjang === "SMP" ? j.label === "SMP/MTs" : j.label === "SMA/MA"))?.kelas.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => { setKelas(k); setShowCustom(false); }}
                className="rounded-xl border-2 py-3 text-sm font-bold transition"
                style={{
                  border: kelas === k && !showCustom ? "3px solid #FF7043" : "2px solid rgba(0,0,0,0.08)",
                  background: kelas === k && !showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "rgba(255,255,255,0.8)",
                  color: kelas === k && !showCustom ? "#E65100" : "#757575",
                }}
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="rounded-xl border-2 py-3 text-sm font-bold transition"
              style={{
                border: showCustom ? "3px solid #FF7043" : "2px solid rgba(0,0,0,0.08)",
                background: showCustom ? "linear-gradient(135deg, #FFE0B2, #FFF3E0)" : "rgba(255,255,255,0.8)",
                color: showCustom ? "#E65100" : "#757575",
              }}
            >
              ✏️ Lainnya
            </button>
          </div>
          {showCustom && (
            <input
              value={customKelas}
              onChange={(e) => setCustomKelas(e.target.value)}
              placeholder="Tulis kelas kamu..."
              className="mt-2 w-full rounded-xl border-2 border-orange-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400"
            />
          )}
          <input type="hidden" name="kelas" value={selectedKelas} />
        </div>
      )}

      <input type="hidden" name="name" />

      <div className="rounded-xl border-2 border-blue-100 bg-blue-50/80 px-4 py-3 text-xs text-blue-700">
        <p className="font-black">🎯 Alur kamu:</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-4 font-semibold">
          <li>Pretest — 15 pernyataan</li>
          <li>Belajar — 6 modul interaktif</li>
          <li>Main — 8 kasus + 6 mini game</li>
          <li>Posttest — 15 pernyataan lagi</li>
          <li>Angket respons</li>
        </ol>
      </div>

      <SubmitButton label="🚀 Mulai!" pendingLabel="Masuk..." />
      {pending && <p className="text-center text-xs text-gray-500">Menyimpan...</p>}
    </form>
  );
}
