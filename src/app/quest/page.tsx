"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Music2,
  ArrowLeftRight,
  Piano,
  Swords,
  Guitar,
  Cat,
} from "lucide-react";
import { useApp } from "@/hooks/AppProvider";
import { Card } from "@/components/ui/card";

const modes = [
  {
    href: "/play/note-finder",
    title: "Note Finder",
    desc: "Recognize single notes",
    color: "bg-emerald-500",
    icon: Music2,
  },
  {
    href: "/play/intervals",
    title: "Interval Explorer",
    desc: "Hear the distance",
    color: "bg-sky-500",
    icon: ArrowLeftRight,
  },
  {
    href: "/play/chords",
    title: "Chord Quest",
    desc: "Identify major vs minor",
    color: "bg-violet-500",
    icon: Piano,
  },
  {
    href: "/play/instruments",
    title: "Instrument Mode",
    desc: "Same note, different sounds",
    color: "bg-orange-500",
    icon: Guitar,
  },
  {
    href: "/play/duel",
    title: "Dad vs Son",
    desc: "Challenge each other",
    color: "bg-rose-500",
    icon: Swords,
  },
  {
    href: "/play/learning",
    title: "Learning Mode",
    desc: "C = Cat, say it with me",
    color: "bg-amber-500",
    icon: Cat,
  },
];

export default function QuestPage() {
  const { activeProfile, hydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  if (!activeProfile) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  return (
    <main className="flex flex-col gap-4 pt-2">
      <div>
        <p className="text-sm text-white/60">Playing as {activeProfile.displayName}</p>
        <h1 className="text-2xl font-extrabold text-star">Choose a Quest</h1>
      </div>

      <div className="flex flex-col gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href}>
              <Card className="flex items-center gap-3 p-3 transition hover:border-mint/30 hover:bg-navy-elev">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${m.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold">{m.title}</div>
                  <div className="text-sm text-white/65">{m.desc}</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
