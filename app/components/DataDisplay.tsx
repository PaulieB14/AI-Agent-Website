'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { USER_LOCKED_QUERY, hasRequiredTokens } from '../queries';

interface DataDisplayProps {
  totalLocked: string;
  agentKey: string;
  holders: Array<{ address: string; amount: string }>;
  subscribers: Array<{ address: string; amount: string }>;
}

export default function DataDisplay({
  totalLocked,
  agentKey,
  holders,
  subscribers
}: DataDisplayProps) {
  const [showAllHolders, setShowAllHolders] = useState(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [newAgentId, setNewAgentId] = useState('');
  const { isConnected, address } = useAccount();
  const { data: userLockedData } = useQuery(USER_LOCKED_QUERY, {
    variables: { user: address?.toLowerCase() },
    skip: !address
  });

  const userHasRequiredTokens = hasRequiredTokens(userLockedData?.agentKeyUsers?.[0]?.totalSubscribed);

  // Format number with commas and 3 decimal places
  const formatNumber = (num: string) => {
    const number = parseFloat(num);
    return number.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  // Filter out duplicates and zero amounts
  const uniqueHolders = holders.filter((holder, index, self) => 
    index === self.findIndex(h => h.address === holder.address)
  );
  
  const nonZeroSubscribers = subscribers.filter(sub => parseFloat(sub.amount) > 0);
  
  const displayedHolders = showAllHolders ? uniqueHolders : uniqueHolders.slice(0, 10);
  const displayedSubscribers = showAllSubscribers ? nonZeroSubscribers : nonZeroSubscribers.slice(0, 10);

  const handleExportHoldersCSV = () => {
    const holdersCsv = uniqueHolders.map(h => `${formatNumber(h.amount)} ${h.address}`).join('\n');
    const csv = `Holder\n${holdersCsv}`;
    
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
    const subscribersCsv = nonZeroSubscribers.map(s => `${s.address},${formatNumber(s.amount)}`).join('\n');
    const csv = `Address,Amount\n${subscribersCsv}`;
    
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
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="bg-[#1a1f2e] p-8 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-left">
            <h3 className="text-gray-400 text-lg mb-1">Total Locked:</h3>
            <p className="text-xl text-white">{totalLocked} DNXS</p>
          </div>
          <div className="text-left">
            <h3 className="text-gray-400 text-lg mb-1">Total Subscribers:</h3>
            <p className="text-xl text-white">{nonZeroSubscribers.length}</p>
          </div>
          <div className="text-left">
            <h3 className="text-gray-400 text-lg mb-1">Agent Key:</h3>
            <p className="text-sm text-white font-mono break-all">{agentKey}</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowSubscribers(false)}
          className={`px-6 py-3 rounded-lg font-semibold ${!showSubscribers ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          View Holders
        </button>
        <button
          onClick={() => setShowSubscribers(true)}
          className={`px-6 py-3 rounded-lg font-semibold ${showSubscribers ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          View Subscribers
        </button>
      </div>

      {/* Data Section */}
      <div className="bg-[#1a1f2e] p-8 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{showSubscribers ? 'Subscribers' : 'Holders'}</h3>
          <div className="flex gap-4">
            <button
              onClick={() => showSubscribers ? setShowAllSubscribers(!showAllSubscribers) : setShowAllHolders(!showAllHolders)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              {(showSubscribers ? showAllSubscribers : showAllHolders) ? 'Show Less' : 'Show All'}
            </button>
            {/* Show CSV export for holders, and for subscribers if user has required tokens */}
            {(!showSubscribers || userHasRequiredTokens) && (
              <button
                onClick={showSubscribers ? handleExportSubscribersCSV : handleExportHoldersCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                Export CSV
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2 text-gray-400">{showSubscribers ? 'Address' : 'Holder'}</th>
                {showSubscribers && <th className="p-2 text-gray-400">Amount</th>}
              </tr>
            </thead>
            <tbody>
              {showSubscribers ? 
                displayedSubscribers.map((subscriber, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-2 text-sm font-mono text-white">{subscriber.address}</td>
                    <td className="p-2 text-white">{formatNumber(subscriber.amount)}</td>
                  </tr>
                )) :
                displayedHolders.map((holder, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-2 text-white">
                      {formatNumber(holder.amount)} <span className="text-sm font-mono ml-2">{holder.address}</span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent ID Section */}
      {isConnected && userHasRequiredTokens && (
        <div className="bg-[#1a1f2e] p-8 rounded-lg">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Agent ID"
              value={newAgentId}
              onChange={(e) => setNewAgentId(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
            <button
              onClick={() => {/* TODO: Handle fetching new agent data */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Fetch Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
