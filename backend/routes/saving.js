const express = require('express');
const {
  sumByFieldForSavings,
  totalSpendsForSavings,
} = require('../services/calculationService');
const { validateDateRange, validateField } = require('../middleware/validation');

const router = express.Router();

// GET /saving/sum - Sum by a given field for a date range (savings only)
router.get('/sum', validateDateRange, validateField, async (req, res) => {
  try {
    const { startDate, endDate, field } = req.query;
    // Only include spends where SpendType is 'saving'
    const sum = await sumByFieldForSavings({ startDate, endDate, field});
    res.json(sum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate sum.', details: err.message });
  }
});

// GET /saving/total - Sum of all savings for a date range
router.get('/total', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await totalSpendsForSavings({ startDate, endDate});
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate total sum.', details: err.message });
  }
});

module.exports = router;
