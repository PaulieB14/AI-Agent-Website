'use client';

import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { base } from "wagmi/chains";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { w3mConnectors } from '@web3modal/ethereum';

const projectId = 'c4f79cc821944f9680842a551b7a0777';

const chains = [base, mainnet];
const { publicClient } = configureChains(chains, [publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

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
    try {
      createWeb3Modal({
        wagmiConfig,
        projectId,
        chains,
        defaultChain: base,
        themeMode: 'dark',
        tokens: {
          [base.id]: {
            address: '0x4aaba1b66a9a3e3053343ec11beeec2d205904df' as `0x${string}`,
            image: 'https://avatars.githubusercontent.com/u/37784886'
          }
        }
      });
      setMounted(true);
    } catch (error) {
      console.error('Failed to initialize Web3Modal:', error);
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
}
