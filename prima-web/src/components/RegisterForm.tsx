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
    <form action={formAction}>
      {state?.error ? (
        <div style={{
          padding: "10px 14px", borderRadius: "10px", marginBottom: "12px",
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)",
          fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#fca5a5",
        }}>⚠️ {state.error}</div>
      ) : null}

      <div style={{ marginBottom: "10px" }}>
        <label style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
          color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px",
        }}>👤 Nama Lengkap</label>
        <input name="name" type="text" required placeholder="Tulis nama kamu..."
          style={{
            width: "100%", borderRadius: "10px", padding: "10px 12px",
            fontSize: "0.8rem", fontWeight: 600, color: "white",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
          color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px",
        }}>🎓 Jenjang</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {JENJANG.map((j) => (
            <button key={j.label} type="button"
              onClick={() => { setJenjang(j.label === "SMP/MTs" ? "SMP" : "SMA"); setKelas(""); setShowCustom(false); }}
              style={{
                padding: "10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                border: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA")
                  ? "2px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                background: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA")
                  ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.05)",
                color: (jenjang === "SMP" && j.label === "SMP/MTs") || (jenjang === "SMA" && j.label === "SMA/MA")
                  ? "#c084fc" : "rgba(255,255,255,0.5)",
              }}
            >{j.label}</button>
          ))}
        </div>
      </div>

      {jenjang && (
        <div style={{ marginBottom: "10px" }}>
          <label style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
            color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px",
          }}>📋 Kelas</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {JENJANG.find((j) => (jenjang === "SMP" ? j.label === "SMP/MTs" : j.label === "SMA/MA"))?.kelas.map((k) => (
              <button key={k} type="button" onClick={() => { setKelas(k); setShowCustom(false); }}
                style={{
                  padding: "10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s",
                  border: kelas === k && !showCustom ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.1)",
                  background: kelas === k && !showCustom ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.05)",
                  color: kelas === k && !showCustom ? "#f472b6" : "rgba(255,255,255,0.5)",
                }}
              >{k}</button>
            ))}
            <button type="button" onClick={() => setShowCustom(true)}
              style={{
                padding: "10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                border: showCustom ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.1)",
                background: showCustom ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.05)",
                color: showCustom ? "#f472b6" : "rgba(255,255,255,0.5)",
              }}
            >✏️ Lainnya</button>
          </div>
          {showCustom && (
            <input value={customKelas} onChange={(e) => setCustomKelas(e.target.value)}
              placeholder="Tulis kelas kamu..."
              style={{
                marginTop: "8px", width: "100%", borderRadius: "10px", padding: "10px 12px",
                fontSize: "0.8rem", fontWeight: 600, color: "white",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(236,72,153,0.3)",
                outline: "none", boxSizing: "border-box",
              }}
            />
          )}
          <input type="hidden" name="kelas" value={selectedKelas} />
        </div>
      )}

      <input type="hidden" name="name" />

      <div style={{
        padding: "12px 14px", borderRadius: "12px", marginTop: "8px",
        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)",
      }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
          color: "#93c5fd", margin: 0,
        }}>🎯 Alur kamu:</p>
        <ol style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 600,
          color: "rgba(255,255,255,0.5)", margin: "4px 0 0", paddingLeft: "16px",
          lineHeight: 1.8,
        }}>
          <li>Pretest — 15 pernyataan</li>
          <li>Belajar — 6 modul interaktif</li>
          <li>Main — 8 kasus + 6 mini game</li>
          <li>Posttest — 15 pernyataan lagi</li>
          <li>Angket respons</li>
        </ol>
      </div>

      <div style={{ marginTop: "12px" }}>
        <SubmitButton label="🚀 Mulai!" pendingLabel="Masuk..." />
      </div>
      {pending && (
        <p style={{
          textAlign: "center", fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem",
          fontWeight: 700, color: "rgba(255,255,255,0.4)", marginTop: "6px",
        }}>Menyimpan...</p>
      )}
    </form>
  );
}
