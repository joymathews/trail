const express = require('express');
const {
  saveSpend,
  getSpendById,
  getSpendsByDateRange,
  addAllDistinctValues
} = require('../db/dbInterface');
const { validateSpendFields, validateDateRange } = require('../middleware/validation');
const { SpendFields } = require('../utils/fieldEnums');


const router = express.Router();



// POST /spends - Store a spend (expense or saving)
router.post('/', validateSpendFields, async (req, res) => {
  try {
    const userId = req.user.id;
    const spend = {
      userId,
      ...req.body
    };
    await saveSpend(spend);
    // Save distinct values for category, vendor, paymentMode, description, spendType
    await addAllDistinctValues(userId, req.body);
    res.status(201).json({ message: 'Spend stored successfully.', spend });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store spend.', details: err.message });
  }
});

// GET /spends - Retrieve all spends for a date range
router.get('/', validateDateRange, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const spends = await getSpendsByDateRange(userId, startDate, endDate);
    res.json(spends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve spends.', details: err.message });
  }
});

// GET /spends/:id - Retrieve a spend by id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query; // Only date is needed from query
    const spend = await getSpendById(userId, req.params.id, date);
    if (!spend) {
      return res.status(404).json({ error: 'Spend not found.' });
    }
    res.json(spend);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve spend.', details: err.message });
  }
});

module.exports = router;