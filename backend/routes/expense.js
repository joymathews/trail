const express = require('express');
const {
  sumByFieldForExpenseTypes,
  totalSpendsForExpenseTypes,
  forecastDynamicExpense
,
} = require('../services/calculationService');
const { validateDateRange, validateField } = require('../middleware/validation');

const router = express.Router();

// GET /expense/sum - Sum by a given field for a date range (expenses only)
router.get('/sum', validateDateRange, validateField, async (req, res) => {
  try {
    const { startDate, endDate, field } = req.query;
    // Only include spends where SpendType is not 'saving'
    const sum = await sumByFieldForExpenseTypes({ startDate, endDate, field });
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /expense/total - Sum of all expenses (excluding savings) for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await totalSpendsForExpenseTypes({ startDate, endDate});
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

// GET /expense/forecast - Forecast expenses for a date range (dynamic only, excluding savings)
router.get('/forecast', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const forecast = await forecastDynamicExpense({ startDate, endDate, onlyExpenses: true });
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate forecast.', details: err.message });
  }
});

module.exports = router;
