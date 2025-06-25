// Renamed from expenseDb.js. All logic is the same, but now uses 'spend' terminology.
const { PutCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { TABLE_NAME } = require('../../config');
const { createDynamoDBDocumentClient } = require('./dynamodbFactory');
const { generateSortKey, generateSpendId, generateSpendDateRangeSortKeys } = require('./keyGenerator');
const { SpendFields } = require('../../utils/fieldEnums');

const ddbDocClient = createDynamoDBDocumentClient();

// Save a spend item as per new table design
async function saveSpend({ userId, date, description, amountSpent, category, vendor, paymentMode, spendType }) {
  const id = generateSpendId(date, description);
  const sortKey = generateSortKey({ date, type: 'spend', idOrValue: id });
  const spend = {
    UserId: userId,
    SortKey: sortKey,
    id,
    [SpendFields.DATE]: date,
    [SpendFields.DESCRIPTION]: description,
    [SpendFields.AMOUNT_SPENT]: amountSpent,
    [SpendFields.CATEGORY]: category,
    [SpendFields.VENDOR]: vendor,
    [SpendFields.PAYMENT_MODE]: paymentMode,
    [SpendFields.SPEND_TYPE]: spendType,
    Type: 'spend'
  };
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: spend,
    })
  );
  return spend;
}

// Get a spend by userId and sortKey (id)
async function getSpendById(userId, id, date) {
  const sortKey = generateSortKey({ date, type: 'spend', idOrValue: id });
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { UserId: userId, SortKey: sortKey },
    })
  );
  return result.Item;
}

// Query spends for a user in a date range
async function getSpendsByDateRange(userId, startDate, endDate) {
  const { startSortKey, endSortKey } = generateSpendDateRangeSortKeys(startDate, endDate);
  const result = await ddbDocClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'UserId = :uid AND SortKey BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':uid': userId,
        ':start': startSortKey,
        ':end': endSortKey,
      },
    })
  );
  return result.Items || [];
}

module.exports = { saveSpend, getSpendById, getSpendsByDateRange };
