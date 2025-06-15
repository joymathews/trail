import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseSumLineChart from '../components/ExpenseSumLineChart';
import SpendFieldSelect from '../components/SpendFieldSelect';
import { SpendFields } from '../utils/fieldEnums';
import './SpendChartsPage.scss';

const fetchExpenseSum = async (startDate, endDate, field) => {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({
    startDate,
    endDate,
    field,
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

  useEffect(() => {
    if (dateRange.start && dateRange.end && spendField) {
      fetchExpenseSum(dateRange.start, dateRange.end, spendField).then((data) => {
        // If spendField is DATE, keep as {date, value}, else use {key, value}
        if (spendField === SpendFields.DATE) {
          setExpenseData(data);
        } else {
          setExpenseData(data.map(({ date, value }) => ({ key: date, value })));
        }
      });
    }
  }, [dateRange.start, dateRange.end, spendField]);

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleSpendFieldChange = (field) => {
    setSpendField(field);
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
            <ExpenseSumLineChart data={expenseData} spendField={spendField} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendChartsPage;
