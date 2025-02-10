'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useLazyQuery } from '@apollo/client';
import { formatNumber } from '../utils/format';
import { FETCH_AGENT_USERS_QUERY, FETCH_AGENT_SUBSCRIBERS_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';

interface DataDisplayProps {
  totalLocked: string;
  totalSubscribers: string;
  agentKey: string;
  holders: Array<{ address: string; amount: string }>;
  subscribers: Array<{ address: string; amount: string }>;
  isEligible: boolean;
  subscriptionData: string | null;
  isLoading?: boolean;
  error?: string | null;
  tokenSymbol?: string;
}

type UnifiedDataItem = {
  id?: string;
  address?: string;
  balance?: string;
  amount?: string;
  totalSubscribed?: string;
};

export default function DataDisplay({
  totalLocked,
  totalSubscribers,
  agentKey,
  holders,
  subscribers,
  isEligible,
  subscriptionData,
  isLoading,
  error,
  tokenSymbol = 'DNXS'
}: DataDisplayProps) {
  const [showFetchedSubscribers, setShowFetchedSubscribers] = useState(true);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showAllFetched, setShowAllFetched] = useState(false);
  const [newAgentId, setNewAgentId] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedAgentData, setFetchedAgentData] = useState<{
    agentKey: {
      users: Array<{
        id: string;
        balance?: string;
        totalSubscribed?: string;
        agentKey: {
          ans: {
            symbol: string;
          };
        };
      }>;
      totalSubscribed?: string;
      totalSubscribers?: string;
    };
  } | null>(null);
  const { address, isConnected } = useAccount();

  const [fetchAgentUsers, { loading: fetchingUsers }] = useLazyQuery(FETCH_AGENT_USERS_QUERY, {
    client,
    onCompleted: (data) => {
      if (data?.agentKey) {
        setFetchedAgentData(prev => ({
          agentKey: {
            ...prev?.agentKey,
            users: data.agentKey.users
          }
        }));
        setFetchError(null);
      } else {
        setFetchError('No data found for this agent key');
      }
    },
    onError: (error) => {
      console.error('Error fetching agent users:', error);
      setFetchError(error.message);
      setFetchedAgentData(null);
    },
  });

  const [fetchSubscribers, { loading: fetchingSubscribers }] = useLazyQuery(FETCH_AGENT_SUBSCRIBERS_QUERY, {
    client,
    onCompleted: (data) => {
      if (data?.agentKey) {
        setFetchedAgentData(prev => ({
          agentKey: {
            ...prev?.agentKey,
            totalSubscribed: data.agentKey.totalSubscribed,
            totalSubscribers: data.agentKey.totalSubscribers,
            users: showFetchedSubscribers ? data.agentKey.users : (prev?.agentKey.users || [])
          }
        }));
      }
    },
    onError: (error) => {
      console.error('Error fetching subscribers:', error);
      setFetchError(error.message);
    },
  });

  const fetchingAgentData = fetchingUsers || fetchingSubscribers;

  const handleFetchAgentData = () => {
    if (newAgentId) {
      setFetchError(null);
      const trimmedKey = newAgentId.trim();
      fetchAgentUsers({ variables: { agentKey: trimmedKey } });
      fetchSubscribers({ variables: { agentKey: trimmedKey } });
    }
  };

  const getAmount = (item: UnifiedDataItem) => item.balance || item.amount || item.totalSubscribed || '0';
  const getId = (item: UnifiedDataItem) => {
    const id = item.id || item.address || '';
    return id.includes('-') ? id.split('-')[1] : id;
  };

  const currentSymbol = fetchedAgentData?.agentKey?.users[0]?.agentKey?.ans?.symbol || tokenSymbol;
  const fetchedTotalSubscribed = `${formatNumber(fetchedAgentData?.agentKey?.totalSubscribed || '0')} ${currentSymbol}`;
  const fetchedTotalSubscribers = fetchedAgentData?.agentKey?.totalSubscribers || '0';

  return (
    <div className="space-y-16">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-black">Loading data...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-4">
          <p className="text-red-500">{fetchError}</p>
        </div>
      )}
      {fetchingAgentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-black">Loading agent data...</p>
          </div>
        </div>
      )}
      {/* Stats Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribed:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">
              {fetchedAgentData ? fetchedTotalSubscribed : `${formatNumber(totalLocked)} ${currentSymbol}`}
            </p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">
              {fetchedAgentData ? fetchedTotalSubscribers : totalSubscribers}
            </p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
            <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">
              {fetchedAgentData ? newAgentId : agentKey}
            </p>
          </div>
        </div>
      </div>

      {/* Export Status */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4">Want to Export Your Own Project Data?</h3>
        <p className="text-gray-300/90 text-lg leading-relaxed mb-4">
          Connect your wallet with 50,000 locked tokens to export CSV files of your project&apos;s holders and subscribers.
        </p>
        {isConnected && (
          <>
            <div className={`text-xl font-bold ${isEligible ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
              {isEligible ? 'Wallet is Eligible' : `Not Eligible - Need 50,000 ${currentSymbol}`}
            </div>
            <div className="mt-2 text-gray-300">
              Connected Address: {address}
            </div>
            <div className="mt-1 text-gray-300">
              Subscription Amount: {subscriptionData ? formatNumber(subscriptionData) : 'N/A'} 
            </div>
          </>
        )}
      </div>

      {/* Data Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="flex flex-col gap-6">
          {isConnected && isEligible && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter Agent ID"
                value={newAgentId}
                onChange={(e) => setNewAgentId(e.target.value)}
                className="flex-1 px-6 py-3.5 bg-[#1E2435]/80 rounded-xl text-white border border-gray-800/30 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
              <button
                onClick={handleFetchAgentData}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
              >
                Fetch Data
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
              {fetchedAgentData && (
                <div className="text-white">
                  <span className="text-gray-400/90 mr-2">Agent Key:</span>
                  <span className="font-mono text-sm">{newAgentId}</span>
                </div>
              )}
                <div className="flex items-center gap-3">
                  <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      if (fetchedAgentData) {
                        setShowFetchedSubscribers(false);
                        fetchAgentUsers({ variables: { agentKey: newAgentId } });
                      } else {
                        setShowSubscribers(false);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg ${
                      (!fetchedAgentData && !showSubscribers) || (fetchedAgentData && !showFetchedSubscribers)
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/20' 
                        : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435] border border-gray-800/30'
                    }`}
                  >
                    Holders
                  </button>
                  <button
                    onClick={() => {
                      if (fetchedAgentData) {
                        setShowFetchedSubscribers(true);
                        fetchSubscribers({ variables: { agentKey: newAgentId } });
                      } else {
                        setShowSubscribers(true);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg ${
                      (!fetchedAgentData && showSubscribers) || (fetchedAgentData && showFetchedSubscribers)
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/20' 
                        : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435] border border-gray-800/30'
                    }`}
                  >
                    Subscribers
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (fetchedAgentData) {
                    const items = fetchedAgentData.agentKey.users;
                    const csv = `Wallet Address,Amount\n${items.map(item => 
                      `${getId(item)},${formatNumber(getAmount(item)).replace(/,/g, '')}`
                    ).join('\n')}`;
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentSymbol.toLowerCase()}-${showFetchedSubscribers ? 'subscribers' : 'holders'}-${newAgentId}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  } else {
                    const items = showSubscribers ? subscribers : holders;
                    const csv = `Wallet Address,Amount\n${items.map(item => 
                      `${getId(item)},${formatNumber(getAmount(item)).replace(/,/g, '')}`
                    ).join('\n')}`;
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentSymbol.toLowerCase()}-${showSubscribers ? 'subscribers' : 'holders'}-${agentKey}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium text-sm border border-green-400/20"
              >
                Export CSV
              </button>
              <button
                onClick={() => fetchedAgentData ? setShowAllFetched(!showAllFetched) : setShowAll(!showAll)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium text-sm border border-blue-400/20"
              >
                {(fetchedAgentData ? showAllFetched : showAll) ? 'Show Less' : 'Show All'}
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
                  {(fetchedAgentData ? 
                    (showAllFetched ? fetchedAgentData.agentKey.users : fetchedAgentData.agentKey.users.slice(0, 10)) :
                    (showAll ? 
                      (showSubscribers ? subscribers : holders) : 
                      (showSubscribers ? subscribers.slice(0, 10) : holders.slice(0, 10))
                    )
                  ).map((item, index) => (
                    <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                      <td className="py-6 px-8 text-white">{index + 1}</td>
                      <td className="py-6 px-8 text-xs font-mono text-white break-all">{getId(item)}</td>
                      <td className="py-6 px-8 text-white font-medium">
                        {formatNumber(getAmount(item))} {currentSymbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
