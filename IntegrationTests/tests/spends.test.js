const axios = require('axios');
const { getSpends } = require('../testData/spends');

describe('spend API Integration Tests', () => {
  const API_URL = 'http://localhost:3001/spends';
  const spends = getSpends();

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
});
