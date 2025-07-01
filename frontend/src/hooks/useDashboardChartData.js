import { useState, useEffect } from 'react';
import { SpendFields } from '../utils/fieldEnums';

export function useDashboardChartData(dateRange, fetchSumFn) {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    date: [],
    category: [],
    vendor: [],
    paymentMode: [],
    spendType: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      if (!dateRange.start || !dateRange.end) return;
      setLoading(true);
      const fields = [
        SpendFields.DATE,
        SpendFields.CATEGORY,
        SpendFields.VENDOR,
        SpendFields.PAYMENT_MODE,
        SpendFields.SPEND_TYPE
      ];
      const newChartData = {
        date: [],
        category: [],
        vendor: [],
        paymentMode: [],
        spendType: []
      };
      try {
        await Promise.all(fields.map(async (field) => {
          const data = await fetchSumFn(dateRange.start, dateRange.end, field);
          if (field === SpendFields.DATE) {
            newChartData.date = data.map(item => ({ date: item.key, value: item.value }));
          } else if (field === SpendFields.CATEGORY) {
            newChartData.category = data;
          } else if (field === SpendFields.VENDOR) {
            newChartData.vendor = data;
          } else if (field === SpendFields.PAYMENT_MODE) {
            newChartData.paymentMode = data;
          } else if (field === SpendFields.SPEND_TYPE) {
            newChartData.spendType = data;
          }
        }));
        setChartData(newChartData);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [dateRange.start, dateRange.end, fetchSumFn]);

  return { loading, chartData };
}
