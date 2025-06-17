import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ExpenseSumLineChart.scss';
import { SpendFields } from '../utils/fieldEnums';
import { formatDate } from '../utils/date';

const formatXAxisDate = (dateStr) => {
  try {
    // Format date string for X axis (e.g., 'May 16')
    if (dateStr === null || dateStr === undefined || dateStr === '') {
      return 'N/A';
    }
    
    // Handle potential numeric timestamps
    let dateInput = dateStr;
    if (typeof dateStr === 'number' || (typeof dateStr === 'string' && !isNaN(Number(dateStr)))) {
      const timestamp = Number(dateStr);
      // Sanity check: Ensure timestamp is within reasonable range (2000-2050)
      if (timestamp < 946684800000 || timestamp > 2524608000000) { // 2000-01-01 to 2050-01-01
        return String(dateStr); // Just return as string if out of reasonable date range
      }
    }
    
    const date = new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date in formatXAxisDate:', dateStr);
      return typeof dateStr === 'object' ? 'Invalid Date' : String(dateStr);
    }
    
    try {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (localeError) {
      // Fallback if toLocaleDateString fails
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    }
  } catch (error) {
    console.warn('Error formatting X-axis date:', error, dateStr);
    return typeof dateStr === 'object' ? 'Invalid Date' : String(dateStr);
  }
};

// Format Y-axis ticks to be more concise
const formatYAxisTick = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const ExpenseSumLineChart = ({ data = [], spendField }) => {
  // Validate and clean data before using
  const validData = React.useMemo(() => {
    return data.filter(item => {
      // Check if item exists and has required fields
      if (!item) {
        return false;
      }
      
      // Check for either date or key, and value must exist
      if (
        (item.date === undefined && item.key === undefined) || 
        item.value === undefined
      ) {
        return false;
      }
      
      // For date fields, make sure the date is valid
      if (item.date !== undefined && spendField === SpendFields.DATE) {
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
  }, [data, spendField]);
  
  // Determine x axis key and formatter
  const isDateField = spendField === SpendFields.DATE;
  const xKey = isDateField ? 'date' : 'key';
  const xFormatter = isDateField
    ? formatXAxisDate
    : (str) => String(str);

  return (
    <div className="expense-sum-line-chart">
      <ResponsiveContainer width="100%" height="90%" minHeight={250} minWidth={300}>
        <LineChart 
          data={validData} 
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tickFormatter={xFormatter} 
            interval={validData.length > 30 ? Math.floor(validData.length / 15) : 0} // Skip ticks for large datasets
            angle={validData.length > 10 ? -45 : 0}
            textAnchor={validData.length > 10 ? "end" : "middle"}
            height={validData.length > 10 ? 60 : 30}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            tickFormatter={formatYAxisTick} 
            width={40}
            tick={{ fontSize: 10 }}
          />
          <Tooltip 
            labelFormatter={(label) => {
              // Extra safeguard for label formatting
              if (!label) return 'N/A';
              
              try {
                return xFormatter(label);
              } catch (e) {
                console.warn('Error formatting tooltip label:', e);
                return String(label);
              }
            }} 
            formatter={(value) => {
              // Ensure value is properly formatted
              if (value === undefined || value === null) return ['N/A', 'Value'];
              return [`${value}`, 'Value'];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#38b2ac" // Using accent color from our theme
            strokeWidth={1.5}
            dot={validData.length > 30 ? false : { r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseSumLineChart;
