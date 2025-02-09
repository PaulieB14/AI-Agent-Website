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
  const [agentKey, setAgentKey] = useState('');
  const [showHolders, setShowHolders] = useState(true);
  const [showAllData, setShowAllData] = useState(false);

  // Dynamic Agent Queries
  const [fetchAgentUsers, { loading: usersLoading, error: usersError, data: agentUsersData }] = 
    useLazyQuery<HoldersResponse>(FETCH_AGENT_USERS_QUERY, { client });

  const [fetchAgentSubscribers, { loading: subsLoading, error: subsError, data: agentSubscribersData }] = 
    useLazyQuery<SubscribersResponse>(FETCH_AGENT_SUBSCRIBERS_QUERY, { client });

  // Default DNXS Queries
  const [fetchDefaultHolders, { data: defaultHoldersData }] = useLazyQuery<HoldersResponse>(HOLDERS_QUERY, {
    client,
    variables: { agentKey: DNXS_AGENT_KEY }
  });

  const [fetchDefaultSubscribers, { data: defaultSubscribersData }] = useLazyQuery<SubscribersResponse>(SUBSCRIBERS_QUERY, {
    client,
    variables: { agentKey: DNXS_AGENT_KEY }
  });

  const handleFetchData = () => {
    if (agentKey.trim()) {
      const trimmedKey = agentKey.trim();
      fetchAgentUsers({ variables: { agentKey: trimmedKey } });
      fetchAgentSubscribers({ variables: { agentKey: trimmedKey } });
    } else {
      fetchDefaultHolders();
      fetchDefaultSubscribers();
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

  // Fetch DNXS data on mount
  useEffect(() => {
    if (!agentKey) {
      fetchDefaultHolders();
      fetchDefaultSubscribers();
    }
  }, [fetchDefaultHolders, fetchDefaultSubscribers, agentKey]);

  const loading = usersLoading || subsLoading || !defaultHoldersData || !defaultSubscribersData;
  const error = usersError || subsError;

  // Get current data based on agent key
  const currentData = agentKey && agentUsersData ? {
    holders: agentUsersData.agentKey.users,
    subscribers: agentSubscribersData?.agentKey.users || [],
    totalSubscribed: agentSubscribersData?.agentKey.totalSubscribed || '0',
    totalSubscribers: agentSubscribersData?.agentKey.totalSubscribers || '0',
    symbol: agentUsersData.agentKey.users[0]?.agentKey.ans.symbol || 'DNXS'
  } : {
    holders: defaultHoldersData?.agentKey.users || [],
    subscribers: defaultSubscribersData?.agentKey.users || [],
    totalSubscribed: defaultSubscribersData?.agentKey.totalSubscribed || '0',
    totalSubscribers: defaultSubscribersData?.agentKey.totalSubscribers || '0',
    symbol: defaultHoldersData?.agentKey.users[0]?.agentKey.ans.symbol || 'DNXS'
  };

  const displayedData = showHolders ? 
    (showAllData ? currentData.holders : currentData.holders.slice(0, 10)) :
    (showAllData ? currentData.subscribers : currentData.subscribers.slice(0, 10));

  return (
    <div className="space-y-16">
      {/* Input Section */}
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
      </div>

      {/* Stats Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribed:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">
              {formatNumber(currentData.totalSubscribed)} {currentData.symbol}
            </p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{currentData.totalSubscribers}</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
            <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">
              {agentKey || DNXS_AGENT_KEY}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => setShowHolders(true)}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            showHolders 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Holders
        </button>
        <button
          onClick={() => setShowHolders(false)}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            !showHolders 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Subscribers
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-white tracking-wide">
            {showHolders ? 'Holders' : 'Subscribers'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleExportCSV(
                showHolders ? currentData.holders : currentData.subscribers,
                showHolders ? 'holders' : 'subscribers'
              )}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowAllData(!showAllData)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
            >
              {showAllData ? 'Show Less' : 'Show All'}
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
                {displayedData.map((item, index) => (
                  <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                    <td className="py-6 px-8 text-white">{index + 1}</td>
                    <td className="py-6 px-8 text-xs font-mono text-white break-all">{item.id.split('-').pop()}</td>
                    <td className="py-6 px-8 text-white font-medium">
                      {formatNumber('balance' in item ? item.balance : item.totalSubscribed)} {currentData.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentKeyDataDisplay;
