"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

export interface FormItem {
  id: number;
  statement: string;
}

interface Option {
  value: string;
  label: string;
}

type Action = (
  prevState: unknown,
  formData: FormData,
) => Promise<{ error?: string } | undefined>;

interface QuestionnaireFormProps {
  action: Action;
  items: FormItem[];
  options: Option[];
  namePrefix: string;
  instructions: string;
  submitLabel: string;
  dimensionByItem?: Record<number, string>;
}

interface ItemGroup {
  label: string | null;
  items: FormItem[];
}

function groupByDimension(
  items: FormItem[],
  dimensionByItem?: Record<number, string>,
): ItemGroup[] {
  if (!dimensionByItem) return [{ label: null, items }];
  const groups: ItemGroup[] = [];
  let current: ItemGroup | null = null;
  for (const item of items) {
    const dim = dimensionByItem[item.id];
    if (!current || current.label !== dim) {
      current = { label: dim, items: [] };
      groups.push(current);
    }
    current.items.push(item);
  }
  return groups;
}

export function QuestionnaireForm({
  action,
  items,
  options,
  namePrefix,
  instructions,
  submitLabel,
  dimensionByItem,
}: QuestionnaireFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [selected, setSelected] = useState<Record<number, string>>({});

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === items.length;
  const groups = groupByDimension(items, dimensionByItem);

  return (
    <form action={formAction}>
      {state?.error ? (
        <div style={{
          padding: "10px 14px", borderRadius: "10px", marginBottom: "16px",
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.2)",
          fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#fca5a5",
        }}>⚠️ {state.error}</div>
      ) : null}

      <p style={{
        padding: "10px 14px", borderRadius: "10px", marginBottom: "16px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600,
        color: "rgba(255,255,255,0.6)",
      }}>{instructions}</p>

      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: "20px" }}>
          {group.label ? (
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.08em", color: "#f472b6", textTransform: "uppercase",
              marginBottom: "12px",
            }}>{group.label}</p>
          ) : null}
          {group.items.map((item) => (
            <div key={item.id} style={{
              padding: "14px", borderRadius: "14px", marginBottom: "10px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700,
                color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.5,
              }}>{item.id}. {item.statement}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "10px" }}>
                {options.map((opt) => {
                  const active = selected[item.id] === opt.value;
                  return (
                    <label key={opt.value} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "8px 4px", borderRadius: "10px", cursor: "pointer",
                      border: active ? "2px solid #f43f5e" : "1px solid rgba(255,255,255,0.08)",
                      background: active ? "rgba(244,63,94,0.15)" : "rgba(255,255,255,0.03)",
                      transition: "all 0.2s",
                    }}>
                      <input
                        type="radio"
                        name={`${namePrefix}${item.id}`}
                        value={opt.value}
                        required
                        onChange={() => setSelected((prev) => ({ ...prev, [item.id]: opt.value }))}
                        style={{ display: "none" }}
                      />
                      <span style={{
                        fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700,
                        color: active ? "#f472b6" : "rgba(255,255,255,0.5)",
                      }}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
        <div style={{ flex: 1 }}>
          <SubmitButton label={submitLabel} pendingLabel="Menyimpan…" />
        </div>
        {!allAnswered ? (
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
          }}>{items.length - answeredCount} belum dijawab</p>
        ) : null}
      </div>
      {pending ? (
        <p style={{
          textAlign: "center", fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem",
          fontWeight: 600, color: "rgba(255,255,255,0.4)", marginTop: "8px",
        }}>Menyimpan data…</p>
      ) : null}
    </form>
  );
}
