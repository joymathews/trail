import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseSumLineChart from '../components/ExpenseSumLineChart';
import ExpenseSumBarChart from '../components/ExpenseSumBarChart';
import SpendFieldSelect from '../components/SpendFieldSelect';
import ChartTypeSelector from '../components/ChartTypeSelector';
import { SpendFields } from '../utils/fieldEnums';
import './SpendChartsPage.scss';

const fetchExpenseSum = async (startDate, endDate, field) => {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({
    startDate,
    endDate,
    field,
  });
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiUrl}/expense/sum?${params}`);
    
    if (!res.ok) {
      console.warn(`API error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    
    if (!data || typeof data !== 'object') {
      console.warn('Invalid API response data:', data);
      return [];
    }
    
    // Convert to array of { date, value } and validate values
    return Object.entries(data)
      .map(([date, value]) => {
        // Ensure value is a valid number
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          console.warn(`Invalid value for ${date}: ${value}`);
          return null;
        }
        
        return { date, value: numValue };
      })
      .filter(item => item !== null); // Remove invalid entries
  } catch (error) {
    console.error('Error fetching expense sum:', error);
    return [];
  }
};

const SpendChartsPage = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [expenseData, setExpenseData] = useState([]);
  const [spendField, setSpendField] = useState(SpendFields.DATE);
  const [chartType, setChartType] = useState('LineChart');
  useEffect(() => {
    if (dateRange.start && dateRange.end && spendField) {
      fetchExpenseSum(dateRange.start, dateRange.end, spendField).then((data) => {
        try {
          // If spendField is DATE, keep as {date, value}, else use {key, value}
          if (spendField === SpendFields.DATE) {
            setExpenseData(data);
          } else {
            // Safely map the data and handle any errors
            const mappedData = data
              .map(item => {
                if (!item || item.date === undefined || item.value === undefined) {
                  return null;
                }
                return { key: item.date, value: item.value };
              })
              .filter(item => item !== null);
            
            setExpenseData(mappedData);
          }
        } catch (error) {
          console.error('Error processing expense data:', error);
          setExpenseData([]);
        }
      }).catch(error => {
        console.error('Error fetching expense data:', error);
        setExpenseData([]);
      });
    }
  }, [dateRange.start, dateRange.end, spendField]);

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleSpendFieldChange = (field) => {
    setSpendField(field);
  };
  // Determine if we have a large dataset that might need special handling
  const isLargeDataset = expenseData.length > 40;
  
  return (
    <div className={`spend-charts-page ${isLargeDataset ? 'has-large-dataset' : ''}`}>
      <Header />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Spend Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <DateRangePicker onChange={handleDateRangeChange} />
            <SpendFieldSelect value={spendField} onChange={handleSpendFieldChange} />
            <ChartTypeSelector selectedType={chartType} onChange={setChartType} />
          </div>
        </div>
        <div className="charts-section">
          {expenseData.length === 0 ? (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#718096',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              Select a date range to view spend analysis data
            </div>
          ) : (
            <div className="chart-1" style={isLargeDataset ? {width: `${Math.max(100, expenseData.length * 15)}px`} : {}}>
              {chartType === 'LineChart' ? (
                <ExpenseSumLineChart data={expenseData} spendField={spendField} />
              ) : (
                <ExpenseSumBarChart data={expenseData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpendChartsPage;
