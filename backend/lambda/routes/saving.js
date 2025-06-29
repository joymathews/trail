const express = require('express');
const {
  sumByFieldForSavings,
  totalSpendsForSavings,
  getSpendsByDateRange,
  forecastSaving
} = require('../db/dbInterface');
const { validateDateRange, validateField } = require('../middleware/validation');
const { filterSaving } = require('../services/filterService');


const router = express.Router();



// GET /saving - Get all savings for a date range
router.get('/', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const spends = await getSpendsByDateRange(userId, startDate, endDate);
    // Filter only savings using filterService
    const savings = spends.filter(filterSaving);
    res.json(savings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch savings.', details: err.message });
  }
});

// GET /saving/sum - Sum by a given field for a date range (savings only)
router.get('/sum', validateDateRange, validateField, async (req, res) => {
  try {
    const { startDate, endDate, field } = req.query;
    const userId = req.user.id;
    // Only include spends where SpendType is 'saving'
    const sum = await sumByFieldForSavings({ userId, startDate, endDate, field });
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /saving/total - Sum of all savings for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const total = await totalSpendsForSavings({ userId, startDate, endDate });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});
/**
 * GET /saving/forecast - Forecast savings for a date range given monthly income
 * Expects: startDate, endDate, monthlyIncome as query parameters
 * Returns: { monthlyIncome, totalFixedExpenses, forecastedDynamicSpends, totalSavingsMade, predictedSaving, startDate, endDate }
 */
router.get('/forecast', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate, monthlyIncome } = req.query;
    const userId = req.user.id;
    const income = Number(monthlyIncome);
    if (isNaN(income) || income < 0) {
      return res.status(400).json({ error: 'monthlyIncome must be a positive number.' });
    }
    const result = await forecastSaving({ userId, startDate, endDate, monthlyIncome: income });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to forecast savings.', details: err.message });
  }
});

module.exports = router;
