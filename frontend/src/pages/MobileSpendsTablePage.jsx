import React, { useMemo, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import usePersistentDateRange from "../hooks/usePersistentDateRange";
import { useSpends } from "../hooks/useSpends";
import DateRangePicker from "../components/DateRangePicker";
import Header from "../components/Header";
import "./MobileSpendsTablePage.scss";

// Utility to get unique vendors from spends
function getUniqueVendors(spends) {
  const vendors = spends.map(s => s.vendor).filter(Boolean);
  return Array.from(new Set(vendors)).sort();
}

export default function MobileSpendsTablePage({ onSignOut }) {
  const isMobile = useIsMobile(1024);
  const [dateRange, setDateRange] = usePersistentDateRange();
  const { spends, loading, error } = useSpends(dateRange.start, dateRange.end);
  const [vendorFilter, setVendorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Get unique vendors and dates for dropdowns
  const uniqueVendors = useMemo(() => getUniqueVendors(spends), [spends]);
  const uniqueDates = useMemo(() => {
    const dates = spends.map(s => s.date).filter(Boolean);
    return Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  }, [spends]);

  // Filtered spends
  const filteredSpends = useMemo(() => {
    let result = spends;
    if (vendorFilter) {
      result = result.filter(s => s.vendor === vendorFilter);
    }
    if (dateFilter) {
      result = result.filter(s => s.date === dateFilter);
    }
    return result;
  }, [spends, vendorFilter, dateFilter]);

  if (!isMobile) {
    // Optionally redirect or show nothing on desktop
    return null;
  }

  return (
    <div className="mobile-spends-table-page">
      <Header onSignOut={onSignOut} />
      <h2>Spends</h2>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <div className="filter-row">
        <div className="dropdown-filter">
          <label htmlFor="date-filter">Date</label>
          <select
            id="date-filter"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          >
            <option value="">All</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-filter">
          <label htmlFor="vendor-filter">Vendor</label>
          <select
            id="vendor-filter"
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
          >
            <option value="">All</option>
            {uniqueVendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>
        </div>
        {(vendorFilter || dateFilter) && (
          <button className="clear-filter" onClick={() => { setVendorFilter(""); setDateFilter(""); }}>Clear</button>
        )}
      </div>
      <div className="table-wrapper">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredSpends.length === 0 ? (
          <div className="empty">No spends found.</div>
        ) : (
          <table className="spends-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpends.map((spend, idx) => (
                <tr key={spend.id || idx}>
                  <td>{spend.date}</td>
                  <td>{spend.vendor}</td>
                  <td>{spend.amountSpent ?? spend.amount ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
