"use client";

import "./globals.css"; // Correct relative path to globals.css
import Navbar from "./components/Navbar"; // Correct relative path to Navbar

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nexus AI</title>
        <meta name="description" content="Nexus AI - The future of blockchain data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-800 text-center text-gray-400 py-4">
          © 2025 Nexus AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
