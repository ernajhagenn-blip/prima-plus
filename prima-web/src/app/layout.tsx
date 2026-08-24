import type { Metadata } from "next";
import GameShell from "@/components/GameShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRIMA+ — Kesadaran Berbahasa Remaja",
  description: "Platform kesadaran berbahasa untuk remaja.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">
        <GameShell>{children}</GameShell>
      </body>
    </html>
  );
}
