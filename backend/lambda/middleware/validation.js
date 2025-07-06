// Middleware to validate spend edit (PATCH)
// Middleware to validate spend edit (PATCH)
function validateEditSpend(req, res, next) {
  const { date, updates } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required to edit a spend.' });
  }
  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No updates provided.' });
  }
  // Only allow updates to valid spend fields (case-insensitive, match enum)
  const allowedFields = [
    SpendFields.DATE,
    SpendFields.DESCRIPTION,
    SpendFields.AMOUNT_SPENT,
    SpendFields.CATEGORY,
    SpendFields.VENDOR,
    SpendFields.PAYMENT_MODE,
    SpendFields.SPEND_TYPE
  ];
  for (const key of Object.keys(updates)) {
    // Check for case-insensitive match to allowed fields
    const match = allowedFields.find(f => f.toLowerCase() === key.toLowerCase());
    if (!match) {
      return res.status(400).json({ error: `Invalid spend field in updates: ${key}` });
    }
    // Normalize field name to canonical enum (avoid duplicates with case changes)
    if (key !== match) {
      updates[match] = updates[key];
      delete updates[key];
    }
    // For SpendType, normalize value as well
    if (match === SpendFields.SPEND_TYPE && typeof updates[match] === 'string') {
      const allowedSpendTypes = ['fixed', 'dynamic', 'saving'];
      const normalizedSpendType = updates[match].toLowerCase();
      if (!allowedSpendTypes.includes(normalizedSpendType)) {
        return res.status(400).json({ error: 'SpendType must be "fixed", "dynamic", or "saving".' });
      }
      updates[match] = normalizedSpendType;
    }
  }
  next();
}

// Middleware to validate spend delete (DELETE)
function validateDeleteSpend(req, res, next) {
  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required to delete a spend.' });
  }
  next();
}
const { SpendFields } = require('../utils/fieldEnums');

function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
  next();
}

// Middleware to validate the 'field' query parameter for sum/group-by endpoints
function validateSumFieldQuery(req, res, next) {
  const { field } = req.query;
  const allowedFields = [
    SpendFields.DATE,
    SpendFields.CATEGORY,
    SpendFields.VENDOR,
    SpendFields.PAYMENT_MODE,
    SpendFields.SPEND_TYPE
  ];
  if (!field) {
    return res.status(400).json({ error: 'field is required.' });
  }
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `field must be one of: ${allowedFields.join(', ')}` });
  }
  next();
}

function validateSpendFields(req, res, next) {
  if (
    !req.body[SpendFields.DATE] ||
    !req.body[SpendFields.AMOUNT_SPENT] ||
    !req.body[SpendFields.SPEND_TYPE]
  ) {
    return res.status(400).json({ error: 'DATE, AMOUNT_SPENT, SPEND_TYPE fields are required.' });
  }
  const SpendType = req.body[SpendFields.SPEND_TYPE];
  const allowedSpendTypes = ['fixed', 'dynamic', 'saving'];
  const normalizedSpendType = SpendType.toLowerCase();
  if (!allowedSpendTypes.includes(normalizedSpendType)) {
    return res.status(400).json({ error: 'SpendType must be "fixed", "dynamic", or "saving".' });
  }
  req.body[SpendFields.SPEND_TYPE] = normalizedSpendType; // Normalize for downstream use
  next();
}

module.exports = { validateDateRange, validateSumFieldQuery, validateSpendFields, validateEditSpend, validateDeleteSpend };
