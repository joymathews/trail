const {
  sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense,
  sumByFieldForSavings,
  totalSpendsForSavings
} = require('./calculationService');

const { saveSpend, getSpendById, getSpendsByDateRange } = require('./spendDb');

async function dynamoDBSaveSpend(spend) {
    return await saveSpend(spend);
}

async function dynamoDBGetSpendById(id) {
    return await getSpendById(id);
}

async function dynamoDBGetSpendsByDateRange(startDate, endDate) {
    return await getSpendsByDateRange(startDate, endDate);
}


async function dynamoDBSumByFieldForExpenseTypes({ startDate, endDate, field }) {
   return await sumByFieldForExpenseTypes({ startDate, endDate, field });
}

async function dynamoDBSumByFieldForSavings({ startDate, endDate, field }) {
    return await sumByFieldForSavings({ startDate, endDate, field });
}



async function dynamoDBTotalSpendsForExpenseTypes({ startDate, endDate }) {
    return await totalSpendsForExpenseTypes({ startDate, endDate });
}

async function dynamoDBTotalSpendsForSavings({ startDate, endDate }) {
    return await totalSpendsForSavings({ startDate, endDate });
}

async function dynamoDBForecastDynamicExpense({ startDate, endDate }) {
    return await forecastDynamicExpense({ startDate, endDate, onlyExpenses: true });
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