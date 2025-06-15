// src/components/SpendInputRow.jsx
import React, { useState, useRef } from "react";
import { SpendFields } from "../utils/fieldEnums";
import "./SpendInputRow.scss";

function SpendInputRow({ inputRow, onChange, onSave, saving }) {
  // Autocomplete state
  const [suggestions, setSuggestions] = useState({
    [SpendFields.CATEGORY]: [],
    [SpendFields.DESCRIPTION]: [],
    [SpendFields.VENDOR]: [],
    [SpendFields.PAYMENT_MODE]: []
  });
  const [showSuggestions, setShowSuggestions] = useState({
    [SpendFields.CATEGORY]: false,
    [SpendFields.DESCRIPTION]: false,
    [SpendFields.VENDOR]: false,
    [SpendFields.PAYMENT_MODE]: false
  });
  const [activeSuggestion, setActiveSuggestion] = useState({
    [SpendFields.CATEGORY]: -1,
    [SpendFields.DESCRIPTION]: -1,
    [SpendFields.VENDOR]: -1,
    [SpendFields.PAYMENT_MODE]: -1
  });
  const inputRefs = {
    [SpendFields.CATEGORY]: useRef(null),
    [SpendFields.DESCRIPTION]: useRef(null),
    [SpendFields.VENDOR]: useRef(null),
    [SpendFields.PAYMENT_MODE]: useRef(null)
  };

  // Map SpendFields to backend route segments
  const backendFieldMap = {
    [SpendFields.CATEGORY]: "category",
    [SpendFields.VENDOR]: "vendor",
    [SpendFields.PAYMENT_MODE]: "paymentMode",
    [SpendFields.DESCRIPTION]: "description"
  };

  // Fetch suggestions from backend
  const fetchSuggestions = async (field, value) => {
    if (!value) {
      setSuggestions(s => ({ ...s, [field]: [] }));
      return;
    }
    try {
      const backendField = backendFieldMap[field];
      if (!backendField) {
        return;
      }
      const url = `${import.meta.env.VITE_API_URL}/autocomplete/${backendField}?q=${encodeURIComponent(value)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(s => ({ ...s, [field]: data }));
      } else {
        console.warn(`[fetchSuggestions] Bad response for ${field}:`, res.status);
      }
    } catch (e) {
      setSuggestions(s => ({ ...s, [field]: [] }));
    }
  };

  // Handle input change with autocomplete
  const handleInputChange = (field, value) => {
    onChange(field, value);
    fetchSuggestions(field, value);
    setShowSuggestions(s => ({ ...s, [field]: true }));
    setActiveSuggestion(a => ({ ...a, [field]: -1 }));
  };

  // Handle suggestion click
  const handleSuggestionClick = (field, suggestion) => {
    onChange(field, suggestion);
    setShowSuggestions(s => ({ ...s, [field]: false }));
    setSuggestions(s => ({ ...s, [field]: [] }));
  };

  // Handle keyboard navigation
  const handleKeyDown = (field, e) => {
    const suggs = suggestions[field] || [];
    if (e.key === "ArrowDown") {
      setActiveSuggestion(a => ({ ...a, [field]: Math.min(a[field] + 1, suggs.length - 1) }));
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion(a => ({ ...a, [field]: Math.max(a[field] - 1, 0) }));
    } else if (e.key === "Enter" && activeSuggestion[field] >= 0) {
      handleSuggestionClick(field, suggs[activeSuggestion[field]]);
    } else if (e.key === "Escape") {
      setShowSuggestions(s => ({ ...s, [field]: false }));
    }
  };

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
        <div className="autocomplete-wrapper">
          <input
            id="spend-category"
            type="text"
            value={inputRow[SpendFields.CATEGORY]}
            ref={inputRefs[SpendFields.CATEGORY]}
            onChange={e => handleInputChange(SpendFields.CATEGORY, e.target.value)}
            onFocus={() => inputRow[SpendFields.CATEGORY] && fetchSuggestions(SpendFields.CATEGORY, inputRow[SpendFields.CATEGORY])}
            onBlur={() => setTimeout(() => setShowSuggestions(s => ({ ...s, [SpendFields.CATEGORY]: false })), 100)}
            onKeyDown={e => handleKeyDown(SpendFields.CATEGORY, e)}
            placeholder="Category"
            autoComplete="off"
          />
          {showSuggestions[SpendFields.CATEGORY] && suggestions[SpendFields.CATEGORY].length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions[SpendFields.CATEGORY].map((s, i) => (
                <li
                  key={s}
                  className={i === activeSuggestion[SpendFields.CATEGORY] ? "active" : ""}
                  onMouseDown={() => handleSuggestionClick(SpendFields.CATEGORY, s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </td>
      <td>
        <label htmlFor="spend-description" className="visually-hidden">Description</label>
        <div className="autocomplete-wrapper">
          <input
            id="spend-description"
            type="text"
            value={inputRow[SpendFields.DESCRIPTION]}
            ref={inputRefs[SpendFields.DESCRIPTION]}
            onChange={e => handleInputChange(SpendFields.DESCRIPTION, e.target.value)}
            onFocus={() => inputRow[SpendFields.DESCRIPTION] && fetchSuggestions(SpendFields.DESCRIPTION, inputRow[SpendFields.DESCRIPTION])}
            onBlur={() => setTimeout(() => setShowSuggestions(s => ({ ...s, [SpendFields.DESCRIPTION]: false })), 100)}
            onKeyDown={e => handleKeyDown(SpendFields.DESCRIPTION, e)}
            placeholder="Description"
            autoComplete="off"
          />
          {showSuggestions[SpendFields.DESCRIPTION] && suggestions[SpendFields.DESCRIPTION].length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions[SpendFields.DESCRIPTION].map((s, i) => (
                <li
                  key={s}
                  className={i === activeSuggestion[SpendFields.DESCRIPTION] ? "active" : ""}
                  onMouseDown={() => handleSuggestionClick(SpendFields.DESCRIPTION, s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
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
        <div className="autocomplete-wrapper">
          <input
            id="spend-vendor"
            type="text"
            value={inputRow[SpendFields.VENDOR]}
            ref={inputRefs[SpendFields.VENDOR]}
            onChange={e => handleInputChange(SpendFields.VENDOR, e.target.value)}
            onFocus={() => inputRow[SpendFields.VENDOR] && fetchSuggestions(SpendFields.VENDOR, inputRow[SpendFields.VENDOR])}
            onBlur={() => setTimeout(() => setShowSuggestions(s => ({ ...s, [SpendFields.VENDOR]: false })), 100)}
            onKeyDown={e => handleKeyDown(SpendFields.VENDOR, e)}
            placeholder="Vendor"
            autoComplete="off"
          />
          {showSuggestions[SpendFields.VENDOR] && suggestions[SpendFields.VENDOR].length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions[SpendFields.VENDOR].map((s, i) => (
                <li
                  key={s}
                  className={i === activeSuggestion[SpendFields.VENDOR] ? "active" : ""}
                  onMouseDown={() => handleSuggestionClick(SpendFields.VENDOR, s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </td>
      <td>
        <label htmlFor="spend-payment-mode" className="visually-hidden">Payment Mode</label>
        <div className="autocomplete-wrapper">
          <input
            id="spend-payment-mode"
            type="text"
            value={inputRow[SpendFields.PAYMENT_MODE]}
            ref={inputRefs[SpendFields.PAYMENT_MODE]}
            onChange={e => handleInputChange(SpendFields.PAYMENT_MODE, e.target.value)}
            onFocus={() => inputRow[SpendFields.PAYMENT_MODE] && fetchSuggestions(SpendFields.PAYMENT_MODE, inputRow[SpendFields.PAYMENT_MODE])}
            onBlur={() => setTimeout(() => setShowSuggestions(s => ({ ...s, [SpendFields.PAYMENT_MODE]: false })), 100)}
            onKeyDown={e => handleKeyDown(SpendFields.PAYMENT_MODE, e)}
            placeholder="Payment Mode"
            autoComplete="off"
          />
          {showSuggestions[SpendFields.PAYMENT_MODE] && suggestions[SpendFields.PAYMENT_MODE].length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions[SpendFields.PAYMENT_MODE].map((s, i) => (
                <li
                  key={s}
                  className={i === activeSuggestion[SpendFields.PAYMENT_MODE] ? "active" : ""}
                  onMouseDown={() => handleSuggestionClick(SpendFields.PAYMENT_MODE, s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
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