const fs = require('fs');
const path = require('path');
const { parseCSVLine } = require('../utils/csvUtils');
const { SpendFields } = require('../utils/fieldEnums');

const csvFilePath = path.join(__dirname, '../mock_data.csv');

function getSpends() {
  const spends = [];
  const data = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = data.split(/\r?\n/).filter(Boolean);
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 6) continue;
    const [Date, Description, AmountSpent, Category, Vendor, PaymentMode, SpendType] = row;
    spends.push({
      [SpendFields.DATE]: Date.replace(/\//g, '-').replace(/(\d{2})-(\w{3})-(\d{2})/, (m, d, mth, y) => {
        const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
        return `20${y}-${months[mth]}-${d}`;
      }),
      [SpendFields.DESCRIPTION]: Description.trim(),
      [SpendFields.AMOUNT_SPENT]: Number(AmountSpent),
      [SpendFields.CATEGORY]: Category.trim(),
      [SpendFields.VENDOR]: Vendor.trim(),
      [SpendFields.PAYMENT_MODE]: PaymentMode.trim(),
      [SpendFields.SPEND_TYPE]: SpendType ? SpendType.trim().toLowerCase() : 'dynamic',
    });
  }
  return spends;
}

module.exports = { getSpends };
