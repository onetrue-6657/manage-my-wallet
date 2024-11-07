import React from "react";
import GithubIcon from "../icons/github.png";

const Footer = () => {
  return (
    <footer>
      <div className="left-section">
        <label for="theme-select">Theme: </label>
        <select id="theme-select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="center-section">
        <p>© 2024 Manage My Wallet. All rights reserved.</p>
      </div>
      <div className="right-section">
        <a
          href="https://github.com/onetrue-6657/manage-my-wallet"
          target="blank"
          rel="noopener noreferrer"
        >
          <img src={GithubIcon} alt="GitHub" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
