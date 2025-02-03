'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import client from '../apolloClient';
import { HOLDERS_QUERY, SUBSCRIBERS_QUERY } from '../queries';

interface User {
  id: string;
  balance?: string;
  totalSubscribed?: string;
  displayId: string;
}

export default function WalletQuery() {
  const [getHolders, { data: holdersData, loading: holdersLoading, error: holdersError }] = useLazyQuery(HOLDERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [getSubscribers, { data: subscribersData, loading: subscribersLoading, error: subscribersError }] = useLazyQuery(SUBSCRIBERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [showAllHolders, setShowAllHolders] = useState(false);
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [isViewingSubscribers, setIsViewingSubscribers] = useState(false);

  // Reset showAll state when switching views
  const toggleView = () => {
    setIsViewingSubscribers(!isViewingSubscribers);
    setShowAllHolders(false);
    setShowAllSubscribers(false);
  };

  const formatGwei = (value: string | undefined): string => {
    if (!value) return '0.000';
    const num = parseFloat(value) / 1e18;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const AGENT_KEY = '0x4aaba1b66a9a3e3053343ec11beeec2d205904df';

  const extractWalletAddress = (fullAddress: string): string => {
    const prefix = `${AGENT_KEY}-`;
    if (fullAddress.startsWith(prefix)) {
      return fullAddress.substring(prefix.length);
    }
    return fullAddress;
  };

  const processUserData = (users: User[] | undefined, field: 'balance' | 'totalSubscribed') => {
    if (!users) return [];

    // Filter out entries with zero balance and sort by amount
    return users
      .filter(user => {
        const amount = user[field];
        return amount && parseFloat(amount) > 0;
      })
      .map(user => {
        const walletAddress = extractWalletAddress(user.id);
        return {
          ...user,
          id: walletAddress,
          displayId: walletAddress
        };
      })
      .sort((a, b) => {
        const aValue = parseFloat(a[field] || '0');
        const bValue = parseFloat(b[field] || '0');
        return bValue - aValue;
      });
  };

  const exportToCSV = () => {
    const data = getCurrentData();
    if (!data.length) return;
    
    const headers = ['Wallet Address', 'Amount'];
    const rows: string[][] = data.map((user: User) => [
      user.id,
      formatGwei(isViewingSubscribers ? user.totalSubscribed : user.balance)
    ]);
    
    downloadCSV(headers, rows, isViewingSubscribers ? 'dnxs_subscribers.csv' : 'dnxs_holders.csv');
  };

  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
    // Properly escape and quote CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');
    
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

  const getCurrentData = () => {
    if (isViewingSubscribers) {
      const filtered = processUserData(subscribersData?.agentKey?.users, 'totalSubscribed');
      return showAllSubscribers ? filtered : filtered.slice(0, 10);
    } else {
      const filtered = processUserData(holdersData?.agentKey?.users, 'balance');
      return showAllHolders ? filtered : filtered.slice(0, 10);
    }
  };

  return (
    <div className="text-center py-8 md:py-10 px-4">
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <p className="text-base md:text-lg font-bold text-gray-400">Total Locked:</p>
            <p className="text-base md:text-lg text-white">7,293,790.953 DNXS</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-base md:text-lg font-bold text-gray-400">Total Subscribers:</p>
            <p className="text-base md:text-lg text-white">27</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-base md:text-lg font-bold text-gray-400">Agent Key:</p>
            <p className="text-xs md:text-sm text-white break-all">{AGENT_KEY}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isViewingSubscribers ? 'DNXS Subscribers' : 'DNXS Holders'}
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={toggleView}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
          >
            View {isViewingSubscribers ? 'Holders' : 'Subscribers'}
          </button>
          {getCurrentData().length > 0 && (
            <button
              type="button"
              onClick={exportToCSV}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
            >
              Export CSV
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

      <div className="bg-white bg-opacity-5 rounded-lg overflow-hidden shadow-md mb-6">
        <div className="max-h-[500px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-800">
              <tr className="bg-white bg-opacity-10">
                <th className="px-4 py-3 text-left text-gray-300">#</th>
                <th className="px-4 py-3 text-left text-gray-300">
                  {isViewingSubscribers ? 'Total Subscribed' : 'Tokens'}
                </th>
                <th className="px-4 py-3 text-left text-gray-300">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentData().map((user: User, index: number) => (
                <tr key={user.id} className="border-t border-white border-opacity-10">
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    {formatGwei(isViewingSubscribers ? user.totalSubscribed : user.balance)}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.displayId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isViewingSubscribers && (
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
          onClick={() => setShowAllHolders(!showAllHolders)}
        >
          {showAllHolders ? 'Show Less' : 'Show All Holders'}
        </button>
      )}
      {isViewingSubscribers && (
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
          onClick={() => setShowAllSubscribers(!showAllSubscribers)}
        >
          {showAllSubscribers ? 'Show Less' : 'Show All Subscribers'}
        </button>
      )}
    </div>
  );
}
