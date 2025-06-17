// src/utils/date.js
export function formatDate(date) {
  // Handle null, undefined, special cases or invalid date values
  if (date === null || date === undefined || date === '') {
    return 'N/A';
  }

  // If the input is already a string that looks like a formatted date, return it directly
  if (typeof date === 'string') {
    // Valid ISO format check (YYYY-MM-DD)
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoRegex.test(date)) {
      return date;
    }
  }
  
  try {
    // Handle potential numeric timestamps
    let dateInput = date;
    if (typeof date === 'number' || (typeof date === 'string' && !isNaN(Number(date)))) {
      // If it's a valid timestamp number
      const timestamp = Number(date);
      // Sanity check: Ensure timestamp is within reasonable range (2000-2050 years)
      if (timestamp < 946684800000 || timestamp > 2524608000000) { // 2000-01-01 to 2050-01-01
        return String(date); // Just return as string if out of reasonable date range
      }
    }
    
    // Create a new Date object - will throw for invalid dates
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // Validate the date (check for Invalid Date)
    if (isNaN(d.getTime())) {
      // Fallback - return the input as a string
      return typeof date === 'object' ? 'Invalid Date' : String(date);
    }
    
    // Format YYYY-MM-DD safely
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Error formatting date:', error, date);
    // Fallback - return the input as a string if possible
    return typeof date === 'object' ? 'Invalid Date' : String(date);
  }
}