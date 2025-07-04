import React, { useState, useEffect } from "react";
import "./DateRangePicker.scss";

function DateRangePicker({ value, onChange }) {
  const [dates, setDates] = useState({ startDate: value?.start || null, endDate: value?.end || null });

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      onChange(dates.startDate, dates.endDate);
    }
  }, [dates.startDate, dates.endDate]);

  useEffect(() => {
    setDates({ startDate: value?.start || null, endDate: value?.end || null });
  }, [value?.start, value?.end]);

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
      <span className="date-range-separator">to</span>
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