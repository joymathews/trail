# IntegrationTests Folder

This folder contains all the files and scripts needed to run integration tests for the expense backend API.

## Folder Structure and Purpose

- **tests/**  
  Contains all integration test files, split by feature:
  - `spends.test.js`  
    Tests for the `/spends` endpoint (fetching, filtering, etc.)
  - `expense.test.js`  
    Tests for the `/expense` endpoint (sum, total, forecast, etc.)
  - `saving.test.js`  
    Tests for the `/saving` endpoint (total, sum by category, etc.)
  - `autocomplete.test.js`  
    Tests for the `/autocomplete` endpoint (suggestions, error handling, etc.)

- **testData/**  
  Contains test data preparation scripts:
  - `spends.js`  
    Reads and parses `mock_data.csv` to provide spend data for tests.

- **utils/**  
  Utility functions for tests:
  - `csvUtils.js`  
    CSV parsing helper used by test data scripts.

- **mock_data.csv**  
  CSV file with mock expense data. Used to populate the backend and validate API results.

- **mockClient.js**  
  Utility script for parsing the CSV and preparing expense data. Can be used to add data manually to the backend for debugging or local testing.

- **setup.js**  
  Jest global setup script. Adds all spends from the CSV to the backend before any tests run (runs only once per test session).

- **jest.config.js**  
  Jest configuration file. Configures global setup and test file location.

- **package.json**  
  Defines dependencies (like Jest and Axios) and scripts for running tests in this folder.

- **start_test.bat**  
  Batch script to automate the full integration test workflow:
  - Installs dependencies
  - Starts DynamoDB in Docker
  - Starts the backend server
  - Runs the integration tests
  - Stops the backend and DynamoDB containers
  - Shows test results

## How to Run the Integration Tests

1. **Open a terminal (PowerShell or Command Prompt) in the `IntegrationTests` folder.**

2. **Run the batch script:**
   ```powershell
   .\start_test.bat
   ```
   This will:
   - Install dependencies (if needed)
   - Start DynamoDB and the backend server
   - Run all integration tests in the `tests/` folder
   - Clean up by stopping the backend and DynamoDB
   - Show whether the tests passed or failed

---

All test logic and data are in this folder. Use `start_test.bat` to run the full integration test suite automatically. Results and cleanup are handled for you.
