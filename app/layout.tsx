import './globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nexus AI</title>
        <meta name="description" content="Nexus AI - The future of blockchain data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">Nexus AI</h1>
            <div className="flex space-x-4">
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
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-center text-gray-400 py-4">
          © 2025 Nexus AI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
