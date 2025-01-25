"use client";

import { useState, useEffect, useCallback } from "react";

const TOTAL_SUPPLY = 21000000; // Total supply of DNXS

interface Holder {
  rank: number;
  wallet: string;
  tokens: string;
}

interface Subscriber {
  rank: number;
  wallet: string;
  subscribed: string;
}

interface SubscriberData {
  user: {
    id: string;
  };
  totalSubscribed: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"holders" | "subscribers">("holders");
  const [topHolders, setTopHolders] = useState<Holder[]>([]);
  const [topSubscribers, setTopSubscribers] = useState<Subscriber[]>([]);
  const [totalLocked, setTotalLocked] = useState<number>(0);
  const [percentageLocked, setPercentageLocked] = useState<string>("0");
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);
  const [showAllHolders, setShowAllHolders] = useState<boolean>(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState<boolean>(false);

  const fetchTopHolders = useCallback(async (limit = 10) => {
    const query = `
      query MyQuery {
        agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
          users(first: ${limit}, orderBy: balance, orderDirection: desc) {
            id
            balance
          }
        }
      }
    `;

    try {
      const response = await fetch(
        "https://gateway.thegraph.com/api/61ad9681ec5a5af6cc8254ccb4d6bc77/subgraphs/id/8f1XAvLcseuxGvme1EYCSCoRnpfDPa6D5jHB914gEM3L",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );
      const result = await response.json();
      const holders = result.data.agentKey.users.map(
        (user: { id: string; balance: string }, index: number) => ({
          rank: index + 1,
          wallet: user.id.replace(
            "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-",
            ""
          ),
          tokens: (parseFloat(user.balance) / 1e18).toLocaleString(),
        })
      );
      setTopHolders(holders);
    } catch (error) {
      console.error("Error fetching top holders:", error);
    }
  }, []);

  const fetchTopSubscribers = useCallback(async (limit = 10) => {
    const query = `
      query TopSubscribers($symbol: String = "DNXS") {
        agentKeys(where: {ans_: {symbol: $symbol}}) {
          totalSubscribed
          totalSubscribers
          users(first: ${limit}, orderBy: totalSubscribed, orderDirection: desc) {
            user {
              id
            }
            totalSubscribed
          }
        }
      }
    `;
    try {
      const response = await fetch(
        "https://gateway.thegraph.com/api/61ad9681ec5a5af6cc8254ccb4d6bc77/subgraphs/id/8f1XAvLcseuxGvme1EYCSCoRnpfDPa6D5jHB914gEM3L",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );
      const result = await response.json();
      const data = result.data.agentKeys[0];
      const subscribers = data.users
        .filter((user: SubscriberData) => parseFloat(user.totalSubscribed) > 0)
        .map((user: SubscriberData, index: number) => ({
          rank: index + 1,
          wallet: user.user.id,
          subscribed: (parseFloat(user.totalSubscribed) / 1e18).toLocaleString(),
        }));

      const totalLockedTokens = parseFloat(data.totalSubscribed) / 1e18;
      const lockedPercentage = ((totalLockedTokens / TOTAL_SUPPLY) * 100).toFixed(2);
      setTopSubscribers(subscribers);
      setTotalLocked(totalLockedTokens);
      setPercentageLocked(lockedPercentage);
      setTotalSubscribers(data.totalSubscribers);
    } catch (error) {
      console.error("Error fetching top subscribers:", error);
    }
  }, []);

  useEffect(() => {
    fetchTopHolders();
    fetchTopSubscribers();
  }, [fetchTopHolders, fetchTopSubscribers]);

  return (
    <div className="container mx-auto p-6 text-white">
      {/* Hero Section */}
      <header className="text-center bg-gray-900 p-8 rounded-lg shadow-lg mb-10">
        <h1 className="text-5xl font-extrabold text-blue-500">Nexus AI</h1>
        <p className="text-lg text-gray-400 mt-4">
          NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world’s data!
        </p>
        <div className="flex justify-center mt-6 space-x-8">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400 font-semibold">Total Locked</p>
            <p className="text-lg text-white">{totalLocked.toLocaleString()} DNXS</p>
            <p className="text-xs text-gray-500">({percentageLocked}% of total supply)</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400 font-semibold">Total Subscribers</p>
            <p className="text-lg text-white">{totalSubscribers}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400 font-semibold">Agent Key</p>
            <p className="text-xs text-white break-all">
              0x4aaba1b66a9a3e3053343ec11beeec2d205904df
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs flex justify-center space-x-6 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "holders" ? "border-b-2 border-blue-500 text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("holders")}
        >
          Holders
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "subscribers" ? "border-b-2 border-blue-500 text-blue-500" : ""
          }`}
          onClick={() => setActiveTab("subscribers")}
        >
          Subscribers
        </button>
      </div>

      {/* Data Display */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[400px]">
        {activeTab === "holders" && (
          <table className="w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Tokens</th>
                <th className="px-4 py-2 text-left">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {topHolders.map((holder) => (
                <tr key={holder.rank} className="border-t border-gray-600">
                  <td className="px-4 py-2">{holder.rank}</td>
                  <td className="px-4 py-2">{holder.tokens}</td>
                  <td className="px-4 py-2">{holder.wallet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "subscribers" && (
          <table className="w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Subscribed</th>
                <th className="px-4 py-2 text-left">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {topSubscribers.map((subscriber) => (
                <tr key={subscriber.rank} className="border-t border-gray-600">
                  <td className="px-4 py-2">{subscriber.rank}</td>
                  <td className="px-4 py-2">{subscriber.subscribed}</td>
                  <td className="px-4 py-2">{subscriber.wallet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
