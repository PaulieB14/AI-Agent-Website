'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useLazyQuery } from '@apollo/client';
import { formatNumber } from '../utils/format';
import { FETCH_AGENT_DATA_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';

interface DataDisplayProps {
  totalLocked: string;
  agentKey: string;
  holders: Array<{ address: string; amount: string }>;
  subscribers: Array<{ address: string; amount: string }>;
  isEligible: boolean;
  subscriptionData: string | null;
  isLoading?: boolean;
  error?: string | null;
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
  agentKey,
  holders,
  subscribers,
  isEligible,
  subscriptionData,
  isLoading,
  error
}: DataDisplayProps) {
  const [showAllHolders, setShowAllHolders] = useState(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showFetchedSubscribers, setShowFetchedSubscribers] = useState(true);
  const [newAgentId, setNewAgentId] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedAgentData, setFetchedAgentData] = useState<{
    subscribers: {
      users: Array<{ id: string; totalSubscribed: string }>;
    };
    holders: {
      users: Array<{ id: string; balance: string }>;
    };
  } | null>(null);
  const { address, isConnected } = useAccount();

  const [fetchAgentData, { loading: fetchingAgentData }] = useLazyQuery(FETCH_AGENT_DATA_QUERY, {
    client,
    onCompleted: (data) => {
      if (data?.subscribers?.users && data?.holders?.users) {
        setFetchedAgentData(data);
        setFetchError(null);
      } else {
        setFetchError('No data found for this agent key');
      }
    },
    onError: (error) => {
      console.error('Error fetching agent data:', error);
      setFetchError(error.message);
      setFetchedAgentData(null);
    },
  });

  const handleFetchAgentData = () => {
    if (newAgentId) {
      setFetchError(null);
      fetchAgentData({ variables: { agentKey: newAgentId } });
    }
  };

  const getAmount = (item: UnifiedDataItem) => item.balance || item.amount || item.totalSubscribed || '0';
  const getId = (item: UnifiedDataItem) => {
    const id = item.id || item.address || '';
    // If the id contains a hyphen (agent key prefix), get the part after the hyphen
    return id.includes('-') ? id.split('-')[1] : id;
  };

  // Filter out duplicates and zero amounts for DNXS data
  const uniqueHolders = holders
    .filter(holder => parseFloat(getAmount(holder)) > 0)
    .filter((holder, index, self) => 
      index === self.findIndex(h => getId(h) === getId(holder))
    )
    .sort((a, b) => parseFloat(getAmount(b)) - parseFloat(getAmount(a)));
  
  const nonZeroSubscribers = subscribers
    .filter(sub => parseFloat(getAmount(sub)) > 0)
    .sort((a, b) => parseFloat(getAmount(b)) - parseFloat(getAmount(a)));
  
  const displayedHolders = showAllHolders ? uniqueHolders : uniqueHolders.slice(0, 10);
  const displayedSubscribers = showAllSubscribers ? nonZeroSubscribers : nonZeroSubscribers.slice(0, 10);

  // Calculate total locked from holders' balances
  const calculateTotalLocked = (users: Array<{ balance: string }>) => {
    return users.reduce((sum, user) => sum + BigInt(user.balance), BigInt(0)).toString();
  };

  // Separate section for fetched agent data
  const fetchedTotalLocked = fetchedAgentData ? calculateTotalLocked(fetchedAgentData.holders.users) : '0';

  const handleExportHoldersCSV = () => {
    const holdersCsv = uniqueHolders.map(h => `${getId(h)},${formatNumber(getAmount(h)).replace(/,/g, '')}`).join('\n');
    const csv = `Wallet Address,Amount\n${holdersCsv}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-holders-${agentKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportSubscribersCSV = () => {
    const subscribersCsv = nonZeroSubscribers.map(s => `${getId(s)},${formatNumber(getAmount(s)).replace(/,/g, '')}`).join('\n');
    const csv = `Wallet Address,Amount\n${subscribersCsv}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-subscribers-${agentKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
      {/* DNXS Stats Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Locked:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{formatNumber(totalLocked)} DNXS</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{nonZeroSubscribers.length}</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
            <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">{agentKey}</p>
          </div>
        </div>
      </div>

      {/* Export Status */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4">Want to Export Your Own Project Data?</h3>
        <p className="text-gray-300/90 text-lg leading-relaxed mb-4">
          Connect your wallet with 10,000 locked DNXS tokens to export CSV files of your project&apos;s holders and subscribers.
        </p>
        {isConnected && (
          <>
            <div className={`text-xl font-bold ${isEligible ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
              {isEligible ? 'Eligible - Scroll to bottom' : 'Not Eligible - Need 10,000 DNXS'}
            </div>
            <div className="mt-2 text-gray-300">
              Connected Address: {address}
            </div>
            <div className="mt-1 text-gray-300">
              Subscription Amount: {subscriptionData ? formatNumber(subscriptionData) : 'N/A'} DNXS
            </div>
          </>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => setShowSubscribers(false)}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            !showSubscribers 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Holders
        </button>
        <button
          onClick={() => setShowSubscribers(true)}
          className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
            showSubscribers 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
              : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
          }`}
        >
          View Subscribers
        </button>
      </div>

      {/* DNXS Data Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-semibold text-white tracking-wide">{showSubscribers ? 'Subscribers' : 'Holders'}</h3>
            <button
              onClick={showSubscribers ? handleExportSubscribersCSV : handleExportHoldersCSV}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
            >
              Export CSV
            </button>
          </div>
          <button
            onClick={() => showSubscribers ? setShowAllSubscribers(!showAllSubscribers) : setShowAllHolders(!showAllHolders)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
          >
            {(showSubscribers ? showAllSubscribers : showAllHolders) ? 'Show Less' : 'Show All'}
          </button>
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
                {(showSubscribers ? displayedSubscribers : displayedHolders).map((item, index) => (
                  <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                    <td className="py-6 px-8 text-white">{index + 1}</td>
                    <td className="py-6 px-8 text-xs font-mono text-white break-all">{getId(item)}</td>
                    <td className="py-6 px-8 text-white font-medium">{formatNumber(getAmount(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent ID Section */}
      {isConnected && isEligible && (
        <>
          <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
            <div className="flex gap-4">
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
          </div>

          {/* Fetched Agent Data Section */}
          {fetchedAgentData && (
            <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                  <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Locked:</h3>
                  <p className="text-3xl text-white font-semibold tracking-wide">{formatNumber(fetchedTotalLocked)}</p>
                </div>
                <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                  <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
                  <p className="text-3xl text-white font-semibold tracking-wide">{fetchedAgentData.subscribers.users.length}</p>
                </div>
                <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
                  <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Agent Key:</h3>
                  <p className="text-sm text-white font-mono break-all bg-[#232839]/80 p-3 rounded-lg border border-gray-800/30">{newAgentId}</p>
                </div>
              </div>

              {/* Fetched Data Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold text-white tracking-wide">{showFetchedSubscribers ? 'Subscribers' : 'Holders'}</h3>
                  <button
                    onClick={() => {
                      const items = showFetchedSubscribers ? fetchedAgentData.subscribers.users : fetchedAgentData.holders.users;
                      const csv = `Wallet Address,Amount\n${items.map(item => `${getId(item)},${formatNumber(getAmount(item)).replace(/,/g, '')}`).join('\n')}`;
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${showFetchedSubscribers ? 'subscribers' : 'holders'}-${newAgentId}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-lg font-medium border border-green-400/20"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="flex justify-center gap-8">
                  <button
                    onClick={() => setShowFetchedSubscribers(false)}
                    className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      !showFetchedSubscribers 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
                        : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
                    }`}
                  >
                    View Holders
                  </button>
                  <button
                    onClick={() => setShowFetchedSubscribers(true)}
                    className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      showFetchedSubscribers 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105 transform border border-blue-400/20' 
                        : 'bg-[#1E2435]/80 text-gray-300/90 hover:bg-[#1E2435]/90 hover:scale-102 border border-gray-800/30'
                    }`}
                  >
                    View Subscribers
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
                      {(showFetchedSubscribers ? fetchedAgentData.subscribers.users : fetchedAgentData.holders.users).map((item, index) => (
                        <tr key={index} className="hover:bg-[#1E2435]/80 transition-colors duration-150">
                          <td className="py-6 px-8 text-white">{index + 1}</td>
                          <td className="py-6 px-8 text-xs font-mono text-white break-all">{getId(item)}</td>
                          <td className="py-6 px-8 text-white font-medium">
                            {formatNumber(getAmount(item))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
