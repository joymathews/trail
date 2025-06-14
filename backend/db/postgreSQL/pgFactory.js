const { Client } = require('pg');
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { createAuthToken } = require("@aws-sdk/rds-signer");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  REGION,
  IS_LOCAL,
} = require('../../config');

async function createPgClient() {
  if (!IS_LOCAL) {
    // Aurora IAM authentication for production using AWS SDK v3
    const credentials = fromNodeProviderChain();
    const token = await createAuthToken({
      region: REGION,
      hostname: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      credentials,
    });
    return new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: token,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    // Local PostgreSQL
    return new Client({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });
  }
}

module.exports = { createPgClient };