import { describe, it, expect } from "vitest";
import { finalizeSessionMastery, emptyMastery } from "./mastery";
import type { ProfileState } from "./types";
import { NATURAL_NOTES, ADVANCED_UNLOCKED } from "../game/progression";

function baseProfile(notes: string[] = [...NATURAL_NOTES]): ProfileState {
  const mastery: ProfileState["mastery"] = {};
  for (const n of notes) {
    mastery[n] = {
      ...emptyMastery(),
      mastered: false,
      sessionAccuracies: [0.9, 0.95],
    };
  }
  return {
    id: "son",
    displayName: "Son",
    xp: 0,
    level: 1,
    streakDays: 0,
    lastPlayDate: null,
    instrument: "piano",
    mastery,
    unlockedNotes: [...notes],
    sessions: [],
    intervalMastery: {},
    chordMastery: {},
  };
}

describe("mastery unlock", () => {
  it("unlocks accidentals after 3 strong sessions on all naturals", () => {
    const p = baseProfile();
    const perNote = Object.fromEntries(
      NATURAL_NOTES.map((n) => [n, { correct: 4, total: 4 }])
    );
    const next = finalizeSessionMastery(p, perNote);
    for (const n of NATURAL_NOTES) {
      expect(next.mastery[n].mastered).toBe(true);
    }
    expect(next.unlockedNotes).toEqual([...ADVANCED_UNLOCKED]);
  });

  it("does not unlock accidentals if accuracy below threshold", () => {
    const p = baseProfile();
    const perNote = Object.fromEntries(
      NATURAL_NOTES.map((n, i) => [
        n,
        i === 0 ? { correct: 1, total: 4 } : { correct: 4, total: 4 },
      ])
    );
    const next = finalizeSessionMastery(p, perNote);
    expect(next.mastery.C.mastered).toBe(false);
    expect(next.unlockedNotes).toEqual([...NATURAL_NOTES]);
  });
});
