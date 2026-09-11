import type { NaturalNote } from "./audio/notes";

export const KID_NOTE_MAP: Record<
  NaturalNote,
  { animal: string; emoji: string; say: string }
> = {
  C: { animal: "Cat", emoji: "🐱", say: "Ceeee!" },
  D: { animal: "Dog", emoji: "🐶", say: "Deeee!" },
  E: { animal: "Elephant", emoji: "🐘", say: "Eeeee!" },
  F: { animal: "Fish", emoji: "🐟", say: "Effff!" },
  G: { animal: "Goat", emoji: "🐐", say: "Geeee!" },
  A: { animal: "Ant", emoji: "🐜", say: "Aaaaa!" },
  B: { animal: "Bird", emoji: "🐦", say: "Beeee!" },
};

/** Enharmonic labels for advanced accidentals */
export const ACCIDENTAL_DISPLAY: Record<string, string> = {
  "C#": "C♯ / D♭",
  "D#": "D♯ / E♭",
  "F#": "F♯ / G♭",
  "G#": "G♯ / A♭",
  "A#": "A♯ / B♭",
};

export function kidLabel(note: string): string {
  const base = note.replace(/#|b/, "") as NaturalNote;
  const info = KID_NOTE_MAP[base];
  const shown = ACCIDENTAL_DISPLAY[note] ?? note;
  if (!info) return shown;
  return `${info.emoji} ${shown} = ${info.animal}`;
}

export function displayNoteLabel(note: string, kidMode: boolean): string {
  const shown = ACCIDENTAL_DISPLAY[note] ?? note;
  if (!kidMode) return shown;
  const base = note.replace(/#|b/, "") as NaturalNote;
  const info = KID_NOTE_MAP[base];
  if (!info) return shown;
  return `${info.emoji} ${shown}`;
}
