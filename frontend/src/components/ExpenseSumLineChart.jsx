import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ExpenseSumLineChart.scss';
import { SpendFields } from '../utils/fieldEnums';
import { validateChartData, formatYAxisTick, formatXAxisDate } from '../utils/chartUtils';

const ExpenseSumLineChart = ({ data = [], spendField }) => {
  const validData = React.useMemo(() => validateChartData(data, spendField), [data, spendField]);
  const isDateField = spendField === SpendFields.DATE;
  const xKey = isDateField ? 'date' : 'key';
  const xFormatter = isDateField ? formatXAxisDate : (str) => String(str);

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
            interval={validData.length > 30 ? Math.floor(validData.length / 15) : 0}
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
              if (!label) return 'N/A';
              try {
                return xFormatter(label);
              } catch (e) {
                return String(label);
              }
            }} 
            formatter={(value) => {
              if (value === undefined || value === null) return ['N/A', 'Value'];
              return [`${value}`, 'Value'];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            className="line-theme-accent"
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
