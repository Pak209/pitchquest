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
import { playNotesSequential, playNotesTogether, resumeAudio } from "@/lib/audio/engine";
import { makeIntervalQuestion } from "@/lib/game/intervals";
import { xpForSession, sessionLength } from "@/lib/game/note-finder";

type Q = ReturnType<typeof makeIntervalQuestion>;

export default function IntervalExplorerPage() {
  const { activeProfile, hydrated, completeSession } = useApp();
  const router = useRouter();
  const kidMode = activeProfile?.id === "son";
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
  const [together, setTogether] = useState(false);
  const correctRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  useEffect(() => {
    if (activeProfile && !q && !done) setQ(makeIntervalQuestion(kidMode));
  }, [activeProfile, q, done, kidMode]);

  const timbre = activeProfile?.instrument ?? "piano";

  const hear = async () => {
    if (!q) return;
    await resumeAudio();
    const notes = [q.root, q.second];
    if (together) {
      await playNotesTogether(notes, { timbre, duration: 1 });
    } else {
      await playNotesSequential(notes, { timbre, duration: 0.5, gap: 0.55 });
    }
  };

  useEffect(() => {
    if (q && !feedback) {
      const t = setTimeout(() => {
        hear().catch(() => undefined);
      }, 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, feedback, together, timbre]);

  const answer = (id: string) => {
    if (!q || feedback) return;
    const ok = id === q.interval.id;
    const label = kidMode
      ? `${q.interval.emoji} ${q.interval.kidName}`
      : q.interval.dadLabel;
    if (ok) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
      setFeedback({ correct: true, message: `That was ${label}!` });
    } else {
      livesRef.current = Math.max(0, livesRef.current - 1);
      setLives(livesRef.current);
      setFeedback({
        correct: false,
        message: `That was ${label}. Listen again!`,
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
        mode: "intervals",
        correct: correctRef.current,
        total,
        xpEarned: earned,
      });
      setDone(true);
      setFeedback(null);
      return;
    }
    setIndex(nextIndex);
    setQ(makeIntervalQuestion(kidMode));
    setFeedback(null);
  };

  if (!activeProfile || (!q && !done)) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }
  if (done) {
    return (
      <div className="pt-8">
        <SessionEnd
          correct={correctCount}
          total={total}
          xp={xp}
          title="Intervals Complete!"
        />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 pt-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-white/70">
          <span>Interval Explorer</span>
          <span>
            {index + 1} / {total}
          </span>
        </div>
        <Progress value={((index + 1) / total) * 100} />
      </div>
      <p className="text-center text-lg font-bold">What interval do you hear?</p>
      <div className="flex justify-center">
        <SpeakerButton onClick={hear} />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant={together ? "outline" : "default"}
          onClick={() => setTogether(false)}
        >
          One after another
        </Button>
        <Button
          size="sm"
          variant={together ? "default" : "outline"}
          onClick={() => setTogether(true)}
        >
          Together
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {q!.choices.map((c) => (
          <Button
            key={c.id}
            size="lg"
            variant="outline"
            disabled={!!feedback}
            onClick={() => answer(c.id)}
          >
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
