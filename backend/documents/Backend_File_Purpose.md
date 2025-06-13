# Backend File Purpose Overview

This document describes the purpose of each file in the `backend` folder of the Daily Expense application.

---

## Top-Level Files

- **app.js**
  - Sets up the Express application, configures middleware (JSON parsing, CORS), and mounts the main routers for spends, expenses, and savings.

- **awsEnsure.js**
  - Ensures the DynamoDB table exists at startup. Creates the table if it does not exist.

- **awsFactory.js**
  - Provides factory functions to create AWS DynamoDB clients (standard and document client), with support for local and cloud environments.

- **config.js**
  - Centralizes configuration values (region, table name, endpoints, CORS origin) using environment variables.

- **lambda.js**
  - Entry point for AWS Lambda deployment. Wraps the Express app for serverless use.

- **local.js**
  - Entry point for local development. Ensures the table exists, starts the Express server, and logs the local URL.

- **package.json**
  - Lists backend dependencies and scripts.

---

## db/

- **db/spendDb.js**
  - Handles all database operations for spends:
    - `saveSpend`: Store a spend record.
    - `getSpendById`: Retrieve a spend by its ID.
    - `getSpendsByDateRange`: Retrieve spends within a date range.

---

## documents/

- **API_Contracts.md**
  - Documents all API endpoints, request/response contracts, and error formats.

- **Calculation_Logic.md**
  - Explains all calculation logic used in the backend (sum, total, forecast, filtering, etc).

---

## middleware/

- **middleware/validation.js**
  - Provides Express middleware for validating request fields and query parameters for spends and calculations.

---

## routes/

- **routes/spends.js**
  - Defines endpoints for creating and retrieving spends (expenses and savings):
    - `POST /spends`: Add a spend.
    - `GET /spends`: Get spends by date range.
    - `GET /spends/:id`: Get spend by ID.

- **routes/expense.js**
  - Defines endpoints for expense-related queries:
    - `GET /expense`: Get all expenses (fixed/dynamic) by date range.
    - `GET /expense/sum`: Sum expenses by field.
    - `GET /expense/total`: Total expenses.
    - `GET /expense/forecast`: Forecast dynamic expenses.

- **routes/saving.js**
  - Defines endpoints for saving-related queries:
    - `GET /saving`: Get all savings by date range.
    - `GET /saving/sum`: Sum savings by field.
    - `GET /saving/total`: Total savings.

---

## services/

- **services/calculationService.js**
  - Implements all calculation logic for sums, totals, and forecasts, using filtering and aggregation.

- **services/filterService.js**
  - Provides filter functions to distinguish between expense types (fixed, dynamic, saving) for use in calculations.

---
