import React from "react";

/**
 * Renders a list of forecast items.
 * Props: items: Array<{ label: string, value: React.ReactNode }>
 */
export default function ForecastList({ items }) {
  return (
    <div className="forecast-list">
      {items.map(({ label, value }, idx) => (
        <div className="forecast-item" key={idx}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
