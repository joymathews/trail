const { DB_USED } = require('../config');

let db;
if (DB_USED === 'dynamodb') {
  const dynamo = require('./dynamodb/dynamoDBInterface');
  db = {
    saveSpend: dynamo.dynamoDBSaveSpend,
    getSpendById: dynamo.dynamoDBGetSpendById,
    getSpendsByDateRange: dynamo.dynamoDBGetSpendsByDateRange,
    sumByFieldForExpenseTypes: dynamo.dynamoDBSumByFieldForExpenseTypes,
    sumByFieldForSavings: dynamo.dynamoDBSumByFieldForSavings,
    totalSpendsForExpenseTypes: dynamo.dynamoDBTotalSpendsForExpenseTypes,
    totalSpendsForSavings: dynamo.dynamoDBTotalSpendsForSavings,
    forecastDynamicExpense: dynamo.dynamoDBForecastDynamicExpense,
  };
} else if (DB_USED === 'postgres') {
  const pg = require('./postgreSQL/postgreSQLInterface');
  db = {
    saveSpend: pg.pgSaveSpend,
    getSpendById: pg.pgGetSpendById,
    getSpendsByDateRange: pg.pgGetSpendsByDateRange,
    sumByFieldForExpenseTypes: pg.pgSumByFieldForExpenseTypes,
    sumByFieldForSavings: pg.pgSumByFieldForSavings,
    totalSpendsForExpenseTypes: pg.pgTotalSpendsForExpenseTypes,
    totalSpendsForSavings: pg.pgTotalSpendsForSavings,
    forecastDynamicExpense: pg.pgForecastDynamicExpense,
  };
} else {
  throw new Error('Unsupported DB_USED value: ' + DB_USED);
}

module.exports = db;