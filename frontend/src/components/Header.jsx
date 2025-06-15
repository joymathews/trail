import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header({ onSignOut }) {
  return (
    <header className="header">
      <Link to="/" className="header-title">
        Trail
      </Link>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/charts">Spend Charts</Link>
      </nav>
      <button className="signout-btn" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  );
}

export default Header;