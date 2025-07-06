import React, { useState } from "react";
import "./SpendSheetMobile.scss";
import SpendInputForm from "./spendSheet/SpendInputForm";
import { useSpendInput } from "../hooks/useSpendInput";

function SpendSheetMobile() {
  // Use today's date for both start and end, so the form works
  const today = new Date().toISOString().slice(0, 10);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    inputRow,
    handleInputRowChange,
    handleSaveInputRowWithDate,
    saving,
    error,
  } = useSpendInput(today, today);

  return (
    <div className="spend-sheet-mobile">
      <h3>Spends Sheet</h3>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setSuccessMessage("");
          await handleSaveInputRowWithDate();
          if (!error) {
            setSuccessMessage("Spend added successfully!");
            setTimeout(() => setSuccessMessage(""), 2000);
          }
        }}
        className="spend-sheet-mobile-form"
      >
        <SpendInputForm
          inputRow={inputRow}
          onChange={handleInputRowChange}
          onSave={handleSaveInputRowWithDate}
          saving={saving}
          as="form"
          error={error}
        />
      </form>
      {error && <div className="error">{error}</div>}
      {successMessage && !error && (
        <div className="success" style={{ color: 'green', marginTop: 8 }}>{successMessage}</div>
      )}
    </div>
  );
}

export default SpendSheetMobile;
