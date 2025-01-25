"use client";

import "../globals.css"; // Correct relative path to globals.css
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Navbar() {
  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo / Site Name */}
        <h1 className="text-2xl font-bold">Nexus AI</h1>
        
        {/* Navigation Links and Buy Button */}
        <div className="flex space-x-4 items-center">
          <a
            href="https://x.com/DataNexusAgent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:opacity-75"
          >
            <FontAwesomeIcon icon={faTwitter} className="text-xl text-white" fixedWidth />
          </a>
          <a
            href="https://t.me/Nexusbotportal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="hover:opacity-75"
          >
            <FontAwesomeIcon icon={faTelegram} className="text-xl text-white" fixedWidth />
          </a>
          <a
            href="https://discord.gg/4fPQUtuJCq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="hover:opacity-75"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-xl text-white" fixedWidth />
          </a>
          {/* Buy Button */}
          <a
            href="https://flooz.xyz/swap?tokenAddress=0x4aaba1b66a9a3e3053343ec11beeec2d205904df&network=base&fromToken=0x4200000000000000000000000000000000000006&utm_source=Telegram-BuyBotTech&utm_medium=buy-CTA&utm_campaign=Flooz-Telegram-Bots&utm_id=BuyBotTech&refId=HtwiZx&partnerId=buyBotTech"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-500 transition-transform transform hover:scale-105"
          >
            Buy $DNXS
          </a>
        </div>
      </nav>
    </header>
  );
}
