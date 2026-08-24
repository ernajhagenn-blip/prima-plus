"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%", padding: "12px", borderRadius: "14px",
        fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
        color: "white", border: "none", cursor: pending ? "not-allowed" : "pointer",
        opacity: pending ? 0.5 : 1,
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        boxShadow: "0 4px 0 #5b21b6, 0 6px 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        transition: "all 0.15s",
      }}
    >
      {pending ? (pendingLabel ?? "Menyimpan…") : label}
    </button>
  );
}
