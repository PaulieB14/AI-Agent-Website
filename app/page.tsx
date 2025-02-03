"use client";

import { useQuery } from '@apollo/client';
import DataDisplay from './components/DataDisplay';
import { HOLDERS_QUERY, SUBSCRIBERS_QUERY, formatAmount } from './queries';

interface User {
  id: string;
  balance?: string;
  totalSubscribed?: string;
}

interface QueryResponse {
  agentKey: {
    totalSubscribed: string;
    users: User[];
  };
}

const AGENT_KEY = "0x4aaba1b66a9a3e3053343ec11beeec2d205904df";

export default function Home() {
  const { data: holdersData } = useQuery<QueryResponse>(HOLDERS_QUERY);
  const { data: subscribersData } = useQuery<QueryResponse>(SUBSCRIBERS_QUERY);

  const holders = holdersData?.agentKey?.users?.map((user: User) => ({
    address: user.id,
    amount: formatAmount(user.balance || "0")
  })) || [];

  const subscribers = subscribersData?.agentKey?.users?.map((user: User) => ({
    address: user.id,
    amount: formatAmount(user.totalSubscribed || "0")
  })) || [];

  // Use totalSubscribed from the query for total locked amount
  const totalLocked = formatAmount(subscribersData?.agentKey?.totalSubscribed || "0");

  const data = {
    totalLocked,
    totalSubscribers: subscribers.length,
    agentKey: AGENT_KEY,
    holders,
    subscribers
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 text-white">
      {/* Hero Section */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-blue-500">Nexus AI</h1>
        <h2 className="text-2xl font-semibold text-gray-400 mb-6">$DNXS</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
          NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world&apos;s data!
        </p>
        <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4">Want to Export Your Own Project Data?</h3>
          <p className="text-gray-300">
            Connect your wallet with 25,000 locked DNXS tokens to export CSV files of your project&apos;s holders and subscribers.
          </p>
        </div>
      </header>

      {/* Data Display */}
      <DataDisplay {...data} />
    </div>
  );
}
