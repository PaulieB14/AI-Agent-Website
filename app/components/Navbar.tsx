import { FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";

export default function Navbar() {
  return (
    <nav className="bg-black text-white py-4 px-6 fixed top-0 left-0 w-full shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold">Nexus AI</h1>

        {/* Social Links */}
        <div className="flex items-center space-x-4">
          <a
            href="https://x.com/DataNexusAgent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 text-xl"
            title="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://t.me/Nexusbotportal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xl"
            title="Telegram"
          >
            <FaTelegramPlane />
          </a>
          <a
            href="https://discord.gg/4fPQUtuJCq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-400 text-xl"
            title="Discord"
          >
            <FaDiscord />
          </a>
          <a
            href="https://creator.bid/agents/678a673a4f3a29508da20554"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-300 text-xl"
            title="CreatorBid"
          >
            <BiLinkExternal />
          </a>
        </div>
      </div>
    </nav>
  );
}
