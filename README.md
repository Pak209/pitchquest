# Pitch Quest

Ear-training PWA for Dad & Son — dark navy night-sky theme, Web Audio tones, mastery-based unlocks.

## Stack

- Next.js 14 App Router + TypeScript + Tailwind CSS
- Web Audio API (no licensed samples)
- localStorage persistence
- PWA manifest + service worker

## Launch

```bash
cd /workspace/pitchquest   # or your clone path
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm test          # vitest unit tests (note math, mastery, note-finder)
npm run lint      # next lint / eslint
npm run build     # production build
npm start         # serve production build
```

## Profiles

- **Son** — kid labels (C=Cat 🐱, D=Dog, …) + Learning Mode
- **Dad** — standard note names
- Per-profile XP, level, streak, mastery, instrument preference, session history

## Modes

1. **Note Finder** — adaptive single-note ID (starts C vs G)
2. **Interval Explorer** — Unison, m3, M3, P5, Octave
3. **Chord Quest** — Major vs Minor
4. **Instrument Mode** — timbre picker → Note Finder
5. **Dad vs Son** — alternate-turn race with kind winner screen
6. **Learning Mode** — animal mnemonics + hear notes

## Mastery unlocks (not XP-gated)

≥90% accuracy on each unlocked note across **3 sessions** expands the set:

`C+G → +D/E → +F/A → +B`

XP is cosmetic (level badge only).

## Audio

- A4 = 440 Hz equal temperament
- Timbres: sine, pad, piano-ish harmonics, bell, organ-ish, triangle
- ADSR envelopes; AudioContext resumed on user gesture

## Persistence

Key: `pitchquest:v1` in `localStorage`.

## License

Private / personal project.
