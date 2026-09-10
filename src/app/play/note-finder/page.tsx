"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SpeakerButton } from "@/components/game/SpeakerButton";
import { Lives } from "@/components/game/Lives";
import { FeedbackCard } from "@/components/game/FeedbackCard";
import { SessionEnd } from "@/components/game/SessionEnd";
import { playNote, resumeAudio } from "@/lib/audio/engine";
import {
  makeQuestion,
  sessionLength,
  xpForSession,
  type NoteQuestion,
} from "@/lib/game/note-finder";
import { displayNoteLabel } from "@/lib/kid-labels";
import { recordNoteAttempt } from "@/lib/storage/mastery";

export default function NoteFinderPage() {
  const { activeProfile, hydrated, completeSession, patchActive } = useApp();
  const router = useRouter();
  const kidMode = activeProfile?.id === "son";

  const total = useMemo(() => sessionLength(), []);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [question, setQuestion] = useState<NoteQuestion | null>(null);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [done, setDone] = useState(false);
  const [xp, setXp] = useState(0);
  const perNoteRef = useRef<Record<string, { correct: number; total: number }>>(
    {}
  );
  const correctRef = useRef(0);
  const livesRef = useRef(3);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (hydrated && !activeProfile) router.replace("/");
  }, [hydrated, activeProfile, router]);

  const unlocked = useMemo(
    () => activeProfile?.unlockedNotes ?? ["C", "G"],
    [activeProfile?.unlockedNotes]
  );
  const mastery = useMemo(
    () => activeProfile?.mastery ?? {},
    [activeProfile?.mastery]
  );
  const timbre = activeProfile?.instrument ?? "piano";

  const nextQuestion = useCallback(() => {
    setQuestion(makeQuestion(unlocked, mastery));
    setFeedback(null);
    setLocked(false);
  }, [unlocked, mastery]);

  useEffect(() => {
    if (activeProfile && !question && !done) nextQuestion();
  }, [activeProfile, question, done, nextQuestion]);

  const hear = async () => {
    if (!question) return;
    await resumeAudio();
    await playNote(question.answer, question.octave, {
      timbre,
      duration: 0.75,
    });
  };

  useEffect(() => {
    if (question && !feedback) {
      const t = setTimeout(() => {
        playNote(question.answer, question.octave, {
          timbre,
          duration: 0.75,
        }).catch(() => undefined);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [question, feedback, timbre]);

  const endSession = (finalCorrect: number) => {
    const earned = xpForSession(finalCorrect, total);
    setXp(earned);
    completeSession({
      mode: "note-finder",
      correct: finalCorrect,
      total,
      xpEarned: earned,
      perNote: { ...perNoteRef.current },
      notesSeen: Object.keys(perNoteRef.current),
    });
    setDone(true);
    setFeedback(null);
  };

  const answer = (choice: string) => {
    if (!question || locked || feedback) return;
    setLocked(true);
    const ok = choice === question.answer;
    const cur = perNoteRef.current[question.answer] ?? {
      correct: 0,
      total: 0,
    };
    perNoteRef.current[question.answer] = {
      correct: cur.correct + (ok ? 1 : 0),
      total: cur.total + 1,
    };
    patchActive((p) => ({
      ...p,
      mastery: recordNoteAttempt(p.mastery, question.answer, ok),
    }));
    if (ok) {
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
      setFeedback({
        correct: true,
        message: `That was ${displayNoteLabel(question.answer, kidMode)}!`,
      });
    } else {
      livesRef.current = Math.max(0, livesRef.current - 1);
      setLives(livesRef.current);
      setFeedback({
        correct: false,
        message: `That was ${displayNoteLabel(question.answer, kidMode)}. Listen again!`,
      });
    }
  };

  const onNext = () => {
    if (!feedback) return;
    const nextIndex = index + 1;
    if (nextIndex >= total || (!feedback.correct && livesRef.current <= 0)) {
      endSession(correctRef.current);
      return;
    }
    setIndex(nextIndex);
    nextQuestion();
  };

  if (!activeProfile || (!question && !done)) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  if (done) {
    return (
      <div className="pt-8">
        <SessionEnd correct={correctCount} total={total} xp={xp} />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 pt-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-white/70">
          <span>Note Finder</span>
          <span>
            {index + 1} / {total}
          </span>
        </div>
        <Progress value={((index + 1) / total) * 100} />
      </div>

      <p className="text-center text-lg font-bold text-white/90">
        What note do you hear?
      </p>

      <div className="flex justify-center py-4">
        <SpeakerButton onClick={hear} />
      </div>

      <div
        className={`grid gap-3 ${
          question!.choices.length === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {question!.choices.map((c) => (
          <Button
            key={c}
            size="xl"
            variant="outline"
            className="h-24 text-2xl"
            disabled={!!feedback}
            onClick={() => answer(c)}
          >
            {displayNoteLabel(c, kidMode)}
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
