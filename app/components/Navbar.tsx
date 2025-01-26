"use client";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function Navbar() {
  return (
    <header className="bg-dark text-white sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          {/* Logo / Site Name */}
          <a className="navbar-brand text-primary fw-bold" href="#">
            Nexus AI
          </a>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Social Media Icons */}
              <li className="nav-item me-3">
                <a
                  href="https://x.com/DataNexusAgent"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-white" fixedWidth />
                </a>
              </li>
              <li className="nav-item me-3">
                <a
                  href="https://t.me/Nexusbotportal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-white" fixedWidth />
                </a>
              </li>
              <li className="nav-item me-3">
                <a
                  href="https://discord.gg/4fPQUtuJCq"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faDiscord} className="text-white" fixedWidth />
                </a>
              </li>

              {/* Buy Button */}
              <li className="nav-item">
                <a
                  href="https://flooz.xyz/swap?tokenAddress=0x4aaba1b66a9a3e3053343ec11beeec2d205904df&network=base&fromToken=0x4200000000000000000000000000000000000006&utm_source=Telegram-BuyBotTech&utm_medium=buy-CTA&utm_campaign=Flooz-Telegram-Bots&utm_id=BuyBotTech&refId=HtwiZx&partnerId=buyBotTech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary fw-bold"
                >
                  Buy $DNXS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
