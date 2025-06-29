const {
  sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense,
  sumByFieldForSavings,
  totalSpendsForSavings,
  predictSavingForDateRange
} = require('./dynamodb/calculationService');
const { saveSpend, getSpendById, getSpendsByDateRange } = require('./dynamodb/spendDb');
const { addAllDistinctValues, getDistinctValues } = require('./dynamodb/uniqueValuesDB');
const { dynamoHealthCheck } = require('./dynamodb/dynamoHealthCheck');
module.exports = {
  saveSpend,
  getSpendById,
  getSpendsByDateRange,
  sumByFieldForExpenseTypes,
  sumByFieldForSavings,
  totalSpendsForExpenseTypes,
  totalSpendsForSavings,
  forecastDynamicExpense,
  predictSavingForDateRange,
  addAllDistinctValues,
  getDistinctValues,
  dynamoHealthCheck
};