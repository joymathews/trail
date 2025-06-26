require('dotenv').config({ path: './lambda/.env' });
const { CORS_ORIGIN, TABLE_NAME } = require('./lambda/config');
const createApp = require('./lambda/app');
const { createDynamoDBClient } = require('./lambda/db/dynamodb/dynamodbFactory');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');

async function ensureTableExists() {
  const client = createDynamoDBClient();
  const params = {
    TableName: TABLE_NAME,
    AttributeDefinitions: [
      { AttributeName: 'UserId', AttributeType: 'S' },
      { AttributeName: 'SortKey', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'UserId', KeyType: 'HASH' },
      { AttributeName: 'SortKey', KeyType: 'RANGE' },
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand mode
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

const port = process.env.PORT || 3001;

(async () => {
  // Always use DynamoDB for local development
  console.log('Using DynamoDB for local development');
  await ensureTableExists();
  const app = createApp();
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port} (CORS: ${CORS_ORIGIN})`);
  });
})();