// Autocomplete route for Category, Vendor, PaymentMode, Description
const express = require('express');
const router = express.Router();
const db = require('../db/dbInterface');
const { SpendFields } = require('../utils/fieldEnums');

// GET /autocomplete/:field?q=searchText
router.get('/:field', async (req, res) => {
  const { field } = req.params;
  const { q } = req.query;
  try {
    let results;
    switch (field) {
      case SpendFields.CATEGORY:
        results = await db.getCategorySuggestions(q);
        break;
      case SpendFields.VENDOR:
        results = await db.getVendorSuggestions(q);
        break;
      case SpendFields.PAYMENT_MODE:
        results = await db.getPaymentModeSuggestions(q);
        break;
      case SpendFields.DESCRIPTION:
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
