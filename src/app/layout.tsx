import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { PwaRegister } from "@/components/layout/PwaRegister";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-rounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pitch Quest",
  description: "Train your ears. Explore the music. Level up together.",
  applicationName: "Pitch Quest",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pitch Quest",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-display`}>
        <AppShell>{children}</AppShell>
        <PwaRegister />
      </body>
    </html>
  );
}
