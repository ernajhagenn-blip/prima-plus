import type { Metadata, Viewport } from "next";
import GameShell from "@/components/GameShell";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRIMA+ — Kesadaran Berbahasa Remaja",
  description: "Platform kesadaran berbahasa Indonesia untuk remaja.",
  applicationName: "PRIMA+",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "PRIMA+" },
  icons: {
    icon: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon-32.png`, sizes: "32x32" }, { url: `${process.env.NEXT_PUBLIC_BASE_PATH}/icon-192.png`, sizes: "192x192" }],
    apple: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH}/apple-touch-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">
        <GameShell>{children}</GameShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
