'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import client from '../apolloClient';
import { HOLDERS_QUERY, SUBSCRIBERS_QUERY, USER_LOCKED_QUERY } from '../queries';

interface User {
  id: string;
  balance?: string;
  totalSubscribed?: string;
  displayId: string;
}

export default function WalletQuery() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [isEligible, setIsEligible] = useState(false);
  const [checkUserLocked] = useLazyQuery(USER_LOCKED_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [getHolders, { data: holdersData, loading: holdersLoading, error: holdersError }] = useLazyQuery(HOLDERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [getSubscribers, { data: subscribersData, loading: subscribersLoading, error: subscribersError }] = useLazyQuery(SUBSCRIBERS_QUERY, {
    client,
    fetchPolicy: 'no-cache'
  });

  const [visibleHolders, setVisibleHolders] = useState(10);
  const [visibleSubscribers, setVisibleSubscribers] = useState(10);
  const [isViewingSubscribers, setIsViewingSubscribers] = useState(false);

  const DEFAULT_VISIBLE = 10;
  const EXPANDED_VISIBLE = 100;

  const toggleView = () => {
    setIsViewingSubscribers(!isViewingSubscribers);
    setVisibleHolders(DEFAULT_VISIBLE);
    setVisibleSubscribers(DEFAULT_VISIBLE);
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

  const getAllData = () => {
    if (isViewingSubscribers) {
      return processUserData(subscribersData?.agentKey?.users, 'totalSubscribed');
    } else {
      return processUserData(holdersData?.agentKey?.users, 'balance');
    }
  };

  const exportToCSV = () => {
    const data = getAllData();
    if (!data.length) return;
    
    const headers = ['Wallet Address', 'Amount'];
    const rows: string[][] = data.map((user: User) => [
      user.id,
      formatGwei(isViewingSubscribers ? user.totalSubscribed : user.balance)
    ]);
    
    downloadCSV(headers, rows, isViewingSubscribers ? 'dnxs_subscribers.csv' : 'dnxs_holders.csv');
  };

  const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
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

  useEffect(() => {
    const checkEligibility = async () => {
      if (isConnected && address) {
        try {
          const { data } = await checkUserLocked({
            variables: { user: address.toLowerCase() }
          });
          
          const totalSubscribed = data?.agentKeyUsers?.[0]?.totalSubscribed || '0';
          const eligible = parseFloat(totalSubscribed) / 1e18 >= 25000;
          setIsEligible(eligible);
        } catch (error) {
          console.error('Error checking eligibility:', error);
          setIsEligible(false);
        }
      } else {
        setIsEligible(false);
      }
    };

    checkEligibility();
  }, [isConnected, address, checkUserLocked]);

  const getCurrentData = () => {
    if (isViewingSubscribers) {
      const filtered = processUserData(subscribersData?.agentKey?.users, 'totalSubscribed');
      return filtered.slice(0, visibleSubscribers);
    } else {
      const filtered = processUserData(holdersData?.agentKey?.users, 'balance');
      return filtered.slice(0, visibleHolders);
    }
  };

  const toggleVisibleEntries = () => {
    if (isViewingSubscribers) {
      setVisibleSubscribers(visibleSubscribers === DEFAULT_VISIBLE ? EXPANDED_VISIBLE : DEFAULT_VISIBLE);
    } else {
      setVisibleHolders(visibleHolders === DEFAULT_VISIBLE ? EXPANDED_VISIBLE : DEFAULT_VISIBLE);
    }
  };

  const currentVisibleCount = isViewingSubscribers ? visibleSubscribers : visibleHolders;
  const totalCount = isViewingSubscribers 
    ? processUserData(subscribersData?.agentKey?.users, 'totalSubscribed').length 
    : processUserData(holdersData?.agentKey?.users, 'balance').length;

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

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Want to Export Your Own Project Data?</h3>
          <p className="text-gray-300 text-sm md:text-base">
            Connect your wallet with 25,000 locked DNXS tokens to export CSV files of your project&apos;s holders and subscribers.
          </p>
        </div>
        {!isConnected ? (
          <button
            onClick={() => open()}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold mx-auto block"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-center">
            {isEligible ? (
              <p className="text-green-500 text-sm md:text-base">✓ You can now export your project&apos;s data</p>
            ) : (
              <p className="text-yellow-500 text-sm md:text-base">
                ⚠️ You need 25,000 DNXS tokens locked to export your project&apos;s data
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isViewingSubscribers ? 'DNXS Subscribers' : 'DNXS Holders'}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleView}
            className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold text-sm sm:text-base"
          >
            View {isViewingSubscribers ? 'Holders' : 'Subscribers'}
          </button>
          {getCurrentData().length > 0 && (
            <button
              type="button"
              onClick={exportToCSV}
              className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold text-sm sm:text-base"
            >
              Export DNXS {isViewingSubscribers ? 'Subscribers' : 'Holders'} CSV
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

      {totalCount > DEFAULT_VISIBLE && (
        <button
          className="mt-4 px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold text-sm sm:text-base"
          onClick={toggleVisibleEntries}
        >
          {currentVisibleCount === DEFAULT_VISIBLE 
            ? `Show More (${Math.min(EXPANDED_VISIBLE, totalCount)})`
            : 'Show Less'}
        </button>
      )}
    </div>
  );
}
