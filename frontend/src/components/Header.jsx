import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

function NavLinks({ onClick = () => {}, location }) {
  return (
    <>
      <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={onClick}>
        Home
      </Link>
      <Link 
        to="/expense-dashboard" 
        className={location.pathname === "/expense-dashboard" ? "active" : ""}
        onClick={onClick}
      >
        Expense Dashboard
      </Link>
      <Link 
        to="/saving-dashboard" 
        className={location.pathname === "/saving-dashboard" ? "active" : ""}
        onClick={onClick}
      >
        Saving Dashboard
      </Link>
      <Link 
        to="/expense-forecast" 
        className={location.pathname === "/expense-forecast" ? "active" : ""}
        onClick={onClick}
      >
        Expense Forecast
      </Link>
      <Link 
        to="/saving-forecast" 
        className={location.pathname === "/saving-forecast" ? "active" : ""}
        onClick={onClick}
      >
        Saving Forecast
      </Link>
    </>
  );
}

NavLinks.propTypes = {
  onClick: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

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
      <button className="hamburger" aria-label="Menu" aria-haspopup="true" aria-expanded={menuOpen} aria-controls="header-nav-mobile" onClick={handleMenuToggle}>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <nav id="header-nav-mobile" className={`header-nav-mobile${menuOpen ? ' open' : ''}`}> 
        <button className="signout-btn" onClick={() => { onSignOut(); closeMenu(); }} aria-label="Sign Out">
          <span className="btn-text">Sign Out</span>
          <span className="signout-icon" aria-hidden="true"></span>
        </button>
        <NavLinks onClick={closeMenu} location={location} />
      </nav>
      <nav className="header-nav-desktop">
        <NavLinks location={location} />
        <button className="signout-btn" onClick={onSignOut} aria-label="Sign Out">
          <span className="btn-text">Sign Out</span>
          <span className="signout-icon" aria-hidden="true"></span>
        </button>
      </nav>
    </header>
  );
}

export default Header;