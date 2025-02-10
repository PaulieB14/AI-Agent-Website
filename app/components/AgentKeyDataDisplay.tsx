// AgentKeyDataDisplay.tsx

// 1. Imports
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { FETCH_AGENT_USERS_QUERY, FETCH_AGENT_SUBSCRIBERS_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';
import { formatNumber } from '../utils/format';

// 3. Interfaces
interface User {
  id: string;
  balance: string;
  agentKey: {
    ans: { symbol: string; }
  };
}

interface Subscriber {
  id: string;
  totalSubscribed: string;
  agentKey: {
    ans: { symbol: string; }
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

interface DisplayState {
  mode: 'default' | 'custom';
  key: string;
}

// 4. Component
const AgentKeyDataDisplay: React.FC = () => {
  // States
  const { isConnected } = useAccount();
  const [displayState, setDisplayState] = useState<DisplayState>({
    mode: 'default',
    key: ''
  });
  const [inputKey, setInputKey] = useState('');
  const [dataType, setDataType] = useState<'holders' | 'subscribers'>('holders');
  const [showAllData, setShowAllData] = useState(false);

  // Queries
  const [fetchUsers, { loading: usersLoading, error: usersError, data: userData }] = 
    useLazyQuery<HoldersResponse>(FETCH_AGENT_USERS_QUERY, { client });

  const [fetchSubscribers, { loading: subsLoading, error: subsError, data: subscriberData }] = 
    useLazyQuery<SubscribersResponse>(FETCH_AGENT_SUBSCRIBERS_QUERY, { client });

  useEffect(() => {
    if (!isConnected && displayState.mode === 'custom') {
      setInputKey('');
      setDisplayState({ mode: 'default', key: '' });
    }
  }, [isConnected]);

  // Handlers
  const handleFetchData = async () => {
    if (!inputKey.trim()) return;
    const key = inputKey.trim();
    
    try {
      await Promise.all([
        fetchUsers({ variables: { agentKey: key } }),
        fetchSubscribers({ variables: { agentKey: key } })
      ]);
      setDisplayState({ mode: 'custom', key });
      setDataType('holders');
      setShowAllData(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      link.setAttribute('download', `${filename}_${displayState.key}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Data processing
  const filterData = (data: User[] | Subscriber[]) => {
    return data.filter(item => {
      const address = item.id.split('-').pop()?.toLowerCase();
      return address !== '0xfc48314ad4ad5bd36a84e8307b86a68a01d95d9c';
    });
  };

  const currentData = {
    holders: filterData(userData?.agentKey?.users || []),
    subscribers: filterData(subscriberData?.agentKey?.users || []),
    totalSubscribed: subscriberData?.agentKey?.totalSubscribed || '0',
    totalSubscribers: subscriberData?.agentKey?.totalSubscribers || '0',
    symbol: userData?.agentKey?.users[0]?.agentKey?.ans?.symbol || ''
  };

  const displayedData = dataType === 'holders' ? 
    (showAllData ? currentData.holders : currentData.holders.slice(0, 10)) :
    (showAllData ? currentData.subscribers : currentData.subscribers.slice(0, 10));

  // Loading and error states
  const loading = usersLoading || subsLoading;
  const error = usersError || subsError;


  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
          <div className="text-center text-white">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      );
    }

    if (displayState.mode === 'default') {
      return (
        <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter Agent Key"
              className="flex-1 px-6 py-3.5 bg-[#1E2435]/80 rounded-xl text-white border border-gray-800/30 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              disabled={!isConnected}
            />
            <button
              onClick={handleFetchData}
              disabled={loading || !inputKey.trim() || !isConnected}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20 disabled:opacity-50"
            >
              {loading ? 'Fetching...' : 'Fetch Data'}
            </button>
          </div>
        </div>
      );
    }

    return (
        <>
          {/* Results Table */}
          <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-6">
                <div className="text-white">
                  <span className="text-gray-400/90 mr-2">Agent Key:</span>
                  <span className="font-mono text-sm">{displayState.key}</span>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value as 'holders' | 'subscribers')}
                    className="bg-[#1E2435]/80 text-white px-4 py-2 rounded-lg border border-gray-800/30 focus:outline-none focus:border-blue-500"
                  >
                    <option value="holders">Holders ({formatNumber(currentData.totalSubscribed)} {currentData.symbol})</option>
                    <option value="subscribers">Subscribers ({currentData.totalSubscribers})</option>
                  </select>
                  <button
                    onClick={() => {
                      setInputKey('');
                      setDisplayState({ mode: 'default', key: '' });
                      setDataType('holders');
                      setShowAllData(false);
                    }}
                    className="px-4 py-2 bg-[#1E2435]/80 text-gray-300/90 rounded-lg hover:bg-[#1E2435] transition-colors duration-200 text-sm font-medium border border-gray-800/30"
                  >
                    New Search
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV(
                    dataType === 'holders' ? currentData.holders : currentData.subscribers,
                    dataType
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
        </>
    );
  };

  return (
    <div className="space-y-16">
      {renderContent()}
    </div>
  );
};

export default AgentKeyDataDisplay;
