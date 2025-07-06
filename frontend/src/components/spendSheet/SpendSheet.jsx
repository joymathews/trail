import React, { useState, useMemo } from "react";
import DateRangePicker from "../DateRangePicker";
import SpendEditableRow from "./SpendEditableRow";
import { SpendFields } from "../../utils/fieldEnums";
import { spendFieldConfig } from "./spendFieldConfig";
import "./SpendSheet.scss";
import { useSpendInput } from "../../hooks/useSpendInput";
import usePersistentDateRange from '../../hooks/usePersistentDateRange';
function getDistinctValues(data, key) {
  // Include blanks as a filter option and sort values
  const values = data.map(row => row[key]);
  const nonBlank = Array.from(new Set(values.filter(v => v != null && v !== "")));
  nonBlank.sort((a, b) => String(a).localeCompare(String(b)));
  const hasBlank = values.some(v => v == null || v === "");
  return hasBlank ? [...nonBlank, "(blank)"] : nonBlank;
}

function SpendSheet() {
  const [dateRange, setDateRange] = usePersistentDateRange();
  const handleDateChange = setDateRange;
  const {
    inputRow,
    handleAddRowInputChange,
    handleEditRowInputChange,
    handleSaveInputRowWithDate,
    addRowAutocomplete,
    editRowAutocomplete,
    saving,
    spends,
    loading,
    error,
    fetchError,
    handleDeleteSpend,
    handleEditSpend,
  } = useSpendInput(dateRange.start, dateRange.end);

  // State for editing (row id and field for inline edit)
  const [editing, setEditing] = useState({ id: null, field: null });
  const [editRow, setEditRow] = useState({});
  const [filters, setFilters] = useState({});

  // Memoize distinct values for each field
  const distinctValues = useMemo(() => {
    const result = {};
    for (const field of spendFieldConfig) {
      result[field.key] = getDistinctValues(spends, field.key);
    }
    return result;
  }, [spends]);

  // Memoize filtered spends
  const filteredSpends = useMemo(() =>
    spends.filter(spend =>
      spendFieldConfig.every(field => {
        const filterValue = filters[field.key];
        if (!filterValue) return true;
        if (filterValue === "(blank)") {
          return spend[field.key] == null || spend[field.key] === "";
        }
        return String(spend[field.key] || "") === filterValue;
      })
    ),
    [spends, filters]
  );

  return (
    <div className="spend-sheet-container wide">
      <DateRangePicker
        value={dateRange}
        onChange={handleDateChange}
      />
      <h3>Spends Sheet</h3>
      {/* Show error message if present */}
      {error && (
        <div className="spend-sheet-error">
          {error}
        </div>
      )}
      <div className="spend-table-wrapper">
        <table className="spend-table">
          <thead>
            <tr>
              {spendFieldConfig.map(field => (
                <th key={field.key}>{field.label}</th>
              ))}
              <th></th>
            </tr>
            <tr>
              {spendFieldConfig.map(field => (
                <th key={field.key}>
                  <label htmlFor={`filter-${field.key}`} className="visually-hidden">
                    Filter by {field.label}
                  </label>
                  <select
                    id={`filter-${field.key}`}
                    aria-label={`Filter by ${field.label}`}
                    value={filters[field.key] || ""}
                    onChange={e => setFilters(f => ({ ...f, [field.key]: e.target.value }))}
                  >
                    <option value="">All</option>
                    {distinctValues[field.key].map(val => (
                      <option key={val} value={val}>{val === "(blank)" ? "(blank)" : val}</option>
                    ))}
                  </select>
                </th>
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
              onSave={handleSaveInputRowWithDate}
              isNew={true}
              saving={saving}
              autocomplete={addRowAutocomplete}
            />
            {/* Existing spends */}
            {filteredSpends.length === 0 && !loading && (
              <tr>
                <td colSpan={spendFieldConfig.length + 2} className="center">
                  {dateRange.start && dateRange.end
                    ? "No spends found."
                    : "Please select a start and end date."}
                </td>
              </tr>
            )}
            {filteredSpends.map((spend, idx) => {
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
                  onFieldChange={isEditingRow ? (key, value) => handleEditRowInputChange(key, value, setEditRow) : undefined}
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