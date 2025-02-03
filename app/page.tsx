"use client";

import WalletQuery from './components/WalletQuery';

export default function Home() {
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 text-white">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-blue-500">Nexus AI</h1>
        <h2 className="text-2xl font-semibold text-gray-400 mb-6">$DNXS</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world&apos;s data!
        </p>
      </header>

      <WalletQuery />
    </div>
  );
}
