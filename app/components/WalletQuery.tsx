'use client';

import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import client from '../lib/apolloClient';
import { CHECK_SUBSCRIPTION_QUERY } from '../lib/queries';

const REQUIRED_DNXS = BigInt('10000000000000000000000'); // 10,000 DNXS

export default function WalletQuery() {
  const { address, isConnected } = useAccount();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [checkSubscription] = useLazyQuery(CHECK_SUBSCRIPTION_QUERY, {
    client,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log('📊 Query completed:', JSON.stringify(data, null, 2));
    },
    onError: (error) => {
      console.error('❌ Query error:', error);
      setError(error.message);
      setIsEligible(false);
    },
  });

  const formatGwei = (value: string | undefined): string => {
    if (!value) return '0.000';
    try {
      const num = parseFloat(value) / 1e18;
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    } catch (error) {
      console.error('Error formatting value:', error);
      return '0.000';
    }
  };

  const checkEligibility = async () => {
    if (!isConnected || !address) {
      console.log("❌ Wallet not connected");
      setIsEligible(false);
      setError("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userAddress = address.toLowerCase();
      console.log("🔍 Checking wallet:", userAddress);

      const { data } = await checkSubscription({
        variables: { user: userAddress },
      });

      if (!data?.agentKeyUsers?.[0]) {
        console.log("⚠️ No subscription found");
        setIsEligible(false);
        setSubscriptionData('0');
        return;
      }

      const totalSubscribed = data.agentKeyUsers[0].totalSubscribed || '0';
      const subscribedBigInt = BigInt(totalSubscribed);

      console.log(`
        💰 Subscription Details:
        Raw: ${totalSubscribed}
        Required: ${REQUIRED_DNXS.toString()}
        Has: ${subscribedBigInt.toString()}
        Human readable: ${formatGwei(totalSubscribed)} DNXS
      `);

      const eligible = subscribedBigInt >= REQUIRED_DNXS;
      console.log("✅ Eligible:", eligible);

      setSubscriptionData(totalSubscribed);
      setIsEligible(eligible);

    } catch (error) {
      console.error("❌ Check failed:", error);
      setError("Failed to check eligibility");
      setIsEligible(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      console.log("🔄 Auto-checking wallet:", address);
      checkEligibility();
    }
  }, [isConnected, address]);

  // Rest of your JSX remains the same, but add loading states:
  return (
    <div className="text-center py-8 md:py-10 px-4">
      {/* ... existing stats section ... */}

      <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            Want to Export Your Own Project Data?
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Connect your wallet and check if you have enough DNXS subscribed (10,000 minimum)
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ConnectButton />
          
          {isConnected && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={checkEligibility}
                disabled={isLoading}
                className={`w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-400 transition-colors duration-200 font-semibold
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Checking...' : 'Check Eligibility'}
              </button>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {isEligible !== null && !error && (
                <div className="text-center">
                  <p className="text-gray-300 mb-2">
                    Your subscription: {formatGwei(subscriptionData || '0')} DNXS
                  </p>
                  {isEligible ? (
                    <p className="text-green-500">✓ Eligible to export data</p>
                  ) : (
                    <p className="text-yellow-500">⚠️ Need 10,000 DNXS minimum</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ... existing query form section ... */}
    </div>
  );
}