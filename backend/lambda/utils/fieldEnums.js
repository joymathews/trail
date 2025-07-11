// backend/utils/fieldEnums.js
// Enum-like object for spend fields to ensure consistency and avoid typos

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
