export type IntervalDef = {
  id: string;
  semitones: number;
  dadLabel: string;
  kidName: string;
  emoji: string;
};

export const INTERVALS: IntervalDef[] = [
  { id: "unison", semitones: 0, dadLabel: "P1 / Unison", kidName: "Same note", emoji: "👯" },
  { id: "m3", semitones: 3, dadLabel: "m3", kidName: "Small skip", emoji: "🐣" },
  { id: "M3", semitones: 4, dadLabel: "M3", kidName: "Happy skip", emoji: "😄" },
  { id: "P5", semitones: 7, dadLabel: "P5", kidName: "Power jump", emoji: "🦸" },
  { id: "octave", semitones: 12, dadLabel: "P8 / Octave", kidName: "Same but higher", emoji: "🚀" },
];

export const ROOTS = ["C", "D", "E", "F", "G"] as const;

const PC: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteAtInterval(
  root: string,
  octave: number,
  semitones: number
): { name: string; octave: number } {
  const midi = (octave + 1) * 12 + PC[root] + semitones;
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return { name: NAMES[pc], octave: oct };
}

export function makeIntervalQuestion(kidMode: boolean) {
  const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
  const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
  const octave = 4;
  const second = noteAtInterval(root, octave, interval.semitones);
  const choices = INTERVALS.map((i) => ({
    id: i.id,
    label: kidMode ? `${i.emoji} ${i.kidName}` : i.dadLabel,
  }));
  // shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return {
    interval,
    root: { name: root, octave },
    second,
    choices,
  };
}
