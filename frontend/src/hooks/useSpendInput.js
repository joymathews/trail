import { useState } from "react";
import { formatDate } from "../utils/date";
import { SpendFields } from "../utils/fieldEnums";
import { useSpends } from "../hooks/useSpends";

const blankSpend = {
  [SpendFields.DATE]: formatDate(new Date()),
  [SpendFields.CATEGORY]: "",
  [SpendFields.DESCRIPTION]: "",
  [SpendFields.AMOUNT_SPENT]: "",
  [SpendFields.VENDOR]: "",
  [SpendFields.PAYMENT_MODE]: "",
  [SpendFields.SPEND_TYPE]: "",
};

const API_URL = import.meta.env.VITE_API_URL;

export function useSpendInput(startDate, endDate) {
  const [inputRow, setInputRow] = useState({ ...blankSpend });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { spends, setSpends, loading, error: fetchError } = useSpends(startDate, endDate);

  const handleInputRowChange = (field, value) => {
    setInputRow((row) => ({
      ...row,
      [field]: value,
    }));
  };

  const handleSaveInputRow = async () => {
    const spend = inputRow;
    if (
      !spend[SpendFields.DATE] ||
      !spend[SpendFields.CATEGORY] ||
      !spend[SpendFields.DESCRIPTION] ||
      !spend[SpendFields.AMOUNT_SPENT] ||
      !spend[SpendFields.SPEND_TYPE]
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/spends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spend),
      });
      if (res.ok) {
        const { spend: newSpend } = await res.json();
        setInputRow({ ...blankSpend });
        setSpends((prev) => [newSpend, ...prev]);
      } else {
        setError("Failed to save spend.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setSaving(false);
    }
  };

  return {
    inputRow,
    setInputRow,
    handleInputRowChange,
    handleSaveInputRow,
    saving,
    error,
    spends,
    setSpends,
    loading,
    fetchError,
  };
}
