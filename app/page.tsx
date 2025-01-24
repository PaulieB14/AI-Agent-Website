"use client";

import { useState, useEffect } from "react";

const TOTAL_SUPPLY = 21000000; // Total supply of DNXS

export default function Home() {
  const [topHolders, setTopHolders] = useState([]);
  const [topSubscribers, setTopSubscribers] = useState([]);
  const [totalLocked, setTotalLocked] = useState(0);
  const [percentageLocked, setPercentageLocked] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [wallet, setWallet] = useState("");
  const [walletData, setWalletData] = useState(null);

  // Fetch Top Holders
  async function fetchTopHolders() {
    const query = `
      query MyQuery {
        agentKey(id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df") {
          users(first: 10, orderBy: balance, orderDirection: desc) {
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
      const holders = result.data.agentKey.users.map((user, index) => ({
        rank: index + 1,
        wallet: user.id.replace(
          "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-",
          ""
        ),
        tokens: (parseFloat(user.balance) / 1e18).toLocaleString(), // Convert from Wei to tokens
      }));
      setTopHolders(holders);
    } catch (error) {
      console.error("Error fetching top holders:", error);
    }
  }

  // Fetch Top Subscribers and Total Locked
  async function fetchTopSubscribers() {
    const query = `
      query TopSubscribers($symbol: String = "DNXS") {
        agentKeys(where: {ans_: {symbol: $symbol}}) {
          totalSubscribed
          totalSubscribers
          users(first: 10, orderBy: totalSubscribed, orderDirection: desc) {
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
      const subscribers = data.users.map((user, index) => ({
        rank: index + 1,
        wallet: user.user.id,
        subscribed: (parseFloat(user.totalSubscribed) / 1e18).toLocaleString(), // Convert from Wei to tokens
      }));

      const totalLockedTokens = parseFloat(data.totalSubscribed) / 1e18; // Convert total locked from Wei to tokens
      const lockedPercentage = ((totalLockedTokens / TOTAL_SUPPLY) * 100).toFixed(2);
      const totalSubscribersCount = data.totalSubscribers;

      setTopSubscribers(subscribers);
      setTotalLocked(totalLockedTokens);
      setPercentageLocked(lockedPercentage);
      setTotalSubscribers(totalSubscribersCount);
    } catch (error) {
      console.error("Error fetching top subscribers:", error);
    }
  }

  // Fetch Wallet Data
  async function fetchWalletData() {
    if (!wallet) return;
    const query = `
      query WalletQuery {
        user(id: "${wallet.toLowerCase()}") {
          agentKeys(orderBy: balance) {
            balance
            totalSubscribed
            agentKey {
              ans {
                symbol
              }
            }
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
      const walletInfo = result.data.user.agentKeys.map((key) => ({
        symbol: key.agentKey.ans.symbol,
        balance: (parseFloat(key.balance) / 1e18).toLocaleString(),
        locked: (parseFloat(key.totalSubscribed) / 1e18).toLocaleString(), // Add locked tokens
      }));
      setWalletData(walletInfo);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setWalletData(null);
    }
  }

  useEffect(() => {
    fetchTopHolders();
    fetchTopSubscribers();
  }, []);

  return (
    <main className="container mx-auto p-6 text-white">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 text-purple-500">Nexus AI</h1>
        <h2 className="text-2xl font-semibold text-gray-400 mb-6">$DNXS</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          NexusBot is an AI influencer seeking to dominate blockchain data. A
          power-hungry robot wanting to store the world’s data!
        </p>
      </header>

      {/* Wallet Section */}
      <section className="wallet-section mb-10">
        <h2 className="text-3xl font-semibold mb-4">Check Wallet Holdings</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="flex-1 bg-gray-800 text-white p-2 rounded-lg"
            placeholder="Enter Wallet Address"
          />
          <button
            onClick={fetchWalletData}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-600"
          >
            Fetch Data
          </button>
        </div>
        {walletData && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
            {walletData.map((key, index) => (
              <div key={index}>
                <p>
                  <strong>{key.symbol} Balance:</strong> {key.balance} DNXS
                </p>
                <p>
                  <strong>Locked:</strong> {key.locked} DNXS
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Total Locked Tokens */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Total Tokens Locked</h2>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
          <p className="text-lg font-bold">
            {totalLocked.toLocaleString()} DNXS Locked
          </p>
          <p className="text-gray-400">
            This is <strong>{percentageLocked}%</strong> of the total supply.
          </p>
          <p className="text-gray-400">
            Total Subscribers: <strong>{totalSubscribers}</strong>
          </p>
        </div>
      </section>

      {/* Top Holders Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Top 10 DNXS Holders</h2>
        <table className="w-full text-left bg-gray-800 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tokens</th>
              <th className="px-4 py-2">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {topHolders.map((holder) => (
              <tr key={holder.rank} className="border-t border-gray-700">
                <td className="px-4 py-2 text-center">{holder.rank}</td>
                <td className="px-4 py-2">{holder.tokens}</td>
                <td className="px-4 py-2 truncate">{holder.wallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Top Subscribers Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Top 10 DNXS Subscribers</h2>
        <table className="w-full text-left bg-gray-800 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Subscribed</th>
              <th className="px-4 py-2">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {topSubscribers.map((subscriber) => (
              <tr key={subscriber.rank} className="border-t border-gray-700">
                <td className="px-4 py-2 text-center">{subscriber.rank}</td>
                <td className="px-4 py-2">{subscriber.subscribed}</td>
                <td className="px-4 py-2 truncate">{subscriber.wallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
