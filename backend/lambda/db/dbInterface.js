const {
  sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense,
  sumByFieldForSavings,
  totalSpendsForSavings
} = require('./dynamodb/calculationService');
const { saveSpend, getSpendById, getSpendsByDateRange } = require('./dynamodb/spendDb');
const { addAllDistinctValues, getDistinctValues } = require('./dynamodb/uniqueValuesDB');

module.exports = {
  saveSpend,
  getSpendById,
  getSpendsByDateRange,
  sumByFieldForExpenseTypes,
  sumByFieldForSavings,
  totalSpendsForExpenseTypes,
  totalSpendsForSavings,
  forecastDynamicExpense,
  addAllDistinctValues,
  getDistinctValues,
};