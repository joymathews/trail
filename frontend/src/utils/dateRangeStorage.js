const STORAGE_KEY = 'dateRange';

export function saveDateRangeToStorage(dateRange) {
  if (dateRange && dateRange.start && dateRange.end) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dateRange));
  }
}

export function getDateRangeFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.start && parsed.end) {
        return parsed;
      }
    }
  } catch {}
  return null;
}
