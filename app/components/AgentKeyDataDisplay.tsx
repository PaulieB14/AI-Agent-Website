import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { HOLDERS_QUERY, SUBSCRIBERS_QUERY, FETCH_AGENT_USERS_QUERY, FETCH_AGENT_SUBSCRIBERS_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';
import { formatNumber } from '../utils/format';

const DNXS_AGENT_KEY = "0x4aaba1b66a9a3e3053343ec11beeec2d205904df";

interface User {
  id: string;
  balance: string;
  agentKey: {
    ans: {
      symbol: string;
    };
  };
}

interface Subscriber {
  id: string;
  totalSubscribed: string;
  agentKey: {
    ans: {
      symbol: string;
    };
  };
}

interface HoldersResponse {
  agentKey: {
    users: User[];
  };
}

interface SubscribersResponse {
  agentKey: {
    totalSubscribed: string;
    totalSubscribers: string;
    users: Subscriber[];
  };
}

const AgentKeyDataDisplay: React.FC = () => {
  // DNXS State
  const [showDNXSHolders, setShowDNXSHolders] = useState(true);
  const [showDNXSSubscribers, setShowDNXSSubscribers] = useState(false);
  const [showAllDNXSHolders, setShowAllDNXSHolders] = useState(false);
  const [showAllDNXSSubscribers, setShowAllDNXSSubscribers] = useState(false);
  const [dnxsHolders, setDNXSHolders] = useState<User[]>([]);
  const [dnxsSubscribers, setDNXSSubscribers] = useState<Subscriber[]>([]);
  const [dnxsTotalSubscribed, setDNXSTotalSubscribed] = useState('0');
  const [dnxsTotalSubscribers, setDNXSTotalSubscribers] = useState('0');
  const [dnxsSymbol, setDNXSSymbol] = useState('');

  // Dynamic Agent State
  const [agentKey, setAgentKey] = useState('');
  const [showAgentHolders, setShowAgentHolders] = useState(true);
  const [showAgentSubscribers, setShowAgentSubscribers] = useState(false);
  const [showAllAgentHolders, setShowAllAgentHolders] = useState(false);
  const [showAllAgentSubscribers, setShowAllAgentSubscribers] = useState(false);

  // DNXS Queries
  const [fetchDNXSHolders] = useLazyQuery<HoldersResponse>(HOLDERS_QUERY, {
    client,
    variables: { agentKey: DNXS_AGENT_KEY },
    onCompleted: (data) => {
      setDNXSHolders(data.agentKey.users);
      if (data.agentKey.users[0]?.agentKey.ans.symbol) {
        setDNXSSymbol(data.agentKey.users[0].agentKey.ans.symbol);
      }
    }
  });

  const [fetchDNXSSubscribers] = useLazyQuery<SubscribersResponse>(SUBSCRIBERS_QUERY, {
    client,
    variables: { agentKey: DNXS_AGENT_KEY },
    onCompleted: (data) => {
      setDNXSSubscribers(data.agentKey.users);
      setDNXSTotalSubscribed(data.agentKey.totalSubscribed);
      setDNXSTotalSubscribers(data.agentKey.totalSubscribers);
    }
  });

  // Dynamic Agent Queries
  const [fetchAgentUsers, { loading: usersLoading, error: usersError, data: agentUsersData }] = 
    useLazyQuery<HoldersResponse>(FETCH_AGENT_USERS_QUERY, { client });

  const [fetchAgentSubscribers, { loading: subsLoading, error: subsError, data: agentSubscribersData }] = 
    useLazyQuery<SubscribersResponse>(FETCH_AGENT_SUBSCRIBERS_QUERY, { client });

  // Fetch DNXS data on mount and keep it constant
  useEffect(() => {
    fetchDNXSHolders();
    fetchDNXSSubscribers();
  }, [fetchDNXSHolders, fetchDNXSSubscribers]);

  const handleFetchData = () => {
    if (agentKey.trim()) {
      const trimmedKey = agentKey.trim();
      fetchAgentUsers({ variables: { agentKey: trimmedKey } });
      fetchAgentSubscribers({ variables: { agentKey: trimmedKey } });
    }
  };

  const handleExportCSV = (data: (User | Subscriber)[], filename: string) => {
    const headers = ['Wallet Address', filename.includes('holder') ? 'Balance' : 'Total Subscribed'];
    const csv = [
      headers,
      ...data.map(item => {
        const address = item.id.split('-').pop() || '';
        const amount = 'balance' in item
          ? formatNumber(item.balance)
          : formatNumber(item.totalSubscribed);
        return [address, amount];
      }),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = window.URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${agentKey || 'dnxs'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Dynamic agent data
  const agentHolders = agentUsersData?.agentKey.users || [];
  const agentSubscribers = agentSubscribersData?.agentKey.users || [];
  const agentTotalSubscribed = agentSubscribersData?.agentKey.totalSubscribed || '0';
  const agentTotalSubscribers = agentSubscribersData?.agentKey.totalSubscribers || '0';
  const agentSymbol = agentHolders[0]?.agentKey.ans.symbol || '';

  const displayedDNXSHolders = showAllDNXSHolders ? dnxsHolders : dnxsHolders.slice(0, 10);
  const displayedDNXSSubscribers = showAllDNXSSubscribers ? dnxsSubscribers : dnxsSubscribers.slice(0, 10);
  const displayedAgentHolders = showAllAgentHolders ? agentHolders : agentHolders.slice(0, 10);
  const displayedAgentSubscribers = showAllAgentSubscribers ? agentSubscribers : agentSubscribers.slice(0, 10);

  const loading = usersLoading || subsLoading;
  const error = usersError || subsError;

  return (
    <div className="space-y-16">
      {/* DNXS Stats Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribed:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{formatNumber(dnxsTotalSubscribed)} {dnxsSymbol}</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{dnxsTotalSubscribers}</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
            <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">{DNXS_AGENT_KEY}</p>
          </div>
        </div>
      </div>

      {/* DNXS View Toggle */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => {
            setShowDNXSHolders(true);
            setShowDNXSSubscribers(false);
          }}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            showDNXSHolders 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Holders
        </button>
        <button
          onClick={() => {
            setShowDNXSHolders(false);
            setShowDNXSSubscribers(true);
          }}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            showDNXSSubscribers 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Subscribers
        </button>
      </div>

      {/* DNXS Data Section */}
      {showDNXSHolders && (
        <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-white tracking-wide">Holders</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportCSV(dnxsHolders, 'dnxs_holders')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
              >
                Export CSV
              </button>
              <button
                onClick={() => setShowAllDNXSHolders(!showAllDNXSHolders)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
              >
                {showAllDNXSHolders ? 'Show Less' : 'Show All'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-xl border border-gray-800/30 min-w-[1200px]">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-[#1E2435]/80 border-b border-gray-800/30">
                    <th className="py-6 px-8 text-gray-400/90 font-medium w-16">#</th>
                    <th className="py-6 px-8 text-gray-400/90 font-medium">Wallet Address</th>
                    <th className="py-6 px-8 text-gray-400/90 font-medium w-48">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {displayedDNXSHolders.map((user, index) => (
                    <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                      <td className="py-6 px-8 text-white">{index + 1}</td>
                      <td className="py-6 px-8 text-xs font-mono text-white break-all">{user.id.split('-').pop()}</td>
                      <td className="py-6 px-8 text-white font-medium">
                        {formatNumber(user.balance)} {user.agentKey.ans.symbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showDNXSSubscribers && (
        <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-white tracking-wide">Subscribers</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportCSV(dnxsSubscribers, 'dnxs_subscribers')}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
              >
                Export CSV
              </button>
              <button
                onClick={() => setShowAllDNXSSubscribers(!showAllDNXSSubscribers)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
              >
                {showAllDNXSSubscribers ? 'Show Less' : 'Show All'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-xl border border-gray-800/30 min-w-[1200px]">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-[#1E2435]/80 border-b border-gray-800/30">
                    <th className="py-6 px-8 text-gray-400/90 font-medium w-16">#</th>
                    <th className="py-6 px-8 text-gray-400/90 font-medium">Wallet Address</th>
                    <th className="py-6 px-8 text-gray-400/90 font-medium w-48">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {displayedDNXSSubscribers.map((subscriber, index) => (
                    <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                      <td className="py-6 px-8 text-white">{index + 1}</td>
                      <td className="py-6 px-8 text-xs font-mono text-white break-all">{subscriber.id.split('-').pop()}</td>
                      <td className="py-6 px-8 text-white font-medium">
                        {formatNumber(subscriber.totalSubscribed)} {subscriber.agentKey.ans.symbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Want to Export Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4">Want to Export Your Own Project Data?</h3>
        <p className="text-gray-300/90 text-lg leading-relaxed mb-4">
          Connect your wallet with 10,000 locked tokens to export CSV files of your project&apos;s holders and subscribers.
        </p>
      </div>

      {/* Dynamic Agent Data Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="flex gap-4">
          <input
            type="text"
            value={agentKey}
            onChange={(e) => setAgentKey(e.target.value)}
            placeholder="Enter Agent Key"
            className="flex-1 px-6 py-3.5 bg-[#1E2435]/80 rounded-xl text-white border border-gray-800/30 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          />
          <button
            onClick={handleFetchData}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
        
        {agentUsersData && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
              <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribed:</h3>
                <p className="text-3xl text-white font-semibold tracking-wide">
                  {formatNumber(agentTotalSubscribed)} {agentSymbol}
                </p>
              </div>
              <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
                <p className="text-3xl text-white font-semibold tracking-wide">{agentTotalSubscribers}</p>
              </div>
              <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
                <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">{agentKey}</p>
              </div>
            </div>

            {/* Agent View Toggle */}
            <div className="flex justify-center gap-8 mb-8">
              <button
                onClick={() => {
                  setShowAgentHolders(true);
                  setShowAgentSubscribers(false);
                }}
                className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                  showAgentHolders 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
                    : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
                }`}
              >
                View Holders
              </button>
              <button
                onClick={() => {
                  setShowAgentHolders(false);
                  setShowAgentSubscribers(true);
                }}
                className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                  showAgentSubscribers 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
                    : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
                }`}
              >
                View Subscribers
              </button>
            </div>

            {showAgentHolders && (
              <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-white tracking-wide">Holders</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportCSV(agentHolders, 'holders')}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => setShowAllAgentHolders(!showAllAgentHolders)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
                    >
                      {showAllAgentHolders ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="overflow-hidden rounded-xl border border-gray-800/30 min-w-[1200px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left bg-[#1E2435]/80 border-b border-gray-800/30">
                          <th className="py-6 px-8 text-gray-400/90 font-medium w-16">#</th>
                          <th className="py-6 px-8 text-gray-400/90 font-medium">Wallet Address</th>
                          <th className="py-6 px-8 text-gray-400/90 font-medium w-48">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/30">
                        {displayedAgentHolders.map((user, index) => (
                          <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                            <td className="py-6 px-8 text-white">{index + 1}</td>
                            <td className="py-6 px-8 text-xs font-mono text-white break-all">{user.id.split('-').pop()}</td>
                            <td className="py-6 px-8 text-white font-medium">
                              {formatNumber(user.balance)} {user.agentKey.ans.symbol}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {showAgentSubscribers && (
              <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-white tracking-wide">Subscribers</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportCSV(agentSubscribers, 'subscribers')}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => setShowAllAgentSubscribers(!showAllAgentSubscribers)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
                    >
                      {showAllAgentSubscribers ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="overflow-hidden rounded-xl border border-gray-800/30 min-w-[1200px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left bg-[#1E2435]/80 border-b border-gray-800/30">
                          <th className="py-6 px-8 text-gray-400/90 font-medium w-16">#</th>
                          <th className="py-6 px-8 text-gray-400/90 font-medium">Wallet Address</th>
                          <th className="py-6 px-8 text-gray-400/90 font-medium w-48">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/30">
                        {displayedAgentSubscribers.map((subscriber, index) => (
                          <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                            <td className="py-6 px-8 text-white">{index + 1}</td>
                            <td className="py-6 px-8 text-xs font-mono text-white break-all">{subscriber.id.split('-').pop()}</td>
                            <td className="py-6 px-8 text-white font-medium">
                              {formatNumber(subscriber.totalSubscribed)} {subscriber.agentKey.ans.symbol}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentKeyDataDisplay;
