import React, { useEffect, useState } from "react";
import { fetchExpenseForecast } from "../utils/api";
import usePersistentDateRange from "../hooks/usePersistentDateRange";
import ForecastPageLayout from "../components/ForecastPageLayout";
import ForecastList from "../components/ForecastList";
import ForecastLoader from "../components/ForecastLoader";
import { formatINR } from "../utils/format";
import DateRangePicker from "../components/DateRangePicker";
import "./ExpenseForecastPage.scss";

function ExpenseForecast({ onSignOut }) {
  // Forecast calculation summary:
  // The forecast is based on your dynamic expenses between the selected dates. It calculates your average daily spend so far and projects the total for the whole range. Only expenses marked as "dynamic" are included.
  // The summary shows your projected total, actual spent so far, daily average, and the date range.

  const [dateRange, setDateRange] = usePersistentDateRange();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      setLoading(true);
      fetchExpenseForecast(dateRange.start, dateRange.end)
        .then(setForecast)
        .finally(() => setLoading(false));
    }
  }, [dateRange.start, dateRange.end]);

  const handleDateRangeChange = setDateRange;

  return (
    <ForecastPageLayout
      onSignOut={onSignOut}
      title="Expense Forecast"
      explanation={
        "The Expense Forecast is based on your dynamic expenses between the selected dates. It calculates your average daily spend so far and projects the total for the whole range. Only expenses marked as 'dynamic' are included. The summary shows your projected total, actual spent so far, daily average, and the date range."
      }
    >
      <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      <ForecastLoader
        loading={loading}
        hasData={forecast && Object.keys(forecast).length > 0}
        emptyText="No forecast data available."
      >
        <ForecastList
          items={forecast && Object.keys(forecast).length > 0 ? [
            { label: "Total Expense Forecast:", value: formatINR(forecast.forecast) },
            { label: "Total Spent:", value: formatINR(forecast.totalSpent) },
            { label: "Daily Average:", value: formatINR(forecast.dailyAverage) },
            { label: "Days So Far:", value: forecast.daysSoFar },
            { label: "Total Days:", value: forecast.totalDays },
            { label: "Remaining Days:", value: forecast.remainingDays },
            { label: "Date Range:", value: `${forecast.startDate} to ${forecast.endDate}` },
          ] : []}
        />
      </ForecastLoader>
    </ForecastPageLayout>
  );
}

export default ExpenseForecast;
