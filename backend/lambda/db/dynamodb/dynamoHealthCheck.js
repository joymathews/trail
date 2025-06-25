const { createDynamoDBClient } = require('./dynamodbFactory');
const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');

async function dynamoHealthCheck() {
  try {
    const client = createDynamoDBClient();
    // Use the command pattern for AWS SDK v3
    await client.send(new ListTablesCommand({}));
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { dynamoHealthCheck };
