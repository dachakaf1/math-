// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
let ctx: AudioContext | null = null;
let enabled = true;
export function setSoundEnabled(v: boolean) { enabled = v; }
export function playSound(kind: "click" | "ok" | "bad" | "tick") {
  if (!enabled) return;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const notes = kind === "ok" ? [523, 659, 784] : kind === "bad" ? [180, 140] : kind === "tick" ? [880] : [620];
    notes.forEach((freq, i) => {
      const osc = ctx!.createOscillator(); const gain = ctx!.createGain();
      osc.type = kind === "bad" ? "sawtooth" : "sine"; osc.frequency.value = freq;
      const start = now + i * 0.07;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(kind === "tick" ? 0.015 : 0.05, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "tick" ? 0.05 : 0.18));
      osc.connect(gain).connect(ctx!.destination); osc.start(start); osc.stop(start + 0.2);
    });
  } catch { /* audio unavailable */ }
}
