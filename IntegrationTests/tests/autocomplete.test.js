const axios = require('axios');

describe('autocomplete API Integration Tests', () => {
  const AUTOCOMPLETE_URL = 'http://localhost:3001/autocomplete';

  it('should return description suggestions', async () => {
    const searchString = 'Swiggy';
    const res = await axios.get(`${AUTOCOMPLETE_URL}/description`, { params: { q: searchString } });
    expect(res.status).toBe(200);
    res.data.forEach(desc => {
      expect(desc.toLowerCase()).toContain(searchString.toLowerCase());
    });
  });

  it('should return category suggestions', async () => {
    const searchString = 'Food';
    const res = await axios.get(`${AUTOCOMPLETE_URL}/category`, { params: { q: searchString } });
    expect(res.status).toBe(200);
    res.data.forEach(cat => {
      expect(cat.toLowerCase()).toContain(searchString.toLowerCase());
    });
  });

  //vendor suggestion test
  it('should return vendor suggestions', async () => {
    const searchString = 'Amazon';
    const res = await axios.get(`${AUTOCOMPLETE_URL}/vendor`, { params: { q: searchString } });
    expect(res.status).toBe(200);
    res.data.forEach(vendor => {
      expect(vendor.toLowerCase()).toContain(searchString.toLowerCase());
    });
  });

  //Payment method suggestion test
  it('should return payment method suggestions', async () => {
    const searchString = 'Credit';
    const res = await axios.get(`${AUTOCOMPLETE_URL}/paymentMode`, { params: { q: searchString } });
    expect(res.status).toBe(200);
    res.data.forEach(method => {
      expect(method.toLowerCase()).toContain(searchString.toLowerCase());
    });
  });

  //invalid autocomplete test
  it('should return empty array for invalid autocomplete type', async () => {
    const searchString = 'InvalidType';
    try
    {
      const res = await axios.get(`${AUTOCOMPLETE_URL}/invalid`, { params: { q: searchString } });
      fail('Expected request to fail with 400');
    }
    catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({ error: 'Invalid autocomplete field' });
    }
  });


});
