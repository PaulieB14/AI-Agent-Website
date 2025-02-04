'use client';

import { WagmiConfig } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, chains, projectId, web3ModalConfig } from './web3config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function Web3ModalWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        createWeb3Modal({
          wagmiConfig,
          projectId,
          chains,
          defaultChain: chains[0],
          ...web3ModalConfig,
          themeMode: 'dark',
          tokens: {
            [chains[0].id]: {
              address: '0x4aaba1b66a9a3e3053343ec11beeec2d205904df' as `0x${string}`,
              image: 'https://avatars.githubusercontent.com/u/37784886'
            }
          }
        });
        console.log('Web3Modal initialized successfully');
        setMounted(true);
      } catch (error) {
        console.error('Failed to initialize Web3Modal:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
