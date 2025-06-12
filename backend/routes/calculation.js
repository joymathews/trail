const express = require('express');
const { getExpenseSumByField } = require('../services/expenseService');

const router = express.Router();

// GET /calculation/sum - Sum by a given field for a date range (grouped by the field)
router.get('/sum', async (req, res) => {
  const { startDate, endDate, field } = req.query;
  const allowedFields = ['Category', 'Vendor', 'PaymentMode', 'ExpenseType'];
  if (!startDate || !endDate || !field) {
    return res.status(400).json({ error: 'startDate, endDate, and field are required.' });
  }
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `field must be one of: ${allowedFields.join(', ')}` });
  }
  try {
    const sumByField = await getExpenseSumByField({ startDate, endDate, field });
    res.json(sumByField);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /calculation/total - Sum of all expenses for a date range
router.get('/total', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
  try {
    // Get all expenses in the date range
    const { getExpensesByDateRange } = require('../services/expenseService');
    const expenses = await getExpensesByDateRange(startDate, endDate);
    // Calculate the total sum
    const total = expenses.reduce((sum, exp) => sum + Number(exp.AmountSpent), 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

// GET /calculation/forecast - Forecast expenses for a date range
router.get('/forecast', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }

  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // Use the lesser of today or endDate for actuals
    const actualEnd = today < endDate ? today : endDate;

    // Get all expenses from startDate to actualEnd
    const { getExpensesByDateRange } = require('../services/expenseService');
    const expenses = await getExpensesByDateRange(startDate, actualEnd);

    // Only include expenses where ExpenseType is 'dynamic'
    const dynamicExpenses = expenses.filter(
      exp => exp.ExpenseType && exp.ExpenseType.toLowerCase() === 'dynamic'
    );

    // Calculate total spent and number of days so far
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

    res.json({
      startDate,
      endDate,
      totalSpent,
      daysSoFar,
      dailyAverage,
      totalDays,
      forecast: Number(forecast.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate forecast.', details: err.message });
  }
});

module.exports = router;
