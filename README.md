# Trail: Personal Finance Journal

Trail is a full-stack personal finance journal app. It helps users track expenses, savings, and forecasts, providing dashboards and analytics for better financial planning. The app is designed for personal use, with a focus on privacy and local development.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.x recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Quick Start

### 1. Clone the Repository
```powershell
git clone https://github.com/joymathews/trail.git
cd trail
```

### 2. Start Supporting Services (DynamoDB Local)
```powershell
docker compose up dynamodb
```

### 3. Start the Backend
Navigate to the backend folder and run:
```powershell
cd backend
npm install
node local.js
```
Or use the integration test batch script for automated setup:
```powershell
cd IntegrationTests
./start_test.bat
```

### 4. Start the Frontend
Navigate to the frontend folder and run:
```powershell
cd frontend
npm install
npm run dev
```

---

## Running Unit Tests

### Backend Tests
Currently, backend unit tests are not implemented. Integration tests are available:
```powershell
cd IntegrationTests
npm run test
```
Or use:
```powershell
./start_test.bat
```

### Frontend Tests
Linting is available:
```powershell
npm run lint
```
No unit tests are currently defined for the frontend.

---

## Environment Variables

### Backend (`backend/lambda/.env`)
Create a `.env` file with the following keys:
```env
TRAIL_AWS_REGION=
TRAIL_AWS_DYNAMO_DB_SPENDS_TABLE_NAME=
TRAIL_AWS_DYNAMODB_ENDPOINT=
TRAIL_IS_LOCAL=
TRAIL_CORS_ORIGIN=
PORT=
```

### Frontend (`frontend/.env`)
Create a `.env` file with the following keys:
```env
VITE_API_URL=
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
```
Do not include sensitive values in version control.

---

## Docker Compose Overview

Docker Compose is used to start local development services. The provided configuration launches a local DynamoDB instance:

```yaml
services:
  dynamodb:
    image: amazon/dynamodb-local
    ports:
      - "8000:8000"
    command: -jar DynamoDBLocal.jar -inMemory -sharedDb
```

**Purpose:**
- Provides a local, in-memory DynamoDB database for backend development and testing.
- Ensures backend APIs can be tested without connecting to AWS.

---

## Main Use Case

Trail is intended for personal finance tracking, journaling, and analytics. It is suitable for users who want to self-host and keep their financial data private.

---

## Additional Resources

- See `IntegrationTests/ReadMe.md` for details on integration testing.
- See `backend/documents/` for API contracts and backend logic documentation.
