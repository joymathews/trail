const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
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

module.exports = { saveExpense, getExpenseById, getExpensesByDateRange };