const axios = require('axios');
const { getSpends } = require('../testData/spends');
const { SpendFields } = require('../utils/fieldEnums');

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
      exp => exp[SpendFields.DATE] >= startDate && exp[SpendFields.DATE] <= endDate
    );

    // Check that the API returns the same number of spends
    expect(res.data.length).toBe(expected.length);

    // Optionally, check that each expected spend is present in the API response
    expected.forEach(exp => {
      expect(
        res.data.some(apiExp =>
          apiExp[SpendFields.DATE] === exp[SpendFields.DATE] &&
          apiExp[SpendFields.DESCRIPTION] === exp[SpendFields.DESCRIPTION] &&
          Number(apiExp[SpendFields.AMOUNT_SPENT]) === Number(exp[SpendFields.AMOUNT_SPENT]) &&
          apiExp[SpendFields.CATEGORY] === exp[SpendFields.CATEGORY] &&
          apiExp[SpendFields.VENDOR] === exp[SpendFields.VENDOR] &&
          apiExp[SpendFields.PAYMENT_MODE] === exp[SpendFields.PAYMENT_MODE] &&
          apiExp[SpendFields.SPEND_TYPE] === exp[SpendFields.SPEND_TYPE]
        )
      ).toBe(true);
    });
  });
});
