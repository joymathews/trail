import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

function Header({ onSignOut }) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen(open => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <Link to="/" className="header-title" onClick={closeMenu}>
        Trail
      </Link>
      <button className="hamburger" aria-label="Menu" onClick={handleMenuToggle}>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <nav className={`header-nav-mobile${menuOpen ? ' open' : ''}`}>
        <button className="signout-btn" onClick={() => { onSignOut(); closeMenu(); }}>
          <span className="btn-text">Sign Out</span>
          <span className="signout-icon" aria-hidden="true"></span>
        </button>
        <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMenu}>
          Home
        </Link>
        <Link 
          to="/expense-dashboard" 
          className={location.pathname === "/expense-dashboard" ? "active" : ""}
          onClick={closeMenu}
        >
          Expense Dashboard
        </Link>
        <Link 
          to="/saving-dashboard" 
          className={location.pathname === "/saving-dashboard" ? "active" : ""}
          onClick={closeMenu}
        >
          Saving Dashboard
        </Link>
        <Link 
          to="/expense-forecast" 
          className={location.pathname === "/expense-forecast" ? "active" : ""}
          onClick={closeMenu}
        >
          Expense Forecast
        </Link>
        <Link 
          to="/saving-forecast" 
          className={location.pathname === "/saving-forecast" ? "active" : ""}
          onClick={closeMenu}
        >
          Saving Forecast
        </Link>
      </nav>
      <nav className="header-nav-desktop">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link 
          to="/expense-dashboard" 
          className={location.pathname === "/expense-dashboard" ? "active" : ""}
        >
          Expense Dashboard
        </Link>
        <Link 
          to="/saving-dashboard" 
          className={location.pathname === "/saving-dashboard" ? "active" : ""}
        >
          Saving Dashboard
        </Link>
        <Link 
          to="/expense-forecast" 
          className={location.pathname === "/expense-forecast" ? "active" : ""}
        >
          Expense Forecast
        </Link>
        <Link 
          to="/saving-forecast" 
          className={location.pathname === "/saving-forecast" ? "active" : ""}
        >
          Saving Forecast
        </Link>
        <button className="signout-btn" onClick={onSignOut}>
          <span className="btn-text">Sign Out</span>
          <span className="signout-icon" aria-hidden="true"></span>
        </button>
      </nav>
    </header>
  );
}

export default Header;