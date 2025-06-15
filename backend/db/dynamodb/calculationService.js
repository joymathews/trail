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

async function sumByFieldForExpenseTypes({ startDate, endDate, field }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
  return sumByFieldWithFilter(
    spends,
    field,
    filterExpenseType
  );
}

async function sumByFieldForSavings({ startDate, endDate, field }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
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

async function totalSpendsForExpenseTypes({ startDate, endDate }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
  return totalSpendsWithFilter(
    spends,
    filterExpenseType
  );
}

async function totalSpendsForSavings({ startDate, endDate }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
  return totalSpendsWithFilter(
    spends,
    filterSaving
  );
}

async function forecastDynamicExpense({ startDate, endDate }) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const actualEnd = today < endDate ? today : endDate;
  const spends = await getSpendsByDateRange(startDate, actualEnd);
  // Only include spends where SpendType is 'dynamic'
  const dynamicSpends = spends.filter(filterDynamic);
  const totalSpent = dynamicSpends.reduce((sum, s) => sum + Number(s[SpendFields.AMOUNT_SPENT]), 0);
  // Calculate days so far (inclusive)
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
  return {
    forecast: dailyAverage * totalDays,
    startDate,
    endDate,
    dailyAverage,
    daysSoFar,
    totalDays,
    totalSpent,
  };
}

module.exports = { 
    sumByFieldForExpenseTypes,
    sumByFieldForSavings,
    totalSpendsForExpenseTypes,
    totalSpendsForSavings,
    forecastDynamicExpense
};
