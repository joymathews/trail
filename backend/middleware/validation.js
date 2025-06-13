function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
  next();
}

function validateField(req, res, next) {
  const { field } = req.query;
  const allowedFields = ['Category', 'Vendor', 'PaymentMode', 'SpendType'];
  if (!field) {
    return res.status(400).json({ error: 'field is required.' });
  }
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `field must be one of: ${allowedFields.join(', ')}` });
  }
  next();
}

const allowedSpendTypes = ['fixed', 'dynamic', 'saving'];

function validateSpendFields(req, res, next) {
  const { Date, Description, AmountSpent, Category, Vendor, PaymentMode, SpendType } = req.body;
  if (!Date || !Description || !AmountSpent || !Category || !Vendor || !PaymentMode || !SpendType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const normalizedSpendType = SpendType.toLowerCase();
  if (!allowedSpendTypes.includes(normalizedSpendType)) {
    return res.status(400).json({ error: 'SpendType must be "fixed", "dynamic", or "saving".' });
  }
  req.body.SpendType = normalizedSpendType; // Normalize for downstream use
  next();
}

module.exports = { validateDateRange, validateField, validateSpendFields };
