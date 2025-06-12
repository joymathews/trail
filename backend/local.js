require('dotenv').config();
const { ensureTableExists } = require('./awsEnsure');
const createApp = require('./app');
const { CORS_ORIGIN } = require('./config');

const port = process.env.PORT || 3001;

(async () => {
  await ensureTableExists();
  const app = createApp();
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port} (CORS: ${CORS_ORIGIN})`);
  });
})();