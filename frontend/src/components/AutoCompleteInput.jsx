import React, { useState, useRef } from "react";
import "./AutoCompleteInput.scss";

/**
 * Generic input with autocomplete dropdown for use in both table row and form.
 * Props:
 * - id, label, value, onChange, placeholder, suggestions, showSuggestions, onSuggestionClick, onFocus, onBlur, onKeyDown, inputRef
 */
function AutoCompleteInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  suggestions = [],
  showSuggestions = false,
  onSuggestionClick,
  onFocus,
  onBlur,
  onKeyDown,
  inputRef,
  autoComplete = "off",
  type = "text",
  activeSuggestion = -1
}) {
  return (
    <div className="autocomplete-wrapper">
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        ref={inputRef}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((s, i) => (
            <li
              key={s}
              className={i === activeSuggestion ? "active" : ""}
              onMouseDown={() => onSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoCompleteInput;
