const express = require('express');
const { sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense,
  getSpendsByDateRange
} = require('../db/dbInterface');
const { validateDateRange, validateField } = require('../middleware/validation');
const { filterExpenseType } = require('../services/filterService');


const router = express.Router();


// GET /expense - Get all expenses (fixed and dynamic) for a date range
router.get('/', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const spends = await getSpendsByDateRange(userId, startDate, endDate);
    // Filter only fixed and dynamic expenses using filterService
    const expenses = spends.filter(filterExpenseType);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses.', details: err.message });
  }
});

// GET /expense/sum - Sum by a given field for a date range (expenses only)
router.get('/sum', validateDateRange, validateField, async (req, res) => {
  try {
    const { startDate, endDate, field } = req.query;
    const userId = req.user.id;
    // Only include spends where SpendType is not 'saving'
    const sum = await sumByFieldForExpenseTypes({ userId, startDate, endDate, field });
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /expense/total - Sum of all expenses (excluding savings) for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const total = await totalSpendsForExpenseTypes({ userId, startDate, endDate });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

// GET /expense/forecast - Forecast expenses for a date range (dynamic only, excluding savings)
router.get('/forecast', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const forecast = await forecastDynamicExpense({ userId, startDate, endDate, onlyExpenses: true });
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate forecast.', details: err.message });
  }
});

module.exports = router;
