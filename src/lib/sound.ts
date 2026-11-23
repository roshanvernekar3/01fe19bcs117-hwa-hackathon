let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(ctx: AudioContext, freq: number, freqEnd: number, duration: number, type: OscillatorType, gain = 0.12) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), ctx.currentTime + duration);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + duration + 0.02);
}

export function playAddToCart() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("pawberry-sound") === "off") return;
  } catch {}
  const ctx = audio();
  if (!ctx) return;
  try {
    tone(ctx, 520, 760, 0.12, "triangle");
  } catch {}
}

export function playWish() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("pawberry-sound") === "off") return;
  } catch {}
  const ctx = audio();
  if (!ctx) return;
  try {
    tone(ctx, 880, 1318, 0.16, "sine");
  } catch {}
}

export function setSoundPref(v: boolean) {
  try {
    localStorage.setItem("pawberry-sound", v ? "on" : "off");
  } catch {}
}

export function isSoundOn(): boolean {
  try {
    const v = localStorage.getItem("pawberry-sound");
    if (v === null) return true;
    return v !== "off";
  } catch {
    return true;
  }
}
