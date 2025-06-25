const express = require('express');
const cors = require('cors');
const spendsRouter = require('./routes/spends');
const expenseRouter = require('./routes/expense');
const savingRouter = require('./routes/saving');
const autoComplete = require('./routes/autocomplete');
const healthCheck = require('./routes/health');
const { CORS_ORIGIN } = require('./config');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
  }));

  // Explicitly handle OPTIONS for all routes
  app.options('*', cors());

  app.use('/spends', spendsRouter);
  app.use('/expense', expenseRouter);
  app.use('/saving', savingRouter);
  app.use('/autocomplete', autoComplete);
  app.use('/health',healthCheck);

  return app;
}

module.exports = createApp;