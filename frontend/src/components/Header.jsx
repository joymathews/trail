import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

function Header({ onSignOut }) {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="header-title">
        Trail
      </Link>
      <nav className="header-nav">
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
      </nav>
      <div className="header-actions">
        <button className="signout-btn" onClick={onSignOut}>
          <span className="btn-text">Sign Out</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;