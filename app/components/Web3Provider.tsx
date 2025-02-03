'use client';

import { WagmiConfig } from 'wagmi'
import { Web3Modal } from '@web3modal/react'
import { wagmiConfig, ethereumClient } from '../lib/web3'

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
      <Web3Modal 
        projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944f9680842a551b7a0777'} 
        ethereumClient={ethereumClient} 
      />
    </>
  );
}
