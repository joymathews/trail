# Backend Calculation Logic

This document explains all the calculation logic implemented in the backend of the Daily Expense application. The calculations are primarily handled in `backend/services/calculationService.js` and are used by the API endpoints for expenses and savings.

---

## 1. Filtering Logic

Filtering is performed using functions from `filterService.js`:
- **filterExpenseType(spend):** Returns true if `SpendType` is `fixed` or `dynamic`.
- **filterSaving(spend):** Returns true if `SpendType` is `saving`.
- **filterDynamic(spend):** Returns true if `SpendType` is `dynamic`.

---

## 2. Sum by Field (for Expenses or Savings)

### Function: `sumByFieldWithFilter(spends, field, filterFn)`
- **Purpose:** Sums the `AmountSpent` for each unique value of a given field (e.g., Category, Vendor), after filtering spends.
- **Used by:**
  - `sumByFieldForExpenseTypes({ startDate, endDate, field })` (expenses only)
  - `sumByFieldForSavings({ startDate, endDate, field })` (savings only)
- **How it works:**
  1. Fetches spends in the date range.
  2. Filters spends using the provided filter function.
  3. Sums `AmountSpent` for each unique value of the specified field.
- **Returns:** An object mapping field values to their total spend.

---

## 3. Total Spends (for Expenses or Savings)

### Function: `totalSpendsWithFilter(spends, filterFn)`
- **Purpose:** Calculates the total `AmountSpent` for spends matching the filter.
- **Used by:**
  - `totalSpendsForExpenseTypes({ startDate, endDate })` (expenses only)
  - `totalSpendsForSavings({ startDate, endDate })` (savings only)
- **How it works:**
  1. Fetches spends in the date range.
  2. Filters spends using the provided filter function.
  3. Sums all `AmountSpent` values.
- **Returns:** A single number (total spend).

---

## 4. Forecast Dynamic Expenses

### Function: `forecastDynamicExpense({ startDate, endDate })`
- **Purpose:** Forecasts the total dynamic expenses for a date range, based on the average daily spend so far.
- **How it works:**
  1. Determines the actual end date for calculation (today or the requested end date, whichever is earlier).
  2. Fetches spends in the range from `startDate` to `actualEnd`.
  3. Filters spends to only those with `SpendType` = `dynamic`.
  4. Sums the total spent so far.
  5. Calculates the number of days so far and the total number of days in the requested range.
  6. Computes the daily average and multiplies by the total days to forecast the total spend.
- **Returns:**
    - `forecast`: Forecasted total dynamic spend for the range
    - `startDate`, `endDate`, `dailyAverage`, `daysSoFar`, `totalDays`, `totalSpent`

---

## 5. Data Source

All calculations use spends fetched from DynamoDB via `getSpendsByDateRange(startDate, endDate)`, which returns all spends where `Date` is between the given range (inclusive).

---

## 6. Summary Table

| Calculation                | Function Name                  | Filter Used         | Output Type         |
|--------------------------- |------------------------------- |-------------------- |-------------------- |
| Sum by field (expenses)    | sumByFieldForExpenseTypes      | filterExpenseType   | Object (field:sum)  |
| Sum by field (savings)     | sumByFieldForSavings           | filterSaving        | Object (field:sum)  |
| Total spends (expenses)    | totalSpendsForExpenseTypes     | filterExpenseType   | Number              |
| Total spends (savings)     | totalSpendsForSavings          | filterSaving        | Number              |
| Forecast dynamic expenses  | forecastDynamicExpense         | filterDynamic       | Object (forecast, etc.) |

---

## 7. Notes
- All sums and totals use the `AmountSpent` field (converted to Number).
- Filtering is case-insensitive for `SpendType`.
- The forecast only considers spends up to today if the end date is in the future.
