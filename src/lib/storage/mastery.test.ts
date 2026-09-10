import { describe, it, expect } from "vitest";
import { finalizeSessionMastery, emptyMastery } from "./mastery";
import type { ProfileState } from "./types";
import { START_UNLOCKED } from "../game/progression";

function baseProfile(): ProfileState {
  return {
    id: "son",
    displayName: "Son",
    xp: 0,
    level: 1,
    streakDays: 0,
    lastPlayDate: null,
    instrument: "piano",
    mastery: {
      C: { ...emptyMastery(), mastered: false, sessionAccuracies: [0.9, 0.95] },
      G: { ...emptyMastery(), mastered: false, sessionAccuracies: [1, 0.9] },
    },
    unlockedNotes: [...START_UNLOCKED],
    sessions: [],
    intervalMastery: {},
    chordMastery: {},
  };
}

describe("mastery unlock", () => {
  it("unlocks next notes after 3 strong sessions on all current", () => {
    const p = baseProfile();
    const next = finalizeSessionMastery(p, {
      C: { correct: 4, total: 4 },
      G: { correct: 3, total: 3 },
    });
    expect(next.mastery.C.mastered).toBe(true);
    expect(next.mastery.G.mastered).toBe(true);
    expect(next.unlockedNotes).toEqual(["C", "D", "E", "G"]);
  });

  it("does not unlock if accuracy below threshold", () => {
    const p = baseProfile();
    const next = finalizeSessionMastery(p, {
      C: { correct: 1, total: 4 },
      G: { correct: 3, total: 3 },
    });
    expect(next.mastery.C.mastered).toBe(false);
    expect(next.unlockedNotes).toEqual(["C", "G"]);
  });
});
