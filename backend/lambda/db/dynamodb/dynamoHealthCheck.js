const { createDynamoDBClient } = require('./dynamodbFactory');

async function dynamoHealthCheck() {
  try {
    const client = createDynamoDBClient();
    // Simple call to list tables as a health check
    await client.listTables({});
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { dynamoHealthCheck };
