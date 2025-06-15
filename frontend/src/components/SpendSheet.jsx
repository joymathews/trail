import React, { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import SpendInputRow from "./SpendInputRow";
import { useSpends } from "../hooks/useSpends";
import { formatDate } from "../utils/date";
import { SpendFields } from "../utils/fieldEnums";
import "./SpendSheet.scss";
import useIsMobile from "../hooks/useIsMobile";
import SpendSheetMobile from "./SpendSheetMobile";

const blankSpend = {
  [SpendFields.DATE]: formatDate(new Date()),
  [SpendFields.CATEGORY]: "",
  [SpendFields.DESCRIPTION]: "",
  [SpendFields.AMOUNT_SPENT]: "",
  [SpendFields.VENDOR]: "",
  [SpendFields.PAYMENT_MODE]: "",
  [SpendFields.SPEND_TYPE]: "",
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

  const { spends, setSpends, loading, error: fetchError } = useSpends(startDate, endDate);
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
      !spend[SpendFields.DATE] ||
      !spend[SpendFields.CATEGORY] ||
      !spend[SpendFields.DESCRIPTION] ||
      !spend[SpendFields.AMOUNT_SPENT] ||
      !spend[SpendFields.SPEND_TYPE]
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/spends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spend),
      });
      if (res.ok) {
        const { spend: newSpend } = await res.json();
        setInputRow({ ...blankSpend });
        setSpends((prev) => [newSpend, ...prev]);
      } else {
        setError("Failed to save spend.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setSaving(false);
    }
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
                <td>{spend[SpendFields.DATE]}</td>
                <td>{spend[SpendFields.CATEGORY]}</td>
                <td>{spend[SpendFields.DESCRIPTION]}</td>
                <td style={{ textAlign: "right" }}>{spend[SpendFields.AMOUNT_SPENT]}</td>
                <td>{spend[SpendFields.VENDOR]}</td>
                <td>{spend[SpendFields.PAYMENT_MODE]}</td>
                <td>{spend[SpendFields.SPEND_TYPE]}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {fetchError && (
        <div style={{ color: "red", margin: "1em 0" }}>
          Error fetching spends: {fetchError}
        </div>
      )}
    </div>
  );
}

export default SpendSheet;