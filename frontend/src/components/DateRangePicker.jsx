import React, { useState, useEffect } from "react";
import "./DateRangePicker.scss";

function DateRangePicker({ onChange }) {
  const [dates, setDates] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      onChange(dates.startDate, dates.endDate);
    }
  }, [dates.startDate, dates.endDate, onChange]);

  const handleStartDateChange = (e) => {
    setDates((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setDates((prev) => ({ ...prev, endDate: e.target.value }));
  };

  return (
    <div className="date-range-picker">
      <label>
        Start Date:
        <input
          type="date"
          value={dates.startDate || ""}
          onChange={handleStartDateChange}
        />
      </label>
      <span style={{ margin: "0 0.5rem" }}>to</span>
      <label>
        End Date:
        <input
          type="date"
          value={dates.endDate || ""}
          onChange={handleEndDateChange}
        />
      </label>
    </div>
  );
}

export default DateRangePicker;