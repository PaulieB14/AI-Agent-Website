import React, { useState } from 'react';
import { useLazyQuery, ApolloError } from '@apollo/client';
import { FETCH_AGENT_INFO_QUERY, FETCH_AGENT_SUBSCRIBERS_QUERY, FETCH_AGENT_USERS_QUERY } from '../lib/queries';
import client from '../lib/apolloClient';
import { formatNumber } from '../utils/format';

interface AgentInfoResponse {
  agentKey: AgentInfo;
}

interface AgentSubscribersResponse {
  agentKey: {
    users: Subscriber[];
  };
}

interface AgentUsersResponse {
  agentKey: {
    users: User[];
  };
}

interface User {
  id: string;
  balance: string;
  agentKey: {
    ans: {
      symbol: string;
    };
  };
}

interface AgentInfo {
  name: string;
  totalSubscribed: string;
  totalSubscribers: string;
  ans: {
    symbol: string;
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

const AgentKeyDataDisplay: React.FC = () => {
  const [agentKey, setAgentKey] = useState('');
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const [fetchAgentInfo, { loading: infoLoading, error: infoError }] = useLazyQuery(FETCH_AGENT_INFO_QUERY, {
    client,
    onCompleted: (data: AgentInfoResponse) => {
      setAgentInfo(data.agentKey);
    },
  });

  const [fetchSubscribers, { loading: subsLoading, error: subsError }] = useLazyQuery(FETCH_AGENT_SUBSCRIBERS_QUERY, {
    client,
    onCompleted: (data: AgentSubscribersResponse) => {
      setSubscribers(data.agentKey.users);
    },
  });

  const [fetchUsers, { loading: usersLoading, error: usersError }] = useLazyQuery(FETCH_AGENT_USERS_QUERY, {
    client,
    onCompleted: (data: AgentUsersResponse) => {
      setUsers(data.agentKey.users);
    },
  });

  const handleFetchData = () => {
    if (agentKey.trim()) {
      const trimmedKey = agentKey.trim();
      fetchAgentInfo({ variables: { agentKey: trimmedKey } });
      fetchSubscribers({ variables: { agentKey: trimmedKey } });
      fetchUsers({ variables: { agentKey: trimmedKey } });
    } else {
      console.error('Agent Key is required');
    }
  };

  const handleExportCSV = (data: (Subscriber | User)[], filename: string) => {
    const csv = [
      ['Wallet Address', 'Amount'],
      ...data.map(item => [
        item.id.split('-').pop() || '',
        formatNumber('balance' in item ? item.balance : item.totalSubscribed)
      ]),
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

  const displayedSubscribers = showAllSubscribers ? subscribers : subscribers.slice(0, 10);
  const displayedUsers = showAllUsers ? users : users.slice(0, 10);
  const loading = infoLoading || subsLoading || usersLoading;
  const error: ApolloError | undefined = infoError || subsError || usersError;

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
        
        {agentInfo && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{agentInfo.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Total Subscribed</p>
                <p className="text-lg">{formatNumber(agentInfo.totalSubscribed)} {agentInfo.ans?.symbol || ''}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Subscribers</p>
                <p className="text-lg">{agentInfo.totalSubscribers}</p>
              </div>
            </div>
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Users with Balance</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV(users, 'users')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  {showAllUsers ? 'Show Top 10' : 'Show All'}
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {displayedUsers.map((user, index) => (
                <li key={index} className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded">
                  <span className="font-mono">{user.id.split('-').pop()}</span>
                  <span>{formatNumber(user.balance)} {user.agentKey.ans?.symbol || ''}</span>
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
                  <span>{formatNumber(subscriber.totalSubscribed)} {subscriber.agentKey.ans?.symbol || ''}</span>
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
