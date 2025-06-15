import React from 'react';
import './ChartTypeSelector.scss';

const chartTypes = [
  { label: 'Line Chart', value: 'LineChart' },
  { label: 'Bar Chart', value: 'BarChart' },
];

export default function ChartTypeSelector({ selectedType, onChange }) {
  return (
    <div className="chart-type-selector">
      {chartTypes.map((type) => (
        <label key={type.value} style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            name="chartType"
            value={type.value}
            checked={selectedType === type.value}
            onChange={() => onChange(type.value)}
          />
          {type.label}
        </label>
      ))}
    </div>
  );
}
