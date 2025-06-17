import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseSumLineChart from '../components/ExpenseSumLineChart';
import ExpenseSumBarChart from '../components/ExpenseSumBarChart';
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
      .map(([key, value]) => {
        // Ensure value is a valid number
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          console.warn(`Invalid value for ${key}: ${value}`);
          return null;
        }
        
        return { key, value: numValue };
      })
      .filter(item => item !== null); // Remove invalid entries
  } catch (error) {
    console.error('Error fetching expense sum:', error);
    return [];
  }
};

const SpendChartsPage = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    date: [],
    category: [],
    vendor: [],
    paymentMode: [],
    spendType: []
  });
  
  // Toggle between line and bar chart for each field
  const [chartTypes, setChartTypes] = useState({
    date: 'LineChart',
    category: 'BarChart',
    vendor: 'BarChart',
    paymentMode: 'BarChart',
    spendType: 'BarChart'
  });
  
  // Toggle chart type for a specific field
  const toggleChartType = (field) => {
    setChartTypes(prev => ({
      ...prev,
      [field]: prev[field] === 'LineChart' ? 'BarChart' : 'LineChart'
    }));
  };
  
  // Fetch data for all fields when date range changes
  useEffect(() => {
    const fetchAllData = async () => {
      if (!dateRange.start || !dateRange.end) return;
      
      // Show loading state
      setLoading(true);
      
      // Fields to fetch data for
      const fields = [
        SpendFields.DATE,
        SpendFields.CATEGORY, 
        SpendFields.VENDOR,
        SpendFields.PAYMENT_MODE,
        SpendFields.SPEND_TYPE
      ];
      
      const newChartData = { 
        date: [],
        category: [],
        vendor: [], 
        paymentMode: [],
        spendType: []
      };
      
      try {
        // Fetch data for each field in parallel
        await Promise.all(fields.map(async (field) => {
          try {
            const data = await fetchExpenseSum(dateRange.start, dateRange.end, field);
            
            // Process data appropriately for each field
            if (field === SpendFields.DATE) {
              newChartData.date = data.map(item => ({
                date: item.key, // Use key from API response
                value: item.value
              }));
            } else if (field === SpendFields.CATEGORY) {
              newChartData.category = data;
            } else if (field === SpendFields.VENDOR) {
              newChartData.vendor = data;
            } else if (field === SpendFields.PAYMENT_MODE) {
              newChartData.paymentMode = data;
            } else if (field === SpendFields.SPEND_TYPE) {
              newChartData.spendType = data;
            }
          } catch (error) {
            console.error(`Error fetching data for ${field}:`, error);
          }
        }));
        
        setChartData(newChartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        // Hide loading state
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [dateRange.start, dateRange.end]);
  
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ start: startDate, end: endDate });
  };
  
  // Check if we have large datasets that might need special handling
  const isLargeDataset = {
    date: chartData.date.length > 40,
    category: chartData.category.length > 40,
    vendor: chartData.vendor.length > 40,
    paymentMode: chartData.paymentMode.length > 40,
    spendType: chartData.spendType.length > 40
  };
  
  return (
    <div className="spend-charts-page dashboard-layout">
      <Header />
      <div className="charts-content">
        <div className="charts-header">
          <h2>Expense Dashboard</h2>
          <div className="header-controls">
            <DateRangePicker onChange={handleDateRangeChange} />
          </div>
        </div>
        
        {/* Show loading state */}
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
              <p>Please select a date range using the date picker above to view your expense analytics.</p>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Date Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Expenses by Date</h3>
                <button 
                  className={`chart-toggle-btn ${chartTypes.date === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
                  onClick={() => toggleChartType('date')}
                  title={chartTypes.date === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
                >
                  {chartTypes.date === 'LineChart' ? 'Bar' : 'Line'}
                </button>
              </div>
              <div className="chart-container" style={isLargeDataset.date ? {width: `${Math.max(100, chartData.date.length * 15)}px`} : {}}>
                {chartTypes.date === 'LineChart' ? (
                  <ExpenseSumLineChart data={chartData.date} spendField={SpendFields.DATE} />
                ) : (
                  <ExpenseSumBarChart data={chartData.date} />
                )}
              </div>
            </div>
            
            {/* Category Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Expenses by Category</h3>
                <button 
                  className={`chart-toggle-btn ${chartTypes.category === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
                  onClick={() => toggleChartType('category')}
                  title={chartTypes.category === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
                >
                  {chartTypes.category === 'LineChart' ? 'Bar' : 'Line'}
                </button>
              </div>
              <div className="chart-container" style={isLargeDataset.category ? {width: `${Math.max(100, chartData.category.length * 15)}px`} : {}}>
                {chartTypes.category === 'LineChart' ? (
                  <ExpenseSumLineChart data={chartData.category} spendField={SpendFields.CATEGORY} />
                ) : (
                  <ExpenseSumBarChart data={chartData.category} />
                )}
              </div>
            </div>
            
            {/* Vendor Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Expenses by Vendor</h3>
                <button 
                  className={`chart-toggle-btn ${chartTypes.vendor === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
                  onClick={() => toggleChartType('vendor')}
                  title={chartTypes.vendor === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
                >
                  {chartTypes.vendor === 'LineChart' ? 'Bar' : 'Line'}
                </button>
              </div>
              <div className="chart-container" style={isLargeDataset.vendor ? {width: `${Math.max(100, chartData.vendor.length * 15)}px`} : {}}>
                {chartTypes.vendor === 'LineChart' ? (
                  <ExpenseSumLineChart data={chartData.vendor} spendField={SpendFields.VENDOR} />
                ) : (
                  <ExpenseSumBarChart data={chartData.vendor} />
                )}
              </div>
            </div>
            
            {/* Payment Mode Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Expenses by Payment Mode</h3>
                <button 
                  className={`chart-toggle-btn ${chartTypes.paymentMode === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
                  onClick={() => toggleChartType('paymentMode')}
                  title={chartTypes.paymentMode === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
                >
                  {chartTypes.paymentMode === 'LineChart' ? 'Bar' : 'Line'}
                </button>
              </div>
              <div className="chart-container" style={isLargeDataset.paymentMode ? {width: `${Math.max(100, chartData.paymentMode.length * 15)}px`} : {}}>
                {chartTypes.paymentMode === 'LineChart' ? (
                  <ExpenseSumLineChart data={chartData.paymentMode} spendField={SpendFields.PAYMENT_MODE} />
                ) : (
                  <ExpenseSumBarChart data={chartData.paymentMode} />
                )}
              </div>
            </div>
            
            {/* Spend Type Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Expenses by Spend Type</h3>
                <button 
                  className={`chart-toggle-btn ${chartTypes.spendType === 'LineChart' ? 'chart-line' : 'chart-bar'}`}
                  onClick={() => toggleChartType('spendType')}
                  title={chartTypes.spendType === 'LineChart' ? 'Switch to Bar Chart' : 'Switch to Line Chart'}
                >
                  {chartTypes.spendType === 'LineChart' ? 'Bar' : 'Line'}
                </button>
              </div>
              <div className="chart-container" style={isLargeDataset.spendType ? {width: `${Math.max(100, chartData.spendType.length * 15)}px`} : {}}>
                {chartTypes.spendType === 'LineChart' ? (
                  <ExpenseSumLineChart data={chartData.spendType} spendField={SpendFields.SPEND_TYPE} />
                ) : (
                  <ExpenseSumBarChart data={chartData.spendType} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendChartsPage;
