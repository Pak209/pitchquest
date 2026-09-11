import { describe, it, expect } from "vitest";
import { buildChoices, makeQuestion, xpForSession } from "./note-finder";
import { NATURAL_NOTES } from "./progression";

describe("note finder", () => {
  it("always includes the answer in choices", () => {
    for (let i = 0; i < 20; i++) {
      const q = makeQuestion([...NATURAL_NOTES], {});
      expect(q.choices).toContain(q.answer);
      expect(q.choices).toHaveLength(NATURAL_NOTES.length);
    }
  });

  it("buildChoices respects unlock set", () => {
    const unlocked = ["C", "G"];
    const c = buildChoices("C", unlocked, unlocked.length);
    expect(c.every((n) => unlocked.includes(n))).toBe(true);
    expect(c).toContain("C");
    expect(c).toHaveLength(2);
  });

  it("xp scales with correct answers", () => {
    expect(xpForSession(10, 10)).toBeGreaterThan(xpForSession(5, 10));
  });
});
