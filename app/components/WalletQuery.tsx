'use client';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import client from '../apolloClient';
import { HOLDERS_QUERY, SUBSCRIBERS_QUERY } from '../queries';

export default function WalletQuery() {
  const [getHolders, { data: holdersData, loading: holdersLoading, error: holdersError }] = useLazyQuery(HOLDERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [getSubscribers, { data: subscribersData, loading: subscribersLoading, error: subscribersError }] = useLazyQuery(SUBSCRIBERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  interface User {
    id: string;
    balance?: string;
    totalSubscribed?: string;
  }

  const formatNumber = (value: string | undefined): string => {
    if (!value) return '0.000';
    const num = parseFloat(value);
    return num.toFixed(3);
  };

  const exportHoldersToCSV = () => {
    if (!holdersData?.agentKey?.users) return;
    
    const headers = ['#', 'Tokens', 'Wallet Address'];
    const rows: string[][] = holdersData.agentKey.users.map((user: User, index: number) => [
      (index + 1).toString(),
      formatNumber(user.balance),
      user.id
    ]);
    
    downloadCSV(headers, rows, 'dnxs_holders.csv');
  };

  const exportSubscribersToCSV = () => {
    if (!subscribersData?.agentKey?.users) return;
    
    const headers = ['#', 'Total Subscribed', 'Wallet Address'];
    const rows: string[][] = subscribersData.agentKey.users.map((user: User, index: number) => [
      (index + 1).toString(),
      formatNumber(user.totalSubscribed),
      user.id
    ]);
    
    downloadCSV(headers, rows, 'dnxs_subscribers.csv');
  };

  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getHolders();
    getSubscribers();
  }, [getHolders, getSubscribers]);

  return (
    <div className="text-center py-8 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">DNXS Data</h1>
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="flex justify-center gap-4">
          {holdersData?.agentKey?.users && (
            <button
              type="button"
              onClick={exportHoldersToCSV}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors duration-200 font-semibold"
            >
              Export Holders
            </button>
          )}
          {subscribersData?.agentKey?.users && (
            <button
              type="button"
              onClick={exportSubscribersToCSV}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 font-semibold"
            >
              Export Subscribers
            </button>
          )}
        </div>
      </div>

      {(holdersLoading || subscribersLoading) && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      )}
      
      {(holdersError || subscribersError) && (
        <div className="text-red-500 mt-4">
          <p>Error: {holdersError?.message || subscribersError?.message || 'An error occurred'}</p>
          <p className="text-sm mt-2">Please try again later.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Holders Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Top Holders</h2>
          <div className="bg-white bg-opacity-5 rounded-lg overflow-hidden shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-white bg-opacity-10">
                  <th className="px-4 py-3 text-left text-gray-300">#</th>
                  <th className="px-4 py-3 text-left text-gray-300">Tokens</th>
                  <th className="px-4 py-3 text-left text-gray-300">Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                {holdersData?.agentKey?.users?.map((user: User, index: number) => (
                  <tr key={user.id} className="border-t border-white border-opacity-10">
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3">{formatNumber(user.balance)}</td>
                    <td className="px-4 py-3 text-sm break-all">{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscribers Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Top Subscribers</h2>
          <div className="bg-white bg-opacity-5 rounded-lg overflow-hidden shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-white bg-opacity-10">
                  <th className="px-4 py-3 text-left text-gray-300">#</th>
                  <th className="px-4 py-3 text-left text-gray-300">Total Subscribed</th>
                  <th className="px-4 py-3 text-left text-gray-300">Wallet Address</th>
                </tr>
              </thead>
              <tbody>
                {subscribersData?.agentKey?.users?.map((user: User, index: number) => (
                  <tr key={user.id} className="border-t border-white border-opacity-10">
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3">{formatNumber(user.totalSubscribed)}</td>
                    <td className="px-4 py-3 text-sm break-all">{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
