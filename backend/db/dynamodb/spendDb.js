// Renamed from expenseDb.js. All logic is the same, but now uses 'spend' terminology.
const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { TABLE_NAME } = require('../../config');
const { createDynamoDBDocumentClient } = require('./dynamodbFactory');
const { SpendFields } = require('../../utils/fieldEnums');

const ddbDocClient = createDynamoDBDocumentClient();

async function saveSpend(spend) {
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: spend,
    })
  );
}

async function getSpendById(id) {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return result.Item;
}

async function getSpendsByDateRange(startDate, endDate) {
  const result = await ddbDocClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );
  let items = result.Items || [];
  return items.filter(item => item[SpendFields.DATE] >= startDate && item[SpendFields.DATE] <= endDate);
}

module.exports = { saveSpend, getSpendById, getSpendsByDateRange };
