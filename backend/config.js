module.exports = {
  REGION: process.env.AWS_REGION || 'us-east-1',
  TABLE_NAME: process.env.EXPENSES_TABLE || 'Expenses',
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT, // Optional: for local development
  IS_LOCAL: process.env.IS_LOCAL === 'true', // Read as boolean
};