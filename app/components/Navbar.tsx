"use client";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../lib/fontawesome"; // Correct relative path to Font Awesome configuration
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import Font Awesome styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons";


export default function Navbar() {
  return (
    <header className="bg-dark text-white sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-primary fw-bold" href="#">
            Nexus AI
          </a>

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

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Social Icons */}
              <li className="nav-item me-3">
                <a
                  href="https://x.com/DataNexusAgent"
                  target="_blank"
                  className="nav-link"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-white" />
                </a>
              </li>
              <li className="nav-item me-3">
                <a
                  href="https://t.me/Nexusbotportal"
                  target="_blank"
                  className="nav-link"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-white" />
                </a>
              </li>
              <li className="nav-item me-3">
                <a
                  href="https://discord.gg/4fPQUtuJCq"
                  target="_blank"
                  className="nav-link"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faDiscord} className="text-white" />
                </a>
              </li>
              {/* Buy Button */}
              <li className="nav-item">
                <a
                  href="https://flooz.xyz/swap"
                  target="_blank"
                  className="btn btn-primary buy-button fw-bold"
                  rel="noopener noreferrer"
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
