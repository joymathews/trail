const { createPgClient } = require('../pgFactory');

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

// Save a spend
async function pgSaveSpend(spend) {
  return withPgClient(async (client) => {
    const query = `
      INSERT INTO spends (id, "Date", "Description", "AmountSpent", "Category", "Vendor", "PaymentMode", "SpendType")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        "Date" = EXCLUDED."Date",
        "Description" = EXCLUDED."Description",
        "AmountSpent" = EXCLUDED."AmountSpent",
        "Category" = EXCLUDED."Category",
        "Vendor" = EXCLUDED."Vendor",
        "PaymentMode" = EXCLUDED."PaymentMode",
        "SpendType" = EXCLUDED."SpendType"
    `;
    const values = [
      spend.id,
      spend.Date,
      spend.Description,
      spend.AmountSpent,
      spend.Category,
      spend.Vendor,
      spend.PaymentMode,
      spend.SpendType
    ];
    await client.query(query, values);
  });
}

// Get spend by ID
async function pgGetSpendById(id) {
  return withPgClient(async (client) => {
    const res = await client.query('SELECT id, "Date"::text AS "Date", "Description", "AmountSpent", "Category", "Vendor", "PaymentMode", "SpendType" FROM spends WHERE id = $1', [id]);
    return res.rows[0];
  });
}

// Get spends by date range
async function pgGetSpendsByDateRange(startDate, endDate) {
  return withPgClient(async (client) => {
    const res = await client.query(
      'SELECT id, "Date"::text AS "Date", "Description", "AmountSpent", "Category", "Vendor", "PaymentMode", "SpendType" FROM spends WHERE "Date" >= $1 AND "Date" <= $2',
      [startDate, endDate]
    );
    return res.rows;
  });
}

// Sum by field for expense types (SpendType: fixed or dynamic)
async function pgSumByFieldForExpenseTypes({ startDate, endDate, field }) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT "${field}", SUM("AmountSpent") AS total
       FROM spends
       WHERE "Date" >= $1 AND "Date" <= $2
         AND LOWER("SpendType") IN ('fixed', 'dynamic')
       GROUP BY "${field}"`,
      [startDate, endDate]
    );
    // Return as { fieldValue: total, ... }
    return Object.fromEntries(res.rows.map(row => [row[field], Number(row.total)]));
  });
}

// Sum by field for savings (SpendType: saving)
async function pgSumByFieldForSavings({ startDate, endDate, field }) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT "${field}", SUM("AmountSpent") AS total
       FROM spends
       WHERE "Date" >= $1 AND "Date" <= $2
         AND LOWER("SpendType") = 'saving'
       GROUP BY "${field}"`,
      [startDate, endDate]
    );
    return Object.fromEntries(res.rows.map(row => [row[field], Number(row.total)]));
  });
}

// Total spends for expense types (SpendType: fixed or dynamic)
async function pgTotalSpendsForExpenseTypes({ startDate, endDate }) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT SUM("AmountSpent") AS total
       FROM spends
       WHERE "Date" >= $1 AND "Date" <= $2
         AND LOWER("SpendType") IN ('fixed', 'dynamic')`,
      [startDate, endDate]
    );
    return Number(res.rows[0].total) || 0;
  });
}

// Total spends for savings (SpendType: saving)
async function pgTotalSpendsForSavings({ startDate, endDate }) {
  return withPgClient(async (client) => {
    const res = await client.query(
      `SELECT SUM("AmountSpent") AS total
       FROM spends
       WHERE "Date" >= $1 AND "Date" <= $2
         AND LOWER("SpendType") = 'saving'`,
      [startDate, endDate]
    );
    return Number(res.rows[0].total) || 0;
  });
}

// Forecast dynamic expense (SpendType: dynamic)
async function pgForecastDynamicExpense({ startDate, endDate }) {
  return withPgClient(async (client) => {
    const today = new Date().toISOString().slice(0, 10);
    const actualEnd = today < endDate ? today : endDate;
    const res = await client.query(
      `SELECT "AmountSpent", "Date"
       FROM spends
       WHERE "Date" >= $1 AND "Date" <= $2
         AND LOWER("SpendType") = 'dynamic'`,
      [startDate, actualEnd]
    );
    const spends = res.rows;
    const totalSpent = spends.reduce((sum, s) => sum + Number(s.AmountSpent), 0);
    const daysSoFar = Math.max(
      1,
      Math.ceil((new Date(actualEnd) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1)
    );
    const dailyAverage = totalSpent / daysSoFar;
    const totalDays = Math.max(
      1,
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1)
    );
    return {
      forecast: dailyAverage * totalDays,
      startDate,
      endDate,
      dailyAverage,
      daysSoFar,
      totalDays,
      totalSpent,
    };
  });
}

module.exports = {
  pgSaveSpend,
  pgGetSpendById,
  pgGetSpendsByDateRange,
  pgSumByFieldForExpenseTypes,
  pgSumByFieldForSavings,
  pgTotalSpendsForExpenseTypes,
  pgTotalSpendsForSavings,
  pgForecastDynamicExpense,
};