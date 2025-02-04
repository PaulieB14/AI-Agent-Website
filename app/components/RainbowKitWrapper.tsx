'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http } from 'viem';

// Alchemy RPC URL for Base chain
const baseRpcUrl = 'https://base-mainnet.g.alchemy.com/v2/hWjkrx8N9UtT_IRMb-IJpXp4LIwrAqdt';

const projectId = 'ec7ed15ff92542f3d95d8b8a3300c6a4';

// Static Wagmi configuration to avoid hydration mismatches
const config = getDefaultConfig({
  appName: 'DNXS Query',
  projectId,
  chains: [base],
  transports: {
    [base.id]: http(baseRpcUrl),  // Valid Alchemy RPC URL
  },
});

const queryClient = new QueryClient();

export default function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
