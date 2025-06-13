// backend/services/filterService.js

function filterExpenseType(spend) {
  return (
    spend.SpendType &&
    ['fixed', 'dynamic'].includes(spend.SpendType.toLowerCase())
  );
}

function filterSaving(spend) {
  return spend.SpendType && spend.SpendType.toLowerCase() === 'saving';
}

function filterDynamic(spend) {
  return spend.SpendType && spend.SpendType.toLowerCase() === 'dynamic';
}

module.exports = {
  filterExpenseType,
  filterSaving,
  filterDynamic,
};
