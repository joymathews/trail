import React from 'react';
import { SpendFields } from '../utils/fieldEnums';
import './SpendFieldSelect.scss';

const spendFieldOptions = [
  { value: SpendFields.DATE, label: 'Date' },
  { value: SpendFields.CATEGORY, label: 'Category' },
  { value: SpendFields.VENDOR, label: 'Vendor' },
  { value: SpendFields.PAYMENT_MODE, label: 'Payment Mode' },
  { value: SpendFields.SPEND_TYPE, label: 'Spend Type' },
];

const SpendFieldSelect = ({ value, onChange }) => (
  <div className="spend-field-select-wrapper">
    <label htmlFor="spend-field-select">Field</label>
    <select
      id="spend-field-select"
      className="spend-field-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {spendFieldOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default SpendFieldSelect;
