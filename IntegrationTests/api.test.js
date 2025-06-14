const axios = require('axios');
const fs = require('fs');
const path = require('path');

describe('spend API Integration Tests', () => {
  const API_URL = 'http://localhost:3001/spends'; // Adjust port if needed
  const EXPENSE_URL = 'http://localhost:3001/expense';
  const SAVING_URL = 'http://localhost:3001/saving';
  const csvFilePath = path.join(__dirname, 'mock_data.csv');

  function parseCSVLine(line) {
    const regex = /(?:"([^"]*)")|([^,]+)/g;
    const result = [];
    let match;
    while ((match = regex.exec(line))) {
      result.push(match[1] || match[2]);
    }
    return result;
  }

  let spends = [];

  beforeAll(() => {
    // Read and parse CSV
    const data = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = data.split(/\r?\n/).filter(Boolean);
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length < 6) continue;
      const [Date, Description, AmountSpent, Category, Vendor, PaymentMode, SpendType] = row;
      spends.push({
        Date: Date.replace(/\//g, '-').replace(/(\d{2})-(\w{3})-(\d{2})/, (m, d, mth, y) => {
          const months = {Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
          return `20${y}-${months[mth]}-${d}`;
        }),
        Description: Description.trim(),
        AmountSpent: Number(AmountSpent),
        Category: Category.trim(),
        Vendor: Vendor.trim(),
        PaymentMode: PaymentMode.trim(),
        SpendType: SpendType ? SpendType.trim().toLowerCase() : 'dynamic',
      });
    }
  });

  it('should add all spends from CSV', async () => {
    for (const spend of spends) {
      const res = await axios.post(API_URL, spend);
      expect(res.status).toBe(201);
      expect(res.data.spend).toMatchObject(spend);
    }
  }, 60000);

  it('should fetch spends for a date range', async () => {
    const startDate = '2025-05-16';
    const endDate = '2025-06-11';
    const res = await axios.get(`${API_URL}`, {
      params: { startDate, endDate }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);

    // Filter CSV spends for the same date range
    const expected = spends.filter(
      exp => exp.Date >= startDate && exp.Date <= endDate
    );

    // Check that the API returns the same number of spends
    expect(res.data.length).toBe(expected.length);

    // Optionally, check that each expected spend is present in the API response
    expected.forEach(exp => {
      expect(
        res.data.some(apiExp =>
          apiExp.Date === exp.Date &&
          apiExp.Description === exp.Description &&
          Number(apiExp.AmountSpent) === Number(exp.AmountSpent) &&
          apiExp.Category === exp.Category &&
          apiExp.Vendor === exp.Vendor &&
          apiExp.PaymentMode === exp.PaymentMode &&
          apiExp.spendType === exp.spendType
        )
      ).toBe(true);
    });
  });

  it('should calculate sum by category', async () => {
    const res = await axios.get(`${EXPENSE_URL}/sum`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11', field: 'Category' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
    expect(Object.keys(res.data).length).toBeGreaterThan(0);

    // Check that Home Essentials sum matches expected value
    expect(Number(res.data['Home Essentials'])).toBeCloseTo(27335.79, 2);
  });

  it('should calculate total spends', async () => {
    const res = await axios.get(`${EXPENSE_URL}/total`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data.total).toBe('number');
    // Check that the total matches expected value
    expect(Number(res.data.total)).toBeCloseTo(112397.55, 2);
  });

  it('should forecast spends', async () => {
    const res = await axios.get(`${EXPENSE_URL}/forecast`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-13' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data.forecast).toBe('number');
    // Check that the forecast matches expected value
    expect(Number(res.data.forecast)).toBeCloseTo(112397.55, 2);
  });


  it('should calculate total savings', async () => {
  const res = await axios.get(`${SAVING_URL}/total`, {
    params: { startDate: '2025-05-16', endDate: '2025-06-11' }
  });
  expect(res.status).toBe(200);
  expect(typeof res.data.total).toBe('number');
  // Check that the total savings matches expected value
  expect(Number(res.data.total)).toBeCloseTo(12000, 2);
  });

  it('should calculate sum by category for saving', async () => {
    const res = await axios.get(`${SAVING_URL}/sum`, {
      params: { startDate: '2025-05-16', endDate: '2025-06-11', field: 'Category' }
    });
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
    expect(Object.keys(res.data).length).toBeGreaterThan(0);

    // Check that Home Essentials sum matches expected value
    expect(Number(res.data['MutualFund'])).toBeCloseTo(12000, 2);
  });

  it('should fetch all expenses (fixed and dynamic) for a date range', async () => {
    const startDate = '2025-05-16';
    const endDate = '2025-06-11';
    const res = await axios.get(`${EXPENSE_URL}`, {
      params: { startDate, endDate }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    // Only fixed and dynamic expenses should be returned
    res.data.forEach(exp => {
      expect(['fixed', 'dynamic']).toContain(exp.SpendType?.toLowerCase());
    });
    // Should not include any savings
    expect(res.data.some(exp => exp.SpendType?.toLowerCase() === 'saving')).toBe(false);
  });

  it('should fetch all savings for a date range', async () => {
    const startDate = '2025-05-16';
    const endDate = '2025-06-11';
    const res = await axios.get(`${SAVING_URL}`, {
      params: { startDate, endDate }
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    // Only savings should be returned
    res.data.forEach(saving => {
      expect(saving.SpendType?.toLowerCase()).toBe('saving');
    });
    // Should not include any fixed or dynamic expenses
    expect(res.data.some(saving => ['fixed', 'dynamic'].includes(saving.SpendType?.toLowerCase()))).toBe(false);
  });
});
