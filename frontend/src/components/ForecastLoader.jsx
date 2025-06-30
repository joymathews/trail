import React from "react";

/**
 * Handles loading and empty state for forecast data.
 * Props: loading (bool), hasData (bool), emptyText (string), children
 */
export default function ForecastLoader({ loading, hasData, emptyText, children }) {
  if (loading) return <div>Loading...</div>;
  if (!hasData) return <div>{emptyText}</div>;
  return children;
}
