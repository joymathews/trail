import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseSumLineChart from '../components/ExpenseSumLineChart';
import SpendFieldSelect from '../components/SpendFieldSelect';
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
  const [spendField, setSpendField] = useState(SpendFields.DATE);
  // Prevent infinite loop by only updating if values actually change
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchExpenseSum(dateRange.start, dateRange.end).then(setExpenseData);
    }
  }, [dateRange.start, dateRange.end]);

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleSpendFieldChange = (field) => {
    setSpendField(field);
    // Optionally, trigger fetch here if needed
  };

  return (
    <div className="spend-charts-page">
      <Header />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Spend Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <DateRangePicker onChange={handleDateRangeChange} />
            <SpendFieldSelect value={spendField} onChange={handleSpendFieldChange} />
          </div>
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
