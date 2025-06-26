const { createDynamoDBClient } = require('./dynamodbFactory');
const { DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { TRAIL_AWS_DYNAMO_DB_SPENDS_TABLE_NAME } = process.env;

async function dynamoHealthCheck() {
  try {
    const client = createDynamoDBClient();
    await client.send(new DescribeTableCommand({ TableName: TRAIL_AWS_DYNAMO_DB_SPENDS_TABLE_NAME }));
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { dynamoHealthCheck };
