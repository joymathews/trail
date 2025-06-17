import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import './ExpenseSumBarChart.scss';
import { formatDate } from '../utils/date';

export default function ExpenseSumBarChart({ data }) {
  const isDate = data[0]?.date !== undefined;
  return (
    <div className="expense-sum-bar-chart">
      <ResponsiveContainer width="100%" height="90%" minHeight={300} minWidth={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={isDate ? 'date' : 'key'}
            tickFormatter={isDate ? formatDate : undefined}
          />
          <YAxis />
          <Tooltip labelFormatter={isDate ? formatDate : undefined} />
          <Bar dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="top" className="bar-value-label" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
