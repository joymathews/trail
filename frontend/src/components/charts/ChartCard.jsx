import React from 'react';
import './ChartCard.scss';

const ChartCard = ({
  title,
  chartType,
  onToggleChartType,
  isLargeDataset,
  chartData,
  spendField,
  LineChartComponent,
  BarChartComponent
}) => (
  <div className="chart-card">
    <div className="chart-header">
      <h3>{title}</h3>
      <button
        className={`chart-toggle-btn ${chartType === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
        onClick={onToggleChartType}
        title={chartType === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
      >
        {chartType === 'LineChart' ? 'Bar' : 'Line'}
      </button>
    </div>
    <div
      className={`chart-container${isLargeDataset ? ' dynamic-width' : ''}`}
      style={isLargeDataset ? { '--dynamic-width': `${Math.max(100, chartData.length * 15)}px` } : {}}
    >
      {chartType === 'LineChart' ? (
        <LineChartComponent data={chartData} spendField={spendField} />
      ) : (
        <BarChartComponent data={chartData} />
      )}
    </div>
  </div>
);

export default ChartCard;
