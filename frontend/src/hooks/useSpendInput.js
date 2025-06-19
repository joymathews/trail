import { useState } from "react";
import { formatDate } from "../utils/date";
import { SpendFields } from "../utils/fieldEnums";
import { useSpends } from "../hooks/useSpends";
import { saveSpend } from '../utils/api';

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
