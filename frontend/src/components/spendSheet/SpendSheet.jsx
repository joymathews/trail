import React, { useState } from "react";
import DateRangePicker from "../DateRangePicker";
import SpendInputRow from "./SpendInputRow";
import { SpendFields } from "../../utils/fieldEnums";
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
    error,
    spends,
    loading,
    fetchError,
    handleDeleteSpend,
    handleEditSpend,
  } = useSpendInput(dateRange.start, dateRange.end);

  // State for editing
  const [editing, setEditing] = useState({ id: null, field: null });
  const [editValue, setEditValue] = useState("");

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
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Vendor</th>
              <th>Payment Mode</th>
              <th>Spend Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <SpendInputRow
              inputRow={inputRow}
              onChange={handleInputRowChange}
              onSave={handleSaveInputRow}
              saving={saving}
            />
            {/* Existing spends */}
            {spends.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="center">
                  {dateRange.start && dateRange.end
                    ? "No spends found."
                    : "Please select a start and end date."}
                </td>
              </tr>
            )}
            {spends.map((spend, idx) => (
              <tr key={spend.id || idx}>
                <td>{spend[SpendFields.DATE]}</td>
                {/* CATEGORY */}
                <td
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.CATEGORY });
                    setEditValue(spend[SpendFields.CATEGORY] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.CATEGORY ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.CATEGORY]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.CATEGORY]
                  )}
                </td>
                {/* DESCRIPTION */}
                <td
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.DESCRIPTION });
                    setEditValue(spend[SpendFields.DESCRIPTION] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.DESCRIPTION ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.DESCRIPTION]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.DESCRIPTION]
                  )}
                </td>
                {/* AMOUNT */}
                <td
                  className="right"
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.AMOUNT_SPENT });
                    setEditValue(spend[SpendFields.AMOUNT_SPENT] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.AMOUNT_SPENT ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.AMOUNT_SPENT]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.AMOUNT_SPENT]
                  )}
                </td>
                {/* VENDOR */}
                <td
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.VENDOR });
                    setEditValue(spend[SpendFields.VENDOR] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.VENDOR ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.VENDOR]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.VENDOR]
                  )}
                </td>
                {/* PAYMENT MODE */}
                <td
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.PAYMENT_MODE });
                    setEditValue(spend[SpendFields.PAYMENT_MODE] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.PAYMENT_MODE ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.PAYMENT_MODE]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.PAYMENT_MODE]
                  )}
                </td>
                {/* SPEND TYPE */}
                <td
                  onDoubleClick={() => {
                    setEditing({ id: spend.id, field: SpendFields.SPEND_TYPE });
                    setEditValue(spend[SpendFields.SPEND_TYPE] || "");
                  }}
                >
                  {editing.id === spend.id && editing.field === SpendFields.SPEND_TYPE ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => setEditing({ id: null, field: null })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleEditSpend(spend.id, spend[SpendFields.DATE], { [SpendFields.SPEND_TYPE]: editValue });
                          setEditing({ id: null, field: null });
                        } else if (e.key === 'Escape') {
                          setEditing({ id: null, field: null });
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    spend[SpendFields.SPEND_TYPE]
                  )}
                </td>
                <td>
                  {editing.id === spend.id ? (
                    <button
                      className="save-btn"
                      title="Save"
                      onClick={() => {
                        if (editing.field && editValue !== undefined) {
                          handleEditSpend(
                            spend.id,
                            spend[SpendFields.DATE],
                            { [editing.field]: editValue }
                          );
                        }
                        setEditing({ id: null, field: null });
                      }}
                    >
                      Save
                    </button>
                  ) : null}
                  <button
                    className="delete-btn"
                    title="Delete spend"
                    onClick={() => handleDeleteSpend(spend.id, spend[SpendFields.DATE])}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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