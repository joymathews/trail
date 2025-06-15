const axios = require('axios');

describe('saving API Integration Tests', () => {
  const SAVING_URL = 'http://localhost:3001/saving';

  it('should calculate total savings', async () => {
    const res = await axios.get(`${SAVING_URL}/total`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data.total).toBe('number');
    expect(Number(res.data.total)).toBeCloseTo(12000, 2);
  });

  it('should calculate sum by category for saving', async () => {
    const res = await axios.get(`${SAVING_URL}/sum`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11', field: 'Category' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
    expect(Object.keys(res.data).length).toBeGreaterThan(0);
    expect(Number(res.data['MutualFund'])).toBeCloseTo(12000, 2);
  });

  it('should fetch all savings for a date range', async () => {
    const startDate = '2025-05-16';
    const endDate = '2025-06-11';
    const res = await axios.get(`${SAVING_URL}`, {
      params: { startDate, endDate }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    res.data.forEach(saving => {
      expect(saving.SpendType?.toLowerCase()).toBe('saving');
    });
    expect(res.data.some(saving => ['fixed', 'dynamic'].includes(saving.SpendType?.toLowerCase()))).toBe(false);
  });
});
