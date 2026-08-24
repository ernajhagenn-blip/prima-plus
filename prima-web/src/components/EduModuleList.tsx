"use client";

import { useState } from "react";

interface Module {
  id: number;
  sort_order: number;
  title: string;
  dimension: string;
  body: string;
}

const DIMENSION_COLORS: Record<string, string> = {
  "Sikap Positif": "from-blue-500 to-cyan-400",
  "Kesetiaan Penggunaan": "from-emerald-500 to-teal-400",
  "Kesadaran Norma": "from-amber-500 to-orange-400",
  Kebanggaan: "from-rose-500 to-pink-400",
  "Refleksi Kritis": "from-violet-500 to-purple-400",
};

const DIMENSION_ICONS: Record<string, string> = {
  "Sikap Positif": "💡",
  "Kesetiaan Penggunaan": "✍️",
  "Kesadaran Norma": "🎯",
  Kebanggaan: "🇮🇩",
  "Refleksi Kritis": "🔍",
};

function renderBody(body: string) {
  const paragraphs = body.split(/\n{2,}/);
  return paragraphs.map((para, i) => {
    // Handle bold text (**text**)
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="mb-3 last:mb-0">
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="font-bold text-gray-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function EduModuleList({ modules }: { modules: Module[] }) {
  const [readSet, setReadSet] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(
    modules.length > 0 ? modules[0].id : null,
  );

  const progress = Math.round((readSet.size / modules.length) * 100);

  const toggleRead = (id: number) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Progres Edukasi</span>
          <span>
            {readSet.size}/{modules.length} modul terbaca
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="mt-2 text-xs font-bold text-emerald-600">
            ✅ Semua modul sudah dibaca! Silakan lanjut ke kuis.
          </p>
        )}
      </div>

      {/* Module cards */}
      {modules.map((m, i) => {
        const isRead = readSet.has(m.id);
        const isExpanded = expandedId === m.id;
        const gradientClass = DIMENSION_COLORS[m.dimension] || "from-gray-500 to-gray-400";
        const icon = DIMENSION_ICONS[m.dimension] || "📖";

        return (
          <div
            key={m.id}
            className={`group relative overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm transition-all animate-slide-up ${
              isRead
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-md"
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Gradient top bar */}
            <div
              className={`h-1 bg-gradient-to-r ${gradientClass}`}
            />

            <div className="p-5">
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span className="mt-0.5 text-xl">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Modul {i + 1}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isRead
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isRead ? "✓ Terbaca" : "Belum dibaca"}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-gray-900 leading-snug">
                    {m.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {m.dimension}
                  </p>
                </div>
                <span
                  className={`mt-1 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {/* Body */}
              {isExpanded && (
                <div
                  className="overflow-hidden"
                >
                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-700">
                      {renderBody(m.body)}
                    </div>

                    {/* Mark as read button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRead(m.id);
                        }}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                          isRead
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-700 text-white hover:bg-red-800"
                        }`}
                      >
                        {isRead ? "✓ Sudah dibaca" : "Saya sudah baca modul ini"}
                      </button>
                    </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
