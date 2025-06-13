# API Documentation & Contracts

## Base URL

    http://localhost:3001

---

## /spends

### POST /spends
- **Description:** Store a spend (expense or saving)
- **Request Body (JSON):**
  - `Date` (string, required, format: YYYY-MM-DD)
  - `Description` (string, required)
  - `AmountSpent` (number, required)
  - `Category` (string, required)
  - `Vendor` (string, required)
  - `PaymentMode` (string, required)
  - `SpendType` (string, required: "fixed", "dynamic", or "saving")
- **Response:**
  - `201 Created` with `{ message, spend }` on success
  - `400` or `500` with `{ error, details? }` on error

#### Example Request
```json
{
  "Date": "2025-06-13",
  "Description": "Uber Ride",
  "AmountSpent": 250,
  "Category": "Transport",
  "Vendor": "Uber",
  "PaymentMode": "Credit Card",
  "SpendType": "dynamic"
}
```

#### Example Response
```json
{
  "message": "Spend stored successfully.",
  "spend": {
    "id": "2025-06-13-Uber-abc123xyz",
    "Date": "2025-06-13",
    "Description": "Uber Ride",
    "AmountSpent": 250,
    "Category": "Transport",
    "Vendor": "Uber",
    "PaymentMode": "Credit Card",
    "SpendType": "dynamic"
  }
}
```

---

### GET /spends
- **Description:** Retrieve all spends for a date range
- **Query Parameters:**
  - `startDate` (string, required, format: YYYY-MM-DD)
  - `endDate` (string, required, format: YYYY-MM-DD)
- **Response:** Array of spend objects

---

### GET /spends/:id
- **Description:** Retrieve a spend by id
- **Response:** Spend object or 404 if not found

---

## /expense

### GET /expense
- **Description:** Get all expenses (fixed and dynamic) for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
- **Response:** Array of expense objects (SpendType: fixed or dynamic)

---

### GET /expense/sum
- **Description:** Sum expenses by a given field for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
  - `field` (string, required: one of Category, Vendor, PaymentMode, SpendType)
- **Response:** Object mapping field values to summed AmountSpent

---

### GET /expense/total
- **Description:** Total of all expenses (excluding savings) for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
- **Response:** `{ total: number }`

---

### GET /expense/forecast
- **Description:** Forecast dynamic expenses for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
- **Response:**
  - `forecast` (number)
  - `startDate`, `endDate`, `dailyAverage`, `daysSoFar`, `totalDays`, `totalSpent`

---

## /saving

### GET /saving
- **Description:** Get all savings for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
- **Response:** Array of saving objects (SpendType: saving)

---

### GET /saving/sum
- **Description:** Sum savings by a given field for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
  - `field` (string, required: one of Category, Vendor, PaymentMode, SpendType)
- **Response:** Object mapping field values to summed AmountSpent

---

### GET /saving/total
- **Description:** Total of all savings for a date range
- **Query Parameters:**
  - `startDate` (string, required)
  - `endDate` (string, required)
- **Response:** `{ total: number }`

---

## Spend Object Schema

```json
{
  "id": "string",
  "Date": "YYYY-MM-DD",
  "Description": "string",
  "AmountSpent": number,
  "Category": "string",
  "Vendor": "string",
  "PaymentMode": "string",
  "SpendType": "fixed" | "dynamic" | "saving"
}
```

---

## Error Responses
- All endpoints may return errors in the form:
```json
{
  "error": "Error message.",
  "details": "Optional details."
}
```

---

## Notes
- All date fields must be in `YYYY-MM-DD` format.
- `SpendType` must be one of: `fixed`, `dynamic`, `saving`.
- For sum endpoints, the response is an object mapping the requested field to the sum of `AmountSpent`.
