// page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import dynamic from 'next/dynamic';
import client from '@/app/lib/apolloClient';
import { CHECK_SUBSCRIPTION_QUERY, HOLDERS_QUERY, SUBSCRIBERS_QUERY } from '@/app/lib/queries';
import DataDisplay from '@/app/components/DataDisplay';
import Hero from '@/app/components/Hero';

interface SubscriptionData {
  agentKeyUsers: Array<{
    totalSubscribed: string;
  }>;
}

interface HoldersData {
  agentKey: {
    users: Array<{
      id: string;
      balance: string;
    }>;
  };
}

interface SubscribersData {
  agentKey: {
    users: Array<{
      id: string;
      totalSubscribed: string;
    }>;
  };
}

const REQUIRED_DNXS = BigInt('10000000000000000000000'); // 10,000 DNXS
const AGENT_KEY = "0x4aaba1b66a9a3e3053343ec11beeec2d205904df";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}

function WalletQueryComponent() {
  const { address, isConnected } = useAccount();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holdersData, setHoldersData] = useState<Array<{ address: string; amount: string }>>([]);
  const [subscribersData, setSubscribersData] = useState<Array<{ address: string; amount: string }>>([]);
  const [totalLocked, setTotalLocked] = useState<string>('0');

  const [checkSubscription] = useLazyQuery<SubscriptionData>(CHECK_SUBSCRIPTION_QUERY, {
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

  const [fetchHolders] = useLazyQuery<HoldersData>(HOLDERS_QUERY, {
    client,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const holders = data.agentKey.users.map(user => ({
        address: user.id,
        amount: user.balance
      }));
      setHoldersData(holders);
      const total = holders.reduce((sum, holder) => sum + BigInt(holder.amount), BigInt(0));
      setTotalLocked(total.toString());
    },
    onError: (error) => {
      console.error('❌ Holders query error:', error);
      setError(error.message);
    },
  });

  const [fetchSubscribers] = useLazyQuery<SubscribersData>(SUBSCRIBERS_QUERY, {
    client,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const subscribers = data.agentKey.users.map(user => ({
        address: user.id,
        amount: user.totalSubscribed
      }));
      setSubscribersData(subscribers);
    },
    onError: (error) => {
      console.error('❌ Subscribers query error:', error);
      setError(error.message);
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

      const totalSubscribed = data?.agentKeyUsers[0]?.totalSubscribed || '0';
      const subscribedBigInt = BigInt(totalSubscribed);
      const isEligible = subscribedBigInt >= REQUIRED_DNXS;

      console.log(`
        💰 Subscription Details:
        Raw: ${totalSubscribed}
        Required: ${REQUIRED_DNXS.toString()}
        Has: ${subscribedBigInt.toString()}
        Human readable: ${formatGwei(totalSubscribed)} DNXS
        Eligible: ${isEligible}
      `);

      setSubscriptionData(totalSubscribed);
      setIsEligible(isEligible);

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
      console.log("🔄 Wallet connected, auto-checking eligibility for:", address);
      setIsLoading(true);
      checkEligibility().finally(() => setIsLoading(false));
    } else {
      console.log("Wallet disconnected or address not available");
      setIsEligible(null);
      setSubscriptionData(null);
    }
    fetchHolders();
    fetchSubscribers();
  }, [isConnected, address]);

  // Separate effect for fetching holders and subscribers
  useEffect(() => {
    fetchHolders();
    fetchSubscribers();
  }, []);

  return (
    <ClientOnly>
      <Hero />
      <div className="container mx-auto px-4">
        <DataDisplay
          totalLocked={totalLocked}
          agentKey={AGENT_KEY}
          holders={holdersData}
          subscribers={subscribersData}
          isEligible={isEligible || false}
          subscriptionData={subscriptionData}
        />
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Wallet Status</h2>
          {isConnected ? (
            <>
              <p>Connected Address: {address}</p>
              <p>Eligibility: {isEligible ? 'Eligible' : 'Not Eligible'}</p>
              <p>Subscription Data: {subscriptionData ? formatGwei(subscriptionData) : 'N/A'} DNXS</p>
              {isLoading && <p>Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
            </>
          ) : (
            <p>Wallet not connected</p>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}

export default dynamic(() => Promise.resolve(WalletQueryComponent), {
  ssr: false
});
