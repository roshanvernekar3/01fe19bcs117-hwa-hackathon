"use client";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = true;
let volume = 0.4;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setEnabled(v: boolean) { enabled = v; }
export function isEnabled() { return enabled; }
export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = volume;
}
export function getVolume() { return volume; }

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.3, start = 0) {
  const c = getCtx();
  if (!c || !masterGain || !enabled) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function play(name: string) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  switch (name) {
    case "pop":
      tone(700, 0.07, "sine", 0.2);
      tone(420, 0.06, "sine", 0.15, 0.03);
      break;
    case "cart":
      tone(523, 0.1, "sine", 0.25);
      tone(659, 0.12, "sine", 0.25, 0.08);
      break;
    case "sparkle":
      tone(784, 0.08, "triangle", 0.2);
      tone(988, 0.08, "triangle", 0.2, 0.06);
      tone(1318, 0.12, "triangle", 0.2, 0.12);
      break;
    case "notify":
      tone(523, 0.15, "sine", 0.2);
      tone(659, 0.15, "sine", 0.2, 0.1);
      tone(784, 0.2, "sine", 0.2, 0.2);
      break;
    case "menu":
      tone(600, 0.05, "sine", 0.15);
      break;
    case "page":
      tone(440, 0.12, "sine", 0.12);
      tone(554, 0.1, "sine", 0.1, 0.06);
      break;
    case "bark":
      tone(220, 0.08, "sawtooth", 0.25);
      tone(180, 0.1, "sawtooth", 0.2, 0.08);
      tone(150, 0.12, "sawtooth", 0.18, 0.16);
      break;
    case "meow":
      tone(400, 0.12, "sine", 0.2);
      tone(550, 0.12, "sine", 0.2, 0.1);
      tone(700, 0.15, "sine", 0.18, 0.2);
      break;
    default:
      tone(500, 0.06, "sine", 0.15);
  }
  // track last play time to suppress duplicate pops
  (window as unknown as { __lastSound: number }).__lastSound = Date.now();
}

export function lastSoundTime() {
  return (window as unknown as { __lastSound?: number }).__lastSound || 0;
}