"use client";

import "./globals.css"; // Correct relative path to globals.css
import Navbar from "./components/Navbar"; // Correct relative path to Navbar
import Head from "next/head"; // Import Head component from Next.js

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Nexus AI</title>
        <meta name="description" content="Nexus AI - The future of blockchain data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Add Bootstrap CSS link here */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZjyjPEJt5WmRAU90FeRpok6YctnYmDr5pNlyT2BrJxj0hMJy6hW+ALEwIH"
          crossorigin="anonymous"
        />
      </Head>
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
