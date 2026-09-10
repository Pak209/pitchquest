"use client";

import React, { createContext, useContext } from "react";
import { useAppState } from "./useAppState";

type Ctx = ReturnType<typeof useAppState>;

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
