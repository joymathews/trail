// mock_expenses/mockClient.js
// This script will add multiple mock expenses to the backend API

const axios = require('axios');

const API_URL = 'http://localhost:3001/expenses'; // Adjust port if needed

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health'];
const vendors = ['Amazon', 'Uber', 'Walmart', 'Netflix', 'CVS'];
const paymentModes = ['CreditCard', 'Cash', 'DebitCard', 'UPI'];
const expenseTypes = ['fixed', 'dynamic'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().slice(0, 10);
}

async function addMockExpenses(count = 50) {
  for (let i = 0; i < count; i++) {
    const expense = {
      Date: getRandomDate(new Date('2025-06-01'), new Date('2025-06-12')),
      Description: `Mock expense ${i + 1}`,
      AmountSpent: (Math.random() * 100 + 1).toFixed(2),
      Category: getRandomItem(categories),
      Vendor: getRandomItem(vendors),
      PaymentMode: getRandomItem(paymentModes),
      ExpenseType: getRandomItem(expenseTypes),
    };
    try {
      const res = await axios.post(API_URL, expense);
      console.log(`Added:`, res.data.expense);
    } catch (err) {
      console.error('Failed to add expense:', err.response ? err.response.data : err.message);
    }
  }
}

addMockExpenses(50); // Add 50 mock expenses
