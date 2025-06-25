module.exports = {
  REGION: process.env.TRAIL_AWS_REGION || 'us-east-1',
  TABLE_NAME: process.env.TRAIL_AWS_DYNAMO_DB_SPENDS_TABLE_NAME || 'Spends',
  DYNAMODB_ENDPOINT: process.env.TRAIL_AWS_DYNAMODB_ENDPOINT, // Optional: for local development
  IS_LOCAL: process.env.TRAIL_IS_LOCAL === 'true', // Read as boolean
  CORS_ORIGIN: process.env.TRAIL_CORS_ORIGIN || 'http://localhost:3000'
};