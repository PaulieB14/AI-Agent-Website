'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet } from 'viem/chains'

const projectId = 'c4f79cc821944f9680842a551b7a0777'
const metadata = {
  name: 'Nexus AI',
  description: 'Nexus AI Web3 Integration',
  url: 'https://nexusai.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet]

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// Initialize web3modal
if (typeof window !== 'undefined') {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#3b82f6' // blue-500
    }
  })
}
