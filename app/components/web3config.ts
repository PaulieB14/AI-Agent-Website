'use client';

import { configureChains, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { erc20ABI } from 'wagmi'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

export const projectId = 'c4f79cc821944f9680842a551b7a0777'

// DNXS Token Configuration
export const dnxsToken = {
  address: '0x4aaba1b66a9a3e3053343ec11beeec2d205904df' as `0x${string}`,
  abi: erc20ABI,
  chainId: base.id
}

// Configure chains
export const { chains, publicClient } = configureChains(
  [base, mainnet],
  [publicProvider()]
)

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata: {
          name: 'Nexus AI',
          description: 'Nexus AI Web3 Integration',
          url: 'https://nexusai.com',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      }
    })
  ],
  publicClient
})
