/** A4 = 440 Hz equal temperament helpers */

export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];
export type NaturalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";

const NAME_TO_PC: Record<string, number> = Object.fromEntries(
  NOTE_NAMES.map((n, i) => [n, i])
);

/** MIDI note number for A4 */
export const A4_MIDI = 69;
export const A4_FREQ = 440;

export function noteNameToMidi(name: string, octave: number): number {
  const pc = NAME_TO_PC[name];
  if (pc === undefined) {
    throw new Error(`Unknown note name: ${name}`);
  }
  return (octave + 1) * 12 + pc;
}

export function midiToFrequency(midi: number): number {
  return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
}

export function noteNameToFrequency(name: string, octave: number): number {
  return midiToFrequency(noteNameToMidi(name, octave));
}

export function midiToNoteName(midi: number): { name: NoteName; octave: number } {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return { name: NOTE_NAMES[pc], octave };
}

export function parseNote(token: string): { name: NoteName; octave: number } {
  const m = token.match(/^([A-G]#?)(-?\d+)$/);
  if (!m) throw new Error(`Invalid note token: ${token}`);
  const name = m[1] as NoteName;
  if (!NAME_TO_PC[name] && name !== "C") {
    // C# etc are fine; validate against list
    if (!NOTE_NAMES.includes(name)) throw new Error(`Invalid note: ${token}`);
  }
  return { name, octave: Number(m[2]) };
}

export function formatNote(name: string, octave: number): string {
  return `${name}${octave}`;
}
