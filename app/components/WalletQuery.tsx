'use client';

import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import client from '../apolloClient';
import { CHECK_SUBSCRIPTION_QUERY } from '../queries'; // Ensure the correct import here

interface User {
  id: string;
  balance?: string;
  totalSubscribed?: string;
  displayId: string;
}

export default function WalletQuery() {
  const { address, isConnected } = useAccount(); // Wallet connection state
  const [isEligible, setIsEligible] = useState<boolean | null>(null); // Eligibility state
  const [subscriptionData, setSubscriptionData] = useState<string | null>(null); // Store subscription data

  const [checkSubscription] = useLazyQuery(CHECK_SUBSCRIPTION_QUERY, {
    client,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log('Query completed with data:', data);
    },
    onError: (error) => {
      console.error('Error during subscription check:', error);
      setIsEligible(false); // In case of error, mark as ineligible
    },
  });

  // Format Gwei to DNXS readable value
  const formatGwei = (value: string | undefined): string => {
    if (!value) return '0.000';
    const num = parseFloat(value) / 1e18;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  };

  // Function to check if the user is eligible
  const checkEligibility = async () => {
    if (!isConnected || !address) {
      console.log("Wallet not connected or address not found.");
      setIsEligible(false);
      return;
    }

    console.log("Wallet connected with address:", address);

    try {
      const userAddress = address.toLowerCase(); // Ensure the address is lowercase
      console.log('Checking eligibility for address:', userAddress);

      const { data } = await checkSubscription({
        variables: { user: userAddress },
      });

      console.log('Query variables:', { user: userAddress });
      console.log('Query response:', data);

      const totalSubscribed = data?.agentKeyUsers[0]?.totalSubscribed || '0';
      console.log('Raw subscription amount:', totalSubscribed);

      // Compare raw values using BigInt for precision
      const isEligible = BigInt(totalSubscribed) >= BigInt('10000000000000000000000'); // 10,000 DNXS in raw value

      // Convert to human-readable DNXS for logging
      const subscribedDNXS = Number(BigInt(totalSubscribed)) / 1e18;
      console.log('Found subscription:', subscribedDNXS.toFixed(3), 'DNXS');
      console.log('Required amount: 10,000 DNXS');
      console.log('Eligible:', isEligible);

      setSubscriptionData(totalSubscribed);
      setIsEligible(isEligible);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setIsEligible(false);
    }
  };

  // Check eligibility once wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      console.log("Auto-checking eligibility for connected wallet:", address);
      checkEligibility();
    }
  }, [isConnected, address]);

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
            <p className="text-xs md:text-sm text-white break-all">{address}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Want to Export Your Own Project Data?</h3>
          <p className="text-gray-300 text-sm md:text-base">
            Connect your wallet and check if you have enough DNXS subscribed (10,000 minimum) to export project data.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          {isConnected && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={checkEligibility}
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
              >
                Check Eligibility
              </button>
              {isEligible !== null && (
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Your subscription amount: {formatGwei(subscriptionData || '0')} DNXS</p>
                  {isEligible ? (
                    <p className="text-green-500 text-sm md:text-base">✓ You have enough DNXS subscribed to export data</p>
                  ) : (
                    <p className="text-yellow-500 text-sm md:text-base">
                      ⚠️ You need 10,000 DNXS subscribed to export data
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Query Specific Wallet</h3>
          <p className="text-gray-300 text-sm md:text-base">
            Enter a wallet address to view its DNXS holdings and subscriptions
          </p>
        </div>
        {/* Query wallet address form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!address) return;

            try {
              console.log('Querying wallet:', address);
              const { data } = await checkSubscription({
                variables: { user: address.toLowerCase() },
              });

              const totalSubscribed = data?.agentKeyUsers[0]?.totalSubscribed || '0';
              console.log('Queried subscription amount for wallet:', totalSubscribed);

              setSubscriptionData(totalSubscribed);
            } catch (error) {
              console.error('Error querying wallet:', error);
            }
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={address || ''}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold"
          >
            Query Wallet
          </button>
        </form>
      </div>
    </div>
  );
}
