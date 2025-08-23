# Backend File Purpose Overview

This document describes the purpose of each file in the `backend` folder of the Trail personal finance application.

---

## Top-Level Files

- **local.js**
  - Entry point for local development. Ensures the DynamoDB table exists, starts the Express server, and logs the local URL.
- **package.json**
  - Lists backend dependencies and scripts.
- **template.yaml**
  - AWS SAM template for serverless deployment (if used).

---

## documents/
- **API_Contracts.md**
  - Documents all API endpoints, request/response contracts, and error formats.
- **Calculation_Logic.md**
  - Explains all calculation logic used in the backend (sum, total, forecast, filtering, etc).

---

## lambda/
- **app.js**
  - Sets up the Express application, configures middleware (JSON parsing, CORS), and mounts the main routers for spends, expenses, savings, autocomplete, and health.
- **config.js**
  - Centralizes configuration values (region, table name, endpoints, CORS origin) using environment variables.
- **lambda.js**
  - Entry point for AWS Lambda deployment. Wraps the Express app for serverless use.
- **package.json**
  - Lists dependencies and scripts for the lambda backend.
- **.env**
  - Environment variables for backend configuration.

---

## lambda/db/
- **dbInterface.js**
  - Main interface for database operations.
- **dynamodb/**
  - **calculationService.js**: Implements calculation logic for sums, totals, and forecasts.
  - **dynamodbFactory.js**: Factory for creating DynamoDB clients (local and AWS).
  - **dynamoHealthCheck.js**: Health check logic for DynamoDB connection.
  - **keyGenerator.js**: Generates unique keys for spends.
  - **spendDb.js**: Handles CRUD operations for spends.
  - **uniqueValuesDB.js**: Fetches unique field values for filtering and autocomplete.

---

## lambda/middleware/
- **rateLimiter.js**
  - Express middleware for rate limiting API requests.
- **userExtractor.js**
  - Middleware to extract user information from requests.
- **validation.js**
  - Middleware for validating request fields and query parameters.

---

## lambda/routes/
- **autocomplete.js**
  - Endpoint for autocomplete suggestions (categories, vendors, etc).
- **expense.js**
  - Endpoints for expense-related queries (sum, total, forecast).
- **health.js**
  - Health check endpoint.
- **saving.js**
  - Endpoints for saving-related queries (sum, total).
- **spends.js**
  - Endpoints for creating and retrieving spends.

---

## lambda/services/
- **filterService.js**
  - Provides filter functions to distinguish between expense types (fixed, dynamic, saving).

---

## lambda/utils/
- **fieldEnums.js**
  - Shared enums for spend fields (Category, Vendor, etc).

---
