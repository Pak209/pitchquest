"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SessionEnd({
  correct,
  total,
  xp,
  title = "Quest Complete!",
  extra,
}: {
  correct: number;
  total: number;
  xp: number;
  title?: string;
  extra?: React.ReactNode;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <Card className="mx-auto max-w-sm p-6 text-center">
      <div className="mb-2 text-5xl">⭐</div>
      <h2 className="mb-1 text-2xl font-bold text-star">{title}</h2>
      <p className="mb-4 text-white/80">
        {correct} / {total} correct · {pct}%
      </p>
      <p className="mb-6 text-lg font-bold text-mint">+{xp} XP</p>
      {extra}
      <div className="flex flex-col gap-2">
        <Button size="lg" onClick={() => window.location.reload()}>
          Play Again
        </Button>
        <Link href="/quest">
          <Button variant="outline" size="lg" className="w-full">
            Choose Quest
          </Button>
        </Link>
      </div>
    </Card>
  );
}
