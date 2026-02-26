"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ToastTone = "success" | "error";

type ToastState = {
  message: string;
  tone: ToastTone;
} | null;

export function useAdminToast(durationMs = 2500) {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<number | null>(null);

  const clearToastTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      clearToastTimer();
      setToast({ message, tone });

      timerRef.current = window.setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, durationMs);
    },
    [clearToastTimer, durationMs]
  );

  useEffect(() => clearToastTimer, [clearToastTimer]);

  return { toast, showToast };
}
