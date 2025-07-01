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

  it('should create, edit, and delete a spend (full lifecycle)', async () => {
    // Step 1: Create a new spend for today
    const today = new Date().toISOString().slice(0, 10);
    const newSpend = {
      [SpendFields.DATE]: today,
      [SpendFields.DESCRIPTION]: 'Integration Test Spend',
      [SpendFields.AMOUNT_SPENT]: 123.45,
      [SpendFields.CATEGORY]: 'Test Category',
      [SpendFields.VENDOR]: 'Test Vendor',
      [SpendFields.PAYMENT_MODE]: 'Test Mode',
      [SpendFields.SPEND_TYPE]: 'dynamic',
    };
    const createRes = await axios.post(`${API_URL}`, newSpend);
    expect(createRes.status).toBe(201);
    const spend = createRes.data.spend;
    expect(spend[SpendFields.DESCRIPTION]).toBe('Integration Test Spend');
    expect(spend[SpendFields.AMOUNT_SPENT]).toBe(123.45);
    expect(spend.id).toBeDefined();

    // Step 2: Edit the spend
    const newDesc = 'Edited Integration Test Spend';
    const patchRes = await axios.patch(`${API_URL}/${spend.id}`, {
      date: spend[SpendFields.DATE],
      updates: { Description: newDesc }
    });
    expect(patchRes.status).toBe(200);
    expect(patchRes.data.result.updates.description).toBe(newDesc);

    // Step 3: GET to verify edit
    const getRes = await axios.get(`${API_URL}/${spend.id}`, { params: { date: spend[SpendFields.DATE] } });
    expect(getRes.status).toBe(200);
    expect(getRes.data[SpendFields.DESCRIPTION]).toBe(newDesc);

    // Step 4: Delete the spend
    const delRes = await axios.delete(`${API_URL}/${spend.id}`, {
      data: { date: spend[SpendFields.DATE] }
    });
    expect(delRes.status).toBe(200);

    // Step 5: GET to verify deletion
    try {
      await axios.get(`${API_URL}/${spend.id}`, { params: { date: spend[SpendFields.DATE] } });
      throw new Error('Should not find deleted spend');
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });
});
