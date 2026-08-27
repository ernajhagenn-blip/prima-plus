"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gameAudio } from "@/lib/gameAudio";
import FunBackground from "@/components/FunBackground";
import { STORY_DATA } from "@/lib/storyData";

function highlight(text: string) {
  return <span>{text}</span>;
}

export default function StoryPage() {
  const [idx, setIdx] = useState(0);
  const [openSource, setOpenSource] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const kick = () => { gameAudio.startMusic("chill"); window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => { window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick); gameAudio.stopMusic(); };
  }, []);
  const d = STORY_DATA[idx];
  const last = idx === STORY_DATA.length - 1;

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, position: "relative", zIndex: 1, background: "radial-gradient(ellipse at 50% -20%, rgba(42,22,85,0.55) 0%, rgba(11,13,34,0.6) 55%)", padding: "clamp(16px,4vmin,48px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <FunBackground variant="night" />
      <div style={{ width: "100%", maxWidth: 720, display: "flex", gap: 6, marginBottom: 26 }}>
        {STORY_DATA.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= idx ? "linear-gradient(90deg,#7c3aed,#ec4899)" : "rgba(255,255,255,0.1)", transition: "background 0.4s" }} />
        ))}
      </div>

      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 12, letterSpacing: "0.25em", color: "#a855f7", margin: "0 0 8px", textAlign: "center" }}>
        FENOMENA NYATA · DATA {idx + 1}/{STORY_DATA.length}
      </p>
      <h1 key={d.id} style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(22px,4.5vmin,36px)", color: "white", margin: "0 0 6px", textAlign: "center", textShadow: "0 3px 14px rgba(124,58,237,0.5)", animation: "slideIn 0.5s ease both" }}>
        {d.headline}
      </h1>
      <p key={d.id + "big"} style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(40px,9vmin,76px)", color: "#FFD34D", margin: "4px 0 14px", textAlign: "center", textShadow: "0 4px 22px rgba(250,204,21,0.35)", animation: "bigPop 0.7s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        {d.big}
      </p>
      <p style={{ fontFamily: "Arial,sans-serif", fontSize: "clamp(13px,2.2vmin,16px)", color: "rgba(255,255,255,0.92)", margin: "0 auto 14px", textAlign: "center", maxWidth: 620, lineHeight: 1.6, fontWeight: 500 }}>
        {highlight(d.desc)}
      </p>

      {d.points && (
        <div style={{ width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", gap: 12, margin: "0 auto 14px" }}>
          {d.points.map((p, i) => {
            const colonIdx = p.indexOf(":");
            const label = colonIdx > 0 ? p.slice(0, colonIdx + 1) : "";
            const rest = colonIdx > 0 ? p.slice(colonIdx + 1).trim() : p;
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Righteous',sans-serif", fontSize: 12, color: "white", fontWeight: 700, marginTop: 2 }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "#ffffff", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  {label && <><b style={{ color: "#facc15" }}>{label}</b> </>}
                  {rest}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 620, margin: "0 auto 14px" }}>
        <button
          onClick={() => setOpenSource(!openSource)}
          style={{ width: "100%", padding: "11px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(168,85,247,0.5)", color: "#c084fc", fontFamily: "'Righteous',sans-serif", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>📄 Sumber Data — ketuk untuk melihat</span>
          <span style={{ transform: openSource ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>?</span>
        </button>
        {openSource && (
          <div style={{ marginTop: 8, padding: "13px 16px", borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.35)", animation: "slideIn 0.3s ease both" }}>
            <p style={{ fontFamily: "Arial,sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
              <b>{d.source.author} ({d.source.year}).</b> <i>{d.source.title}</i>. {d.source.venue}.
              {d.source.link && (
                <>
                  {" "}
                  <a href={d.source.link} target="_blank" rel="noreferrer" style={{ color: "#22d3ee", wordBreak: "break-all" }}>{d.source.link}</a>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 620, marginTop: "auto", paddingBottom: 8 }}>
        {idx > 0 && (
          <button onClick={() => { gameAudio.sfx("page"); setIdx(idx - 1); setOpenSource(false); }} style={{ flex: "0 0 130px", padding: "14px 0", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontFamily: "'Righteous',sans-serif", fontSize: 14, cursor: "pointer" }}>
            ? Sebelumnya
          </button>
        )}
        <button
          onClick={() => { gameAudio.sfx("transition"); if (last) { router.push("/edukasi"); } else { setIdx(idx + 1); setOpenSource(false); } }}
          style={{ flex: 1, padding: "14px 0", borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", color: "white", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 20px rgba(168,85,247,0.4)" }}
        >
          {last ? "Lanjut ke Ruang Edukasi ?" : "Data Berikutnya ?"}
        </button>
      </div>

      <style>{`
        @keyframes slideIn { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes bigPop { 0% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </main>
  );
}
