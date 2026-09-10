"use client";

import { StarryBackground } from "./StarryBackground";
import { BottomNav } from "./BottomNav";
import { AppProvider } from "@/hooks/AppProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <StarryBackground>
        <div className="mx-auto min-h-dvh w-full max-w-lg px-4 pb-24 pt-4">
          {children}
        </div>
        <BottomNav />
      </StarryBackground>
    </AppProvider>
  );
}
