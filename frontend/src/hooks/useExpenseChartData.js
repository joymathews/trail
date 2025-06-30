import { fetchExpenseSum } from '../utils/api';
import { useDashboardChartData } from './useDashboardChartData';

export const useExpenseChartData = (dateRange) =>
  useDashboardChartData(dateRange, fetchExpenseSum);
