import { readJSON, writeJSON } from "../../game/storage";

const KEY = "loop:how-to-play-seen";
const SWIPE_KEY = "loop:swipe-announced";

export function hasSeenGuide(): boolean {
  return readJSON(KEY) === true;
}

export function markGuideAsSeen(): void {
  writeJSON(KEY, true);
}

export function hasSeenSwipe(): boolean {
  return readJSON(SWIPE_KEY) === true;
}

export function markSwipeSeen(): void {
  writeJSON(SWIPE_KEY, true);
}
