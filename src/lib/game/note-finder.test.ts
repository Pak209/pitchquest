import { describe, it, expect } from "vitest";
import { buildChoices, makeQuestion, xpForSession } from "./note-finder";

describe("note finder", () => {
  it("always includes the answer in choices", () => {
    for (let i = 0; i < 20; i++) {
      const q = makeQuestion(["C", "G"], {});
      expect(q.choices).toContain(q.answer);
    }
  });

  it("buildChoices respects unlock set", () => {
    const c = buildChoices("C", ["C", "G"], 3);
    expect(c.every((n) => ["C", "G"].includes(n))).toBe(true);
    expect(c).toContain("C");
  });

  it("xp scales with correct answers", () => {
    expect(xpForSession(10, 10)).toBeGreaterThan(xpForSession(5, 10));
  });
});
