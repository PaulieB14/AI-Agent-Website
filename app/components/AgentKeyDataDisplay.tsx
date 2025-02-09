import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FETCH_AGENT_DATA_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';
import { formatNumber } from '../utils/format';

interface Holder {
  id: string;
  balance: string;
}

interface Subscriber {
  id: string;
  totalSubscribed: string;
}

const AgentKeyDataDisplay: React.FC = () => {
  const [agentKey, setAgentKey] = useState('');
  const [holders, setHolders] = useState<Holder[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showAllHolders, setShowAllHolders] = useState(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);

  const [fetchAgentData, { loading, error }] = useLazyQuery(FETCH_AGENT_DATA_QUERY, {
    client,
    onCompleted: (data) => {
      setHolders(data.agentKey.users);
      setSubscribers(data.agentKey.users.filter((user: Subscriber) => parseFloat(user.totalSubscribed) > 0));
    },
  });

  const handleFetchData = () => {
    if (agentKey.trim()) {
      fetchAgentData({ variables: { agentKey: agentKey.trim() } });
    } else {
      console.error('Agent Key is required');
    }
  };

  const handleExportCSV = (data: Holder[] | Subscriber[], filename: string) => {
    const csv = [
      ['Wallet Address', 'Amount'],
      ...data.map(item => {
        const amount = 'balance' in item ? item.balance : item.totalSubscribed;
        const wholeTokens = Math.floor(parseFloat(amount) / 1e18);
        return [item.id.split('-').pop() || '', wholeTokens.toString()];
      }),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${agentKey}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const displayedHolders = showAllHolders ? holders : holders.slice(0, 10);
  const displayedSubscribers = showAllSubscribers ? subscribers : subscribers.slice(0, 10);

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={agentKey}
            onChange={(e) => setAgentKey(e.target.value)}
            placeholder="Enter Agent Key"
            className="flex-1 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleFetchData}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        
        {holders.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Holders</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV(holders, 'holders')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAllHolders(!showAllHolders)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  {showAllHolders ? 'Show Top 10' : 'Show All'}
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {displayedHolders.map((holder, index) => (
                <li key={index} className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded">
                  <span className="font-mono">{holder.id.split('-').pop()}</span>
                  <span>{formatNumber(Math.floor(parseFloat(holder.balance) / 1e18).toString())} DNXS</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {subscribers.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Subscribers</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV(subscribers, 'subscribers')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAllSubscribers(!showAllSubscribers)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  {showAllSubscribers ? 'Show Top 10' : 'Show All'}
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {displayedSubscribers.map((subscriber, index) => (
                <li key={index} className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded">
                  <span className="font-mono">{subscriber.id.split('-').pop()}</span>
                  <span>{formatNumber(Math.floor(parseFloat(subscriber.totalSubscribed) / 1e18).toString())} DNXS</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentKeyDataDisplay;
