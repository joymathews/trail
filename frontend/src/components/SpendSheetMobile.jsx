import React from "react";
import "./SpendSheetMobile.scss";
import SpendInputForm from "./SpendInputForm";
import { useSpendInput } from "../hooks/useSpendInput";

function SpendSheetMobile() {
  // Use today's date for both start and end, so the form works
  const today = new Date().toISOString().slice(0, 10);
  const {
    inputRow,
    handleInputRowChange,
    handleSaveInputRow,
    saving,
    error,
  } = useSpendInput(today, today);

  return (
    <div className="spend-sheet-mobile">
      <h3>Spends Sheet</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSaveInputRow();
        }}
        className="spend-sheet-mobile-form"
      >
        <SpendInputForm
          inputRow={inputRow}
          onChange={handleInputRowChange}
          onSave={handleSaveInputRow}
          saving={saving}
          as="form"
          error={error}
        />
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default SpendSheetMobile;
