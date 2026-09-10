import type { NoteMastery, ProfileState } from "./types";
import {
  MASTERY_ACCURACY,
  MASTERY_SESSIONS,
  nextUnlockNotes,
} from "../game/progression";

export function emptyMastery(): NoteMastery {
  return {
    attempts: 0,
    correct: 0,
    sessionAccuracies: [],
    mastered: false,
  };
}

export function recordNoteAttempt(
  mastery: Record<string, NoteMastery>,
  note: string,
  correct: boolean
): Record<string, NoteMastery> {
  const prev = mastery[note] ?? emptyMastery();
  const next: NoteMastery = {
    ...prev,
    attempts: prev.attempts + 1,
    correct: prev.correct + (correct ? 1 : 0),
  };
  return { ...mastery, [note]: next };
}

export function finalizeSessionMastery(
  profile: ProfileState,
  perNote: Record<string, { correct: number; total: number }>
): ProfileState {
  const mastery = { ...profile.mastery };
  for (const [note, stats] of Object.entries(perNote)) {
    if (stats.total === 0) continue;
    const prev = mastery[note] ?? emptyMastery();
    const acc = stats.correct / stats.total;
    const sessionAccuracies = [...prev.sessionAccuracies, acc].slice(-10);
    const recent = sessionAccuracies.slice(-MASTERY_SESSIONS);
    const mastered =
      recent.length >= MASTERY_SESSIONS &&
      recent.every((a) => a >= MASTERY_ACCURACY);
    mastery[note] = {
      ...prev,
      sessionAccuracies,
      mastered: prev.mastered || mastered,
    };
  }

  let unlockedNotes = [...profile.unlockedNotes];
  const allCurrentMastered = unlockedNotes.every(
    (n) => mastery[n]?.mastered
  );
  if (allCurrentMastered) {
    const next = nextUnlockNotes(unlockedNotes);
    if (next) unlockedNotes = next;
  }

  return { ...profile, mastery, unlockedNotes };
}

export function noteAccuracy(m?: NoteMastery): number {
  if (!m || m.attempts === 0) return 0;
  return m.correct / m.attempts;
}

export function overallMasteryPercent(profile: ProfileState): number {
  const notes = profile.unlockedNotes;
  if (!notes.length) return 0;
  const sum = notes.reduce((s, n) => s + noteAccuracy(profile.mastery[n]), 0);
  return Math.round((sum / notes.length) * 100);
}
