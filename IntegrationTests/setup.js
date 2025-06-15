const axios = require('axios');
const { getSpends } = require('./testData/spends');

module.exports = async () => {
  const API_URL = 'http://localhost:3001/spends';
  const spends = getSpends();

  for (const spend of spends) {
    await axios.post(API_URL, spend);
  }
};
