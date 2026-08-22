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
    <form action={formAction} className="space-y-6">
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">{instructions}</p>

      {groups.map((group, gi) => (
        <div key={gi} className="space-y-4">
          {group.label ? (
            <p className="text-sm font-bold uppercase tracking-wide text-red-800">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="font-medium text-gray-900">
                {item.id}. {item.statement}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {options.map((opt) => {
                  const active = selected[item.id] === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-2 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${namePrefix}${item.id}`}
                        value={opt.value}
                        required
                        onChange={() =>
                          setSelected((prev) => ({ ...prev, [item.id]: opt.value }))
                        }
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SubmitButton label={submitLabel} pendingLabel="Menyimpan…" />
        </div>
        {!allAnswered ? (
          <p className="text-xs text-gray-500">
            {items.length - answeredCount} pernyataan belum dijawab
          </p>
        ) : null}
      </div>
      {pending ? <p className="text-center text-sm text-gray-500">Menyimpan data…</p> : null}
    </form>
  );
}