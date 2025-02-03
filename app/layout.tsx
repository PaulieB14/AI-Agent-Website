import "./globals.css";
import { Metadata } from "next";
import { Viewport } from "next";
import RootLayoutClient from "./components/RootLayoutClient";

export const metadata: Metadata = {
  title: "Nexus AI",
  description: "Nexus AI - The future of blockchain data",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-screen bg-gray-900">
      <body className="min-h-screen flex flex-col">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
