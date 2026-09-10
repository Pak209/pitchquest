"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FeedbackCard({
  correct,
  message,
  onNext,
  onReplay,
}: {
  correct: boolean;
  message: string;
  onNext: () => void;
  onReplay?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <Card className="w-full max-w-sm border-0 bg-parchment p-5 text-navy shadow-2xl">
        <div className="mb-3 text-center text-5xl">{correct ? "🦁" : "🐼"}</div>
        <p className="mb-1 text-center text-sm font-semibold uppercase tracking-wide text-navy/60">
          {correct ? "Correct!" : "Not quite!"}
        </p>
        <p className="mb-5 text-center text-lg font-bold">{message}</p>
        <div className="flex flex-col gap-2">
          {!correct && onReplay && (
            <Button variant="secondary" size="lg" onClick={onReplay}>
              Play Again
            </Button>
          )}
          <Button size="lg" onClick={onNext}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
