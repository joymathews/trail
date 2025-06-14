// src/hooks/useSpends.js
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export function useSpends(startDate, endDate) {
  const [spends, setSpends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpends() {
      setLoading(true);
      setError("");
      try {
        if (!startDate || !endDate) {
          setSpends([]);
          setLoading(false);
          return;
        }
        const url = `${API_URL}/spends?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch spends");
        let data = await res.json();
        // Convert date strings to timestamps once for efficient sorting
        data.forEach(item => {
          item._dateTs = new Date(item.Date).getTime();
        });
        data = data.sort((a, b) => b._dateTs - a._dateTs);
        setSpends(data);
      } catch (err) {
        setError(err.message || "Error loading spends");
      }
      setLoading(false);
    }
    fetchSpends();
  }, [startDate, endDate]);

  return { spends, setSpends, loading, error };
}