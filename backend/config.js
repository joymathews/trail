module.exports = {
  REGION: process.env.AWS_REGION || 'us-east-1',
  TABLE_NAME: process.env.EXPENSES_TABLE || 'Expenses',
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT, // Optional: for local development
  IS_LOCAL: process.env.IS_LOCAL === 'true', // Read as boolean
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME
};