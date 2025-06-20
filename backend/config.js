module.exports = {
  REGION: process.env.TRAIL_AWS_REGION || 'us-east-1',
  TABLE_NAME: process.env.TRAIL_EXPENSES_TABLE || 'Expenses',
  IS_LOCAL: process.env.TRAIL_IS_LOCAL === 'true', // Read as boolean
  CORS_ORIGIN: process.env.TRAIL_CORS_ORIGIN || 'http://localhost:3000',
  DB_HOST: process.env.TRAIL_AWS_AURORA_PG_DB_HOST,
  DB_PORT: process.env.TRAIL_AWS_AURORA_PG_DB_PORT,
  DB_USER: process.env.TRAIL_AWS_AURORA_PG_DB_USER,
  DB_PASS: process.env.TRAIL_AWS_AURORA_PG_DB_PASS,
  DB_NAME: process.env.TRAIL_AWS_AURORA_PG_DB_NAME
};