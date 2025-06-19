import { SpendFields } from './fieldEnums';

export function getSpendInputFields(inputRow, onChange) {
  return [
    {
      key: SpendFields.DATE,
      label: "Date",
      type: "date",
      value: inputRow[SpendFields.DATE],
      onChange: e => onChange(SpendFields.DATE, e.target.value),
      required: true
    },
    {
      key: SpendFields.CATEGORY,
      label: "Category",
      type: "text",
      value: inputRow[SpendFields.CATEGORY],
      autoComplete: true,
      required: true
    },
    {
      key: SpendFields.DESCRIPTION,
      label: "Description",
      type: "text",
      value: inputRow[SpendFields.DESCRIPTION],
      autoComplete: true,
      required: true
    },
    {
      key: SpendFields.AMOUNT_SPENT,
      label: "Amount",
      type: "number",
      value: inputRow[SpendFields.AMOUNT_SPENT],
      onChange: e => onChange(SpendFields.AMOUNT_SPENT, e.target.value),
      min: 0,
      step: 0.01,
      required: true
    },
    {
      key: SpendFields.VENDOR,
      label: "Vendor",
      type: "text",
      value: inputRow[SpendFields.VENDOR],
      autoComplete: true
    },
    {
      key: SpendFields.PAYMENT_MODE,
      label: "Payment Mode",
      type: "text",
      value: inputRow[SpendFields.PAYMENT_MODE],
      autoComplete: true
    },
    {
      key: SpendFields.SPEND_TYPE,
      label: "Spend Type",
      type: "select",
      value: inputRow[SpendFields.SPEND_TYPE],
      required: true
    }
  ];
}

export function getNextFieldKey(currentKey) {
  const order = [
    SpendFields.CATEGORY,
    SpendFields.DESCRIPTION,
    SpendFields.AMOUNT_SPENT,
    SpendFields.VENDOR,
    SpendFields.PAYMENT_MODE,
    SpendFields.SPEND_TYPE
  ];
  const idx = order.indexOf(currentKey);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
}
