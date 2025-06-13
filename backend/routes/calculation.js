const express = require('express');
const {
  sumByField,
  totalExpenses,
  forecastExpenses,
} = require('../services/calculationService');
const { validateDateRange, validateField } = require('../middleware/validation');

const router = express.Router();

// GET /calculation/sum - Sum by a given field for a date range (grouped by the field)
router.get('/sum', validateDateRange, validateField, async (req, res) => {
  try {
    const { startDate, endDate, field } = req.query;
    const sum = await sumByField({ startDate, endDate, field });
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /calculation/total - Sum of all expenses for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await totalExpenses({ startDate, endDate });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

// GET /calculation/forecast - Forecast expenses for a date range
router.get('/forecast', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const forecast = await forecastExpenses({ startDate, endDate });
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate forecast.', details: err.message });
  }
});

module.exports = router;
