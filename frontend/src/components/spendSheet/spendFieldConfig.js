import { SpendFields } from "../../utils/fieldEnums";

export const spendFieldConfig = [
  { key: SpendFields.CATEGORY, label: "Category", type: "text", autoComplete: true },
  { key: SpendFields.DESCRIPTION, label: "Description", type: "text", autoComplete: true },
  { key: SpendFields.AMOUNT_SPENT, label: "Amount", type: "number" },
  { key: SpendFields.VENDOR, label: "Vendor", type: "text", autoComplete: true },
  { key: SpendFields.PAYMENT_MODE, label: "Payment Mode", type: "text", autoComplete: true },
  { key: SpendFields.SPEND_TYPE, label: "Spend Type", type: "select", options: [
    { value: "fixed", label: "Fixed" },
    { value: "dynamic", label: "Dynamic" },
    { value: "saving", label: "Saving" },
  ] },
];
