import "./globals.css";
import Navbar from "./components/Navbar";
import { Metadata } from "next";
import { Viewport } from "next";
import Web3Provider from "./components/Web3Provider";

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
        <Web3Provider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-center text-gray-400 py-4 px-4 mt-auto">
            <div className="max-w-7xl mx-auto">
              © 2025 Nexus AI. All rights reserved.
            </div>
          </footer>
        </Web3Provider>
      </body>
    </html>
  );
}
