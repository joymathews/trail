/**
 * Generates a DynamoDB sort key for spend items and unique value items.
 *
 * For spend items: returns 'YYYY-MM-DD#spend#<id>'
 * For unique value items (e.g., category, vendor): returns '#<type>#<value>'
 *
 * @param {Object} options
 * @param {string} [options.date] - The date in 'YYYY-MM-DD' format (required for spends)
 * @param {string} options.type - The type of item ('spend', 'category', 'vendor', etc.)
 * @param {string} options.idOrValue - The spend id (for spends) or unique value (for others)
 * @returns {string} The generated sort key
 */
function generateSortKey({ date, type, idOrValue }) {
  if (type === 'spend') {
    if (!date) throw new Error('Date is required for spend sort key');
    return `${date}#spend#${idOrValue}`;
  }
  return `#${type}#${idOrValue}`;
}

/**
 * Generates a unique spend ID.
 * Format: 'YYYY-MM-DD-<CleanDescription>-<random>'
 *
 * Example:
 * generateSpendId('2025-06-13', 'Uber Ride')
 * // Output: '2025-06-13-UberRide-abc123xy' (random suffix will vary)
 *
 * @param {string} date - The date in 'YYYY-MM-DD' format
 * @param {string} description - The spend description
 * @returns {string} The generated unique spend ID
 */
function generateSpendId(date, description) {
  if (!date || !description) throw new Error('date and description are required for spend ID');
  const cleanDesc = description.replace(/[^a-zA-Z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `${date}-${cleanDesc}-${randomSuffix}`;
}

/**
 * Generates a unique ID for unique value items (category, vendor, etc.).
 * Format: '<Type>-<CleanValue>'
 *
 * Example:
 * generateUniqueValueId('category', 'Transport')
 * // Output: 'category-Transport'
 *
 * @param {string} type - The type of item ('category', 'vendor', etc.)
 * @param {string} value - The unique value
 * @returns {string} The generated unique value ID
 */
function generateUniqueValueId(type, value) {
  if (!type || !value) throw new Error('type and value are required for unique value ID');
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
  return `${type}-${cleanValue}`;
}

/**
 * Generates the sort key prefix for unique value items (category, vendor, etc.)
 * Used for begins_with queries in DynamoDB.
 *
 * @param {string} type - The type of item ('category', 'vendor', etc.)
 * @returns {string} The sort key prefix
 */
function generateUniqueValueSortKeyPrefix(type) {
  if (!type) throw new Error('type is required for unique value sort key prefix');
  return `#${type}#`;
}

/**
 * Generates the start and end sort keys for a spend date range query.
 *
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format
 * @returns {{ startSortKey: string, endSortKey: string }}
 */
function generateSpendDateRangeSortKeys(startDate, endDate) {
  if (!startDate || !endDate) throw new Error('startDate and endDate are required');
  // 'z' ensures the end key is lexicographically after any valid spend id
  return {
    startSortKey: `${startDate}#spend#`,
    endSortKey: `${endDate}#spend#z`
  };
}

module.exports = {
  generateSortKey,
  generateSpendId,
  generateUniqueValueId,
  generateSpendDateRangeSortKeys,
  generateUniqueValueSortKeyPrefix
};
