const pg = require('./postgreSQL/postgreSQLInterface');
const autocomplete = require('./postgreSQL/autocompleteQueries');

const db = {
  saveSpend: pg.pgSaveSpend,
  getSpendById: pg.pgGetSpendById,
  getSpendsByDateRange: pg.pgGetSpendsByDateRange,
  sumByFieldForExpenseTypes: pg.pgSumByFieldForExpenseTypes,
  sumByFieldForSavings: pg.pgSumByFieldForSavings,
  totalSpendsForExpenseTypes: pg.pgTotalSpendsForExpenseTypes,
  totalSpendsForSavings: pg.pgTotalSpendsForSavings,
  forecastDynamicExpense: pg.pgForecastDynamicExpense,
  getCategorySuggestions: autocomplete.getCategorySuggestions,
  getVendorSuggestions: autocomplete.getVendorSuggestions,
  getPaymentModeSuggestions: autocomplete.getPaymentModeSuggestions,
  getDescriptionSuggestions: autocomplete.getDescriptionSuggestions,
};

module.exports = db;