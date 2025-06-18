import React from "react";
import SpendInputField from "./SpendInputField";
import { SpendFields } from "../utils/fieldEnums";
import { getSpendInputFields } from '../utils/spendInputFields';
import { useAutocomplete } from '../hooks/useAutocomplete';

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
  const autoFields = [
    SpendFields.CATEGORY,
    SpendFields.DESCRIPTION,
    SpendFields.VENDOR,
    SpendFields.PAYMENT_MODE
  ];
  const {
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    activeSuggestion,
    setActiveSuggestion,
    inputRefs,
    fetchFieldSuggestions,
    handleSuggestionClick,
    handleKeyDown
  } = useAutocomplete(autoFields);

  const handleInputChange = (field, value) => {
    onChange(field, value);
    fetchFieldSuggestions(field, value);
    setShowSuggestions(s => ({ ...s, [field]: true }));
    setActiveSuggestion(a => ({ ...a, [field]: -1 }));
  };

  const fields = getSpendInputFields(inputRow, onChange);

  // Render fields as table row or form
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
              onFocus={(key, value) => value && fetchFieldSuggestions(key, value)}
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
          onFocus={(key, value) => value && fetchFieldSuggestions(key, value)}
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
