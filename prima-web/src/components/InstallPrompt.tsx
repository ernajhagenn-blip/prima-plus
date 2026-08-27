"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred || hidden) return null;

  const install = async () => {
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div style={{
      position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 300,
      maxWidth: 420, margin: "0 auto",
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px", borderRadius: 16,
      background: "rgba(22,24,54,0.96)", border: "2px solid rgba(255,211,77,0.5)",
      boxShadow: "0 8px 28px rgba(10,8,30,0.5)", backdropFilter: "blur(8px)",
    }}>
      <span style={{ fontSize: 26 }}>📲</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: 13, color: "#FFD34D", margin: 0, fontWeight: 900 }}>
          Pasang PRIMA+
        </p>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0 }}>
          Buka lebih cepat dari layar utama & main offline.
        </p>
      </div>
      <button onClick={install} style={{
        padding: "10px 16px", borderRadius: 10, border: "none",
        background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white",
        fontFamily: "'Righteous', sans-serif", fontSize: 13, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap",
      }}>
        INSTALL
      </button>
      <button onClick={() => setHidden(true)} aria-label="Tutup" style={{
        background: "transparent", border: "none", color: "rgba(255,255,255,0.5)",
        fontSize: 18, cursor: "pointer", lineHeight: 1,
      }}>
        ✕
      </button>
    </div>
  );
}
