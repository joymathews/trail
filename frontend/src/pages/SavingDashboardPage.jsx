import React from 'react';
import ExpenseSumLineChart from '../components/charts/ExpenseSumLineChart';
import ExpenseSumBarChart from '../components/charts/ExpenseSumBarChart';
import { useSavingChartData } from '../hooks/useSavingChartData';
import Dashboard from '../components/Dashboard';
import './SavingDashboardPage.scss';

const chartLabels = {
  date: 'Savings by Date',
  category: 'Savings by Category',
  vendor: 'Savings by Vendor',
  paymentMode: 'Savings by Payment Mode',
  spendType: 'Savings by Spend Type',
};

export default function SavingDashboardPage({ onSignOut }) {
  return (
    <Dashboard
      onSignOut={onSignOut}
      title="Saving Dashboard"
      useChartData={useSavingChartData}
      LineChartComponent={ExpenseSumLineChart}
      BarChartComponent={ExpenseSumBarChart}
      chartLabels={chartLabels}
    />
  );
}
