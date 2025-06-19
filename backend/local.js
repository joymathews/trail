require('dotenv').config();
const { ensureTableExists } = require('./db/dynamodb/dynamodbManager');
const createApp = require('./app');
const { CORS_ORIGIN } = require('./config');

const port = process.env.PORT || 3001;

(async () => {
  const app = createApp();
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port} (CORS: ${CORS_ORIGIN})`);
  });
})();