"use client";

import "../globals.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnecting } = useAccount();

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto relative">
        {/* Logo / Site Name */}
        <h1 className="text-2xl font-bold">Nexus AI</h1>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl" />
        </button>

        {/* Navigation Links and Buy Button */}
        <div className={`
          ${isMenuOpen ? 'flex' : 'hidden'} 
          md:flex 
          flex-col 
          md:flex-row 
          absolute 
          md:relative 
          top-full 
          left-0 
          right-0 
          md:top-auto 
          bg-gray-900 
          md:bg-transparent 
          p-4 
          md:p-0 
          space-y-4 
          md:space-y-0 
          md:space-x-4 
          items-center
          shadow-lg
          md:shadow-none
        `}>
          <div className="flex space-x-4 items-center">
            <a
              href="https://x.com/DataNexusAgent"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:opacity-75 p-2"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-xl text-white" fixedWidth />
            </a>
            <a
              href="https://t.me/Nexusbotportal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="hover:opacity-75 p-2"
            >
              <FontAwesomeIcon icon={faTelegram} className="text-xl text-white" fixedWidth />
            </a>
            <a
              href="https://discord.gg/4fPQUtuJCq"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="hover:opacity-75 p-2"
            >
              <FontAwesomeIcon icon={faDiscord} className="text-xl text-white" fixedWidth />
            </a>
          </div>
          {/* Connect Wallet Button */}
          <button
            onClick={() => open()}
            disabled={isConnecting}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105 text-center mr-4 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
          </button>
          {/* Buy Button */}
          <a
            href="https://flooz.xyz/swap?tokenAddress=0x4aaba1b66a9a3e3053343ec11beeec2d205904df&network=base&fromToken=0x4200000000000000000000000000000000000006&utm_source=Telegram-BuyBotTech&utm_medium=buy-CTA&utm_campaign=Flooz-Telegram-Bots&utm_id=BuyBotTech&refId=HtwiZx&partnerId=buyBotTech"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-500 transition-transform transform hover:scale-105 text-center"
          >
            Buy $DNXS
          </a>
        </div>
      </nav>
    </header>
  );
}
