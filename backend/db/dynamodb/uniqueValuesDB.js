const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { TABLE_NAME } = require('../../config');
const { createDynamoDBDocumentClient } = require('./dynamodbFactory');
const { generateSortKey, generateUniqueValueId, generateUniqueValueSortKeyPrefix } = require('./keyGenerator');
const { SpendFields } = require('../../utils/fieldEnums');

const ddbDocClient = createDynamoDBDocumentClient();

// Add a distinct value (e.g., category, vendor, etc.) for a user
async function addDistinctValue(userId, type, value) {
  const id = generateUniqueValueId(type, value);
  const sortKey = generateSortKey({ type, idOrValue: value });
  const item = {
    UserId: userId,
    SortKey: sortKey,
    id,
    Type: type,
    Value: value
  };
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );
  return item;
}

// Add unique values for category, vendor, paymentMode, description
async function addAllDistinctValues(userId, values) {
  const results = [];
  if (values[SpendFields.CATEGORY]) {
    results.push(await addDistinctValue(userId, SpendFields.CATEGORY, values[SpendFields.CATEGORY]));
  }
  if (values[SpendFields.VENDOR]) {
    results.push(await addDistinctValue(userId, SpendFields.VENDOR, values[SpendFields.VENDOR]));
  }
  if (values[SpendFields.PAYMENT_MODE]) {
    results.push(await addDistinctValue(userId, SpendFields.PAYMENT_MODE, values[SpendFields.PAYMENT_MODE]));
  }
  if (values[SpendFields.DESCRIPTION]) {
    results.push(await addDistinctValue(userId, SpendFields.DESCRIPTION, values[SpendFields.DESCRIPTION]));
  }
  return results;
}

// Get all distinct values of a type for a user, optionally filtered by a search string (for autocomplete)
async function getDistinctValues(userId, type, search = "") {
  const sortKeyPrefix = generateUniqueValueSortKeyPrefix(type);
  const result = await ddbDocClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'UserId = :uid AND begins_with(SortKey, :skPrefix)',
      ExpressionAttributeValues: {
        ':uid': userId,
        ':skPrefix': sortKeyPrefix,
      },
    })
  );
  let values = (result.Items || []).map(item => item.Value);
  if (search) {
    const searchLower = search.toLowerCase();
    values = values.filter(v => v && v.toLowerCase().includes(searchLower));
  }
  return values;
}

module.exports = { addAllDistinctValues, getDistinctValues };
