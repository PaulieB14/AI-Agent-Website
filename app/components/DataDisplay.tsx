'use client';

import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { dnxsToken } from './web3config';
import { formatNumber } from '../utils/format';

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
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: dnxsToken.address,
    chainId: dnxsToken.chainId,
  });

  const isEligible = balance && parseFloat(balance.formatted) >= 25000;

  // Filter out duplicates and zero amounts
  const uniqueHolders = holders
    .filter(holder => parseFloat(holder.amount) > 0)
    .filter((holder, index, self) => 
      index === self.findIndex(h => h.address === holder.address)
    )
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  
  const nonZeroSubscribers = subscribers
    .filter(sub => parseFloat(sub.amount) > 0)
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  
  const displayedHolders = showAllHolders ? uniqueHolders : uniqueHolders.slice(0, 10);
  const displayedSubscribers = showAllSubscribers ? nonZeroSubscribers : nonZeroSubscribers.slice(0, 10);

  const handleExportHoldersCSV = () => {
    const holdersCsv = uniqueHolders.map(h => `${h.address},${formatNumber(h.amount).replace(/,/g, '')}`).join('\n');
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
    const subscribersCsv = nonZeroSubscribers.map(s => `${s.address},${formatNumber(s.amount).replace(/,/g, '')}`).join('\n');
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
      {/* Stats Section */}
      <div className="bg-[#1a1f2e]/80 p-10 rounded-2xl shadow-lg border border-gray-800/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Locked:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">{formatNumber(totalLocked)} DNXS</p>
          </div>
          <div className="text-left p-6 bg-[#1E2435]/80 rounded-xl border border-gray-800/30">
            <h3 className="text-gray-400/90 text-lg mb-3 font-medium">Total Subscribers:</h3>
            <p className="text-3xl text-white font-semibold tracking-wide">26</p>
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
          Connect your wallet with 25,000 locked DNXS tokens to export CSV files of your project&apos;s holders and subscribers.
        </p>
        {isConnected && (
          <div className={`text-xl font-bold ${isEligible ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
            {isEligible ? 'Eligible - Scroll to bottom' : 'Not Eligible - Need 25,000 DNXS'}
          </div>
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

      {/* Data Section */}
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
                    <td className="py-6 px-8 text-xs font-mono text-white break-all">{item.address}</td>
                    <td className="py-6 px-8 text-white font-medium">{formatNumber(item.amount)} DNXS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent ID Section */}
      {isConnected && isEligible && (
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
              onClick={() => {/* TODO: Handle fetching new agent data */}}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg font-medium border border-blue-400/20"
            >
              Fetch Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
