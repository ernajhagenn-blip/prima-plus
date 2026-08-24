import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRIMA+ — Kesadaran Berbahasa Remaja",
  description: "Platform kesadaran berbahasa untuk remaja. Pahami pilihanmu, kuatkan bahasamu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header
          className="border-b-3 border-cyan-400"
          style={{
            background: "linear-gradient(135deg, #EF5350 0%, #FF7043 40%, #FFB300 100%)",
            boxShadow: "0 2px 12px rgba(255,112,67,0.3)",
          }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg font-black text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                boxShadow: "0 2px 0 #0D47A1, inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              P+
            </div>
            <div>
              <p className="text-xs font-black leading-tight text-white drop-shadow-sm">PRIMA+</p>
              <p className="text-[10px] font-semibold text-white/80">Bahasa Kita. Pilihan Kita.</p>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          className="border-t-2 border-green-300"
          style={{ background: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)" }}
        >
          <div className="mx-auto max-w-2xl px-3 py-1.5 text-center text-[10px] font-bold text-white/90">
            OPSI 2026 · Ilmu Sosial Humaniora
          </div>
        </footer>
      </body>
    </html>
  );
}
