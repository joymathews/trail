import { useState, useRef, useMemo, useEffect } from 'react';
import { getNextFieldKey } from '../utils/spendInputFields';
import { fetchSuggestions } from '../utils/api';

import debounce from 'lodash.debounce';

export function useAutocomplete(fields) {
  const [suggestions, setSuggestions] = useState(
    Object.fromEntries(fields.map(f => [f, []]))
  );
  const [showSuggestions, setShowSuggestions] = useState(
    Object.fromEntries(fields.map(f => [f, false]))
  );
  const [activeSuggestion, setActiveSuggestion] = useState(
    Object.fromEntries(fields.map(f => [f, -1]))
  );
  const inputRefs = Object.fromEntries(fields.map(f => [f, useRef(null)]));



  // Debounced fetch function
  const debouncedFetchFieldSuggestions = useMemo(() =>
    debounce(async (field, value) => {
      if (!value) {
        setSuggestions(s => ({ ...s, [field]: [] }));
        return;
      }
      try {
        const data = await fetchSuggestions(field, value);
        setSuggestions(s => ({ ...s, [field]: data }));
      } catch {
        setSuggestions(s => ({ ...s, [field]: [] }));
      }
    }, 300), []
  );

  // Cleanup effect to cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchFieldSuggestions.cancel();
    };
  }, [debouncedFetchFieldSuggestions]);

  // Wrapper to match previous API
  const fetchFieldSuggestions = (field, value) => {
    debouncedFetchFieldSuggestions(field, value);
  };

  const handleSuggestionClick = (field, suggestion, onChange) => {
    onChange(field, suggestion);
    setShowSuggestions(s => ({ ...s, [field]: false }));
    setSuggestions(s => ({ ...s, [field]: [] }));
    const nextKey = getNextFieldKey(field);
    if (nextKey && inputRefs[nextKey] && inputRefs[nextKey].current) {
      setTimeout(() => inputRefs[nextKey].current.focus(), 0);
    }
  };

  const handleKeyDown = (field, e, onChange) => {
    const suggs = suggestions[field] || [];
    if (e.key === "ArrowDown") {
      setActiveSuggestion(a => ({ ...a, [field]: Math.min(a[field] + 1, suggs.length - 1) }));
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion(a => ({ ...a, [field]: Math.max(a[field] - 1, 0) }));
    } else if (e.key === "Enter" && activeSuggestion[field] >= 0) {
      handleSuggestionClick(field, suggs[activeSuggestion[field]], onChange);
    } else if (e.key === "Escape") {
      setShowSuggestions(s => ({ ...s, [field]: false }));
    }
  };

  return {
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    activeSuggestion,
    setActiveSuggestion,
    inputRefs,
    fetchFieldSuggestions,
    handleSuggestionClick,
    handleKeyDown
  };
}
