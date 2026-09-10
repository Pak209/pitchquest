"use client";

import { noteNameToFrequency } from "./notes";

export type Timbre = "sine" | "pad" | "piano" | "bell" | "organ" | "triangle";

export type PlayOptions = {
  timbre?: Timbre;
  duration?: number;
  when?: number;
  gain?: number;
};

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is browser-only");
  }
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!sharedCtx) {
    sharedCtx = new AC();
  }
  return sharedCtx;
}

export async function resumeAudio(): Promise<AudioContext> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

function createOscillator(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number
): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  return osc;
}

/** Soft ADSR to avoid clicks */
function applyEnvelope(
  gain: GainNode,
  ctx: AudioContext,
  start: number,
  duration: number,
  peak: number,
  adsr = { a: 0.02, d: 0.12, s: 0.55, r: 0.18 }
) {
  const { a, d, s, r } = adsr;
  const end = start + duration;
  const sustainLevel = peak * s;
  gain.gain.cancelScheduledValues(start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), start + a);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(sustainLevel, 0.0001),
    start + a + d
  );
  const releaseAt = Math.max(start + a + d, end - r);
  gain.gain.setValueAtTime(Math.max(sustainLevel, 0.0001), releaseAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
}

type PartialSpec = { ratio: number; amp: number; type?: OscillatorType };

function timbrePartials(timbre: Timbre): PartialSpec[] {
  switch (timbre) {
    case "sine":
      return [{ ratio: 1, amp: 1, type: "sine" }];
    case "triangle":
      return [{ ratio: 1, amp: 1, type: "triangle" }];
    case "pad":
      return [
        { ratio: 1, amp: 0.7, type: "triangle" },
        { ratio: 2, amp: 0.2, type: "sine" },
        { ratio: 0.5, amp: 0.15, type: "sine" },
      ];
    case "piano":
      return [
        { ratio: 1, amp: 0.85, type: "sine" },
        { ratio: 2, amp: 0.35, type: "sine" },
        { ratio: 3, amp: 0.18, type: "sine" },
        { ratio: 4, amp: 0.08, type: "sine" },
        { ratio: 5, amp: 0.04, type: "sine" },
      ];
    case "bell":
      return [
        { ratio: 1, amp: 0.7, type: "sine" },
        { ratio: 2.76, amp: 0.35, type: "sine" },
        { ratio: 5.4, amp: 0.18, type: "sine" },
        { ratio: 8.2, amp: 0.08, type: "sine" },
      ];
    case "organ":
      return [
        { ratio: 1, amp: 0.55, type: "sine" },
        { ratio: 2, amp: 0.4, type: "sine" },
        { ratio: 3, amp: 0.25, type: "sine" },
        { ratio: 4, amp: 0.15, type: "sine" },
        { ratio: 6, amp: 0.1, type: "sine" },
      ];
    default:
      return [{ ratio: 1, amp: 1, type: "sine" }];
  }
}

function adsrFor(timbre: Timbre) {
  switch (timbre) {
    case "bell":
      return { a: 0.005, d: 0.25, s: 0.25, r: 0.6 };
    case "piano":
      return { a: 0.008, d: 0.2, s: 0.35, r: 0.35 };
    case "pad":
      return { a: 0.08, d: 0.2, s: 0.7, r: 0.35 };
    case "organ":
      return { a: 0.03, d: 0.05, s: 0.85, r: 0.12 };
    default:
      return { a: 0.02, d: 0.12, s: 0.55, r: 0.2 };
  }
}

export async function playFrequency(
  freq: number,
  opts: PlayOptions = {}
): Promise<void> {
  const ctx = await resumeAudio();
  const timbre = opts.timbre ?? "piano";
  const duration = opts.duration ?? 0.7;
  const when = opts.when ?? ctx.currentTime + 0.02;
  const peak = opts.gain ?? 0.22;
  const master = ctx.createGain();
  master.connect(ctx.destination);
  applyEnvelope(master, ctx, when, duration, peak, adsrFor(timbre));

  const partials = timbrePartials(timbre);
  const ampSum = partials.reduce((s, p) => s + p.amp, 0);

  for (const p of partials) {
    const osc = createOscillator(ctx, p.type ?? "sine", freq * p.ratio);
    const g = ctx.createGain();
    g.gain.value = p.amp / ampSum;
    osc.connect(g);
    g.connect(master);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }
}

export async function playNote(
  name: string,
  octave: number,
  opts: PlayOptions = {}
): Promise<void> {
  return playFrequency(noteNameToFrequency(name, octave), opts);
}

export async function playNotesSequential(
  notes: { name: string; octave: number }[],
  opts: PlayOptions & { gap?: number } = {}
): Promise<void> {
  const ctx = await resumeAudio();
  const gap = opts.gap ?? 0.55;
  const duration = opts.duration ?? 0.45;
  const start = ctx.currentTime + 0.02;
  await Promise.all(
    notes.map((n, i) =>
      playNote(n.name, n.octave, {
        ...opts,
        duration,
        when: start + i * gap,
      })
    )
  );
}

export async function playNotesTogether(
  notes: { name: string; octave: number }[],
  opts: PlayOptions = {}
): Promise<void> {
  const ctx = await resumeAudio();
  const when = opts.when ?? ctx.currentTime + 0.02;
  const perGain = (opts.gain ?? 0.18) / Math.sqrt(notes.length);
  await Promise.all(
    notes.map((n) =>
      playNote(n.name, n.octave, { ...opts, when, gain: perGain })
    )
  );
}

export async function playChord(
  notes: { name: string; octave: number }[],
  mode: "simultaneous" | "arpeggio" = "simultaneous",
  opts: PlayOptions = {}
): Promise<void> {
  if (mode === "arpeggio") {
    return playNotesSequential(notes, { ...opts, gap: 0.28, duration: 0.55 });
  }
  return playNotesTogether(notes, opts);
}

export const TIMBRE_LABELS: Record<Timbre, string> = {
  sine: "Sine",
  pad: "Pad",
  piano: "Piano",
  bell: "Bell",
  organ: "Organ",
  triangle: "Soft",
};
