import React, { useState, useRef } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import { SpendFields } from "../utils/fieldEnums";

/**
 * Shared spend input form fields with autocomplete logic.
 * Props:
 * - inputRow, onChange, onSave, saving, as ("row" | "form"), error
 */
function SpendInputForm({
  inputRow,
  onChange,
  onSave,
  saving,
  as = "form",
  error,
}) {
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
      if (!backendField) return;
      const url = `${import.meta.env.VITE_API_URL}/autocomplete/${backendField}?q=${encodeURIComponent(value)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(s => ({ ...s, [field]: data }));
      } else {
        setSuggestions(s => ({ ...s, [field]: [] }));
      }
    } catch {
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

  // Render fields as table row or form
  const fields = [
    {
      key: SpendFields.DATE,
      label: "Date",
      type: "date",
      value: inputRow.Date,
      onChange: e => onChange("Date", e.target.value),
      required: true
    },
    {
      key: SpendFields.CATEGORY,
      label: "Category",
      type: "text",
      value: inputRow[SpendFields.CATEGORY],
      autoComplete: true,
      required: true
    },
    {
      key: SpendFields.DESCRIPTION,
      label: "Description",
      type: "text",
      value: inputRow[SpendFields.DESCRIPTION],
      autoComplete: true,
      required: true
    },
    {
      key: SpendFields.AMOUNT_SPENT,
      label: "Amount",
      type: "number",
      value: inputRow.AmountSpent,
      onChange: e => onChange("AmountSpent", e.target.value),
      min: 0,
      step: 0.01,
      required: true
    },
    {
      key: SpendFields.VENDOR,
      label: "Vendor",
      type: "text",
      value: inputRow[SpendFields.VENDOR],
      autoComplete: true
    },
    {
      key: SpendFields.PAYMENT_MODE,
      label: "Payment Mode",
      type: "text",
      value: inputRow[SpendFields.PAYMENT_MODE],
      autoComplete: true
    },
    {
      key: SpendFields.SPEND_TYPE,
      label: "Spend Type",
      type: "select",
      value: inputRow.SpendType,
      required: true
    }
  ];

  // Render helpers
  const renderField = field => {
    if (field.autoComplete) {
      return (
        <div className={as === "form" ? "form-field" : "table-field"} key={field.key}>
          {as === "form" && <label className="input-label">{field.label}</label>}
          <AutoCompleteInput
            id={`spend-${field.key.toLowerCase()}`}
            label={as === "row" ? field.label : undefined}
            value={field.value}
            inputRef={inputRefs[field.key]}
            onChange={e => handleInputChange(field.key, e.target.value)}
            onFocus={() => field.value && fetchSuggestions(field.key, field.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(s => ({ ...s, [field.key]: false })), 100)}
            onKeyDown={e => handleKeyDown(field.key, e)}
            suggestions={suggestions[field.key]}
            showSuggestions={showSuggestions[field.key]}
            onSuggestionClick={s => handleSuggestionClick(field.key, s)}
            placeholder={field.label}
            autoComplete="off"
            type={field.type}
          />
        </div>
      );
    } else if (field.type === "select") {
      return (
        <div className={as === "form" ? "form-field" : "table-field"} key={field.key}>
          {as === "form" && <label className="input-label">{field.label}</label>}
          <select
            value={field.value}
            onChange={e => onChange("SpendType", e.target.value)}
            required={field.required}
          >
            <option value="">Type</option>
            <option value="fixed">Fixed</option>
            <option value="dynamic">Dynamic</option>
            <option value="saving">Saving</option>
          </select>
        </div>
      );
    } else {
      return (
        <div className={as === "form" ? "form-field" : "table-field"} key={field.key}>
          {as === "form" && <label className="input-label">{field.label}</label>}
          <input
            type={field.type}
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            step={field.step}
            required={field.required}
          />
        </div>
      );
    }
  };

  if (as === "row") {
    // Render as table row (tds)
    return (
      <>
        <td className="spend-td">{renderField(fields[0])}</td>
        <td className="spend-td">{renderField(fields[1])}</td>
        <td className="spend-td">{renderField(fields[2])}</td>
        <td className="spend-td">{renderField(fields[3])}</td>
        <td className="spend-td">{renderField(fields[4])}</td>
        <td className="spend-td">{renderField(fields[5])}</td>
        <td className="spend-td">{renderField(fields[6])}</td>
        <td className="spend-td spend-btn-cell">
          <button className="save-spend-btn" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </td>
      </>
    );
  }

  // Render as form fields (for mobile)
  return (
    <>
      {fields.map(renderField)}
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      {error && <div className="error">{error}</div>}
    </>
  );
}

export default SpendInputForm;
