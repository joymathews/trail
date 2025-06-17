import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import './ExpenseSumBarChart.scss';
import { formatDate } from '../utils/date';

export default function ExpenseSumBarChart({ data = [] }) {
  // Validate and clean data
  const validData = React.useMemo(() => {
    return data.filter(item => {
      // Check if item exists and has required fields
      if (!item || (!item.date && !item.key) || item.value === undefined) {
        return false;
      }
      
      // For date fields, make sure the date is valid
      if (item.date !== undefined) {
        const date = new Date(item.date);
        if (isNaN(date.getTime())) {
          console.warn('Filtered out item with invalid date:', item);
          return false;
        }
      }
      
      // Value should be a valid number
      if (typeof item.value !== 'number' || isNaN(item.value)) {
        console.warn('Filtered out item with invalid value:', item);
        return false;
      }
      
      return true;
    });
  }, [data]);
  
  const isDate = validData.length > 0 && validData[0]?.date !== undefined;
  
  // Determine if we should show labels based on data volume
  const showLabels = validData.length <= 15; // Only show value labels for smaller datasets
  
  // Format tick values to be more concise
  const formatYAxisTick = (value) => {
    if (!value && value !== 0) return '';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };
  
  return (
    <div className="expense-sum-bar-chart">
      <div className="chart-header">
        <h3>Expense Summary</h3>
      </div>      <ResponsiveContainer width="100%" height="90%" minHeight={250} minWidth={300}>
        <BarChart 
          data={validData} 
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          barGap={2}
          barSize={validData.length > 30 ? 4 : validData.length > 15 ? 10 : 20} // Adjust bar size based on data volume
        >
          <CartesianGrid strokeDasharray="3 3" vertical={validData.length <= 30} />
          <XAxis
            dataKey={isDate ? 'date' : 'key'}
            tickFormatter={isDate ? formatDate : undefined}
            interval={validData.length > 30 ? Math.floor(validData.length / 15) : 0} // Skip ticks for dense datasets
            angle={validData.length > 10 ? -45 : 0} // Angle labels for better readability
            textAnchor={validData.length > 10 ? "end" : "middle"}
            height={validData.length > 10 ? 60 : 30} // More space for angled labels
            tick={{ fontSize: 10 }} // Smaller font
          />          <YAxis 
            tickFormatter={formatYAxisTick} 
            width={40}
            tick={{ fontSize: 10 }}
          />          <Tooltip 
            labelFormatter={(label) => {
              // Extra safeguard for label formatting
              if (isDate && label) {
                try {
                  return formatDate(label);
                } catch (e) {
                  return String(label);
                }
              }
              return String(label);
            }}
            formatter={(value) => [`${value}`, 'Value']}
          />
          <Bar 
            dataKey="value" 
            fill="#38b2ac" // Using accent color from our theme
            radius={[2, 2, 0, 0]} // Slightly rounded tops
          >
            {showLabels && (
              <LabelList 
                dataKey="value" 
                position="top" 
                className="bar-value-label" 
                formatter={formatYAxisTick}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
