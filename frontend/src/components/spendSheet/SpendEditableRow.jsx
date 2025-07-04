import React from "react";
import SpendInputField from "./SpendInputField";
import { spendFieldConfig } from "./spendFieldConfig";
import useRowEditKeyEvents from "../../hooks/useRowEditKeyEvents";

/**
 * Props:
 * - rowData: object (the spend row or input row)
 * - isEditing: boolean
 * - onFieldChange: (key, value) => void
 * - onSave: () => void
 * - onCancel: () => void
 * - editingField: string (the field currently being edited, for inline edit)
 * - onFieldEdit: (fieldKey) => void (for inline edit)
 * - autocompleteData: { [fieldKey]: { suggestions, showSuggestions, activeSuggestion, handlers... } }
 * - isNew: boolean (if this is the add row)
 */
export default function SpendEditableRow({
  rowData,
  isEditing,
  onFieldChange,
  onSave,
  onCancel,
  editingField,
  onFieldEdit,
  autocomplete = {},
  isNew = false,
  saving,
  onDelete
}) {
  const rowKeyEvents = useRowEditKeyEvents({ isEditing, onCancel, onSave });
  return (
    <tr {...rowKeyEvents}>
      {spendFieldConfig.map(field => (
        <td
          key={field.key}
          onDoubleClick={
            !isNew ? () => onFieldEdit(field.key) : undefined
          }
        >
          {/* Render date as editable only in add row, otherwise as text */}
          {field.type === 'date' ? (
            isNew ? (
              <input
                type="date"
                value={rowData[field.key] || ""}
                onChange={e => onFieldChange(field.key, e.target.value)}
                style={{ minWidth: 120 }}
              />
            ) : (
              rowData[field.key]
            )
          ) : (
            (isNew || (isEditing && editingField === field.key)) ? (
              <SpendInputField
                field={{
                  ...field,
                  value: rowData[field.key] ?? ""
                }}
                as="row"
                // Only pass autocomplete props for fields that are autoComplete
                {...(field.autoComplete ? {
                  suggestions: autocomplete.suggestions ? autocomplete.suggestions[field.key] : [],
                  showSuggestions: autocomplete.showSuggestions ? autocomplete.showSuggestions[field.key] : false,
                  activeSuggestion: autocomplete.activeSuggestion ? autocomplete.activeSuggestion[field.key] : -1,
                  inputRef: autocomplete.inputRefs ? autocomplete.inputRefs[field.key] : undefined,
                  onInputChange: (_key, value) => {
                    onFieldChange(field.key, value);
                    if (autocomplete.fetchFieldSuggestions) autocomplete.fetchFieldSuggestions(field.key, value);
                  },
                  onSuggestionClick: (key, suggestion, onChange) => autocomplete.handleSuggestionClick && autocomplete.handleSuggestionClick(field.key, suggestion, onFieldChange),
                  onKeyDown: (key, e, onChange) => autocomplete.handleKeyDown && autocomplete.handleKeyDown(field.key, e, onFieldChange),
                  onFocus: () => autocomplete.setShowSuggestions && autocomplete.setShowSuggestions(s => ({ ...s, [field.key]: true })),
                  onBlur: () => autocomplete.setShowSuggestions && autocomplete.setShowSuggestions(s => ({ ...s, [field.key]: false })),
                } : {
                  onChange: (_key, value) => onFieldChange(field.key, value)
                })}
              />
            ) : (
              // Always render a span so double-click works even for empty/undefined values
              <span>{rowData[field.key] !== undefined && rowData[field.key] !== null ? rowData[field.key] : ""}</span>
            )
          )}
        </td>
      ))}
      <td>
        {isEditing ? (
          <>
            <button className="save-btn" onClick={onSave} disabled={saving}>Save</button>
            <button className="cancel-btn" onClick={onCancel} disabled={saving}>Cancel</button>
          </>
        ) : isNew ? (
          <button className="save-btn" onClick={onSave} disabled={saving}>Add</button>
        ) : (
          onDelete && <button className="delete-btn" onClick={onDelete} disabled={saving}>Delete</button>
        )}
      </td>
    </tr>
  );
}
