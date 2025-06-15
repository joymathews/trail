import React, { useState } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import './SpendChartsPage.scss';

const SpendChartsPage = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Placeholder for chart components
  return (
    <div className="spend-charts-page">
      <Header />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Spend Analysis</h2>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        <div className="charts-section">
          {/* TODO: Add chart components here */}
          <div className="chart-placeholder">Chart 1</div>
          <div className="chart-placeholder">Chart 2</div>
          <div className="chart-placeholder">Chart 3</div>
        </div>
      </div>
    </div>
  );
};

export default SpendChartsPage;
