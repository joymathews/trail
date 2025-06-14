const {
  sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense,
  sumByFieldForSavings,
  totalSpendsForSavings
} = require('./calculationService');

const { saveSpend, getSpendById, getSpendsByDateRange } = require('./spendDb');

function dynamoDBSaveSpend(spend) {
    return saveSpend(spend);
}

function dynamoDBGetSpendById(id) {
    return getSpendById(id);
}

function dynamoDBGetSpendsByDateRange(startDate, endDate) {
    return getSpendsByDateRange(startDate, endDate);
}

function dynamoDBSumByFieldForExpenseTypes({ startDate, endDate, field }) {
   return sumByFieldForExpenseTypes({ startDate, endDate, field });
}

function dynamoDBSumByFieldForSavings({ startDate, endDate, field }) {
    return sumByFieldForSavings({ startDate, endDate, field });
}

function dynamoDBTotalSpendsForExpenseTypes({ startDate, endDate }) {
    return totalSpendsForExpenseTypes({ startDate, endDate });
}

function dynamoDBTotalSpendsForSavings({ startDate, endDate }) {
    return totalSpendsForSavings({ startDate, endDate });
}

function dynamoDBForecastDynamicExpense({ startDate, endDate }) {
    return forecastDynamicExpense({ startDate, endDate, onlyExpenses: true });
}

module.exports = { 
    dynamoDBSumByFieldForExpenseTypes,
    dynamoDBSumByFieldForSavings,
    dynamoDBTotalSpendsForExpenseTypes,
    dynamoDBTotalSpendsForSavings,
    dynamoDBForecastDynamicExpense,
    dynamoDBSaveSpend,
    dynamoDBGetSpendById,
    dynamoDBGetSpendsByDateRange
};