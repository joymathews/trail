# IntegrationTests Folder

This folder contains all the files and scripts needed to run integration tests for the expense backend API.

## Files and Their Purpose

- **api.test.js**  
  Contains integration test cases for the backend API. It reads data from `mock_data.csv`, inserts it into the backend, and verifies API functionality (such as range queries, sum, and forecast).

- **mock_data.csv**  
  CSV file with mock expense data. This data is used by the tests to populate the backend and validate API results.

- **mockClient.js**  
  Utility script for parsing the CSV and preparing expense data. This script can be used to add data manually to the backend and is helpful for debugging or testing locally by posting expenses from the CSV without running the full test suite.
  
- **package.json**  
  Defines dependencies (like Jest and Axios) and scripts for running tests in this folder.

- **ReadMe.md**  
  (This file) Documentation for the integration tests.

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
   - Run all integration tests
   - Clean up by stopping the backend and DynamoDB
   - Show whether the tests passed or failed

---

All test logic and data are in this folder. Use `start_test.bat` to run the full integration test suite automatically. Results and cleanup are handled for you.
