/** Mastery unlock path — NOT XP-gated */

export const NATURAL_NOTES = ["C", "D", "E", "F", "G", "A", "B"] as const;

/** Advanced stage: sharps (enharmonic flats shown in UI) */
export const ACCIDENTAL_NOTES = ["C#", "D#", "F#", "G#", "A#"] as const;

export const NATURAL_ORDER = NATURAL_NOTES;

const NOTE_SORT = [
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
];

export function sortNotes(notes: string[]): string[] {
  return [...notes].sort(
    (a, b) => NOTE_SORT.indexOf(a) - NOTE_SORT.indexOf(b)
  );
}

export const START_UNLOCKED = [...NATURAL_NOTES];

export const ADVANCED_UNLOCKED = sortNotes([
  ...NATURAL_NOTES,
  ...ACCIDENTAL_NOTES,
]);

export const UNLOCK_STAGES: {
  id: string;
  notes: string[];
  label: string;
  icon: string;
}[] = [
  {
    id: "naturals",
    notes: [...NATURAL_NOTES],
    label: "7 Naturals: C–B",
    icon: "⭐",
  },
  {
    id: "accidentals",
    notes: [...ADVANCED_UNLOCKED],
    label: "Advanced: sharps & flats",
    icon: "🏆",
  },
  {
    id: "octaves",
    notes: [...ADVANCED_UNLOCKED],
    label: "Octaves",
    icon: "🔔",
  },
  {
    id: "quality",
    notes: [...ADVANCED_UNLOCKED],
    label: "Major vs Minor",
    icon: "🌓",
  },
];

/** ≥90% accuracy over at least 3 sessions for every note currently unlocked → expand set */
export const MASTERY_ACCURACY = 0.9;
export const MASTERY_SESSIONS = 3;

/** Ensure every profile has at least all naturals (migration / floor). */
export function ensureNaturalFloor(current: string[]): string[] {
  const set = new Set(current);
  for (const n of NATURAL_NOTES) set.add(n);
  return sortNotes(Array.from(set));
}

export function nextUnlockNotes(current: string[]): string[] | null {
  const cur = new Set(current);
  const hasAllNaturals = NATURAL_NOTES.every((n) => cur.has(n));
  const hasAllAccidentals = ACCIDENTAL_NOTES.every((n) => cur.has(n));
  if (hasAllNaturals && !hasAllAccidentals) {
    return [...ADVANCED_UNLOCKED];
  }
  return null;
}

export function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function levelProgress(xp: number): number {
  return (xp % 100) / 100;
}
