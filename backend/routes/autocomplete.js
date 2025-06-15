// Autocomplete route for Category, Vendor, PaymentMode, Description
const express = require('express');
const router = express.Router();
const db = require('../db/dbInterface');

// GET /autocomplete/:field?q=searchText
router.get('/:field', async (req, res) => {
  const { field } = req.params;
  const { q } = req.query;
  try {
    let results;
    switch (field) {
      case 'category':
        results = await db.getCategorySuggestions(q);
        break;
      case 'vendor':
        results = await db.getVendorSuggestions(q);
        break;
      case 'paymentMode':
        results = await db.getPaymentModeSuggestions(q);
        break;
      case 'description':
        results = await db.getDescriptionSuggestions(q);
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
