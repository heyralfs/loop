import clickSound from "../assets/sounds/click.mp3";
import slideSound from "../assets/sounds/slide.mp3";
import flipSound from "../assets/sounds/flip.mp3";
import { readJSON, writeJSON } from "../game/storage";

const ctx = new AudioContext(); // one engine
const master = ctx.createGain();
master.connect(ctx.destination);

const MUTE_KEY = "loop:muted";
let muted = readJSON(MUTE_KEY) === true;

export function isMuted(): boolean {
  return muted;
}

export function persistMuted(next: boolean): void {
  muted = next;
  writeJSON(MUTE_KEY, next);
}

type SoundName = "click" | "slide" | "flip";

const buffers: Record<SoundName, AudioBuffer | null> = {
  click: null,
  slide: null,
  flip: null,
};

async function load(name: SoundName, url: string) {
  const data = await fetch(url).then((r) => r.arrayBuffer());
  buffers[name] = await ctx.decodeAudioData(data);
}

Promise.all([
  load("click", clickSound),
  load("slide", slideSound),
  load("flip", flipSound),
]).catch((e) => console.warn("sound load failed", e));

export function play(name: SoundName, delay = 0) {
  if (muted || !buffers[name]) return;
  if (ctx.state === "suspended") ctx.resume(); // gesture unlock
  const src = ctx.createBufferSource();
  src.buffer = buffers[name];
  src.connect(master);
  src.start(ctx.currentTime + delay);
}
