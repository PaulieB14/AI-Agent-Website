"use client";

import { useState, useEffect, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

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
        .map((user: SubscriberData, index: number) => ({
          rank: index + 1,
          wallet: user.user.id,
          subscribed: (parseFloat(user.totalSubscribed) / 1e18).toLocaleString(),
        }))
        .filter((subscriber: Subscriber) => parseFloat(subscriber.subscribed.replace(/,/g, "")) > 0); // Filter out subscribers with 0 holdings
  
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
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 text-white">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-blue-500">Nexus AI</h1>
        <h2 className="text-2xl font-semibold text-gray-400 mb-6">$DNXS</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world’s data!
        </p>
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg max-w-5xl mx-auto mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <p className="text-base md:text-lg font-bold text-gray-400">Total Locked:</p>
              <p className="text-base md:text-lg text-white">{totalLocked.toLocaleString()} DNXS</p>
              <p className="text-xs md:text-sm text-gray-400">({percentageLocked}% of total supply)</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-base md:text-lg font-bold text-gray-400">Total Subscribers:</p>
              <p className="text-base md:text-lg text-white">{totalSubscribers}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-base md:text-lg font-bold text-gray-400">Agent Key:</p>
              <p className="text-xs md:text-sm text-white break-all">0x4aaba1b66a9a3e3053343ec11beeec2d205904df</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tabs flex border-b border-gray-700 mb-6 justify-center space-x-4">
        <button
          className={`px-4 py-2 text-sm md:text-base font-medium ${
            activeTab === "holders" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("holders")}
        >
          Holders
        </button>
        <button
          className={`px-4 py-2 text-sm md:text-base font-medium ${
            activeTab === "subscribers" 
              ? "text-blue-500 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("subscribers")}
        >
          Subscribers
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "holders" && (
        <div className="overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Top DNXS Holders</h2>
          <div className="min-w-full inline-block align-middle px-2 sm:px-0">
            <div className="overflow-hidden border border-gray-700 rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="w-[10%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">#</th>
                    <th scope="col" className="w-[30%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">Tokens</th>
                    <th scope="col" className="w-[60%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">Wallet Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {topHolders.map((holder) => (
                    <tr key={holder.rank}>
                      <td className="w-[10%] px-4 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap">{holder.rank}</td>
                      <td className="w-[30%] px-4 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap">{holder.tokens}</td>
                      <td className="w-[60%] px-4 py-3 text-xs md:text-sm text-gray-300 truncate">{holder.wallet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!showAllHolders && (
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              onClick={() => {
                setShowAllHolders(true);
                fetchTopHolders(100);
              }}
            >
              Show 100
            </button>
          )}
        </div>
      )}

      {activeTab === "subscribers" && (
        <div className="overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Top DNXS Subscribers</h2>
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="w-[10%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">#</th>
                    <th scope="col" className="w-[30%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">Subscribed</th>
                    <th scope="col" className="w-[60%] px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-200">Wallet Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {topSubscribers.map((subscriber) => (
                    <tr key={subscriber.rank}>
                      <td className="w-[10%] px-4 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap">{subscriber.rank}</td>
                      <td className="w-[30%] px-4 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap">{subscriber.subscribed}</td>
                      <td className="w-[60%] px-4 py-3 text-xs md:text-sm text-gray-300 truncate">{subscriber.wallet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!showAllSubscribers && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                setShowAllSubscribers(true);
                fetchTopSubscribers(100);
              }}
            >
              Show 100
            </button>
          )}
        </div>
      )}
    </div>
  );
}
