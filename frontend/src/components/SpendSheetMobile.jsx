import React from "react";
import "./SpendSheetMobile.scss";
import SpendInputForm from "./SpendInputForm";

function SpendSheetMobile({
  inputRow,
  onChange,
  onSave,
  saving,
  error,
}) {
  return (
    <div className="spend-sheet-mobile">
      <h3>Spends Sheet</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave();
        }}
        className="spend-sheet-mobile-form"
      >
        <SpendInputForm
          inputRow={inputRow}
          onChange={onChange}
          onSave={onSave}
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
