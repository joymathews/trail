// mock_expenses/mockClient.js
// This module provides a utility function to parse CSV lines for expense data

require('dotenv').config();
const axios = require('axios');
const { getSpends } = require('./testData/spends');

const API_URL = 'http://localhost:3001/spends'; // Adjust port if needed
const TOKEN = process.env.JWT_TOKEN;
const ADD_TOKEN = process.env.MOCK_ACTUAL_USER === 'true';
// Add all expenses from CSV to backend using getSpends()
async function addExpensesFromCSV() {
  const spends = getSpends();
  for (const expense of spends) {
    try {
      let headers = {};
      if(ADD_TOKEN)
      {
        headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
      }
      const res = await axios.post(API_URL, expense, { headers });
      console.log('Added:', res.data.spend);
    } catch (err) {
      console.error('Failed to add expense:', err.response ? err.response.data : err.message);
    }
  }
}

// If run directly, add data from CSV
if (require.main === module) {
  addExpensesFromCSV();
}
