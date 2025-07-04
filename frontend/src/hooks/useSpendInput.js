import { useState } from "react";
import { formatDate } from "../utils/date";
import { SpendFields } from "../utils/fieldEnums";
import { useSpends } from "../hooks/useSpends";
import { saveSpend, deleteSpend, editSpend } from '../utils/api';

const blankSpend = {
  [SpendFields.DATE]: formatDate(new Date()),
  [SpendFields.CATEGORY]: "",
  [SpendFields.DESCRIPTION]: "",
  [SpendFields.AMOUNT_SPENT]: "",
  [SpendFields.VENDOR]: "",
  [SpendFields.PAYMENT_MODE]: "",
  [SpendFields.SPEND_TYPE]: "",
};

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
        const { spend: newSpend } = await saveSpend(spend);
        setInputRow({ ...blankSpend });
        setSpends((prev) => [newSpend, ...prev]);
      } catch {
        setError("Failed to save spend.");
      } finally {
      setSaving(false);
    }
  };

  const handleEditSpend = async (id, date, updates) => {
    // Only allow specific fields to be updated
    const allowed = [
      SpendFields.CATEGORY,
      SpendFields.DESCRIPTION,
      SpendFields.AMOUNT_SPENT,
      SpendFields.VENDOR,
      SpendFields.PAYMENT_MODE,
      SpendFields.SPEND_TYPE
    ];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowed.includes(key))
    );
    try {
      await editSpend(id, date, filteredUpdates);
      setSpends((prev) => prev.map((s) =>
        s.id === id ? { ...s, ...filteredUpdates } : s
      ));
    } catch {
      setError('Failed to edit spend.');
    }
  };
  const handleDeleteSpend = async (id, date) => {
    if (!window.confirm('Are you sure you want to delete this spend?')) return;
    try {
      await deleteSpend(id, date);
      setSpends((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Failed to delete spend.');
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
    handleDeleteSpend,
    handleEditSpend,
  };
}
