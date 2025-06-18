import React, { useState } from "react";
import DateRangePicker from "../DateRangePicker";
import SpendInputRow from "./SpendInputRow";
import { SpendFields } from "../../utils/fieldEnums";
import "./SpendSheet.scss";
import { useSpendInput } from "../../hooks/useSpendInput";

function SpendSheet() {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const prev7 = new Date();
    prev7.setDate(today.getDate() - 6);
    return prev7.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  const {
    inputRow,
    handleInputRowChange,
    handleSaveInputRow,
    saving,
    error,
    spends,
    loading,
    fetchError,
  } = useSpendInput(startDate, endDate);

  return (
    <div className="spend-sheet-container wide">
      <DateRangePicker
        value={{ start: startDate, end: endDate }}
        onChange={handleDateChange}
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
                <td colSpan={8} className="center">
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
                <td className="right">{spend[SpendFields.AMOUNT_SPENT]}</td>
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
        <div className="spend-sheet-error">
          Error fetching spends: {fetchError}
        </div>
      )}
    </div>
  );
}

export default SpendSheet;