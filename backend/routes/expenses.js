const express = require('express');
const { saveExpense, getExpenseById, getExpensesByDateRange } = require('../services/expenseService');

const router = express.Router();

const allowedExpenseTypes = ['fixed', 'dynamic'];

// POST /expenses - Store an expense
router.post('/', async (req, res) => {
  const { Date, Description, AmountSpent, Category, Vendor, PaymentMode, ExpenseType } = req.body;

  if (!Date || !Description || !AmountSpent || !Category || !Vendor || !PaymentMode || !ExpenseType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const normalizedExpenseType = ExpenseType.toLowerCase();

  if (!allowedExpenseTypes.includes(normalizedExpenseType)) {
    return res.status(400).json({ error: 'ExpenseType must be "fixed" or "dynamic".' });
  }

  const expense = {
    id: `${Date}-${Vendor}-${Math.random().toString(36).slice(2, 11)}`,
    Date,
    Description,
    AmountSpent,
    Category,
    Vendor,
    PaymentMode,
    ExpenseType: normalizedExpenseType,
  };

  try {
    await saveExpense(expense);
    res.status(201).json({ message: 'Expense stored successfully.', expense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store expense.', details: err.message });
  }
});

// GET /expenses/range - Retrieve all expenses for a date range
router.get('/range', async (req, res) => {
  console.log('Received request for expenses in range');
  console.log('Query parameters:', req.query);
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }
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