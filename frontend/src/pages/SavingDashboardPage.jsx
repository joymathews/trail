

import React, { useState } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ChartCard from '../components/charts/ChartCard';
import ExpenseSumLineChart from '../components/charts/ExpenseSumLineChart';
import ExpenseSumBarChart from '../components/charts/ExpenseSumBarChart';
import { SpendFields } from '../utils/fieldEnums';
import usePersistentDateRange from '../hooks/usePersistentDateRange';
import { useSavingChartData } from '../hooks/useSavingChartData';
import './SavingDashboardPage.scss';

const SavingDashboardPage = ({ onSignOut }) => {
  const [dateRange, setDateRange] = usePersistentDateRange();
  const [chartTypes, setChartTypes] = useState({
    date: 'LineChart',
    category: 'BarChart',
    vendor: 'BarChart',
    paymentMode: 'BarChart',
    spendType: 'BarChart'
  });
  const { loading, chartData } = useSavingChartData(dateRange);

  const toggleChartType = (field) => {
    setChartTypes(prev => ({
      ...prev,
      [field]: prev[field] === 'LineChart' ? 'BarChart' : 'LineChart'
    }));
  };

  const handleDateRangeChange = setDateRange;

  const isLargeDataset = {
    date: chartData.date.length > 40,
    category: chartData.category.length > 40,
    vendor: chartData.vendor.length > 40,
    paymentMode: chartData.paymentMode.length > 40,
    spendType: chartData.spendType.length > 40
  };

  return (
    <div className="spend-charts-page dashboard-layout">
      <Header onSignOut={onSignOut} />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Saving Dashboard</h2>
          <div className="header-controls">
            <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          </div>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading saving data...</p>
            </div>
          </div>
        ) : Object.values(chartData).every(data => data.length === 0) ? (
          <div className="empty-state">
            <div className="empty-message">
              <div className="empty-icon">💰</div>
              <h3>No Saving Data Available</h3>
              <p>Please select a date range using the date picker above to view your saving analytics.</p>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <ChartCard
              title="Savings by Date"
              chartType={chartTypes.date}
              onToggleChartType={() => toggleChartType('date')}
              isLargeDataset={isLargeDataset.date}
              chartData={chartData.date}
              spendField={SpendFields.DATE}
              LineChartComponent={ExpenseSumLineChart}
              BarChartComponent={ExpenseSumBarChart}
            />
            <ChartCard
              title="Savings by Category"
              chartType={chartTypes.category}
              onToggleChartType={() => toggleChartType('category')}
              isLargeDataset={isLargeDataset.category}
              chartData={chartData.category}
              spendField={SpendFields.CATEGORY}
              LineChartComponent={ExpenseSumLineChart}
              BarChartComponent={ExpenseSumBarChart}
            />
            <ChartCard
              title="Savings by Vendor"
              chartType={chartTypes.vendor}
              onToggleChartType={() => toggleChartType('vendor')}
              isLargeDataset={isLargeDataset.vendor}
              chartData={chartData.vendor}
              spendField={SpendFields.VENDOR}
              LineChartComponent={ExpenseSumLineChart}
              BarChartComponent={ExpenseSumBarChart}
            />
            <ChartCard
              title="Savings by Payment Mode"
              chartType={chartTypes.paymentMode}
              onToggleChartType={() => toggleChartType('paymentMode')}
              isLargeDataset={isLargeDataset.paymentMode}
              chartData={chartData.paymentMode}
              spendField={SpendFields.PAYMENT_MODE}
              LineChartComponent={ExpenseSumLineChart}
              BarChartComponent={ExpenseSumBarChart}
            />
            <ChartCard
              title="Savings by Spend Type"
              chartType={chartTypes.spendType}
              onToggleChartType={() => toggleChartType('spendType')}
              isLargeDataset={isLargeDataset.spendType}
              chartData={chartData.spendType}
              spendField={SpendFields.SPEND_TYPE}
              LineChartComponent={ExpenseSumLineChart}
              BarChartComponent={ExpenseSumBarChart}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingDashboardPage;
