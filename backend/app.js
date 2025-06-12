const express = require('express');
const expensesRouter = require('./routes/expenses');

function createApp() {
  const app = express(); // <-- FIXED

  app.use(express.json());

  app.use('/expenses', expensesRouter);

  return app;
}

module.exports = createApp;