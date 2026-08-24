import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRIMA+ — Kesadaran Berbahasa Remaja",
  description:
    "Platform kesadaran berbahasa untuk remaja. Pahami pilihanmu, kuatkan bahasamu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header
          className="border-b-4 border-cyan-400"
          style={{
            background: "linear-gradient(135deg, #EF5350 0%, #FF7043 40%, #FFB300 100%)",
            boxShadow: "0 4px 20px rgba(255,112,67,0.3)",
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                boxShadow: "0 3px 0 #0D47A1, inset 0 2px 0 rgba(255,255,255,0.3)",
              }}
            >
              P+
            </div>
            <div>
              <p className="text-sm font-black leading-tight text-white drop-shadow-sm">
                PRIMA+
              </p>
              <p className="text-xs font-semibold text-white/80">
                Bahasa Kita. Pilihan Kita.
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer
          className="border-t-4 border-cyan-400"
          style={{
            background: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 py-3 text-center text-xs font-bold text-white/90 drop-shadow-sm">
            OPSI 2026 · Ilmu Sosial Humaniora
          </div>
        </footer>
      </body>
    </html>
  );
}
