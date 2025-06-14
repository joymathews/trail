import React, { useEffect, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import "./SpendSheet.scss";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to get YYYY-MM-DD string
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function SpendSheet() {
  const [spends, setSpends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Set default date range to previous 7 days
  useEffect(() => {
    const today = new Date();
    const prev7 = new Date();
    prev7.setDate(today.getDate() - 6);
    setStartDate(formatDate(prev7));
    setEndDate(formatDate(today));
  }, []);

  // Fetch spends from backend using date range
  const fetchSpends = async (start = startDate, end = endDate) => {
    setLoading(true);
    setError("");
    try {
      if (!start || !end) {
        setSpends([]);
        setLoading(false);
        return;
      }
      const url = `${API_URL}/spends?startDate=${start}&endDate=${end}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch spends");
      let data = await res.json();
      // Sort by date descending (latest first)
      data = data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      setSpends(data);
    } catch (err) {
      setError(err.message || "Error loading spends");
    }
    setLoading(false);
  };

  // Fetch spends when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchSpends(startDate, endDate);
    } else {
      setSpends([]);
    }
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="spend-sheet-container wide">
      <DateRangePicker onChange={handleDateChange} startDate={startDate} endDate={endDate} />
      <h3>Spends Sheet</h3>
      <div className="spend-table-wrapper">
        <table className="spend-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Vendor</th>
              <th>Payment Mode</th>
              <th>Spend Type</th>
            </tr>
          </thead>
          <tbody>
            {spends.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  {startDate && endDate
                    ? "No spends found."
                    : "Please select a start and end date."}
                </td>
              </tr>
            )}
            {spends.map((spend, idx) => (
              <tr key={spend.id || idx}>
                <td>{spend.Date}</td>
                <td>{spend.Category}</td>
                <td>{spend.Description}</td>
                <td style={{ textAlign: "right" }}>{spend.AmountSpent}</td>
                <td>{spend.Vendor}</td>
                <td>{spend.PaymentMode}</td>
                <td>{spend.SpendType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default SpendSheet;