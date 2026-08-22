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
    "Media pembelajaran berbasis kesadaran berbahasa untuk menguatkan loyalitas bahasa Indonesia remaja di lingkungan sekolah.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700 font-black text-white">
              P+
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-gray-900">
                PRIMA+ — Kesadaran Berbahasa Remaja
              </p>
              <p className="text-xs text-gray-500">
                Penguatan Loyalitas Bahasa Indonesia di Lingkungan Sekolah
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4 text-center text-xs text-gray-400">
            PRIMA+ · OPSI 2026 · Ilmu Sosial Humaniora — Bahasa dan Sastra
          </div>
        </footer>
      </body>
    </html>
  );
}