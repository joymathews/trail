import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header({ onSignOut }) {
  return (
    <header className="header">
      <Link to="/" className="header-title">
        Trail
      </Link>
      <button className="signout-btn" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  );
}

export default Header;