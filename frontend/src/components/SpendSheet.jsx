import React, { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import SpendInputRow from "./SpendInputRow";
import { useSpends } from "../hooks/useSpends";
import { formatDate } from "../utils/date";
import "./SpendSheet.scss";
import useIsMobile from "../hooks/useIsMobile";
import SpendSheetMobile from "./SpendSheetMobile";

const blankSpend = {
  Date: formatDate(new Date()),
  Category: "",
  Description: "",
  AmountSpent: "",
  Vendor: "",
  PaymentMode: "",
  SpendType: "",
};

const API_URL = import.meta.env.VITE_API_URL;

function SpendSheet() {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const prev7 = new Date();
    prev7.setDate(today.getDate() - 6);
    return formatDate(prev7);
  });
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [inputRow, setInputRow] = useState({ ...blankSpend });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { spends, setSpends, loading } = useSpends(startDate, endDate);
  // Use a larger breakpoint (e.g., 1024px)
  const isMobile = useIsMobile(1024);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleInputRowChange = (field, value) => {
    setInputRow((row) => ({
      ...row,
      [field]: value,
    }));
  };

  const handleSaveInputRow = async () => {
    const spend = inputRow;
    // Basic validation
    if (
      !spend.Date ||
      !spend.Category ||
      !spend.Description ||
      !spend.AmountSpent ||
      !spend.SpendType
    ) {
      setError(
        "Please fill all required fields (Date, Category, Description, Amount, Spend Type)."
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        Date: spend.Date,
        Category: spend.Category,
        Description: spend.Description,
        AmountSpent: parseFloat(spend.AmountSpent),
        Vendor: spend.Vendor,
        PaymentMode: spend.PaymentMode,
        SpendType: spend.SpendType,
      };
      const res = await fetch(`${API_URL}/spends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add spend");
      // Insert the new spend at the top of the spends list
      setSpends((prev) => [{ ...spend }, ...prev]);
      setInputRow({ ...blankSpend });
      // Removed: useSpends hook handles refresh
    } catch (err) {
      setError(err.message || "Error adding spend");
    }
    setSaving(false);
  };

  if (isMobile) {
    return (
      <div className="spend-sheet-container">
        <SpendSheetMobile
          inputRow={inputRow}
          onChange={handleInputRowChange}
          onSave={handleSaveInputRow}
          saving={saving}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="spend-sheet-container wide">
      <DateRangePicker
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
      />
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            <SpendInputRow
              inputRow={inputRow}
              onChange={handleInputRowChange}
              onSave={handleSaveInputRow}
              saving={saving}
            />
            {/* Existing spends */}
            {spends.length === 0 && !loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
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
                <td></td>
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