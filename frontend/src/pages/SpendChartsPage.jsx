import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseSumLineChart from '../components/ExpenseSumLineChart';
import { SpendFields } from '../utils/fieldEnums';
import './SpendChartsPage.scss';

const fetchExpenseSum = async (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  const params = new URLSearchParams({
    startDate,
    endDate,
    field: SpendFields.DATE,
  });
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${apiUrl}/expense/sum?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  // Convert to array of { date, value }
  return Object.entries(data).map(([date, value]) => ({ date, value }));
};

const SpendChartsPage = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [expenseData, setExpenseData] = useState([]);
  // Prevent infinite loop by only updating if values actually change
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchExpenseSum(dateRange.start, dateRange.end).then(setExpenseData);
    }
  }, [dateRange.start, dateRange.end]);

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ start: startDate, end: endDate });
  };

  return (
    <div className="spend-charts-page">
      <Header />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Spend Analysis</h2>
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
        <div className="charts-section">
          <div className="chart-1">
            <ExpenseSumLineChart data={expenseData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendChartsPage;
