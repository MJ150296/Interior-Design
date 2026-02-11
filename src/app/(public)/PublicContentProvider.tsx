"use client";

import { createContext, useContext } from "react";
import type { PublicContentBundle } from "@/app/types/content/public";

const PublicContentContext = createContext<PublicContentBundle | null>(null);

export function PublicContentProvider({
  value,
  children,
}: {
  value: PublicContentBundle;
  children: React.ReactNode;
}) {
  return (
    <PublicContentContext.Provider value={value}>
      {children}
    </PublicContentContext.Provider>
  );
}

export function usePublicContent() {
  const ctx = useContext(PublicContentContext);
  if (!ctx) {
    throw new Error("usePublicContent must be used within PublicContentProvider");
  }
  return ctx;
}
