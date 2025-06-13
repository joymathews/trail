function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
  next();
}

function validateField(req, res, next) {
  const { field } = req.query;
  const allowedFields = ['Category', 'Vendor', 'PaymentMode', 'ExpenseType'];
  if (!field) {
    return res.status(400).json({ error: 'field is required.' });
  }
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `field must be one of: ${allowedFields.join(', ')}` });
  }
  next();
}

const allowedExpenseTypes = ['fixed', 'dynamic'];

function validateExpenseFields(req, res, next) {
  const { Date, Description, AmountSpent, Category, Vendor, PaymentMode, ExpenseType } = req.body;
  if (!Date || !Description || !AmountSpent || !Category || !Vendor || !PaymentMode || !ExpenseType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const normalizedExpenseType = ExpenseType.toLowerCase();
  if (!allowedExpenseTypes.includes(normalizedExpenseType)) {
    return res.status(400).json({ error: 'ExpenseType must be "fixed" or "dynamic".' });
  }
  req.body.ExpenseType = normalizedExpenseType; // Normalize for downstream use
  next();
}

module.exports = { validateDateRange, validateField, validateExpenseFields };
