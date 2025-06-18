export const fetchExpenseSum = async (startDate, endDate, field) => {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({ startDate, endDate, field });
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiUrl}/expense/sum?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || typeof data !== 'object') return [];
    return Object.entries(data)
      .map(([key, value]) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return null;
        return { key, value: numValue };
      })
      .filter(item => item !== null);
  } catch {
    return [];
  }
};
