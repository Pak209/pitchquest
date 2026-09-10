"use client";

import type { AppState, ProfileId, ProfileState } from "./types";
import { STORAGE_KEY } from "./types";
import { START_UNLOCKED, xpToLevel } from "../game/progression";
import type { Timbre } from "../audio/engine";

function defaultProfile(id: ProfileId): ProfileState {
  return {
    id,
    displayName: id === "son" ? "Son" : "Dad",
    xp: 0,
    level: 1,
    streakDays: 0,
    lastPlayDate: null,
    instrument: "piano",
    mastery: {},
    unlockedNotes: [...START_UNLOCKED],
    sessions: [],
    intervalMastery: {},
    chordMastery: {},
  };
}

export function defaultAppState(): AppState {
  return {
    version: 1,
    activeProfileId: null,
    profiles: {
      son: defaultProfile("son"),
      dad: defaultProfile("dad"),
    },
  };
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadAppState(): AppState {
  if (!canUseStorage()) return defaultAppState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== 1) return defaultAppState();
    // merge defaults for forward-compat fields
    const base = defaultAppState();
    return {
      ...base,
      ...parsed,
      profiles: {
        son: { ...base.profiles.son, ...parsed.profiles?.son },
        dad: { ...base.profiles.dad, ...parsed.profiles?.dad },
      },
    };
  } catch {
    return defaultAppState();
  }
}

export function saveAppState(state: AppState): void {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updateProfile(
  state: AppState,
  id: ProfileId,
  updater: (p: ProfileState) => ProfileState
): AppState {
  const next = {
    ...state,
    profiles: {
      ...state.profiles,
      [id]: updater(state.profiles[id]),
    },
  };
  saveAppState(next);
  return next;
}

export function setActiveProfile(state: AppState, id: ProfileId | null): AppState {
  const next = { ...state, activeProfileId: id };
  saveAppState(next);
  return next;
}

export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function bumpStreak(profile: ProfileState): ProfileState {
  const today = todayKey();
  if (profile.lastPlayDate === today) return profile;
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();
  const streakDays =
    profile.lastPlayDate === yesterday ? profile.streakDays + 1 : 1;
  return { ...profile, streakDays, lastPlayDate: today };
}

export function addXp(profile: ProfileState, amount: number): ProfileState {
  const xp = profile.xp + amount;
  return { ...profile, xp, level: xpToLevel(xp) };
}

export function setInstrument(profile: ProfileState, instrument: Timbre): ProfileState {
  return { ...profile, instrument };
}
