const { getSpendsByDateRange } = require('../db/spendDb');

async function sumByField({ startDate, endDate, field }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
  const sumByField = {};
  for (const item of spends) {
    const key = item[field];
    if (!key) continue;
    sumByField[key] = (sumByField[key] || 0) + Number(item.AmountSpent);
  }
  return sumByField;
}

async function totalSpends({ startDate, endDate }) {
  const spends = await getSpendsByDateRange(startDate, endDate);
  // Only include spends that are not savings
  return spends.filter(s => s.SpendType !== 'saving').reduce((sum, s) => sum + Number(s.AmountSpent), 0);
}

async function forecastDynamicExpense({ startDate, endDate }) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const actualEnd = today < endDate ? today : endDate;
  const spends = await getSpendsByDateRange(startDate, actualEnd);
  // Only include spends where SpendType is 'dynamic'
  const dynamicSpends = spends.filter(
    s => s.SpendType && s.SpendType.toLowerCase() === 'dynamic'
  );
  const totalSpent = dynamicSpends.reduce((sum, s) => sum + Number(s.AmountSpent), 0);
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

module.exports = { sumByField, totalSpends, forecastSpends: forecastDynamicExpense };
