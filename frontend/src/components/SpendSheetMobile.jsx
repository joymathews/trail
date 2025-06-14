import React from "react";
import "./SpendSheetMobile.scss";

function SpendSheetMobile({
  inputRow,
  onChange,
  onSave,
  saving,
  spends,
  loading,
  error,
}) {
  return (
    <div className="spend-sheet-mobile">
      <h3>Spends Sheet</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave();
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(44,62,80,0.06)",
        }}
      >
        <label>
          Date
          <input
            type="date"
            value={inputRow.Date}
            onChange={e => onChange("Date", e.target.value)}
            required
          />
        </label>
        <label>
          Category
          <input
            type="text"
            value={inputRow.Category}
            onChange={e => onChange("Category", e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={inputRow.Description}
            onChange={e => onChange("Description", e.target.value)}
            required
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            value={inputRow.AmountSpent}
            onChange={e => onChange("AmountSpent", e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </label>
        <label>
          Vendor
          <input
            type="text"
            value={inputRow.Vendor}
            onChange={e => onChange("Vendor", e.target.value)}
          />
        </label>
        <label>
          Payment Mode
          <input
            type="text"
            value={inputRow.PaymentMode}
            onChange={e => onChange("PaymentMode", e.target.value)}
          />
        </label>
        <label>
          Spend Type
          <select
            value={inputRow.SpendType}
            onChange={e => onChange("SpendType", e.target.value)}
            required
          >
            <option value="">Type</option>
            <option value="fixed">Fixed</option>
            <option value="dynamic">Dynamic</option>
            <option value="saving">Saving</option>
          </select>
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default SpendSheetMobile;
