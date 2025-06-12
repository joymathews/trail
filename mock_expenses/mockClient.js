// mock_expenses/mockClient.js
// This module provides a utility function to parse CSV lines for expense data

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/expenses'; // Adjust port if needed
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

// Remove the old addExpensesFromCSV call and export parseCSVLine for test reuse
module.exports = { parseCSVLine };
