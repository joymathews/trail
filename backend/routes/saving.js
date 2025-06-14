const express = require('express');
const {
  sumByFieldForSavings,
  totalSpendsForSavings,
  getSpendsByDateRange
} = require('../db/dbInterface');
const { validateDateRange, validateField } = require('../middleware/validation');
const { filterSaving } = require('../services/filterService');

const router = express.Router();

// GET /saving - Get all savings for a date range
router.get('/', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const spends = await getSpendsByDateRange(startDate, endDate);
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
    // Only include spends where SpendType is 'saving'
    const sum = await sumByFieldForSavings({ startDate, endDate, field });
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /saving/total - Sum of all savings for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await totalSpendsForSavings({ startDate, endDate });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

module.exports = router;
