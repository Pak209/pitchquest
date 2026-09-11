"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Card } from "@/components/ui/card";
import { Progress, RingProgress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { noteAccuracy, overallMasteryPercent } from "@/lib/storage/mastery";
import { UNLOCK_STAGES } from "@/lib/game/progression";
import { levelProgress } from "@/lib/game/progression";

type Tab = "Notes" | "Intervals" | "Chords";

export default function ProgressPage() {
  const { activeProfile, hydrated } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Notes");

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  if (!activeProfile) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  const overall = overallMasteryPercent(activeProfile);
  const sessions = activeProfile.sessions.length;
  const last = activeProfile.sessions[0];
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const masteredCount = activeProfile.unlockedNotes.filter(
    (n) => activeProfile.mastery[n]?.mastered
  ).length;

  return (
    <main className="flex flex-col gap-4 pt-2">
      <h1 className="text-2xl font-extrabold text-star">Progress</h1>
      <p className="text-sm text-white/60">{activeProfile.displayName}&apos;s mastery</p>

      <div className="flex justify-center">
        <RingProgress value={overall} label="Overall" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-star">{sessions}</div>
          <div className="text-xs text-white/60">Sessions</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-orange-300">
            {activeProfile.streakDays}
          </div>
          <div className="text-xs text-white/60">Streak</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-bold text-mint">{activeProfile.xp}</div>
          <div className="text-xs text-white/60">XP</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-1 flex justify-between text-sm">
          <span>Level {activeProfile.level}</span>
          <span className="text-white/60">
            {activeProfile.xp % 100} / 100 to next
          </span>
        </div>
        <Progress value={levelProgress(activeProfile.xp) * 100} />
        <p className="mt-2 text-xs text-white/55">
          Mastered notes: {masteredCount} / {activeProfile.unlockedNotes.length} unlocked
        </p>
        {last && (
          <p className="mt-1 text-xs text-white/55">
            Last session: {last.mode} · {last.correct}/{last.total} ·{" "}
            {new Date(last.at).toLocaleString()}
          </p>
        )}
      </Card>

      <div className="flex gap-2">
        {(["Notes", "Intervals", "Chords"] as Tab[]).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      {tab === "Notes" && (
        <Card className="flex flex-col gap-3 p-4">
          {notes.map((n) => {
            const unlocked = activeProfile.unlockedNotes.includes(n);
            const acc = noteAccuracy(activeProfile.mastery[n]) * 100;
            const mastered = activeProfile.mastery[n]?.mastered;
            return (
              <div key={n}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className={unlocked ? "font-bold" : "text-white/35"}>
                    {n} {mastered ? "✓" : ""}
                  </span>
                  <span className="text-white/60">
                    {unlocked ? `${Math.round(acc)}%` : "Locked"}
                  </span>
                </div>
                <Progress
                  value={unlocked ? acc : 0}
                  barClassName={
                    mastered
                      ? "bg-star"
                      : acc >= 90
                        ? "bg-mint"
                        : acc >= 50
                          ? "bg-sky-400"
                          : "bg-rose-400"
                  }
                />
              </div>
            );
          })}
        </Card>
      )}

      {tab === "Intervals" && (
        <Card className="p-4 text-sm text-white/75">
          Interval accuracy tracks across Interval Explorer sessions. Keep playing
          Unison, Octave, P5, and M3 to fill this board in a future update — session
          history still counts toward XP and streak.
        </Card>
      )}

      {tab === "Chords" && (
        <Card className="p-4 text-sm text-white/75">
          Chord Quest MVP focuses on Major vs Minor. Detailed per-chord bars unlock
          as you play more sessions.
        </Card>
      )}

      <Card className="p-4">
        <h2 className="mb-3 font-bold text-star">Unlock path</h2>
        <ul className="space-y-2 text-sm">
          {UNLOCK_STAGES.slice(0, 2).map((s) => {
            const have = s.notes.every((n) =>
              activeProfile.unlockedNotes.includes(n)
            );
            return (
              <li key={s.id} className="flex items-center gap-2">
                <span>{s.icon}</span>
                <span className={have ? "text-mint" : "text-white/55"}>
                  {s.label} {have ? "✓" : ""}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-white/50">
          Unlock rule: ≥90% accuracy on each unlocked note across 3 sessions (not XP-gated).
        </p>
      </Card>
    </main>
  );
}
