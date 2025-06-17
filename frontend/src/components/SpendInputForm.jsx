import React, { useState, useRef } from "react";
import SpendInputField from "./SpendInputField";
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

  // Fetch suggestions from backend
  const fetchSuggestions = async (field, value) => {
    if (!value) {
      setSuggestions(s => ({ ...s, [field]: [] }));
      return;
    }
    try {
      // Use field directly (matches backend route)
      const url = `${import.meta.env.VITE_API_URL}/autocomplete/${field}?q=${encodeURIComponent(value)}`;
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

  // Helper: get next field key in form order
  const getNextFieldKey = (currentKey) => {
    const order = [
      SpendFields.CATEGORY,
      SpendFields.DESCRIPTION,
      SpendFields.AMOUNT_SPENT,
      SpendFields.VENDOR,
      SpendFields.PAYMENT_MODE,
      SpendFields.SPEND_TYPE
    ];
    const idx = order.indexOf(currentKey);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
  };

  // Handle suggestion click
  const handleSuggestionClick = (field, suggestion) => {
    onChange(field, suggestion);
    setShowSuggestions(s => ({ ...s, [field]: false }));
    setSuggestions(s => ({ ...s, [field]: [] }));
    // Focus next input in form order (for mobile/tab)
    const nextKey = getNextFieldKey(field);
    if (nextKey && inputRefs[nextKey] && inputRefs[nextKey].current) {
      setTimeout(() => inputRefs[nextKey].current.focus(), 0);
    }
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
      value: inputRow[SpendFields.DATE],
      onChange: e => onChange(SpendFields.DATE, e.target.value),
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
      value: inputRow[SpendFields.AMOUNT_SPENT],
      onChange: e => onChange(SpendFields.AMOUNT_SPENT, e.target.value),
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
      value: inputRow[SpendFields.SPEND_TYPE],
      required: true
    }
  ];

  if (as === "row") {
    return (
      <>
        {fields.map((field, idx) => (
          <td className="spend-td" key={field.key}>
            <SpendInputField
              field={field}
              as="row"
              inputRefs={inputRefs}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              activeSuggestion={activeSuggestion}
              onChange={onChange}
              onInputChange={handleInputChange}
              onSuggestionClick={handleSuggestionClick}
              onKeyDown={handleKeyDown}
              onFocus={(key, value) => value && fetchSuggestions(key, value)}
              onBlur={key => setTimeout(() => setShowSuggestions(s => ({ ...s, [key]: false })), 100)}
            />
          </td>
        ))}
        <td className="spend-td spend-btn-cell">
          <button className="save-spend-btn" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </td>
      </>
    );
  }

  return (
    <>
      {fields.map(field => (
        <SpendInputField
          key={field.key}
          field={field}
          as="form"
          inputRefs={inputRefs}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          activeSuggestion={activeSuggestion}
          onChange={onChange}
          onInputChange={handleInputChange}
          onSuggestionClick={handleSuggestionClick}
          onKeyDown={handleKeyDown}
          onFocus={(key, value) => value && fetchSuggestions(key, value)}
          onBlur={key => setTimeout(() => setShowSuggestions(s => ({ ...s, [key]: false })), 100)}
        />
      ))}
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      {error && <div className="error">{error}</div>}
    </>
  );
}

export default SpendInputForm;
