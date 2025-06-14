// PostgreSQL queries for autocomplete fields
const { createPgClient } = require('./pgFactory');

// Helper to ensure client is connected and closed properly
async function withPgClient(fn) {
  const client = await createPgClient();
  try {
    await client.connect();
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function getCategorySuggestions(query) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT DISTINCT "Category" FROM spends WHERE "Category" ILIKE $1 ORDER BY "Category" LIMIT 10`,
      [query ? `%${query}%` : '%']
    );
    return res.rows.map(r => r.Category);
  });
}

async function getVendorSuggestions(query) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT DISTINCT "Vendor" FROM spends WHERE "Vendor" ILIKE $1 ORDER BY "Vendor" LIMIT 10`,
      [query ? `%${query}%` : '%']
    );
    return res.rows.map(r => r.Vendor);
  });
}

async function getPaymentModeSuggestions(query) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT DISTINCT "PaymentMode" FROM spends WHERE "PaymentMode" ILIKE $1 ORDER BY "PaymentMode" LIMIT 10`,
      [query ? `%${query}%` : '%']
    );
    return res.rows.map(r => r.PaymentMode);
  });
}

async function getDescriptionSuggestions(query) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT DISTINCT "Description" FROM spends WHERE "Description" ILIKE $1 ORDER BY "Description" LIMIT 10`,
      [query ? `%${query}%` : '%']
    );
    return res.rows.map(r => r.Description);
  });
}

module.exports = {
  getCategorySuggestions,
  getVendorSuggestions,
  getPaymentModeSuggestions,
  getDescriptionSuggestions,
};
