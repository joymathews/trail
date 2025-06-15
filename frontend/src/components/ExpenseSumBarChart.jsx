import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ExpenseSumBarChart.scss';

export default function ExpenseSumBarChart({ data }) {
  return (
    <div className="expense-sum-bar-chart">
      <ResponsiveContainer width="100%" height="90%" minHeight={300} minWidth={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data[0]?.date ? 'date' : 'key'} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
