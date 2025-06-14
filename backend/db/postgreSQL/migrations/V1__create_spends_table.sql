CREATE TABLE spends (
    id TEXT PRIMARY KEY,
    "Date" DATE NOT NULL,
    "Description" TEXT NOT NULL,
    "AmountSpent" NUMERIC NOT NULL,
    "Category" TEXT,
    "Vendor" TEXT,
    "PaymentMode" TEXT,
    "SpendType" TEXT
);