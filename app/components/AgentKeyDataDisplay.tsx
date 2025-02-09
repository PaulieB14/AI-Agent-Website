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

interface AgentData {
  totalLocked: string;
  totalSubscribed: string;
  totalSubscribers: string;
}

const TOTAL_TOKENS = 21000000;

const AgentKeyDataDisplay: React.FC = () => {
  const [agentKey, setAgentKey] = useState('');
  const [holders, setHolders] = useState<Holder[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [showAllHolders, setShowAllHolders] = useState(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);

  const [fetchAgentData] = useLazyQuery(FETCH_AGENT_DATA_QUERY, {
    client,
    onCompleted: (data) => {
      setAgentData({
        totalLocked: data.agentKey.totalLocked,
        totalSubscribed: data.agentKey.totalSubscribed,
        totalSubscribers: data.agentKey.totalSubscribers,
      });
      setHolders(data.agentKey.users);
      setSubscribers(data.agentKey.users.filter((user: Subscriber) => parseFloat(user.totalSubscribed) > 0));
    },
  });

  const handleFetchData = () => {
    if (agentKey.trim()) {
      fetchAgentData({ variables: { agentKey: agentKey.trim() } });
    } else {
      console.error('Agent Key is required');
      // You might want to add some user feedback here, like setting an error state
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
      <h2 className="text-xl font-bold mb-4">Agent Key Data</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={agentKey}
          onChange={(e) => setAgentKey(e.target.value)}
          placeholder="Enter Agent Key"
          className="flex-1 px-4 py-2 rounded"
        />
        <button
          onClick={handleFetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Data
        </button>
      </div>
      {agentData && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Agent Data</h3>
          <p>Total Locked: {formatNumber(Math.floor(parseFloat(agentData.totalLocked) / 1e18).toString())} DNXS</p>
          <p>Total Subscribed: {formatNumber(Math.floor(parseFloat(agentData.totalSubscribed) / 1e18).toString())} DNXS</p>
          <p>Percentage of Total Supply: {((parseFloat(agentData.totalSubscribed) / 1e18 / TOTAL_TOKENS) * 100).toFixed(4)}%</p>
          <p>Total Subscribers: {agentData.totalSubscribers}</p>
        </div>
      )}
      {holders.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Holders</h3>
          <button
            onClick={() => handleExportCSV(holders, 'holders')}
            className="px-4 py-2 bg-green-500 text-white rounded mb-2 mr-2"
          >
            Export Holders CSV
          </button>
          <button
            onClick={() => setShowAllHolders(!showAllHolders)}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            {showAllHolders ? 'Show Top 10' : 'Show All Holders'}
          </button>
          <ul className="list-disc pl-5">
            {displayedHolders.map((holder, index) => (
              <li key={index}>
                {holder.id.split('-').pop()}: {formatNumber(Math.floor(parseFloat(holder.balance) / 1e18).toString())} DNXS
              </li>
            ))}
          </ul>
        </div>
      )}
      {subscribers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Subscribers</h3>
          <button
            onClick={() => handleExportCSV(subscribers, 'subscribers')}
            className="px-4 py-2 bg-green-500 text-white rounded mb-2 mr-2"
          >
            Export Subscribers CSV
          </button>
          <button
            onClick={() => setShowAllSubscribers(!showAllSubscribers)}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            {showAllSubscribers ? 'Show Top 10' : 'Show All Subscribers'}
          </button>
          <ul className="list-disc pl-5">
            {displayedSubscribers.map((subscriber, index) => (
              <li key={index}>
                {subscriber.id.split('-').pop()}: {formatNumber(Math.floor(parseFloat(subscriber.totalSubscribed) / 1e18).toString())} DNXS
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentKeyDataDisplay;
