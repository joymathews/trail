const { PutCommand, GetCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { TABLE_NAME } = require('../config');
const { createDynamoDBDocumentClient } = require('../awsFactory');

const ddbDocClient = createDynamoDBDocumentClient();

async function saveExpense(expense) {
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: expense,
    })
  );
}

async function getExpenseById(id) {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return result.Item;
}


/**
 * Get the sum of expenses for a time period, grouped by a specific field.
 * @param {Object} params
 * @param {string} params.startDate - Inclusive start date (YYYY-MM-DD)
 * @param {string} params.endDate - Inclusive end date (YYYY-MM-DD)
 * @param {string} params.field - The field to group by (Category, Vendor, PaymentMode, ExpenseType)
 * @returns {Promise<Object>} An object with keys as field values and values as the sum
 */
async function getExpenseSumByField({ startDate, endDate, field }) {
  const result = await ddbDocClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  let items = result.Items || [];
  items = items.filter(item => item.Date >= startDate && item.Date <= endDate);
  const sumByField = {};
  for (const item of items) {
    const key = item[field];
    if (!key) continue;
    sumByField[key] = (sumByField[key] || 0) + Number(item.AmountSpent);
  }
  return sumByField;
}

/**
 * Get all expenses for a date range.
 * @param {string} startDate - Inclusive start date (YYYY-MM-DD)
 * @param {string} endDate - Inclusive end date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of expense objects
 */
async function getExpensesByDateRange(startDate, endDate) {
  const result = await ddbDocClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  let items = result.Items || [];
  return items.filter(item => item.Date >= startDate && item.Date <= endDate);
}

module.exports = { saveExpense, getExpenseById, getExpenseSumByField, getExpensesByDateRange };