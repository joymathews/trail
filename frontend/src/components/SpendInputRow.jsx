// src/components/SpendInputRow.jsx
import React from "react";

function SpendInputRow({ inputRow, onChange, onSave, saving }) {
  return (
    <tr>
      <td>
        <input
          type="date"
          value={inputRow.Date}
          onChange={e => onChange("Date", e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={inputRow.Category}
          onChange={e => onChange("Category", e.target.value)}
          placeholder="Category"
        />
      </td>
      <td>
        <input
          type="text"
          value={inputRow.Description}
          onChange={e => onChange("Description", e.target.value)}
          placeholder="Description"
        />
      </td>
      <td>
        <input
          type="number"
          value={inputRow.AmountSpent}
          onChange={e => onChange("AmountSpent", e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
        />
      </td>
      <td>
        <input
          type="text"
          value={inputRow.Vendor}
          onChange={e => onChange("Vendor", e.target.value)}
          placeholder="Vendor"
        />
      </td>
      <td>
        <input
          type="text"
          value={inputRow.PaymentMode}
          onChange={e => onChange("PaymentMode", e.target.value)}
          placeholder="Payment Mode"
        />
      </td>
      <td>
        <select
          value={inputRow.SpendType}
          onChange={e => onChange("SpendType", e.target.value)}
        >
          <option value="">Type</option>
          <option value="fixed">Fixed</option>
          <option value="dynamic">Dynamic</option>
          <option value="saving">Saving</option>
        </select>
      </td>
      <td>
        <button
          className="save-spend-btn"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}

export default SpendInputRow;