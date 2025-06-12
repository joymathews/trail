const express = require('express');
const expensesRouter = require('./routes/expenses');
const calculationRouter = require('./routes/calculation');

function createApp() {
  const app = express(); // <-- FIXED

  app.use(express.json());

  app.use('/expenses', expensesRouter);
  app.use('/calculation', calculationRouter);

  return app;
}

module.exports = createApp;