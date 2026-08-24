"use client";

import { useState } from "react";

interface Module {
  id: number;
  sort_order: number;
  title: string;
  dimension: string;
  body: string;
}

const DIMENSION_GRADIENTS: Record<string, string> = {
  "Sikap Positif": "linear-gradient(90deg, #3b82f6, #06b6d4)",
  "Kesetiaan Penggunaan": "linear-gradient(90deg, #10b981, #14b8a6)",
  "Kesadaran Norma": "linear-gradient(90deg, #f59e0b, #f97316)",
  "Kebanggaan": "linear-gradient(90deg, #f43f5e, #ec4899)",
  "Refleksi Kritis": "linear-gradient(90deg, #8b5cf6, #a855f7)",
};

const DIMENSION_ICONS: Record<string, string> = {
  "Sikap Positif": "💡",
  "Kesetiaan Penggunaan": "✍️",
  "Kesadaran Norma": "🎯",
  "Kebanggaan": "🇮🇩",
  "Refleksi Kritis": "🔍",
};

function renderBody(body: string) {
  const paragraphs = body.split(/\n{2,}/);
  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ marginBottom: "10px", fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} style={{ color: "rgba(255,255,255,0.95)", fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Progress bar */}
      <div style={{
        padding: "14px 16px", borderRadius: "16px",
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Progres Edukasi</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#c084fc" }}>{readSet.size}/{modules.length} modul</span>
        </div>
        <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #ec4899)", transition: "width 0.4s ease-out" }} />
        </div>
        {progress === 100 && (
          <p style={{ marginTop: "6px", fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "#34d399" }}>✅ Semua modul sudah dibaca!</p>
        )}
      </div>

      {/* Module cards */}
      {modules.map((m, i) => {
        const isRead = readSet.has(m.id);
        const isExpanded = expandedId === m.id;
        const gradient = DIMENSION_GRADIENTS[m.dimension] || "linear-gradient(90deg, #6b7280, #9ca3af)";
        const icon = DIMENSION_ICONS[m.dimension] || "📖";

        return (
          <div key={m.id} style={{
            borderRadius: "16px", overflow: "hidden",
            background: isRead ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.04)",
            border: isRead ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ height: "3px", background: gradient }} />
            <div style={{ padding: "14px 16px" }}>
              <button type="button" onClick={() => setExpandedId(isExpanded ? null : m.id)}
                style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "10px", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <span style={{ fontSize: "1.2rem", marginTop: "2px" }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Modul {i + 1}</span>
                    <span style={{
                      padding: "2px 8px", borderRadius: "6px",
                      fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 800,
                      background: isRead ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                      color: isRead ? "#34d399" : "rgba(255,255,255,0.4)",
                    }}>{isRead ? "✓ Terbaca" : "Belum"}</span>
                  </div>
                  <h2 style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
                    color: "rgba(255,255,255,0.9)", margin: "4px 0 0", lineHeight: 1.4,
                  }}>{m.title}</h2>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 600,
                    color: "rgba(255,255,255,0.35)", margin: "2px 0 0",
                  }}>{m.dimension}</p>
                </div>
                <span style={{
                  marginTop: "4px", color: "rgba(255,255,255,0.3)", fontSize: "0.7rem",
                  transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s",
                }}>▼</span>
              </button>

              {isExpanded && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {renderBody(m.body)}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                    <button type="button" onClick={(e) => { e.stopPropagation(); toggleRead(m.id); }}
                      style={{
                        padding: "8px 16px", borderRadius: "10px",
                        fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 800,
                        color: isRead ? "#34d399" : "white", cursor: "pointer",
                        background: isRead ? "rgba(16,185,129,0.1)" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                        border: isRead ? "1px solid rgba(16,185,129,0.2)" : "none",
                        boxShadow: isRead ? "none" : "0 3px 0 #5b21b6, 0 4px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                      }}
                    >{isRead ? "✓ Sudah dibaca" : "Saya sudah baca modul ini"}</button>
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
