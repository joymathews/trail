const express = require('express');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');
const calculationRouter = require('./routes/calculation');
const { CORS_ORIGIN } = require('./config');

function createApp() {
  const app = express(); // <-- FIXED

  app.use(express.json());
  app.use(cors({ origin: CORS_ORIGIN }));

  app.use('/expenses', expensesRouter);
  app.use('/calculation', calculationRouter);

  return app;
}

module.exports = createApp;