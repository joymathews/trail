const express = require('express');
const { saveSpend, getSpendById, getSpendsByDateRange } = require('../db/spendDb');
const { validateSpendFields, validateDateRange } = require('../middleware/validation');

const router = express.Router();

// POST /spends - Store a spend (expense or saving)
router.post('/', validateSpendFields, async (req, res) => {
  const { Date, Description, AmountSpent, Category, Vendor, PaymentMode, SpendType } = req.body;
  const spend = {
    id: `${Date}-${Vendor}-${Math.random().toString(36).slice(2, 11)}`,
    Date,
    Description,
    AmountSpent,
    Category,
    Vendor,
    PaymentMode,
    SpendType, // Already normalized by middleware
  };
  try {
    await saveSpend(spend);
    res.status(201).json({ message: 'Spend stored successfully.', spend });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store spend.', details: err.message });
  }
});

// GET /spends/range - Retrieve all spends for a date range
router.get('/range', validateDateRange, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const spends = await getSpendsByDateRange(startDate, endDate);
    res.json(spends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve spends.', details: err.message });
  }
});

// GET /spends/:id - Retrieve a spend by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const spend = await getSpendById(id);
    if (!spend) {
      return res.status(404).json({ error: 'Spend not found.' });
    }
    res.json(spend);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve spend.', details: err.message });
  }
});

module.exports = router;