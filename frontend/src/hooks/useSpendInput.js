import { useState, useMemo } from "react";
import { useAutocomplete } from "./useAutocomplete";
import { spendFieldConfig } from "../components/spendSheet/spendFieldConfig";
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
  [SpendFields.SPEND_TYPE]: "dynamic", // Default to dynamic
};

export function useSpendInput(startDate, endDate) {
  // Memoize autocomplete fields for performance
  const autoCompleteFields = useMemo(
    () => spendFieldConfig.filter(f => f.autoComplete).map(f => f.key),
    []
  );

  // Autocomplete hooks for add and edit row
  const addRowAutocomplete = useAutocomplete(autoCompleteFields);
  const editRowAutocomplete = useAutocomplete(autoCompleteFields);

  // No need for lastUsedDate state; just use the last added date directly
  const [inputRow, setInputRow] = useState(() => ({
    ...blankSpend,
    [SpendFields.DATE]: blankSpend[SpendFields.DATE],
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { spends, setSpends, loading, error: fetchError } = useSpends(startDate, endDate);

  const handleInputRowChange = (field, value) => {
    setInputRow((row) => ({
      ...row,
      [field]: value,
    }));
  };

  // Shared suggestion-fetching helper
  const fetchSuggestionsForField = (key, value, autocomplete) => {
    if (autoCompleteFields.includes(key)) {
      autocomplete.fetchFieldSuggestions(key, value);
      autocomplete.setShowSuggestions(s => ({ ...s, [key]: true }));
    }
  };

  // Handler for add row input change (with autocomplete)
  const handleAddRowInputChange = (key, value) => {
    handleInputRowChange(key, value);
    fetchSuggestionsForField(key, value, addRowAutocomplete);
  };

  // Handler for edit row input change (with autocomplete)
  const handleEditRowInputChange = (key, value, setEditRow) => {
    setEditRow(r => ({ ...r, [key]: value }));
    fetchSuggestionsForField(key, value, editRowAutocomplete);
  };

  // Handler for saving add row and updating last used date
  const handleSaveInputRowWithDate = async () => {
    const dateValue = inputRow[SpendFields.DATE];
    await handleSaveInputRow();
    setInputRow(row => ({
      ...blankSpend,
      [SpendFields.DATE]: dateValue || blankSpend[SpendFields.DATE],
    }));
  };

  const handleSaveInputRow = async () => {
    const spend = inputRow;
    if (
      !spend[SpendFields.DATE] ||
      !spend[SpendFields.AMOUNT_SPENT] ||
      !spend[SpendFields.SPEND_TYPE]
    ) {
      setError("Please fill DATE, AMOUNT_SPENT, SPEND_TYPE fields.");
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
    handleInputRowChange,
    handleAddRowInputChange,
    handleEditRowInputChange,
    handleSaveInputRowWithDate,
    addRowAutocomplete,
    editRowAutocomplete,
    saving,
    error,
    spends,
    loading,
    fetchError,
    handleDeleteSpend,
    handleEditSpend,
  };
}
