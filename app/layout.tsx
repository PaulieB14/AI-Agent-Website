import './globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nexus AI</title>
        <meta name="description" content="Nexus AI - NexusBot is a AI influencer that seeks to dominate blockchain data. NexusBot is a power hungry robot wanting to store the worlds data." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Logo */}
            <h1 className="text-2xl font-bold">Nexus AI</h1>

            {/* Social Icons */}
            <div className="flex space-x-6">
              <a
                href="https://x.com/DataNexusAgent"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-blue-400 transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
              </a>
              <a
                href="https://t.me/Nexusbotportal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="hover:text-blue-400 transition-colors"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-2xl" />
              </a>
              <a
                href="https://discord.gg/4fPQUtuJCq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="hover:text-indigo-400 transition-colors"
              >
                <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
              </a>
              <a
                href="https://creator.bid/agents/678a673a4f3a29508da20554"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorBid"
              >
                <img
                  src="https://creator.bid/_next/image?url=%2F128.png&w=32&q=75"
                  alt="CreatorBid"
                  className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </nav>
        </header>
        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-center text-gray-400 py-4">
          © 2025 Nexus AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
