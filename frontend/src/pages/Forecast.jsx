import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DateRangePicker from "../components/DateRangePicker";
import { fetchExpenseForecast } from "../utils/api";
import { getDefaultLast7DaysRange } from "../utils/dateRangeDefaults";
import { getDateRangeFromStorage, saveDateRangeToStorage } from "../utils/dateRangeStorage";
import "./Forecast.scss";

function Forecast({ onSignOut }) {
  const storedRange = getDateRangeFromStorage();
  const defaultRange = storedRange || getDefaultLast7DaysRange();
  const [dateRange, setDateRange] = useState(defaultRange);
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

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });
    saveDateRangeToStorage({ start, end });
  };

  return (
    <div>
      <Header onSignOut={onSignOut} />
      <div className="forecast-container">
        <div className="forecast-title">Expense Forecast</div>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
        />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="forecast-list">
            {forecast && Object.keys(forecast).length > 0 ? (
              <>
                <div className="forecast-item">
                  <span>Total Forecast:</span>
                  <span>{forecast.forecast}</span>
                </div>
                <div className="forecast-item">
                  <span>Total Spent:</span>
                  <span>{forecast.totalSpent}</span>
                </div>
                <div className="forecast-item">
                  <span>Daily Average:</span>
                  <span>{forecast.dailyAverage}</span>
                </div>
                <div className="forecast-item">
                  <span>Days So Far:</span>
                  <span>{forecast.daysSoFar}</span>
                </div>
                <div className="forecast-item">
                  <span>Total Days:</span>
                  <span>{forecast.totalDays}</span>
                </div>
                <div className="forecast-item">
                  <span>Date Range:</span>
                  <span>{forecast.startDate} to {forecast.endDate}</span>
                </div>
              </>
            ) : (
              <div>No forecast data available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;
