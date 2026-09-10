/** Mastery unlock path — NOT XP-gated */

export const NATURAL_ORDER = ["C", "G", "D", "E", "F", "A", "B"] as const;

export const UNLOCK_STAGES: {
  id: string;
  notes: string[];
  label: string;
  icon: string;
}[] = [
  { id: "egg", notes: ["C", "G"], label: "2 Notes: C vs G", icon: "🥚" },
  { id: "sprout", notes: ["C", "D", "E", "G"], label: "3–4 Notes: add D, E", icon: "🌱" },
  { id: "note", notes: ["C", "D", "E", "F", "G", "A"], label: "5–6 Notes: add F, A", icon: "🎵" },
  { id: "star", notes: ["C", "D", "E", "F", "G", "A", "B"], label: "7 Notes: C to B", icon: "⭐" },
  { id: "octaves", notes: ["C", "D", "E", "F", "G", "A", "B"], label: "Octaves", icon: "🔔" },
  { id: "quality", notes: ["C", "D", "E", "F", "G", "A", "B"], label: "Major vs Minor", icon: "🌓" },
  { id: "chords", notes: ["C", "D", "E", "F", "G", "A", "B"], label: "Chords C / F / G", icon: "🎹" },
  { id: "advanced", notes: ["C", "D", "E", "F", "G", "A", "B"], label: "Advanced", icon: "🏆" },
];

export const START_UNLOCKED = ["C", "G"];

/** ≥90% accuracy over at least 3 sessions for every note currently unlocked → expand set */
export const MASTERY_ACCURACY = 0.9;
export const MASTERY_SESSIONS = 3;

export function nextUnlockNotes(current: string[]): string[] | null {
  const stages = [
    ["C", "G"],
    ["C", "D", "E", "G"],
    ["C", "D", "E", "F", "G", "A"],
    ["C", "D", "E", "F", "G", "A", "B"],
  ];
  const cur = new Set(current);
  for (let i = 0; i < stages.length - 1; i++) {
    const stage = stages[i];
    if (stage.every((note) => cur.has(note)) && current.length <= stage.length) {
      const next = stages[i + 1];
      if (next.some((note) => !cur.has(note))) return next;
    }
  }
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].length > current.length) {
      const missing = stages[i].filter((note) => !cur.has(note));
      if (missing.length) return stages[i];
    }
  }
  return null;
}

export function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function levelProgress(xp: number): number {
  return (xp % 100) / 100;
}
