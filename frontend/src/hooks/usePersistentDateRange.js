import { useState } from 'react';
import { getDefaultLast7DaysRange } from '../utils/dateRangeDefaults';
import { getDateRangeFromStorage, saveDateRangeToStorage } from '../utils/dateRangeStorage';

/**
 * Custom hook for date range state with localStorage persistence.
 * Returns [dateRange, setDateRangeAndPersist]
 */
export default function usePersistentDateRange() {
  const storedRange = getDateRangeFromStorage();
  const [dateRange, setDateRange] = useState(storedRange || getDefaultLast7DaysRange());

  const setDateRangeAndPersist = (start, end) => {
    setDateRange({ start, end });
    saveDateRangeToStorage({ start, end });
  };

  return [dateRange, setDateRangeAndPersist];
}
