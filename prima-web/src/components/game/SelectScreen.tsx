"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJourney } from "@/lib/store";
import { KARTS, STAT_META } from "@/components/game/karts";

export interface CharacterDef {
  key: string;
  name: string;
  title: string;
  desc: string;
  skin: string;
  helmet: string;
  suit: string;
  visor: string;
}

export const CHARACTERS: CharacterDef[] = [
  { key: "NARA", name: "Nara", title: "Sang Penjelajah Kata", desc: "Energik dan penasaran. Nara percaya setiap kata punya petualangan — dan dia tidak pernah puas sebelum mencobanya sendiri.", skin: "#f1c9a5", helmet: "#ef4444", suit: "#ef4444", visor: "#0ea5e9" },
  { key: "KIRA", name: "Kira", title: "Ahli Ragam Bahasa", desc: "Tenang dan teliti. Kira bisa membaca situasi dalam sekejap dan tahu kapan sebuah kata pantas tampil — dan kapan harus menunggu.", skin: "#e8b48c", helmet: "#a855f7", suit: "#7c3aed", visor: "#22d3ee" },
  { key: "BIMO", name: "Bimo", title: "Kapten Sirkuit", desc: "Kokoh dan setia. Bimo adalah tipe yang menjaga ritme tim: tidak paling cepat bergaya, tapi paling sulit tergoyahkan.", skin: "#c68642", helmet: "#0ea5e9", suit: "#0369a1", visor: "#facc15" },
  { key: "SELA", name: "Sela", title: "Penjaga Norma", desc: "Cermat dan berprinsip. Sela meyakini ketepatan bukan batasan — justru itu yang membuat kata-katanya selalu sampai dengan utuh.", skin: "#f1c9a5", helmet: "#22c55e", suit: "#16a34a", visor: "#f97316" },
];

function CharacterPortrait({ ch, big }: { ch: CharacterDef; big?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const w = c.width, h = c.height;
      const t = now * 0.001;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.58;
      const s = Math.min(w, h) / (big ? 200 : 240);
      const bob = Math.sin(t * 2 + ch.key.length) * 4;

      ctx.save();
      ctx.translate(cx, cy + bob);

      const bg = ctx.createRadialGradient(0, 0, 10, 0, 0, 90 * s);
      bg.addColorStop(0, `${ch.helmet}55`);
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(-100 * s, -100 * s, 200 * s, 200 * s);

      ctx.fillStyle = ch.suit;
      ctx.beginPath();
      ctx.roundRect(-42 * s, 18 * s, 84 * s, 60 * s, 20 * s);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.roundRect(-30 * s, 24 * s, 60 * s, 14 * s, 7 * s);
      ctx.fill();
      ctx.fillStyle = ch.helmet;
      ctx.beginPath();
      ctx.roundRect(-46 * s, 30 * s, 92 * s, 12 * s, 6 * s);
      ctx.fill();

      ctx.fillStyle = ch.skin;
      ctx.beginPath();
      ctx.arc(0, -14 * s, 34 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ch.helmet;
      ctx.beginPath();
      ctx.arc(0, -22 * s, 37 * s, Math.PI * 0.98, Math.PI * 0.02);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-38 * s, -26 * s, 76 * s, 10 * s, 5 * s);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(-13 * s, -34 * s, 9 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = ch.visor;
      ctx.beginPath();
      ctx.roundRect(-24 * s, -18 * s, 48 * s, 16 * s, 8 * s);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.roundRect(-18 * s, -15 * s, 14 * s, 5 * s, 3 * s);
      ctx.fill();

      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 2 * s, 10 * s, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      ctx.restore();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [ch, big]);
  return <canvas ref={ref} width={big ? 380 : 200} height={big ? 300 : 170} style={{ width: "100%", height: "auto", display: "block" }} />;
}

function KartPreview({ body, accent }: { body: string; accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const w = c.width, h = c.height;
      const t = now * 0.001;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.62;
      const scale = Math.min(w, h) / 210;
      const bob = Math.sin(t * 2.2) * 5;
      ctx.save();
      ctx.translate(cx, cy + bob);
      ctx.beginPath();
      ctx.ellipse(0, 44 * scale, 78 * scale, 16 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();
      ctx.rotate(Math.sin(t * 1.4) * 0.04);
      ctx.fillStyle = "#111827";
      const wl = 30 * scale, ww = 17 * scale;
      ctx.beginPath();
      ctx.roundRect(-86 * scale, 2 * scale, wl, ww, 5 * scale);
      ctx.roundRect(56 * scale, 2 * scale, wl, ww, 5 * scale);
      ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillRect(-82 * scale, 6 * scale, wl * 0.7, ww * 0.35);
      ctx.fillRect(60 * scale, 6 * scale, wl * 0.7, ww * 0.35);
      const g = ctx.createLinearGradient(0, -40 * scale, 0, 30 * scale);
      g.addColorStop(0, accent);
      g.addColorStop(0.55, body);
      g.addColorStop(1, body);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(-72 * scale, -34 * scale, 144 * scale, 62 * scale, 18 * scale);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.roundRect(-58 * scale, -28 * scale, 116 * scale, 20 * scale, 10 * scale);
      ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.roundRect(-64 * scale, 22 * scale, 128 * scale, 14 * scale, 7 * scale);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(-64 * scale, 22 * scale, 128 * scale, 5 * scale, 3 * scale);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.roundRect(-52 * scale, -52 * scale, 104 * scale, 16 * scale, 6 * scale);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(-52 * scale, -52 * scale, 104 * scale, 6 * scale, 3 * scale);
      ctx.fill();
      ctx.fillStyle = "#f1c9a5";
      ctx.beginPath();
      ctx.arc(0, -62 * scale, 24 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, -68 * scale, 26 * scale, Math.PI * 0.95, Math.PI * 0.05);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(0, -68 * scale, 26 * scale, Math.PI * 1.15, Math.PI * 1.85);
      ctx.lineTo(0, -68 * scale);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.arc(-8 * scale, -74 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1c1f2b";
      ctx.beginPath();
      ctx.roundRect(-17 * scale, -64 * scale, 34 * scale, 11 * scale, 5 * scale);
      ctx.fill();
      ctx.restore();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [body, accent]);
  return <canvas ref={ref} width={460} height={330} style={{ width: "100%", maxWidth: 440, height: "auto", display: "block", margin: "0 auto" }} />;
}

export default function SelectScreen() {
  const kartKey = useJourney((s) => s.kartKey);
  const setKart = useJourney((s) => s.setKart);
  const [step, setStep] = useState<1 | 2>(1);
  const [charIdx, setCharIdx] = useState(0);
  const [kartIdx, setKartIdx] = useState(() => {
    const i = KARTS.findIndex((k) => k.key === kartKey);
    return i >= 0 ? i : 0;
  });
  const router = useRouter();
  const ch = CHARACTERS[charIdx];
  const kart = KARTS[kartIdx];

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "radial-gradient(ellipse at 50% -10%, #312e81 0%, #1e1b4b 40%, #0b0d22 80%)", padding: "clamp(14px,3vmin,36px) clamp(12px,3vmin,32px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(11px,2vmin,13px)", letterSpacing: "0.3em", color: "#facc15", margin: "0 0 4px" }}>
        GARASI · LANGKAH {step === 1 ? "1" : "2"}/2
      </p>
      <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(26px,5.5vmin,44px)", color: "white", margin: "0 0 4px", textShadow: "0 3px 0 #1c1030, 0 6px 24px rgba(250,204,21,0.35)" }}>
        {step === 1 ? "PILIH KARAKTER" : "PILIH KART"}
      </h1>

      {step === 1 && (
        <div style={{ width: "100%", maxWidth: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(10px,2.5vmin,28px)", marginTop: 8 }}>
          <div style={{ flex: "1 1 340px", minWidth: 300, maxWidth: 440 }}>
            <div style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.09), rgba(255,255,255,0.02) 65%)", borderRadius: 24, border: `3px solid ${ch.helmet}`, padding: 8, boxShadow: `0 10px 40px ${ch.helmet}55` }}>
              <CharacterPortrait ch={ch} big />
            </div>
            <h2 key={ch.key} style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(26px,5vmin,40px)", color: ch.helmet === "#22c55e" ? "#4ade80" : ch.helmet === "#0ea5e9" ? "#38bdf8" : ch.helmet, textAlign: "center", margin: "14px 0 2px", textShadow: "0 3px 0 #0b0d22", animation: "kartIn 0.35s both" }}>
              {ch.name.toUpperCase()}
            </h2>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(12px,2.2vmin,15px)", color: "#facc15", textAlign: "center", margin: "0 0 8px", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              {ch.title}
            </p>
            <p key={ch.key + "d"} style={{ fontFamily: "Arial,sans-serif", fontSize: "clamp(13px,2.2vmin,15px)", color: "rgba(255,255,255,0.85)", textAlign: "center", margin: "0 auto", maxWidth: 380, lineHeight: 1.55, textShadow: "0 1px 4px rgba(0,0,0,0.8)", animation: "kartIn 0.4s 0.08s both" }}>
              {ch.desc}
            </p>
          </div>

          <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 400, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
            {CHARACTERS.map((c, i) => {
              const active = i === charIdx;
              return (
                <button
                  key={c.key}
                  onClick={() => setCharIdx(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                    padding: "12px 16px", borderRadius: 18,
                    background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                    border: active ? `3px solid ${c.helmet}` : "2px solid rgba(255,255,255,0.12)",
                    cursor: "pointer",
                    boxShadow: active ? `0 8px 28px ${c.helmet}66` : "none",
                    transform: active ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ width: 64, flexShrink: 0 }}>
                    <CharacterPortrait ch={c} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(14px,2.4vmin,17px)", color: "white", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
                      {c.name}
                    </p>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: "clamp(11px,1.9vmin,12.5px)", color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", margin: "2px 0 0", lineHeight: 1.35, textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                      {c.title}
                    </p>
                  </div>
                  {active && <span style={{ marginLeft: "auto", color: c.helmet, fontSize: 20 }}>▶</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ width: "100%", maxWidth: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(10px,2.5vmin,28px)", marginTop: 8 }}>
          <div style={{ flex: "1 1 340px", minWidth: 300, maxWidth: 460 }}>
            <div style={{ background: "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.09), rgba(255,255,255,0.02) 65%)", borderRadius: 24, border: `3px solid ${kart.body}`, padding: "10px 6px 0", boxShadow: `0 10px 40px ${kart.body}55` }}>
              <KartPreview body={kart.body} accent={kart.accent} />
            </div>
            <h2 key={kart.key} style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(26px,5vmin,40px)", color: kart.accent, textAlign: "center", margin: "14px 0 2px", textShadow: "0 3px 0 #0b0d22, 0 0 26px rgba(255,255,255,0.25)", animation: "kartIn 0.35s both" }}>
              {kart.name.toUpperCase()}
            </h2>
            <p key={kart.key + "t"} style={{ fontFamily: "Arial,sans-serif", fontSize: "clamp(13px,2.2vmin,15.5px)", color: "rgba(255,255,255,0.85)", textAlign: "center", margin: "0 auto 16px", maxWidth: 380, lineHeight: 1.55, textShadow: "0 1px 4px rgba(0,0,0,0.8)", animation: "kartIn 0.4s 0.08s both" }}>
              {kart.trait}
            </p>
            <div style={{ background: "rgba(10,12,30,0.7)", borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.14)", maxWidth: 400, margin: "0 auto" }}>
              {STAT_META.map((m, i) => (
                <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < STAT_META.length - 1 ? 8 : 0 }}>
                  <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(10px,1.8vmin,12px)", color: "rgba(255,255,255,0.85)", width: 86, flexShrink: 0, textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    {m.label.toUpperCase()}
                  </span>
                  <div style={{ flex: 1, height: 9, borderRadius: 5, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${kart.stats[m.key] * 10}%`, height: "100%", borderRadius: 5, background: m.color, boxShadow: `0 0 8px ${m.color}88`, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, color: m.color, width: 18, textAlign: "right" }}>{kart.stats[m.key]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 400, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
            {KARTS.map((k, i) => {
              const active = i === kartIdx;
              return (
                <button
                  key={k.key}
                  onClick={() => { setKartIdx(i); setKart(k.key); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                    padding: "13px 16px", borderRadius: 18,
                    background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                    border: active ? `3px solid ${k.accent}` : "2px solid rgba(255,255,255,0.12)",
                    cursor: "pointer",
                    boxShadow: active ? `0 8px 28px ${k.body}66` : "none",
                    transform: active ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: `linear-gradient(135deg, ${k.accent}, ${k.body})`, border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 3px 10px rgba(0,0,0,0.4)" }} />
                  <div>
                    <p style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(14px,2.4vmin,17px)", color: "white", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
                      {k.name}
                    </p>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: "clamp(11px,1.9vmin,12.5px)", color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", margin: "2px 0 0", lineHeight: 1.35, textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                      {k.trait.split(".")[0]}
                    </p>
                  </div>
                  {active && <span style={{ marginLeft: "auto", color: k.accent, fontSize: 20 }}>▶</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: "clamp(16px,3vmin,28px)", width: "100%", maxWidth: 520, padding: "0 8px" }}>
        {step === 2 ? (
          <button onClick={() => setStep(1)} style={{ flex: "0 0 130px", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontFamily: "'Righteous',sans-serif", fontSize: 14, cursor: "pointer" }}>
            ← Karakter
          </button>
        ) : (
          <Link href="/world" style={{ flex: "0 0 130px", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontFamily: "'Righteous',sans-serif", fontSize: 14, textDecoration: "none" }}>
            ← Dunia
          </Link>
        )}
        <button
          onClick={() => { if (step === 1) setStep(2); else router.push("/games/language-kart"); }}
          style={{ flex: 1, padding: "14px 0", borderRadius: 14, background: step === 1 ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "linear-gradient(135deg,#16a34a,#4ade80)", border: "2px solid rgba(255,255,255,0.5)", color: "white", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(15px,2.8vmin,18px)", fontWeight: 900, cursor: "pointer", boxShadow: step === 1 ? "0 8px 26px rgba(168,85,247,0.45)" : "0 8px 26px rgba(34,197,94,0.45)", letterSpacing: "0.04em" }}
        >
          {step === 1 ? "LANJUT PILIH KART ▶" : "GAS KE LINTASAN ▶"}
        </button>
      </div>

      <style>{`@keyframes kartIn { 0% { opacity: 0; transform: translateY(10px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </main>
  );
}
