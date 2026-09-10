"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/hooks/AppProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { playNote, resumeAudio, type Timbre, TIMBRE_LABELS } from "@/lib/audio/engine";

const INSTRUMENTS: { id: Timbre; emoji: string; label: string }[] = [
  { id: "piano", emoji: "🎹", label: "Piano" },
  { id: "pad", emoji: "🎸", label: "Guitar-ish" },
  { id: "sine", emoji: "🎻", label: "Violin-ish" },
  { id: "bell", emoji: "🔔", label: "Bell" },
  { id: "organ", emoji: "🎺", label: "Trumpet/Organ" },
  { id: "triangle", emoji: "🎤", label: "Voice-ish" },
];

export default function InstrumentModePage() {
  const { activeProfile, hydrated, changeInstrument } = useApp();
  const router = useRouter();
  const [previewNote] = useState("C");

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  if (!activeProfile) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  const pick = async (t: Timbre) => {
    changeInstrument(t);
    await resumeAudio();
    await playNote(previewNote, 4, { timbre: t, duration: 0.9 });
  };

  return (
    <main className="flex flex-col gap-4 pt-2">
      <div>
        <h1 className="text-2xl font-extrabold text-star">Instrument Mode</h1>
        <p className="text-sm text-white/70">
          Pick a sound — saved for {activeProfile.displayName}. Then jump into Note Finder.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {INSTRUMENTS.map((ins) => {
          const active = activeProfile.instrument === ins.id;
          return (
            <button
              key={ins.id}
              type="button"
              onClick={() => pick(ins.id)}
              className={`rounded-2xl border p-4 text-center transition ${
                active
                  ? "border-mint bg-mint/15 shadow-glow"
                  : "border-white/10 bg-navy-card hover:bg-navy-elev"
              }`}
            >
              <div className="mb-2 text-4xl">{ins.emoji}</div>
              <div className="font-bold">{ins.label}</div>
              <div className="text-xs text-white/50">{TIMBRE_LABELS[ins.id]}</div>
            </button>
          );
        })}
      </div>

      <Card className="p-4 text-sm text-white/75">
        Current: <span className="font-bold text-mint">{activeProfile.instrument}</span>
        . Preview plays C4 with that timbre.
      </Card>

      <Link href="/play/note-finder">
        <Button size="lg" className="w-full">
          Play Note Finder
        </Button>
      </Link>
    </main>
  );
}
