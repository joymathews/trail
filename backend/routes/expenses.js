const express = require('express');
const { saveExpense, getExpenseById, getExpensesByDateRange } = require('../services/expenseService');
const { validateExpenseFields, validateDateRange } = require('../middleware/validation');

const router = express.Router();

// POST /expenses - Store an expense
router.post('/', validateExpenseFields, async (req, res) => {
  const { Date, Description, AmountSpent, Category, Vendor, PaymentMode, ExpenseType } = req.body;
  const expense = {
    id: `${Date}-${Vendor}-${Math.random().toString(36).slice(2, 11)}`,
    Date,
    Description,
    AmountSpent,
    Category,
    Vendor,
    PaymentMode,
    ExpenseType, // Already normalized by middleware
  };
  try {
    await saveExpense(expense);
    res.status(201).json({ message: 'Expense stored successfully.', expense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store expense.', details: err.message });
  }
});

// GET /expenses/range - Retrieve all expenses for a date range
router.get('/range', validateDateRange, async (req, res) => {
  console.log('Received request for expenses in range');
  console.log('Query parameters:', req.query);
  const { startDate, endDate } = req.query;
  try {
    const expenses = await getExpensesByDateRange(startDate, endDate);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve expenses.', details: err.message });
  }
});

// GET /expenses/:id - Retrieve an expense by id
router.get('/:id', async (req, res) => {
  console.log('Received request for expense by ID');
  console.log('Request parameters:', req.params);
  const { id } = req.params;
  try {
    const expense = await getExpenseById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve expense.', details: err.message });
  }
});

module.exports = router;