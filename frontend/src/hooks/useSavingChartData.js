import { fetchSavingSum } from '../utils/api';
import { useDashboardChartData } from './useDashboardChartData';

export const useSavingChartData = (dateRange) =>
  useDashboardChartData(dateRange, fetchSavingSum);
