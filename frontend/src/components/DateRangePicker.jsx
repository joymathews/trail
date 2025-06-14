import React, { useState } from "react";
import "./DateRangePicker.scss";

function DateRangePicker({ onChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    if (onChange) onChange(e.target.value, endDate);
  };

  const handleEndChange = (e) => {
    setEndDate(e.target.value);
    if (onChange) onChange(startDate, e.target.value);
  };

  return (
    <div className="date-range-picker">
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={handleStartChange}
        />
      </label>
      <span style={{ margin: "0 0.5rem" }}>to</span>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={handleEndChange}
        />
      </label>
    </div>
  );
}

export default DateRangePicker;