import React from "react";
import AutoCompleteInput from "../AutoCompleteInput";
import { SpendFields } from "../../utils/fieldEnums";

/**
 * Renders a single spend input field (input, select, or autocomplete).
 * Props:
 * - field: field config object
 * - as: "form" | "row"
 * - inputRefs, suggestions, showSuggestions, activeSuggestion
 * - onChange, onInputChange, onSuggestionClick, onKeyDown, onFocus, onBlur
 */
function SpendInputField({
  field,
  as = "form",
  inputRef,
  suggestions = [],
  showSuggestions = false,
  activeSuggestion = -1,
  onChange,
  onInputChange,
  onSuggestionClick,
  onKeyDown,
  onFocus,
  onBlur
}) {
  if (field.autoComplete) {
    return (
      <div className={as === "form" ? "form-field" : "table-field"} key={field.key}>
        {as === "form" && <label className="input-label">{field.label}</label>}
        <AutoCompleteInput
          id={`spend-${field.key.toLowerCase()}`}
          label={as === "row" ? field.label : undefined}
          value={field.value}
          inputRef={inputRef}
          onChange={e => onInputChange ? onInputChange(field.key, e.target.value) : onChange ? onChange(field.key, e.target.value) : undefined}
          onFocus={onFocus ? () => onFocus(field.key, field.value) : undefined}
          onBlur={onBlur ? () => onBlur(field.key) : undefined}
          onKeyDown={e => onKeyDown ? onKeyDown(field.key, e, onChange) : undefined}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          activeSuggestion={typeof activeSuggestion === 'number' ? activeSuggestion : -1}
          onSuggestionClick={s => onSuggestionClick ? onSuggestionClick(field.key, s, onChange) : onChange ? onChange(field.key, s) : undefined}
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
          onChange={e => onChange(field.key, e.target.value)}
          required={field.required}
        >
          {/* Remove the generic 'Type' option and default to 'dynamic' */}
          <option value="dynamic">Dynamic</option>
          <option value="fixed">Fixed</option>
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
          onChange={field.onChange ? field.onChange : (onChange ? e => onChange(field.key, e.target.value) : undefined)}
          min={field.min}
          step={field.step}
          required={field.required}
        />
      </div>
    );
  }
}

export default SpendInputField;
