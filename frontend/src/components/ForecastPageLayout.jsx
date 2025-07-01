import React from "react";
import Header from "./Header";
import "./ForecastPageLayout.scss";

/**
 * Layout for forecast pages: header, container, title, explanation, and children.
 * Props: onSignOut, title, explanation, children
 */
export default function ForecastPageLayout({ onSignOut, title, explanation, children }) {
  return (
    <div>
      <Header onSignOut={onSignOut} />
      <div className="forecast-container">
        <div className="forecast-title">{title}</div>
        <div className="forecast-summary-explanation">{explanation}</div>
        {children}
      </div>
    </div>
  );
}
