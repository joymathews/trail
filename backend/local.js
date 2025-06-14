require('dotenv').config();
const { ensureTableExists } = require('./awsEnsure');
const createApp = require('./app');
const { CORS_ORIGIN, DB_USED } = require('./config');

const port = process.env.PORT || 3001;

(async () => {
  if (DB_USED === 'dynamodb') {
    console.log('Using DynamoDB for local development');
    await ensureTableExists();
  } else if (DB_USED === 'postgres') {
    console.log('Using PostgreSQL for local development');
  }
  const app = createApp();
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port} (CORS: ${CORS_ORIGIN})`);
  });
})();