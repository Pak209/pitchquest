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

export function kidLabel(note: string): string {
  const base = note.replace(/#|b/, "") as NaturalNote;
  const info = KID_NOTE_MAP[base];
  if (!info) return note;
  return `${info.emoji} ${note} = ${info.animal}`;
}

export function displayNoteLabel(note: string, kidMode: boolean): string {
  if (!kidMode) return note;
  const base = note.replace(/#|b/, "") as NaturalNote;
  const info = KID_NOTE_MAP[base];
  if (!info) return note;
  return `${info.emoji} ${note}`;
}
