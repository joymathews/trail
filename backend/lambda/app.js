const express = require('express');
const cors = require('cors');
const spendsRouter = require('./routes/spends');
const expenseRouter = require('./routes/expense');
const savingRouter = require('./routes/saving');
const autoComplete = require('./routes/autocomplete');
const healthCheck = require('./routes/health');
const { CORS_ORIGIN, IS_LOCAL } = require('./config');
const { ipLimiter, apiLimiter, healthLimiter } = require('./middleware/rateLimiter');
const userExtractor = require('./middleware/userExtractor');

function createApp() {
  const app = express();

  if (!IS_LOCAL) {
    app.use(ipLimiter); // Only apply in non-local environments
  }
  app.use(express.json());
  app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
  }));

  // Health check route: only healthLimiter, no userExtractor or apiLimiter
  if (!IS_LOCAL) {
    app.use('/health', healthLimiter, healthCheck);
  } else {
    app.use('/health', healthCheck);
  }

  app.use(userExtractor);

  if (!IS_LOCAL) {
    app.use('/spends', apiLimiter, spendsRouter);
    app.use('/expense', apiLimiter, expenseRouter);
    app.use('/saving', apiLimiter, savingRouter);
    app.use('/autocomplete', apiLimiter, autoComplete);
  } else {
    app.use('/spends', spendsRouter);
    app.use('/expense', expenseRouter);
    app.use('/saving', savingRouter);
    app.use('/autocomplete', autoComplete);
  }

  return app;
}

module.exports = createApp;