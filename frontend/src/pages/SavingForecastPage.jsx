import React, { useEffect, useState } from "react";
import { fetchSavingForecast } from "../utils/api";
import usePersistentDateRange from "../hooks/usePersistentDateRange";
import ForecastPageLayout from "../components/ForecastPageLayout";
import ForecastList from "../components/ForecastList";
import ForecastLoader from "../components/ForecastLoader";
import { formatINR } from "../utils/format";
import DateRangePicker from "../components/DateRangePicker";
import "./SavingForecastPage.scss";

function SavingForecast({ onSignOut }) {
  // Saving forecast calculation summary:
  // The Saving Forecast is based on your monthly income, fixed expenses, forecasted dynamic spends, and total savings made between the selected dates.
  // It uses the formula: predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends + totalSavingsMade)
  // This predicts your remaining unallocated balance after all expenses and savings for the selected period.

  const [dateRange, setDateRange] = usePersistentDateRange();
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

  const handleDateRangeChange = setDateRange;

  return (
    <ForecastPageLayout
      onSignOut={onSignOut}
      title="Saving Forecast"
      explanation={
        "The Saving Forecast is based on your monthly income, fixed expenses, forecasted dynamic spends, and total savings made between the selected dates. It uses the formula: " +
        "predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends + totalSavingsMade). This predicts your remaining unallocated balance after all expenses and savings for the selected period."
      }
    >
      <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      <div className="forecast-item forecast-item-income">
        <span>Monthly Income:</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={monthlyIncome === 0 ? '' : monthlyIncome}
          onChange={e => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setMonthlyIncome(val === '' ? 0 : Number(val));
          }}
          placeholder="Enter monthly income"
          className="monthly-income-input"
        />
      </div>
      <ForecastLoader
        loading={loading}
        hasData={forecast && Object.keys(forecast).length > 0}
        emptyText="No saving forecast data available."
      >
        <ForecastList
          items={forecast && Object.keys(forecast).length > 0 ? [
            { label: "Monthly Income (used):", value: formatINR(forecast.monthlyIncome ?? monthlyIncome) },
            { label: "Total Fixed Expenses:", value: formatINR(forecast.totalFixedExpenses) },
            { label: "Forecasted Dynamic Spends:", value: formatINR(forecast.forecastedDynamicSpends) },
            { label: "Total Savings Made:", value: formatINR(forecast.totalSavingsMade) },
            { label: "Predicted Saving:", value: formatINR(forecast.predictedSaving) },
            { label: "Date Range:", value: `${forecast.startDate} to ${forecast.endDate}` },
          ] : []}
        />
      </ForecastLoader>
    </ForecastPageLayout>
  );
}

export default SavingForecast;
