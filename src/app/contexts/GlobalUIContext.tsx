"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface GlobalUIContextType {
  showAppointmentForm: boolean;
  openAppointmentForm: () => void;
  closeAppointmentForm: () => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

export function GlobalUIProvider({ children }: { children: ReactNode }) {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const openAppointmentForm = useCallback(() => {
    setShowAppointmentForm(true);
  }, []);

  const closeAppointmentForm = useCallback(() => {
    setShowAppointmentForm(false);
  }, []);

  return (
    <GlobalUIContext.Provider
      value={{
        showAppointmentForm,
        openAppointmentForm,
        closeAppointmentForm,
      }}
    >
      {children}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  if (context === undefined) {
    throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  }
  return context;
}
