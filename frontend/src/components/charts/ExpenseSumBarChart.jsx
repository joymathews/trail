import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import './ExpenseSumBarChart.scss';
import { validateChartData, formatYAxisTick, formatXAxisDate } from '../../utils/chartUtils';
import { SpendFields } from '../../utils/fieldEnums';

export default function ExpenseSumBarChart({ data = [], spendField }) {
  const validData = React.useMemo(() => validateChartData(data, spendField), [data, spendField]);
  const isDate = spendField === SpendFields.DATE || (validData.length > 0 && validData[0]?.date !== undefined);
  const showLabels = validData.length <= 15; // Only show value labels for smaller datasets
  
  return (
    <div className="expense-sum-bar-chart">
      {/* Chart header removed as requested */}
      <ResponsiveContainer width="100%" height="90%" minHeight={250} minWidth={300}>
        <BarChart 
          data={validData} 
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          barGap={2}
          barSize={validData.length > 30 ? 4 : validData.length > 15 ? 10 : 20} // Adjust bar size based on data volume
        >
          <CartesianGrid strokeDasharray="3 3" vertical={validData.length <= 30} />
          <XAxis
            dataKey={isDate ? 'date' : 'key'}
            tickFormatter={isDate ? formatXAxisDate : undefined}
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
                  return formatXAxisDate(label);
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
            className="bar-theme-accent"
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
