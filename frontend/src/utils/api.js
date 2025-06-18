const API_URL = import.meta.env.VITE_API_URL || '';

export async function fetchExpenseSum(startDate, endDate, field) {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({ startDate, endDate, field });
  try {
    const res = await fetch(`${API_URL}/expense/sum?${params}`);
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
}

export async function fetchSpends(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const url = `${API_URL}/spends?startDate=${startDate}&endDate=${endDate}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch spends');
  let data = await res.json();
  return data;
}

export async function saveSpend(spend) {
  const res = await fetch(`${API_URL}/spends`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spend),
  });
  if (!res.ok) throw new Error('Failed to save spend');
  return res.json();
}

export async function fetchSuggestions(field, value) {
  if (!value) return [];
  const url = `${API_URL}/autocomplete/${field}?q=${encodeURIComponent(value)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}
