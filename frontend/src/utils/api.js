import { renewTokenIfNeeded } from './auth';

const API_URL = import.meta.env.VITE_API_URL || '';

function getAuthToken() {
  // Update this to your actual auth logic if needed
  return localStorage.getItem('jwt');
}

async function apiFetch(url, options = {}) {
  // Try to renew token if needed before making the request
  try {
    await renewTokenIfNeeded();
  } catch (err) {
    // Force logout and redirect to login if token renewal fails
    localStorage.removeItem('jwt');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}

export async function fetchExpenseSum(startDate, endDate, field) {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({ startDate, endDate, field });
  try {
    const res = await apiFetch(`${API_URL}/expense/sum?${params}`);
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
  const res = await apiFetch(url);
  if (!res.ok) throw new Error('Failed to fetch spends');
  let data = await res.json();
  return data;
}

export async function saveSpend(spend) {
  const res = await apiFetch(`${API_URL}/spends`, {
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
  const res = await apiFetch(url);
  if (!res.ok) return [];
  return res.json();
}

// Fetch forecast data for a date range
export async function fetchExpenseForecast(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const params = new URLSearchParams({ startDate, endDate });
  try {
    const res = await apiFetch(`${API_URL}/expense/forecast?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}



// Fetch saving forecast data for a date range and monthly income
export async function fetchSavingForecast(startDate, endDate, monthlyIncome) {
  if (!startDate || !endDate || typeof monthlyIncome !== 'number' || isNaN(monthlyIncome)) return [];
  const params = new URLSearchParams({ startDate, endDate, monthlyIncome: monthlyIncome.toString() });
  try {
    const res = await apiFetch(`${API_URL}/saving/forecast?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Fetch saving sum data for a date range
export async function fetchSavingSum(startDate, endDate, field) {
  if (!startDate || !endDate || !field) return [];
  const params = new URLSearchParams({ startDate, endDate, field });
  try {
    const res = await apiFetch(`${API_URL}/saving/sum?${params}`);
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

export async function deleteSpend(id, date) {
  if (!id || !date) throw new Error('id and date are required');
  const res = await apiFetch(`${API_URL}/spends/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  if (!res.ok) throw new Error('Failed to delete spend');
  return res.json();
}