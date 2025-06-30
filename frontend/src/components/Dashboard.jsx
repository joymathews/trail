import React from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ChartCard from '../components/charts/ChartCard';
import usePersistentDateRange from '../hooks/usePersistentDateRange';

export default function Dashboard({
  onSignOut,
  title,
  useChartData,
  LineChartComponent,
  BarChartComponent,
  chartLabels
}) {
  const [dateRange, setDateRange] = usePersistentDateRange();
  const [chartTypes, setChartTypes] = React.useState({
    date: 'LineChart',
    category: 'BarChart',
    vendor: 'BarChart',
    paymentMode: 'BarChart',
    spendType: 'BarChart'
  });
  const { loading, chartData } = useChartData(dateRange);
  const handleDateRangeChange = setDateRange;

  const toggleChartType = (field) => {
    setChartTypes(prev => ({
      ...prev,
      [field]: prev[field] === 'LineChart' ? 'BarChart' : 'LineChart'
    }));
  };

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
          <h2>{title}</h2>
          <div className="header-controls">
            <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          </div>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading chart data...</p>
            </div>
          </div>
        ) : Object.values(chartData).every(data => data.length === 0) ? (
          <div className="empty-state">
            <div className="empty-message">
              <div className="empty-icon">📊</div>
              <h3>No Chart Data Available</h3>
              <p>Please select a date range using the date picker above to view your analytics.</p>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <ChartCard
              title={chartLabels.date}
              chartType={chartTypes.date}
              onToggleChartType={() => toggleChartType('date')}
              isLargeDataset={isLargeDataset.date}
              chartData={chartData.date}
              spendField={'date'}
              LineChartComponent={LineChartComponent}
              BarChartComponent={BarChartComponent}
            />
            <ChartCard
              title={chartLabels.category}
              chartType={chartTypes.category}
              onToggleChartType={() => toggleChartType('category')}
              isLargeDataset={isLargeDataset.category}
              chartData={chartData.category}
              spendField={'category'}
              LineChartComponent={LineChartComponent}
              BarChartComponent={BarChartComponent}
            />
            <ChartCard
              title={chartLabels.vendor}
              chartType={chartTypes.vendor}
              onToggleChartType={() => toggleChartType('vendor')}
              isLargeDataset={isLargeDataset.vendor}
              chartData={chartData.vendor}
              spendField={'vendor'}
              LineChartComponent={LineChartComponent}
              BarChartComponent={BarChartComponent}
            />
            <ChartCard
              title={chartLabels.paymentMode}
              chartType={chartTypes.paymentMode}
              onToggleChartType={() => toggleChartType('paymentMode')}
              isLargeDataset={isLargeDataset.paymentMode}
              chartData={chartData.paymentMode}
              spendField={'paymentMode'}
              LineChartComponent={LineChartComponent}
              BarChartComponent={BarChartComponent}
            />
            <ChartCard
              title={chartLabels.spendType}
              chartType={chartTypes.spendType}
              onToggleChartType={() => toggleChartType('spendType')}
              isLargeDataset={isLargeDataset.spendType}
              chartData={chartData.spendType}
              spendField={'spendType'}
              LineChartComponent={LineChartComponent}
              BarChartComponent={BarChartComponent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
