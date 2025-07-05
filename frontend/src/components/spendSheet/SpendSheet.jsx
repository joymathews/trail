import React, { useState } from "react";
import DateRangePicker from "../DateRangePicker";
import SpendEditableRow from "./SpendEditableRow";
import { SpendFields } from "../../utils/fieldEnums";
import { spendFieldConfig } from "./spendFieldConfig";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import "./SpendSheet.scss";
import { useSpendInput } from "../../hooks/useSpendInput";
import usePersistentDateRange from '../../hooks/usePersistentDateRange';
function SpendSheet() {
  const [dateRange, setDateRange] = usePersistentDateRange();
  const handleDateChange = setDateRange;
  const {
    inputRow,
    handleInputRowChange,
    handleSaveInputRow,
    saving,
    spends,
    loading,
    fetchError,
    handleDeleteSpend,
    handleEditSpend,
  } = useSpendInput(dateRange.start, dateRange.end);

  // State for editing (row id and field for inline edit)
  const [editing, setEditing] = useState({ id: null, field: null });
  const [editRow, setEditRow] = useState({});

  // Use the API-based autocomplete for all fields that need it
  const autoCompleteFields = spendFieldConfig.filter(f => f.autoComplete).map(f => f.key);
  // Separate autocomplete for add row and edit row (only one edit row at a time)
  const addRowAutocomplete = useAutocomplete(autoCompleteFields);
  const editRowAutocomplete = useAutocomplete(autoCompleteFields);

  // For add row, fetch suggestions on input change
  const handleAddRowInputChange = (key, value) => {
    handleInputRowChange(key, value);
    if (autoCompleteFields.includes(key)) {
      addRowAutocomplete.fetchFieldSuggestions(key, value);
      addRowAutocomplete.setShowSuggestions(s => ({ ...s, [key]: true }));
    }
  };

  // For edit row, fetch suggestions on input change
  const handleEditRowInputChange = (key, value) => {
    setEditRow(r => ({ ...r, [key]: value }));
    if (autoCompleteFields.includes(key)) {
      editRowAutocomplete.fetchFieldSuggestions(key, value);
      editRowAutocomplete.setShowSuggestions(s => ({ ...s, [key]: true }));
    }
  };

  return (
    <div className="spend-sheet-container wide">
      <DateRangePicker
        value={dateRange}
        onChange={handleDateChange}
      />
      <h3>Spends Sheet</h3>
      <div className="spend-table-wrapper">
        <table className="spend-table">
          <thead>
            <tr>
              {spendFieldConfig.map(field => (
                <th key={field.key}>{field.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Add row (uses SpendEditableRow in 'add' mode) */}
            <SpendEditableRow
              rowData={inputRow}
              isEditing={false}
              editingField={null}
              onFieldChange={handleAddRowInputChange}
              onSave={handleSaveInputRow}
              isNew={true}
              saving={saving}
              autocomplete={addRowAutocomplete}
            />
            {/* Existing spends */}
            {spends.length === 0 && !loading && (
              <tr>
                <td colSpan={spendFieldConfig.length + 2} className="center">
                  {dateRange.start && dateRange.end
                    ? "No spends found."
                    : "Please select a start and end date."}
                </td>
              </tr>
            )}
            {spends.map((spend, idx) => {
              const isEditingRow = editing.id === spend.id;
              const rowData = isEditingRow ? { ...spend, ...editRow } : spend;
              return (
                <SpendEditableRow
                  key={spend.id || idx}
                  rowData={rowData}
                  isEditing={isEditingRow}
                  editingField={isEditingRow ? editing.field : null}
                  onFieldEdit={fieldKey => {
                    setEditing({ id: spend.id, field: fieldKey });
                    setEditRow(spend);
                  }}
                  onFieldChange={isEditingRow ? handleEditRowInputChange : undefined}
                  onSave={() => {
                    handleEditSpend(spend.id, spend[SpendFields.DATE], editRow);
                    setEditing({ id: null, field: null });
                    setEditRow({});
                  }}
                  onCancel={() => {
                    setEditing({ id: null, field: null });
                    setEditRow({});
                  }}
                  saving={saving}
                  isNew={false}
                  onDelete={() => handleDeleteSpend(spend.id, spend[SpendFields.DATE])}
                  autocomplete={isEditingRow ? editRowAutocomplete : undefined}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {fetchError && (
        <div className="spend-sheet-error">
          Error fetching spends: {fetchError}
        </div>
      )}
    </div>
  );
}

export default SpendSheet;