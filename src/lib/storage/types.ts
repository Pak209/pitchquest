import type { Timbre } from "../audio/engine";

export type ProfileId = "son" | "dad";

export type NoteMastery = {
  attempts: number;
  correct: number;
  /** Rolling session accuracies (0-1), last up to 10 */
  sessionAccuracies: number[];
  mastered: boolean;
};

export type SessionRecord = {
  id: string;
  mode: string;
  at: number;
  correct: number;
  total: number;
  xpEarned: number;
  notesSeen?: string[];
};

export type ProfileState = {
  id: ProfileId;
  displayName: string;
  xp: number;
  level: number;
  streakDays: number;
  lastPlayDate: string | null; // YYYY-MM-DD local
  instrument: Timbre;
  mastery: Record<string, NoteMastery>;
  unlockedNotes: string[];
  sessions: SessionRecord[];
  intervalMastery: Record<string, NoteMastery>;
  chordMastery: Record<string, NoteMastery>;
};

export type AppState = {
  version: 1;
  activeProfileId: ProfileId | null;
  profiles: Record<ProfileId, ProfileState>;
};

export const STORAGE_KEY = "pitchquest:v1";
