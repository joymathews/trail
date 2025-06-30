import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DateRangePicker from "../components/DateRangePicker";
import { fetchSavingForecast } from "../utils/api";
import { getDefaultLast7DaysRange } from "../utils/dateRangeDefaults";
import { getDateRangeFromStorage, saveDateRangeToStorage } from "../utils/dateRangeStorage";
import "./SavingForecastPage.scss";

function SavingForecast({ onSignOut }) {
  // Saving forecast calculation summary:
  // The Saving Forecast is based on your monthly income, fixed expenses, forecasted dynamic spends, and total savings made between the selected dates.
  // It uses the formula: predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends + totalSavingsMade)
  // This predicts your remaining unallocated balance after all expenses and savings for the selected period.

  const storedRange = getDateRangeFromStorage();
  const defaultRange = storedRange || getDefaultLast7DaysRange();
  const [dateRange, setDateRange] = useState(defaultRange);
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(false);
  // Default monthly income set to 279000 (in INR)
  const [monthlyIncome, setMonthlyIncome] = useState(279000);

  useEffect(() => {
    if (dateRange.start && dateRange.end && monthlyIncome > 0) {
      setLoading(true);
      fetchSavingForecast(dateRange.start, dateRange.end, monthlyIncome)
        .then(setForecast)
        .finally(() => setLoading(false));
    } else {
      setForecast({});
    }
  }, [dateRange.start, dateRange.end, monthlyIncome]);

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });
    saveDateRangeToStorage({ start, end });
  };

  function formatINR(value) {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  }

  return (
    <div>
      <Header onSignOut={onSignOut} />
      <div className="forecast-container">
        <div className="forecast-title">Saving Forecast</div>
        <div className="forecast-summary-explanation">
          The Saving Forecast is based on your monthly income, fixed expenses, forecasted dynamic spends, and total savings made between the selected dates. It uses the formula: <b>predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends + totalSavingsMade)</b>. This predicts your remaining unallocated balance after all expenses and savings for the selected period.
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
        />
        <div className="forecast-item forecast-item-income">
          <span>Monthly Income:</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={monthlyIncome === 0 ? '' : monthlyIncome}
            onChange={e => {
              // Remove non-digit characters
              const val = e.target.value.replace(/[^0-9]/g, '');
              setMonthlyIncome(val === '' ? 0 : Number(val));
            }}
            placeholder="Enter monthly income"
            className="monthly-income-input"
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="forecast-list">
            {forecast && Object.keys(forecast).length > 0 ? (
              <>
                <div className="forecast-item">
                  <span>Monthly Income (used):</span>
                  <span>{formatINR(forecast.monthlyIncome ?? monthlyIncome)}</span>
                </div>
                <div className="forecast-item">
                  <span>Total Fixed Expenses:</span>
                  <span>{formatINR(forecast.totalFixedExpenses)}</span>
                </div>
                <div className="forecast-item">
                  <span>Forecasted Dynamic Spends:</span>
                  <span>{formatINR(forecast.forecastedDynamicSpends)}</span>
                </div>
                <div className="forecast-item">
                  <span>Total Savings Made:</span>
                  <span>{formatINR(forecast.totalSavingsMade)}</span>
                </div>
                <div className="forecast-item">
                  <span>Predicted Saving:</span>
                  <span>{formatINR(forecast.predictedSaving)}</span>
                </div>
                <div className="forecast-item">
                  <span>Date Range:</span>
                  <span>{forecast.startDate} to {forecast.endDate}</span>
                </div>
              </>
            ) : (
              <div>No saving forecast data available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavingForecast;
