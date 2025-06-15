// src/components/SpendInputRow.jsx
import React from "react";
import SpendInputForm from "./SpendInputForm";
import "./SpendInputRow.scss";

function SpendInputRow({ inputRow, onChange, onSave, saving }) {
  return (
    <tr>
      <SpendInputForm
        inputRow={inputRow}
        onChange={onChange}
        onSave={onSave}
        saving={saving}
        as="row"
      />
    </tr>
  );
}

export default SpendInputRow;