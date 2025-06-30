import React from 'react';
import ExpenseSumLineChart from '../components/charts/ExpenseSumLineChart';
import ExpenseSumBarChart from '../components/charts/ExpenseSumBarChart';
import { useExpenseChartData } from '../hooks/useExpenseChartData';
import Dashboard from '../components/Dashboard';

const chartLabels = {
  date: 'Expenses by Date',
  category: 'Expenses by Category',
  vendor: 'Expenses by Vendor',
  paymentMode: 'Expenses by Payment Mode',
  spendType: 'Expenses by Spend Type',
};

export default function ExpenseDashboardPage({ onSignOut }) {
  return (
    <Dashboard
      onSignOut={onSignOut}
      title="Expense Dashboard"
      useChartData={useExpenseChartData}
      LineChartComponent={ExpenseSumLineChart}
      BarChartComponent={ExpenseSumBarChart}
      chartLabels={chartLabels}
    />
  );
}
