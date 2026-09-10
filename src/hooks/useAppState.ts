"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadAppState,
  saveAppState,
  setActiveProfile,
  updateProfile,
  bumpStreak,
  addXp,
  setInstrument,
} from "@/lib/storage/storage";
import type { AppState, ProfileId, ProfileState, SessionRecord } from "@/lib/storage/types";
import { finalizeSessionMastery } from "@/lib/storage/mastery";
import type { Timbre } from "@/lib/audio/engine";

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadAppState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AppState) => {
    saveAppState(next);
    setState(next);
  }, []);

  const selectProfile = useCallback(
    (id: ProfileId) => {
      if (!state) return;
      persist(setActiveProfile(state, id));
    },
    [state, persist]
  );

  const activeProfile: ProfileState | null =
    state && state.activeProfileId
      ? state.profiles[state.activeProfileId]
      : null;

  const patchActive = useCallback(
    (updater: (p: ProfileState) => ProfileState) => {
      if (!state?.activeProfileId) return;
      persist(updateProfile(state, state.activeProfileId, updater));
    },
    [state, persist]
  );

  const completeSession = useCallback(
    (opts: {
      mode: string;
      correct: number;
      total: number;
      xpEarned: number;
      perNote?: Record<string, { correct: number; total: number }>;
      notesSeen?: string[];
    }) => {
      if (!state?.activeProfileId) return;
      persist(
        updateProfile(state, state.activeProfileId, (p) => {
          let next = bumpStreak(p);
          next = addXp(next, opts.xpEarned);
          if (opts.perNote) {
            next = finalizeSessionMastery(next, opts.perNote);
          }
          const rec: SessionRecord = {
            id: `${Date.now()}`,
            mode: opts.mode,
            at: Date.now(),
            correct: opts.correct,
            total: opts.total,
            xpEarned: opts.xpEarned,
            notesSeen: opts.notesSeen,
          };
          next = {
            ...next,
            sessions: [rec, ...next.sessions].slice(0, 50),
          };
          return next;
        })
      );
    },
    [state, persist]
  );

  const changeInstrument = useCallback(
    (timbre: Timbre) => {
      patchActive((p) => setInstrument(p, timbre));
    },
    [patchActive]
  );

  return {
    state,
    hydrated,
    activeProfile,
    selectProfile,
    patchActive,
    completeSession,
    changeInstrument,
    persist,
  };
}
