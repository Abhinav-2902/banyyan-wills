import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
  data: T;
  saveAction: (data: T) => Promise<void>;
  debounceMs?: number;
}

/**
 * Custom hook for auto-saving form data with debouncing
 * @param data - The form data to save
 * @param saveAction - The async function to call for saving
 * @param debounceMs - Debounce delay in milliseconds (default: 1000)
 * @returns savingStatus - Current save status
 */
export function useAutoSave<T>({
  data,
  saveAction,
  debounceMs = 1000,
}: UseAutoSaveOptions<T>): SaveStatus {
  const [savingStatus, setSavingStatus] = useState<SaveStatus>("idle");
  const previousDataRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Serialize data for comparison
    const currentDataString = JSON.stringify(data);

    // Check if data has actually changed
    if (currentDataString === previousDataRef.current) {
      return;
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        setSavingStatus("saving");
        await saveAction(data);
        setSavingStatus("saved");
        previousDataRef.current = currentDataString;

        // Reset to idle after showing "saved" for 2 seconds
        resetTimeoutRef.current = setTimeout(() => {
          setSavingStatus("idle");
        }, 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSavingStatus("error");

        // Reset to idle after showing error for 3 seconds
        resetTimeoutRef.current = setTimeout(() => {
          setSavingStatus("idle");
        }, 3000);
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [data, saveAction, debounceMs]);

  return savingStatus;
}
