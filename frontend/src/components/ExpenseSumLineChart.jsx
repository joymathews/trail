import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ExpenseSumLineChart.scss';

const formatDate = (dateStr) => {
  // Format date string for X axis (e.g., 'May 16')
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ExpenseSumLineChart = ({ data }) => {
  // data: array of { date, value }
  return (
    <div className="expense-sum-line-chart">
      <h3>Daily Expense Sum</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip labelFormatter={formatDate} />
          <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseSumLineChart;
