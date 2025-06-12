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

module.exports = { saveExpense, getExpenseById };