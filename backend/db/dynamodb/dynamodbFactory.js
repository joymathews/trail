const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { REGION, DYNAMODB_ENDPOINT, IS_LOCAL } = require('../../config');

function createDynamoDBClient() {
  const options = { region: REGION };
  if (IS_LOCAL && DYNAMODB_ENDPOINT) {
    options.endpoint = DYNAMODB_ENDPOINT;
    options.credentials = {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    };
  }
  return new DynamoDBClient(options);
}

function createDynamoDBDocumentClient() {
  const ddbClient = createDynamoDBClient();
  return DynamoDBDocumentClient.from(ddbClient);
}

module.exports = {
  createDynamoDBClient,
  createDynamoDBDocumentClient,
};