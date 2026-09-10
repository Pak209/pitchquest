import { describe, it, expect } from "vitest";
import {
  noteNameToMidi,
  midiToFrequency,
  noteNameToFrequency,
  midiToNoteName,
  A4_FREQ,
  A4_MIDI,
} from "./notes";

describe("note helpers", () => {
  it("maps A4 to midi 69", () => {
    expect(noteNameToMidi("A", 4)).toBe(A4_MIDI);
  });

  it("maps C4 to midi 60", () => {
    expect(noteNameToMidi("C", 4)).toBe(60);
  });

  it("A4 frequency is 440", () => {
    expect(midiToFrequency(69)).toBeCloseTo(A4_FREQ, 6);
    expect(noteNameToFrequency("A", 4)).toBeCloseTo(440, 6);
  });

  it("C4 is ~261.63 Hz", () => {
    expect(noteNameToFrequency("C", 4)).toBeCloseTo(261.625565, 3);
  });

  it("octave doubles frequency", () => {
    const a4 = noteNameToFrequency("A", 4);
    const a5 = noteNameToFrequency("A", 5);
    expect(a5 / a4).toBeCloseTo(2, 6);
  });

  it("round-trips midi ↔ name", () => {
    for (let midi = 48; midi <= 84; midi++) {
      const { name, octave } = midiToNoteName(midi);
      expect(noteNameToMidi(name, octave)).toBe(midi);
    }
  });

  it("G4 is a perfect fifth above C4 (~1.5)", () => {
    const c = noteNameToFrequency("C", 4);
    const g = noteNameToFrequency("G", 4);
    expect(g / c).toBeCloseTo(Math.pow(2, 7 / 12), 6);
  });
});
