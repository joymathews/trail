const express = require('express');
const router = express.Router();
const { pgHealthCheck } = require('../db/postgreSQL/postgreSQLInterface');

// Health check endpoint
router.get('/', async (req, res) => {
  const dbOk = await pgHealthCheck();
  if (dbOk) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

module.exports = router;
