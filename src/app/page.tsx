"use client";

import { useRouter } from "next/navigation";
import { Music, Flame } from "lucide-react";
import { useApp } from "@/hooks/AppProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProfileId } from "@/lib/storage/types";
import { resumeAudio } from "@/lib/audio/engine";

function Avatar({ id }: { id: ProfileId }) {
  return (
    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-navy-elev text-4xl ring-4 ring-white/10">
      {id === "son" ? "🧒" : "🧔"}
    </div>
  );
}

export default function HomePage() {
  const { state, hydrated, selectProfile, activeProfile } = useApp();
  const router = useRouter();


  if (!hydrated || !state) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/60">
        Loading…
      </div>
    );
  }

  const pick = async (id: ProfileId) => {
    await resumeAudio();
    selectProfile(id);
    router.push("/quest");
  };

  const son = state.profiles.son;
  const dad = state.profiles.dad;
  const streak = activeProfile?.streakDays ?? Math.max(son.streakDays, dad.streakDays);
  const totalXp = son.xp + dad.xp;

  return (
    <main className="flex flex-col gap-6 pt-6">
      <header className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-star" />
          <h1 className="text-3xl font-extrabold tracking-wide text-star">
            PITCH QUEST
          </h1>
        </div>
        <p className="text-sm text-white/70">
          Train your ears. Explore the music. Level up together.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        {([son, dad] as const).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            className="rounded-2xl border border-white/10 bg-navy-card p-4 text-center shadow-card transition hover:border-mint/40 hover:bg-navy-elev active:scale-[0.98]"
          >
            <Avatar id={p.id} />
            <div className="text-lg font-bold">{p.displayName}</div>
            <div className="mt-1 inline-block rounded-full bg-mint/20 px-2 py-0.5 text-xs font-bold text-mint">
              Lv. {p.level}
            </div>
          </button>
        ))}
      </section>

      <Card className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-bold text-orange-300">
          <Flame className="h-5 w-5 fill-orange-400 text-orange-400" />
          {streak} Day Streak
        </div>
        <div className="text-sm font-semibold text-star">{totalXp} XP</div>
      </Card>

      {activeProfile && (
        <Button variant="outline" onClick={() => router.push("/quest")}>
          Continue as {activeProfile.displayName}
        </Button>
      )}
    </main>
  );
}
