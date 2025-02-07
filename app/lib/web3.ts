import { createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { EthereumClient } from '@web3modal/ethereum'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { http } from 'viem'

// Temporary project ID for development - replace with real one in production
const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_PROJECT_ID || '';

const metadata = {
  name: 'My Website',
  description: 'My Web3 Website',
  url: 'https://mywebsite.com', // TODO: Replace with your website URL
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: mainnet,
  themeMode: 'dark',
  ...metadata
})

export const ethereumClient = new EthereumClient(wagmiConfig, [mainnet])
