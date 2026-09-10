export type ChordQuality = "major" | "minor";

export type ChordDef = {
  id: string;
  root: string;
  quality: ChordQuality;
  kidLabel: string;
  emoji: string;
  notes: { name: string; octave: number }[];
};

export const MVP_CHORDS: ChordDef[] = [
  {
    id: "Cmaj",
    root: "C",
    quality: "major",
    kidLabel: "C Major",
    emoji: "☀️",
    notes: [
      { name: "C", octave: 4 },
      { name: "E", octave: 4 },
      { name: "G", octave: 4 },
    ],
  },
  {
    id: "Cmin",
    root: "C",
    quality: "minor",
    kidLabel: "C Minor",
    emoji: "🌙",
    notes: [
      { name: "C", octave: 4 },
      { name: "D#", octave: 4 },
      { name: "G", octave: 4 },
    ],
  },
  {
    id: "Fmaj",
    root: "F",
    quality: "major",
    kidLabel: "F Major",
    emoji: "🌳",
    notes: [
      { name: "F", octave: 4 },
      { name: "A", octave: 4 },
      { name: "C", octave: 5 },
    ],
  },
  {
    id: "Fmin",
    root: "F",
    quality: "minor",
    kidLabel: "F Minor",
    emoji: "🌲",
    notes: [
      { name: "F", octave: 4 },
      { name: "G#", octave: 4 },
      { name: "C", octave: 5 },
    ],
  },
  {
    id: "Gmaj",
    root: "G",
    quality: "major",
    kidLabel: "G Major",
    emoji: "⛰️",
    notes: [
      { name: "G", octave: 4 },
      { name: "B", octave: 4 },
      { name: "D", octave: 5 },
    ],
  },
  {
    id: "Gmin",
    root: "G",
    quality: "minor",
    kidLabel: "G Minor",
    emoji: "🌑",
    notes: [
      { name: "G", octave: 4 },
      { name: "A#", octave: 4 },
      { name: "D", octave: 5 },
    ],
  },
];

/** MVP: identify Major vs Minor only */
export function makeChordQuestion() {
  const chord = MVP_CHORDS[Math.floor(Math.random() * MVP_CHORDS.length)];
  return {
    chord,
    answer: chord.quality,
    choices: [
      { id: "major" as const, label: "Major", emoji: "☀️" },
      { id: "minor" as const, label: "Minor", emoji: "🌙" },
    ],
  };
}
