'use client';

import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import client from '../apolloClient';
import { USER_QUERY } from '../queries';

export default function WalletQuery() {
  const [wallet, setWallet] = useState('');
  const [getUserData, { data, loading, error }] = useLazyQuery(USER_QUERY, {
    client,
  });

  interface AgentKey {
    id: string;
    balance: string;
    agentKey: {
      ans: {
        symbol: string;
      };
      price?: string;
      marketCap?: string;
    };
  }  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet) {
      getUserData({ variables: { id: wallet.toLowerCase() } });
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-6">Query User Data</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter Wallet Address"
          className="px-4 py-2 rounded border w-1/2"
        />
        <button
          type="submit"
          className="ml-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Query
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.user && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Agent Keys</h2>
          <ul>
            {data.user.agentKeys.map((key: AgentKey) => (
              <li key={key.id} className="mb-4">
                <p><strong>ID:</strong> {key.id}</p>
                <p><strong>Balance:</strong> {key.balance}</p>
                <p><strong>Symbol:</strong> {key.agentKey.ans.symbol}</p>
                <p><strong>Price:</strong> {key.agentKey.price}</p>
                <p><strong>Market Cap:</strong> {key.agentKey.marketCap}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
