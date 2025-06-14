const { createDynamoDBClient } = require('./dynamodbFactory');
const { TABLE_NAME } = require('../../config');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

async function ensureTableExists() {
  const client = createDynamoDBClient();
  const params = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`Table "${TABLE_NAME}" created successfully.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table "${TABLE_NAME}" already exists.`);
    } else {
      console.error('Error creating table:', err);
    }
  }
}

module.exports = { ensureTableExists };