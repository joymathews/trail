const { getSpendsByDateRange } = require('./spendDb');
const { filterExpenseType, filterSaving, filterDynamic } = require('../../services/filterService');
const { SpendFields } = require('../../utils/fieldEnums');

function sumByFieldWithFilter(spends, field, filterFn) {
  const sumByField = {};
  for (const item of spends) {
    if (!filterFn(item)) continue;
    const key = item[field];
    if (!key) continue;
    sumByField[key] = (sumByField[key] || 0) + Number(item[SpendFields.AMOUNT_SPENT]);
  }
  return sumByField;
}

async function sumByFieldForExpenseTypes({ userId, startDate, endDate, field }) {
  const spends = await getSpendsByDateRange(userId, startDate, endDate);
  return sumByFieldWithFilter(
    spends,
    field,
    filterExpenseType
  );
}

async function sumByFieldForSavings({ userId, startDate, endDate, field }) {
  const spends = await getSpendsByDateRange(userId, startDate, endDate);
  return sumByFieldWithFilter(
    spends,
    field,
    filterSaving
  );
}

function totalSpendsWithFilter(spends, filterFn) {
  return spends
    .filter(filterFn)
    .reduce((sum, s) => sum + Number(s[SpendFields.AMOUNT_SPENT]), 0);
}

async function totalSpendsForExpenseTypes({ userId, startDate, endDate }) {
  const spends = await getSpendsByDateRange(userId, startDate, endDate);
  return totalSpendsWithFilter(
    spends,
    filterExpenseType
  );
}

async function totalSpendsForSavings({ userId, startDate, endDate }) {
  const spends = await getSpendsByDateRange(userId, startDate, endDate);
  return totalSpendsWithFilter(
    spends,
    filterSaving
  );
}


function calculateForecastFromSpends(spends, startDate, endDate) {
  // Only include spends where SpendType is 'dynamic'
  const dynamicSpends = spends.filter(filterDynamic);
  const totalSpent = dynamicSpends.reduce((sum, s) => sum + Number(s[SpendFields.AMOUNT_SPENT]), 0);
  // Calculate days so far (inclusive)
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const actualEnd = today < endDate ? today : endDate;
  const daysSoFar = Math.max(
    1,
    Math.ceil(
      (new Date(actualEnd) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
    )
  );
  const dailyAverage = totalSpent / daysSoFar;
  // Calculate total days in the range (inclusive)
  const totalDays = Math.max(
    1,
    Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
    )
  );
  const remainingDays = Math.max(0, totalDays - daysSoFar);
  return {
    forecast: dailyAverage * totalDays,
    startDate,
    endDate,
    dailyAverage,
    daysSoFar,
    totalDays,
    totalSpent,
    remainingDays,
  };
}

async function forecastDynamicExpense({ userId, startDate, endDate }) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const actualEnd = today < endDate ? today : endDate;
  const spends = await getSpendsByDateRange(userId, startDate, actualEnd);
  return calculateForecastFromSpends(spends, startDate, endDate);
}

/**
 * Predicts savings for a date range.
 * Calculation:
 *   predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends) + totalSavings
 * Returns all values used in the calculation for clarity.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @param {number} params.monthlyIncome
 */
async function predictSavingForDateRange({ userId, startDate, endDate, monthlyIncome }) {
  // Get all spends in the range
  const spends = await getSpendsByDateRange(userId, startDate, endDate);
  // Total fixed expenses
  const fixedSpends = spends.filter(s => s[SpendFields.SPEND_TYPE] && s[SpendFields.SPEND_TYPE].toLowerCase() === 'fixed');
  const totalFixedExpenses = fixedSpends.reduce((sum, s) => sum + Number(s[SpendFields.AMOUNT_SPENT]), 0);
  // Forecast dynamic spends
  const forecastResult = calculateForecastFromSpends(spends, startDate, endDate);
  const forecastedDynamicSpends = forecastResult.forecast;
  // Total savings made in the range
  const savingsSpends = spends.filter(s => s[SpendFields.SPEND_TYPE] && s[SpendFields.SPEND_TYPE].toLowerCase() === 'saving');
  const totalSavingsMade = savingsSpends.reduce((sum, s) => sum + Number(s[SpendFields.AMOUNT_SPENT]), 0);
  // Calculate remaining unallocated balance after all expenses and savings which is the predicted saving
  const predictedSaving = monthlyIncome - (totalFixedExpenses + forecastedDynamicSpends + totalSavingsMade);
  return {
    monthlyIncome,
    totalFixedExpenses,
    forecastedDynamicSpends,
    totalSavingsMade,
    predictedSaving, 
    startDate,
    endDate
  };
}

module.exports = { 
    sumByFieldForExpenseTypes,
    sumByFieldForSavings,
    totalSpendsForExpenseTypes,
    totalSpendsForSavings,
    forecastDynamicExpense,
    predictSavingForDateRange
};
