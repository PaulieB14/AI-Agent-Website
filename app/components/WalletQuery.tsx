'use client';

import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import client from '../apolloClient'; // Adjusted path to match your structure
import { USER_QUERY } from '../queries'; // Ensure this path is correct

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
    <div className="text-center py-8 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Query User Data</h1>
      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter Wallet Address"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 font-semibold min-w-[100px]"
          >
            Query
          </button>
        </div>
      </form>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && data.user && (
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Agent Keys</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-6">
              {data.user.agentKeys.map((key: AgentKey) => (
                <li key={key.id} className="bg-white bg-opacity-5 rounded-lg p-4 md:p-6 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p className="text-left">
                      <strong className="text-gray-300">ID:</strong>{' '}
                      <span className="break-all">{key.id}</span>
                    </p>
                    <p className="text-left">
                      <strong className="text-gray-300">Balance:</strong>{' '}
                      <span>{key.balance}</span>
                    </p>
                    <p className="text-left">
                      <strong className="text-gray-300">Symbol:</strong>{' '}
                      <span>{key.agentKey.ans.symbol}</span>
                    </p>
                    <p className="text-left">
                      <strong className="text-gray-300">Price:</strong>{' '}
                      <span>{key.agentKey.price ?? 'N/A'}</span>
                    </p>
                    <p className="text-left md:col-span-2">
                      <strong className="text-gray-300">Market Cap:</strong>{' '}
                      <span>{key.agentKey.marketCap ?? 'N/A'}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
