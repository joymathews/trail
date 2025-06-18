import { SpendFields } from '../utils/fieldEnums';
import { formatDate } from '../utils/date';

export function validateChartData(data, spendField) {
  return (data || []).filter(item => {
    if (!item) return false;
    if ((item.date === undefined && item.key === undefined) || item.value === undefined) return false;
    if (item.date !== undefined && spendField === SpendFields.DATE) {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return false;
    }
    if (typeof item.value !== 'number' || isNaN(item.value)) return false;
    return true;
  });
}

export function formatYAxisTick(value) {
  if (!value && value !== 0) return '';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value;
}

export function formatXAxisDate(dateStr) {
  try {
    if (dateStr === null || dateStr === undefined || dateStr === '') return 'N/A';
    let dateInput = dateStr;
    if (typeof dateStr === 'number' || (typeof dateStr === 'string' && !isNaN(Number(dateStr)))) {
      const timestamp = Number(dateStr);
      if (timestamp < 946684800000 || timestamp > 2524608000000) {
        return String(dateStr);
      }
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return typeof dateStr === 'object' ? 'Invalid Date' : String(dateStr);
    try {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    }
  } catch {
    return typeof dateStr === 'object' ? 'Invalid Date' : String(dateStr);
  }
}
