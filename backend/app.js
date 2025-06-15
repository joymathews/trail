const express = require('express');
const cors = require('cors');
const spendsRouter = require('./routes/spends');
const expenseRouter = require('./routes/expense');
const savingRouter = require('./routes/saving');
const autoComplete = require('./routes/autocomplete');
const { CORS_ORIGIN } = require('./config');

function createApp() {
  const app = express(); // <-- FIXED

  app.use(express.json());
  app.use(cors({ origin: CORS_ORIGIN }));

  app.use('/spends', spendsRouter);
  app.use('/expense', expenseRouter);
  app.use('/saving', savingRouter);
  app.use('/autocomplete', autoComplete);

  return app;
}

module.exports = createApp;