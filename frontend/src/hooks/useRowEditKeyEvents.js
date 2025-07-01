import { useCallback } from "react";

/**
 * Custom hook to handle Escape/Enter key events for row editing.
 * Returns props to spread on the <tr> element.
 */
export default function useRowEditKeyEvents({ isEditing, onCancel, onSave }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isEditing) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        if (onCancel) onCancel();
      } else if (e.key === "Enter") {
        e.stopPropagation();
        if (onSave) onSave();
      }
    },
    [isEditing, onCancel, onSave]
  );

  return {
    onKeyDown: isEditing ? handleKeyDown : undefined,
    tabIndex: isEditing ? 0 : undefined,
  };
}
