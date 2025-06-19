// src/hooks/useSpends.js
import { useState, useEffect } from "react";
import { SpendFields } from "../utils/fieldEnums";
import { fetchSpends } from '../utils/api';

export function useSpends(startDate, endDate) {
  const [spends, setSpends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpendsData() {
      setLoading(true);
      setError("");
      try {
        if (!startDate || !endDate) {
          setSpends([]);
          setLoading(false);
          return;
        }
        const data = await fetchSpends(startDate, endDate);
        // Convert date strings to timestamps once for efficient sorting
        data.forEach(item => {
          item._dateTs = new Date(item[SpendFields.DATE]).getTime();
        });
        const sorted = data.sort((a, b) => b._dateTs - a._dateTs);
        setSpends(sorted);
      } catch (err) {
        setError(err.message || "Error loading spends");
      }
      setLoading(false);
    }
    fetchSpendsData();
  }, [startDate, endDate]);

  return { spends, setSpends, loading, error };
}