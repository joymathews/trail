const axios = require('axios');

describe('expense API Integration Tests', () => {
  const EXPENSE_URL = 'http://localhost:3001/expense';

  it('should calculate sum by category', async () => {
    const res = await axios.get(`${EXPENSE_URL}/sum`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11', field: 'Category' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
    expect(Object.keys(res.data).length).toBeGreaterThan(0);
    expect(Number(res.data['Home Essentials'])).toBeCloseTo(27335.79, 2);
  });

  it('should calculate total spends', async () => {
    const res = await axios.get(`${EXPENSE_URL}/total`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data.total).toBe('number');
    expect(Number(res.data.total)).toBeCloseTo(112397.55, 2);
  });

  it('should forecast spends', async () => {
    const res = await axios.get(`${EXPENSE_URL}/forecast`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-13' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data.forecast).toBe('number');
    expect(Number(res.data.forecast)).toBeCloseTo(112397.55, 2);
  });

  it('should fetch all expenses (fixed and dynamic) for a date range', async () => {
    const startDate = '2025-05-16';
    const endDate = '2025-06-11';
    const res = await axios.get(`${EXPENSE_URL}`, {
      params: { startDate, endDate }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    res.data.forEach(exp => {
      expect(['fixed', 'dynamic']).toContain(exp.SpendType?.toLowerCase());
    });
    expect(res.data.some(exp => exp.SpendType?.toLowerCase() === 'saving')).toBe(false);
  });
});
