"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpeakerButton } from "@/components/game/SpeakerButton";
import { playNote, resumeAudio } from "@/lib/audio/engine";
import { KID_NOTE_MAP } from "@/lib/kid-labels";
import type { NaturalNote } from "@/lib/audio/notes";

const NOTES = Object.keys(KID_NOTE_MAP) as NaturalNote[];

export default function LearningModePage() {
  const { activeProfile, hydrated } = useApp();
  const router = useRouter();
  const [note, setNote] = useState<NaturalNote>("C");

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  if (!activeProfile) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  const info = KID_NOTE_MAP[note];
  const timbre = activeProfile.instrument;

  const hear = async () => {
    await resumeAudio();
    await playNote(note, 4, { timbre, duration: 1 });
  };

  return (
    <main className="flex flex-col items-center gap-5 pt-4">
      <h1 className="text-2xl font-extrabold text-star">Son&apos;s Learning Mode</h1>
      <div className="text-7xl">🐱</div>
      <Card className="w-full p-5 text-center">
        <p className="mb-2 text-3xl font-extrabold text-star">
          {note} = {info.animal} {info.emoji}
        </p>
        <p className="text-lg text-white/80">Say it with me… {info.say}</p>
      </Card>
      <SpeakerButton onClick={hear} />
      <div className="grid w-full grid-cols-4 gap-2">
        {NOTES.map((n) => (
          <Button
            key={n}
            variant={n === note ? "default" : "outline"}
            onClick={async () => {
              setNote(n);
              await resumeAudio();
              await playNote(n, 4, { timbre, duration: 0.7 });
            }}
          >
            {KID_NOTE_MAP[n].emoji} {n}
          </Button>
        ))}
      </div>
    </main>
  );
}
