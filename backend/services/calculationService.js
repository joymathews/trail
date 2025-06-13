const { getExpensesByDateRange } = require('./expenseService');

async function sumByField({ startDate, endDate, field }) {
  const expenses = await getExpensesByDateRange(startDate, endDate);
  const sumByField = {};
  for (const item of expenses) {
    const key = item[field];
    if (!key) continue;
    sumByField[key] = (sumByField[key] || 0) + Number(item.AmountSpent);
  }
  return sumByField;
}

async function totalExpenses({ startDate, endDate }) {
  const expenses = await getExpensesByDateRange(startDate, endDate);
  return expenses.reduce((sum, exp) => sum + Number(exp.AmountSpent), 0);
}

async function forecastExpenses({ startDate, endDate }) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const actualEnd = today < endDate ? today : endDate;
  const expenses = await getExpensesByDateRange(startDate, actualEnd);
  // Only include expenses where ExpenseType is 'dynamic'
  const dynamicExpenses = expenses.filter(
    exp => exp.ExpenseType && exp.ExpenseType.toLowerCase() === 'dynamic'
  );
  const totalSpent = dynamicExpenses.reduce((sum, exp) => sum + Number(exp.AmountSpent), 0);
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
  // Forecast = dailyAverage * totalDays
  const forecast = dailyAverage * totalDays;
  return {
    startDate,
    endDate,
    totalSpent,
    daysSoFar,
    dailyAverage,
    totalDays,
    forecast: Number(forecast.toFixed(2))
  };
}

module.exports = {
  sumByField,
  totalExpenses,
  forecastExpenses,
};
