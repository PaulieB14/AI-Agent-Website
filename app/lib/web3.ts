import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

// Temporary project ID for development - replace with real one in production
export const projectId = 'c4f79cc821944f9680842a551b7a0777';

const chains = [mainnet];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
