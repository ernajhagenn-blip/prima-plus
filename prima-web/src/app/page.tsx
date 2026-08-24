"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CinematicOpening() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 960, h: 600 });
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const obs = new ResizeObserver((es) => {
      for (const e of es) {
        const w = e.contentRect.width, h = e.contentRect.height;
        if (w > 0 && h > 0) setDims({ w, h });
      }
    });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random() * 0.5, r: Math.random() * 1.6 + 0.3, p: Math.random() * Math.PI * 2,
    }));
    const buildings = Array.from({ length: 26 }, (_, i) => ({
      x: i * 90 + Math.random() * 40, w: 46 + Math.random() * 50, h: 60 + Math.random() * 150,
      lit: Math.random(), hue: 250 + Math.random() * 40,
    }));
    const clouds = Array.from({ length: 8 }, (_, i) => ({ x: Math.random(), y: 0.08 + Math.random() * 0.22, s: 0.6 + Math.random() * 0.8, sp: 0.02 + Math.random() * 0.04 }));
    const confetti = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: -Math.random() * 0.5, vy: 0.12 + Math.random() * 0.2, vx: (Math.random() - 0.5) * 0.06,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2, c: ["#FFD34D", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"][Math.floor(Math.random() * 5)], sz: 4 + Math.random() * 5,
    }));

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const t = (now - t0) / 1000;
      const w = dims.w, h = dims.h;
      const intro = Math.min(1, t / 5);
      const ease = 1 - Math.pow(1 - intro, 3);

      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0a0a2e");
      sky.addColorStop(0.45, "#1a1045");
      sky.addColorStop(0.75, "#3b1d6e");
      sky.addColorStop(1, "#6d28d9");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      for (const st of stars) {
        const tw = 0.4 + 0.6 * Math.sin(now * 0.002 + st.p);
        ctx.beginPath();
        ctx.arc(st.x * w, st.y * h * (1 - ease * 0.4), st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${tw * 0.8})`;
        ctx.fill();
      }

      const neb = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.5);
      neb.addColorStop(0, "rgba(168,85,247,0.18)");
      neb.addColorStop(1, "rgba(168,85,247,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      for (const cl of clouds) {
        const cx = (((cl.x + t * cl.sp) % 1.3) - 0.15) * w;
        const cy = cl.y * h;
        const s = cl.s * (0.5 + ease * 0.5);
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, 70 * s, 20 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 40 * s, cy - 8 * s, 44 * s, 16 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const groundY = h * (0.52 + (1 - ease) * 0.25);
      const gg = ctx.createLinearGradient(0, groundY, 0, h);
      gg.addColorStop(0, "#241a4d");
      gg.addColorStop(1, "#120c2b");
      ctx.fillStyle = gg;
      ctx.fillRect(0, groundY, w, h - groundY);

      const scroll = t * 60;
      for (const b of buildings) {
        const bx = (((b.x - scroll * 0.35) % (w + 200)) + w + 200) % (w + 200) - 100;
        const bh = b.h * (0.5 + ease * 0.5);
        ctx.fillStyle = `hsl(${b.hue}, 40%, ${10 + b.lit * 6}%)`;
        ctx.fillRect(bx, groundY - bh, b.w, bh);
        ctx.fillStyle = "rgba(255,220,130,0.5)";
        const cols = Math.max(1, Math.floor(b.w / 16));
        const rows = Math.max(1, Math.floor(bh / 22));
        for (let r2 = 0; r2 < rows; r2++) {
          for (let cc = 0; cc < cols; cc++) {
            if ((r2 * 7 + cc * 13 + Math.floor(b.lit * 100)) % 3 !== 0) continue;
            ctx.fillRect(bx + 6 + cc * 16, groundY - bh + 8 + r2 * 22, 6, 9);
          }
        }
      }

      const roadY = h * 0.8;
      const rg = ctx.createLinearGradient(0, roadY, 0, h);
      rg.addColorStop(0, "#2c2f45");
      rg.addColorStop(1, "#1a1c2e");
      ctx.fillStyle = rg;
      ctx.fillRect(0, roadY, w, h - roadY);
      ctx.strokeStyle = "rgba(250,204,21,0.7)";
      ctx.lineWidth = 4;
      ctx.setLineDash([34, 26]);
      ctx.lineDashOffset = -scroll * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, roadY + (h - roadY) * 0.45);
      ctx.lineTo(w, roadY + (h - roadY) * 0.45);
      ctx.stroke();
      ctx.setLineDash([]);

      const kartT = (t % 5) / 5;
      const kx = -150 + kartT * (w + 320);
      const jump = kartT > 0.42 && kartT < 0.72 ? Math.sin(((kartT - 0.42) / 0.3) * Math.PI) : 0;
      const ky = roadY + 26 - jump * 90;
      const tilt = jump > 0 ? (kartT < 0.57 ? -0.25 : 0.25) : 0;

      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(tilt);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 30, 46 - jump * 20, 9 - jump * 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(-42, -18, 84, 34, 10);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.roundRect(-30, -34, 60, 22, 9);
      ctx.fill();
      ctx.fillStyle = "#0ea5e9";
      ctx.beginPath();
      ctx.roundRect(-20, -30, 40, 14, 6);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.fillRect(-48, -6, 16, 22);
      ctx.fillRect(32, -6, 16, 22);
      ctx.fillStyle = "#f1c9a5";
      ctx.beginPath();
      ctx.arc(0, -42, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -46, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#1c1f2b";
      ctx.beginPath();
      ctx.roundRect(-10, -44, 20, 8, 4);
      ctx.fill();
      ctx.restore();

      if (jump > 0.5) {
        ctx.strokeStyle = "rgba(255,200,60,0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(kx - 30, ky + 24);
        ctx.lineTo(kx - 55 - Math.random() * 20, ky + 30 + Math.random() * 10);
        ctx.moveTo(kx + 30, ky + 24);
        ctx.lineTo(kx + 55 + Math.random() * 20, ky + 30 + Math.random() * 10);
        ctx.stroke();
      }

      const logoT = Math.max(0, Math.min(1, (t - 4.2) / 1.2));
      if (logoT > 0) {
        const le = 1 - Math.pow(1 - logoT, 3);
        ctx.save();
        ctx.translate(w / 2, h * 0.3);
        ctx.scale(0.6 + le * 0.4, 0.6 + le * 0.4);
        ctx.globalAlpha = le;
        ctx.font = `900 ${Math.min(w * 0.13, 110)}px "Righteous", "Arial Black", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const lg = ctx.createLinearGradient(-w * 0.25, 0, w * 0.25, 0);
        lg.addColorStop(0, "#FFD34D");
        lg.addColorStop(0.5, "#ffffff");
        lg.addColorStop(1, "#FFD34D");
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#1c1030";
        ctx.strokeText("PRIMA+", 0, 0);
        ctx.fillStyle = lg;
        ctx.fillText("PRIMA+", 0, 0);
        ctx.restore();
      }

      if (t > 4.8 && !ready) setReady(true);

      if (leaving) {
        ctx.fillStyle = `rgba(5,5,20,${Math.min(1, (now - leaveRef.current) / 500)})`;
        ctx.fillRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [dims, ready, leaving]);

  const leaveRef = useRef(0);
  const go = () => {
    leaveRef.current = performance.now();
    setLeaving(true);
    setTimeout(() => router.push("/story"), 550);
  };

  return (
    <div ref={wrapRef} style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#0a0a2e" }}>
      <canvas ref={canvasRef} width={dims.w} height={dims.h} style={{ width: "100%", height: "100%", display: "block" }} />

      <div style={{
        position: "absolute", left: 0, right: 0, top: "46%", textAlign: "center", zIndex: 10,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.8s ease, transform 0.8s ease", pointerEvents: ready ? "auto" : "none", padding: "0 20px",
      }}>
        <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(13px, 2.4vmin, 18px)", color: "rgba(255,255,255,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.6)", margin: "0 0 6px", fontStyle: "italic" }}>
          Berakar pada Aksara, Setia pada Nusantara.
        </p>
        <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(13px, 2.4vmin, 18px)", color: "#FFD34D", textShadow: "0 2px 10px rgba(0,0,0,0.6)", margin: "0 0 30px", fontWeight: 700 }}>
          Bahasa Kita, Identitas Kita!
        </p>
        <button
          onClick={go}
          style={{
            padding: "16px 46px", borderRadius: 999, border: "3px solid rgba(255,255,255,0.85)",
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #ec4899 100%)",
            color: "white", fontFamily: "'Righteous', 'Arial Black', sans-serif",
            fontSize: "clamp(16px, 3vmin, 22px)", fontWeight: 900, letterSpacing: "0.06em",
            cursor: "pointer", boxShadow: "0 8px 30px rgba(168,85,247,0.55), inset 0 2px 0 rgba(255,255,255,0.4)",
            transition: "transform 0.12s ease, box-shadow 0.12s ease",
          }}
          onPointerDown={(e) => { e.currentTarget.style.transform = "translateY(4px) scale(0.97)"; e.currentTarget.style.boxShadow = "0 3px 14px rgba(168,85,247,0.5)"; }}
          onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
        >
          MULAI PETUALANGAN ▶
        </button>
      </div>

      {!ready && (
        <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
          <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>
            MEMUAT DUNIA PRIMA+...
          </span>
        </div>
      )}
    </div>
  );
}
