# Pitch Quest MVP — Completion Report

## Launch commands

```bash
cd /workspace/pitchquest
npm install
npm run dev          # http://localhost:3000
# or
npm run build && npm start
```

## Implemented

| Priority | Feature | Status |
|----------|---------|--------|
| 1 | Audio accuracy (A4=440, note↔midi↔Hz, timbres, ADSR, chords/intervals) | Done |
| 2 | Note Finder (adaptive, lives, session end, unlock path) | Done |
| 3 | Profiles / persistence (Son+Dad, XP, streak, instrument) | Done |
| 4 | Progression / mastery (≥90% × 3 sessions) | Done |
| 5 | Progress dashboard (ring, stats, note bars, unlock path) | Done |
| 6 | Dad vs Son (alternate turns, kind winner) | Done |
| 7 | Chord Quest (Major vs Minor) | Done |
| 8 | Interval Explorer (Unison, m3/M3, P5, Octave) | Done |
| 9 | Instrument Mode (timbre grid + persist) | Done |
| 10 | PWA (manifest, icons, SW offline shell) | Done |
| 11 | Visual polish (navy night sky, rounded controls, mascots) | Done |

## Deferred / simplified

- Per-interval / per-chord detailed mastery bars (tabs exist; note mastery is full)
- Accidentals beyond naturals in unlock path
- Octaves / 7ths / inversions stages (listed on progress UI, not yet playable gates)
- True sampled instruments (synth approximations only)
- Cloud sync / multi-device
- shadcn CLI components — hand-authored Button/Card/Progress equivalents

## Audio notes

- Pure helpers in `src/lib/audio/notes.ts` (unit tested)
- Engine in `src/lib/audio/engine.ts`: partials + ADSR, `resumeAudio()` on gesture
- Chords: simultaneous or arpeggio; intervals: sequential or together

## Persistence keys

- `localStorage["pitchquest:v1"]` → `{ version: 1, activeProfileId, profiles: { son, dad } }`
- Profile fields: `xp`, `level`, `streakDays`, `lastPlayDate`, `instrument`, `mastery`, `unlockedNotes`, `sessions`, …

## Mastery rules

- Start unlocked: `C`, `G`
- A note is **mastered** when the last 3 session accuracies for that note are each ≥ 0.9
- When **all** currently unlocked notes are mastered, unlock the next stage set
- XP does **not** gate content

## Limitations

- First auto-play of a tone may be blocked until a tap (browser autoplay policy); Speaker button always works after gesture
- Service worker caches a thin shell; App Router RSC payloads may still need network for full offline gameplay
- Synth timbres are approximations, not realistic instrument samples
- Dad vs Son uses the union of both unlock sets and does not write per-profile mastery mid-duel

## Next 3 improvements

1. Persist duel results into both profiles’ session history + lightweight mastery updates
2. Add octave-discrimination and accidental stages behind mastery gates
3. Richer offline caching of `/_next/static` assets + install prompt UI

## Test / build checklist (fill after CI run)

- [x] `npm install`
- [x] `npm test` (12 passed)
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run dev` listens on :3000 (HTTP 200)
