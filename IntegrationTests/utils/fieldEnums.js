// Enum for spend fields (should match backend)
const SpendFields = Object.freeze({
  CATEGORY: "category",
  VENDOR: "vendor",
  PAYMENT_MODE: "paymentMode",
  DESCRIPTION: "description",
  DATE: "date",
  AMOUNT_SPENT: "amountSpent",
  SPEND_TYPE: "spendType"
});

module.exports = { SpendFields };
