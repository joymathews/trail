// mock_expenses/mockClient.js
// This module provides a utility function to parse CSV lines for expense data

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/spends'; // Adjust port if needed
const csvFilePath = path.join(__dirname, 'mock_data.csv');

function parseCSVLine(line) {
  // Handles quoted fields and commas inside quotes
  const regex = /(?:"([^"]*)")|([^,]+)/g;
  const result = [];
  let match;
  while ((match = regex.exec(line))) {
    result.push(match[1] || match[2]);
  }
  return result;
}

// Add all expenses from CSV to backend
async function addExpensesFromCSV() {
  const data = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = data.split(/\r?\n/).filter(Boolean);
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 6) continue;
    const [Date, Description, AmountSpent, Category, Vendor, PaymentMode, SpendType] = row;
    const expense = {
      Date: Date.replace(/\//g, '-').replace(/(\d{2})-(\w{3})-(\d{2})/, (m, d, mth, y) => {
        const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
        return `20${y}-${months[mth]}-${d}`;
      }),
      Description: Description.trim(),
      AmountSpent: Number(AmountSpent),
      Category: Category.trim(),
      Vendor: Vendor.trim(),
      PaymentMode: PaymentMode.trim(),
      SpendType: SpendType ? SpendType.trim().toLowerCase() : 'dynamic',
    };
    try {
      const res = await axios.post(API_URL, expense);
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

module.exports = { parseCSVLine };
