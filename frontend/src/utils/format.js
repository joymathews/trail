// Utility for formatting INR currency
export function formatINR(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}
