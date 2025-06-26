// backend/services/filterService.js
const { SpendFields } = require('../utils/fieldEnums');

function filterExpenseType(spend) {
  return (
    spend[SpendFields.SPEND_TYPE] &&
    ['fixed', 'dynamic'].includes(spend[SpendFields.SPEND_TYPE].toLowerCase())
  );
}

function filterSaving(spend) {
  return spend[SpendFields.SPEND_TYPE] && spend[SpendFields.SPEND_TYPE].toLowerCase() === 'saving';
}

function filterDynamic(spend) {
  return spend[SpendFields.SPEND_TYPE] && spend[SpendFields.SPEND_TYPE].toLowerCase() === 'dynamic';
}

module.exports = {
  filterExpenseType,
  filterSaving,
  filterDynamic,
};
