const { SpendFields } = require('../utils/fieldEnums');

function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
  next();
}

function validateField(req, res, next) {
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
    !req.body[SpendFields.DESCRIPTION] ||
    !req.body[SpendFields.AMOUNT_SPENT] ||
    !req.body[SpendFields.CATEGORY] ||
    !req.body[SpendFields.VENDOR] ||
    !req.body[SpendFields.PAYMENT_MODE] ||
    !req.body[SpendFields.SPEND_TYPE]
  ) {
    return res.status(400).json({ error: 'All spend fields are required.' });
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

module.exports = { validateDateRange, validateField, validateSpendFields };
