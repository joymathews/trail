const express = require('express');
const router = express.Router();
const { dynamoHealthCheck } = require('../db/dbInterface');

// Health check endpoint
router.get('/', async (req, res) => {
  const dbOk = await dynamoHealthCheck();
  if (dbOk) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

module.exports = router;
