import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ExpenseSumLineChart.scss';
import { SpendFields } from '../utils/fieldEnums';
import { formatDate } from '../utils/date';

const formatXAxisDate = (dateStr) => {
  // Format date string for X axis (e.g., 'May 16')
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ExpenseSumLineChart = ({ data, spendField }) => {
  // data: array of { date, value } or { key, value }
  // Determine x axis key and formatter
  const isDateField = spendField === SpendFields.DATE;
  const xKey = isDateField ? 'date' : 'key';
  const xFormatter = isDateField
    ? formatXAxisDate
    : (str) => String(str);

  return (
    <div className="expense-sum-line-chart">
      <h3>Expense Sum</h3>
      <ResponsiveContainer width="100%" height="90%" minHeight={300} minWidth={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tickFormatter={xFormatter} />
          <YAxis />
          <Tooltip labelFormatter={xFormatter} />
          <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseSumLineChart;
