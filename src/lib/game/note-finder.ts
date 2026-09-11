import { pickWeighted, shuffle } from "../utils";

export type NoteQuestion = {
  answer: string;
  octave: number;
  choices: string[];
};

const DEFAULT_OCTAVE = 4;

/** Adaptive weighting: missed notes get higher weight */
export function chooseTargetNote(
  unlocked: string[],
  mastery: Record<string, { attempts: number; correct: number }>
): string {
  const weights = unlocked.map((n) => {
    const m = mastery[n];
    if (!m || m.attempts === 0) return 1.4;
    const acc = m.correct / m.attempts;
    return 0.5 + (1 - acc) * 2.5;
  });
  return pickWeighted(unlocked, weights);
}

export function buildChoices(
  answer: string,
  unlocked: string[],
  count?: number
): string[] {
  const limit = count ?? unlocked.length;
  const others = shuffle(unlocked.filter((n) => n !== answer));
  const picks = [answer, ...others].slice(0, Math.min(limit, unlocked.length));
  return shuffle(picks);
}

export function makeQuestion(
  unlocked: string[],
  mastery: Record<string, { attempts: number; correct: number }>,
  octave = DEFAULT_OCTAVE
): NoteQuestion {
  const answer = chooseTargetNote(unlocked, mastery);
  return {
    answer,
    octave,
    // Show the full unlock set so testers can pick among all notes
    choices: buildChoices(answer, unlocked, unlocked.length),
  };
}

export function sessionLength(): number {
  return 8 + Math.floor(Math.random() * 5); // 8–12
}

export function xpForSession(correct: number, total: number): number {
  const base = correct * 10;
  const bonus = correct === total ? 25 : Math.floor((correct / total) * 10);
  return base + bonus;
}
