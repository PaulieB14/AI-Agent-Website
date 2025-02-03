'use client';

import { WagmiConfig } from "wagmi";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet, base } from "wagmi/chains";
import { useEffect, useState } from "react";

const projectId = 'c4f79cc821944f9680842a551b7a0777';
const metadata = {
  name: 'Nexus AI',
  description: 'Nexus AI Web3 Integration',
  url: 'https://nexusai.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [base, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

export default function Web3ModalWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    createWeb3Modal({
      wagmiConfig,
      projectId,
      chains,
      defaultChain: base,
      themeMode: 'dark'
    });
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  );
}
