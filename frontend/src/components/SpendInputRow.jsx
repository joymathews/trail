// src/components/SpendInputRow.jsx
import React from "react";

function SpendInputRow({ inputRow, onChange, onSave, saving }) {
  return (
    <tr>
      <td>
        <label htmlFor="spend-date" className="visually-hidden">Date</label>
        <input
          id="spend-date"
          type="date"
          value={inputRow.Date}
          onChange={e => onChange("Date", e.target.value)}
        />
      </td>
      <td>
        <label htmlFor="spend-category" className="visually-hidden">Category</label>
        <input
          id="spend-category"
          type="text"
          value={inputRow.Category}
          onChange={e => onChange("Category", e.target.value)}
          placeholder="Category"
        />
      </td>
      <td>
        <label htmlFor="spend-description" className="visually-hidden">Description</label>
        <input
          id="spend-description"
          type="text"
          value={inputRow.Description}
          onChange={e => onChange("Description", e.target.value)}
          placeholder="Description"
        />
      </td>
      <td>
        <label htmlFor="spend-amount" className="visually-hidden">Amount</label>
        <input
          id="spend-amount"
          type="number"
          value={inputRow.AmountSpent}
          onChange={e => onChange("AmountSpent", e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.01"
        />
      </td>
      <td>
        <label htmlFor="spend-vendor" className="visually-hidden">Vendor</label>
        <input
          id="spend-vendor"
          type="text"
          value={inputRow.Vendor}
          onChange={e => onChange("Vendor", e.target.value)}
          placeholder="Vendor"
        />
      </td>
      <td>
        <label htmlFor="spend-payment-mode" className="visually-hidden">Payment Mode</label>
        <input
          id="spend-payment-mode"
          type="text"
          value={inputRow.PaymentMode}
          onChange={e => onChange("PaymentMode", e.target.value)}
          placeholder="Payment Mode"
        />
      </td>
      <td>
        <label htmlFor="spend-type" className="visually-hidden">Spend Type</label>
        <select
          id="spend-type"
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