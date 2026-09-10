"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SpeakerButton } from "@/components/game/SpeakerButton";
import { Lives } from "@/components/game/Lives";
import { FeedbackCard } from "@/components/game/FeedbackCard";
import { SessionEnd } from "@/components/game/SessionEnd";
import { playChord, resumeAudio } from "@/lib/audio/engine";
import { makeChordQuestion } from "@/lib/game/chords";
import { xpForSession, sessionLength } from "@/lib/game/note-finder";

type Q = ReturnType<typeof makeChordQuestion>;

export default function ChordQuestPage() {
  const { activeProfile, hydrated, completeSession } = useApp();
  const router = useRouter();
  const total = useMemo(() => sessionLength(), []);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [q, setQ] = useState<Q | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [done, setDone] = useState(false);
  const [xp, setXp] = useState(0);
  const [arp, setArp] = useState(false);
  const correctRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  useEffect(() => {
    if (activeProfile && !q && !done) setQ(makeChordQuestion());
  }, [activeProfile, q, done]);

  const timbre = activeProfile?.instrument ?? "piano";

  const hear = async () => {
    if (!q) return;
    await resumeAudio();
    await playChord(q.chord.notes, arp ? "arpeggio" : "simultaneous", {
      timbre,
      duration: 1.1,
    });
  };

  useEffect(() => {
    if (q && !feedback) {
      const t = setTimeout(() => {
        playChord(q.chord.notes, arp ? "arpeggio" : "simultaneous", {
          timbre,
          duration: 1.1,
        }).catch(() => undefined);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [q, feedback, timbre, arp]);

  const answer = (choice: "major" | "minor") => {
    if (!q || feedback) return;
    const ok = choice === q.answer;
    if (ok) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
      setFeedback({
        correct: true,
        message: `${q.chord.emoji} That was ${q.chord.kidLabel}!`,
      });
    } else {
      livesRef.current = Math.max(0, livesRef.current - 1);
      setLives(livesRef.current);
      setFeedback({
        correct: false,
        message: `That was ${q.chord.kidLabel}. Listen again!`,
      });
    }
  };

  const onNext = () => {
    if (!feedback) return;
    const nextIndex = index + 1;
    if (nextIndex >= total || (!feedback.correct && livesRef.current <= 0)) {
      const earned = xpForSession(correctRef.current, total);
      setXp(earned);
      completeSession({
        mode: "chords",
        correct: correctRef.current,
        total,
        xpEarned: earned,
      });
      setDone(true);
      setFeedback(null);
      return;
    }
    setIndex(nextIndex);
    setQ(makeChordQuestion());
    setFeedback(null);
  };

  if (!activeProfile || (!q && !done)) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }
  if (done) {
    return (
      <div className="pt-8">
        <SessionEnd correct={correctCount} total={total} xp={xp} title="Chord Quest Complete!" />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 pt-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-white/70">
          <span>Chord Quest</span>
          <span>
            {index + 1} / {total}
          </span>
        </div>
        <Progress value={((index + 1) / total) * 100} />
      </div>
      <p className="text-center text-lg font-bold">Major or Minor?</p>
      <div className="flex justify-center">
        <SpeakerButton onClick={hear} />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant={arp ? "outline" : "default"}
          onClick={() => setArp(false)}
        >
          Together
        </Button>
        <Button
          size="sm"
          variant={arp ? "default" : "outline"}
          onClick={() => setArp(true)}
        >
          Arpeggio
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q!.choices.map((c) => (
          <Button
            key={c.id}
            size="xl"
            variant="outline"
            className="h-28 flex-col text-xl"
            disabled={!!feedback}
            onClick={() => answer(c.id)}
          >
            <span className="text-3xl">{c.emoji}</span>
            {c.label}
          </Button>
        ))}
      </div>
      <Lives count={lives} />
      {feedback && (
        <FeedbackCard
          correct={feedback.correct}
          message={feedback.message}
          onNext={onNext}
          onReplay={hear}
        />
      )}
    </main>
  );
}
