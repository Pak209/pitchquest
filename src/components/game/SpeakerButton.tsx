"use client";

import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpeakerButton({
  onClick,
  disabled,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Play sound"
      className={cn(
        "flex h-36 w-36 items-center justify-center rounded-full bg-sky-600/90 text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-500 active:scale-95 disabled:opacity-50",
        "ring-4 ring-sky-400/30",
        className
      )}
    >
      <Volume2 className="h-14 w-14" />
    </button>
  );
}
