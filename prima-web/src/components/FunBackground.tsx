"use client";

export default function FunBackground({ variant = "bright" }: { variant?: "bright" | "night" }) {
  const night = variant === "night";
  const clouds = [
    { top: "8%", size: 90, dur: 55, delay: 0, o: night ? 0.08 : 0.9 },
    { top: "18%", size: 60, dur: 75, delay: -20, o: night ? 0.06 : 0.8 },
    { top: "30%", size: 120, dur: 95, delay: -45, o: night ? 0.07 : 0.75 },
    { top: "52%", size: 70, dur: 65, delay: -12, o: night ? 0.05 : 0.6 },
    { top: "68%", size: 100, dur: 85, delay: -60, o: night ? 0.06 : 0.5 },
  ];
  const sparkles = Array.from({ length: 26 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 90}%`,
    size: 3 + (i % 3) * 2,
    dur: 1.8 + (i % 5) * 0.7,
    delay: (i % 7) * 0.4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {clouds.map((c, i) => (
        <div key={`c${i}`} className="fun-cloud" style={{ top: c.top, opacity: c.o, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
          <div style={{ width: c.size, height: c.size * 0.38, background: night ? "#ffffff" : "#ffffff", borderRadius: 999, filter: "blur(2px)", boxShadow: `${c.size * 0.25}px ${-c.size * 0.12}px 0 ${night ? "rgba(255,255,255,0.5)" : "#ffffff"} ${night ? "" : ""}, ${-c.size * 0.22}px ${-c.size * 0.08}px 0 ${night ? "rgba(255,255,255,0.4)" : "#ffffff"}` }} />
        </div>
      ))}
      {sparkles.map((s, i) => (
        <div key={`s${i}`} className="fun-spark" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`, background: night ? "#ffffff" : "#fff7c2", borderRadius: "50%", boxShadow: night ? "0 0 8px rgba(255,255,255,0.9)" : "0 0 8px rgba(255,230,120,0.9)" }} />
      ))}
      {[0, 1, 2].map((i) => (
        <div key={`b${i}`} className="fun-balloon" style={{ left: `${12 + i * 32}%`, animationDelay: `${i * 7}s`, animationDuration: `${16 + i * 4}s`, fontSize: 26 + i * 6 }}>
          {["🎈", "🎈", "🎈"][i]}
        </div>
      ))}
      <div className="fun-kart" style={{ animationDuration: "14s", bottom: night ? "4%" : "3%" }}>
        🏎️
      </div>
      <style>{`
        @keyframes funDrift { 0% { transform: translateX(-30vw); } 100% { transform: translateX(130vw); } }
        @keyframes funTwinkle { 0%, 100% { opacity: 0.15; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.25); } }
        @keyframes funRise { 0% { transform: translateY(110vh) rotate(-6deg); } 100% { transform: translateY(-15vh) rotate(8deg); } }
        @keyframes funDrive { 0% { transform: translateX(-20vw) scaleX(1); } 49% { transform: translateX(110vw) scaleX(1); } 50% { transform: translateX(110vw) scaleX(-1); } 99% { transform: translateX(-20vw) scaleX(-1); } 100% { transform: translateX(-20vw) scaleX(1); } }
        .fun-cloud { position: absolute; left: 0; animation: funDrift linear infinite; }
        .fun-spark { position: absolute; animation: funTwinkle ease-in-out infinite; }
        .fun-balloon { position: absolute; bottom: -60px; animation: funRise linear infinite; opacity: 0.9; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15)); }
        .fun-kart { position: absolute; font-size: 34px; animation: funDrive linear infinite; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }
      `}</style>
    </div>
  );
}
