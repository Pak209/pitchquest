"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/hooks/AppProvider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpeakerButton } from "@/components/game/SpeakerButton";
import { playNote, resumeAudio } from "@/lib/audio/engine";
import { makeQuestion, type NoteQuestion } from "@/lib/game/note-finder";
import { displayNoteLabel } from "@/lib/kid-labels";
import { START_UNLOCKED } from "@/lib/game/progression";

type Turn = "dad" | "son";

const ROUNDS = 10;

export default function DuelPage() {
  const { state, hydrated } = useApp();
  const router = useRouter();
  const [scores, setScores] = useState({ dad: 0, son: 0 });
  const [turn, setTurn] = useState<Turn>("dad");
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState<NoteQuestion | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const locked = useRef(false);

  useEffect(() => {
    if (hydrated && !state) router.replace("/");
  }, [hydrated, state, router]);

  const unlocked = useMemo(() => {
    if (!state) return [...START_UNLOCKED];
    const a = new Set([
      ...state.profiles.dad.unlockedNotes,
      ...state.profiles.son.unlockedNotes,
    ]);
    return a.size ? Array.from(a) : [...START_UNLOCKED];
  }, [state]);

  const nextQ = useCallback(() => {
    locked.current = false;
    setFeedback(null);
    setQuestion(makeQuestion(unlocked, {}));
  }, [unlocked]);

  useEffect(() => {
    if (state && !question && !done) nextQ();
  }, [state, question, done, nextQ]);

  const hear = async () => {
    if (!question) return;
    await resumeAudio();
    await playNote(question.answer, question.octave, {
      timbre: state?.profiles[turn].instrument ?? "piano",
      duration: 0.75,
    });
  };

  useEffect(() => {
    if (question && !feedback) {
      const t = setTimeout(() => {
        playNote(question.answer, question.octave, {
          timbre: "piano",
          duration: 0.75,
        }).catch(() => undefined);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [question, feedback]);

  const answer = (choice: string) => {
    if (!question || locked.current || feedback) return;
    locked.current = true;
    const ok = choice === question.answer;
    const kid = turn === "son";
    if (ok) {
      setScores((s) => ({ ...s, [turn]: s[turn] + 1 }));
      setFeedback(
        `Nice! ${displayNoteLabel(question.answer, kid)} is right.`
      );
    } else {
      setFeedback(
        `That was ${displayNoteLabel(question.answer, kid)}. Good try!`
      );
    }
  };

  const advance = () => {
    if (round >= ROUNDS) {
      setDone(true);
      setFeedback(null);
      return;
    }
    setRound((r) => r + 1);
    setTurn((t) => (t === "dad" ? "son" : "dad"));
    nextQ();
  };

  if (!state || (!question && !done)) {
    return <div className="py-20 text-center text-white/60">Loading…</div>;
  }

  if (done) {
    const dadWins = scores.dad > scores.son;
    const sonWins = scores.son > scores.dad;
    const tie = scores.dad === scores.son;
    let title = "What a match!";
    let msg = "You both trained your ears today. 🌟";
    if (sonWins) {
      title = "Son wins!";
      msg = "Awesome listening, champ! Dad is proud. 🎉";
    } else if (dadWins) {
      title = "Dad edges it!";
      msg = "Great game — Son, you got so close. Rematch anytime!";
    } else if (tie) {
      title = "It's a tie!";
      msg = "Perfect teamwork energy. High five! 🙌";
    }
    return (
      <Card className="mx-auto mt-8 max-w-sm p-6 text-center">
        <div className="mb-2 text-5xl">{tie ? "🤝" : sonWins ? "🧒🏆" : "🧔⭐"}</div>
        <h2 className="mb-2 text-2xl font-bold text-star">{title}</h2>
        <p className="mb-4 text-lg font-bold">
          Dad {scores.dad} vs Son {scores.son}
        </p>
        <p className="mb-6 text-white/80">{msg}</p>
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => window.location.reload()}>
            Rematch
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/quest")}>
            Back to Quests
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <main className="flex flex-col gap-5 pt-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm text-white/70">
          <span>Dad vs Son</span>
          <span>
            Round {round} / {ROUNDS}
          </span>
        </div>
        <Progress value={(round / ROUNDS) * 100} />
      </div>

      <Card className="flex items-center justify-between p-4">
        <div className="text-center">
          <div className="text-2xl">🧔</div>
          <div className="font-bold">Dad</div>
          <div className="text-2xl text-star">{scores.dad}</div>
        </div>
        <div className="text-white/40">vs</div>
        <div className="text-center">
          <div className="text-2xl">🧒</div>
          <div className="font-bold">Son</div>
          <div className="text-2xl text-star">{scores.son}</div>
        </div>
      </Card>

      <p className="text-center text-lg font-bold text-mint">
        {turn === "dad" ? "Dad" : "Son"} — Your turn!
      </p>

      <div className="flex justify-center">
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
            className="h-20 text-xl"
            disabled={!!feedback}
            onClick={() => answer(c)}
          >
            {displayNoteLabel(c, turn === "son")}
          </Button>
        ))}
      </div>

      {feedback && (
        <Card className="border-0 bg-parchment p-4 text-center text-navy">
          <p className="mb-3 font-bold">{feedback}</p>
          <Button size="lg" className="w-full" onClick={advance}>
            Next turn
          </Button>
        </Card>
      )}
    </main>
  );
}
