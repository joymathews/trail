// Autocomplete route for Category, Vendor, PaymentMode
const express = require('express');
const db = require('../db/dbInterface');
const { SpendFields } = require('../utils/fieldEnums');


const router = express.Router();


// GET /autocomplete/:field
router.get('/:field', async (req, res) => {
  const { field } = req.params;
  const userId = req.user.id;
  const search = req.query.q || "";
  try {
    let results;
    switch (field) {
      case SpendFields.CATEGORY:
        results = await db.getDistinctValues(userId, SpendFields.CATEGORY, search);
        break;
      case SpendFields.VENDOR:
        results = await db.getDistinctValues(userId, SpendFields.VENDOR, search);
        break;
      case SpendFields.PAYMENT_MODE:
        results = await db.getDistinctValues(userId, SpendFields.PAYMENT_MODE, search);
        break;
      case SpendFields.DESCRIPTION:
        results = await db.getDistinctValues(userId, SpendFields.DESCRIPTION, search);
        break;
      default:
        return res.status(400).json({ error: 'Invalid autocomplete field' });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
