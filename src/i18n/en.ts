import type { Direction, Orientation } from "../game/types";
import type { Status } from "../components/status-chip";

// English is the source of truth: it defines the key set every locale must
// provide (pt.ts is typed as `typeof en`, so a missing key won't compile).
export const en = {
  // board accessible names
  yourBoard: "Your board",
  yourFinalBoard: "Your final board",
  target: "Target",

  // move counter
  moves: "Moves",
  par: "Par",

  // best & streak
  bestToday: (best: number) => `Best today ${best}`,
  dayStreak: (streak: number) => `🔥 ${streak}-day streak`,

  // status chip
  status: {
    PLAYING: "Playing",
    SOLVED: "Solved",
    OPTIMAL: "Optimal",
    GAVE_UP: "Gave up",
  } satisfies Record<Status, string>,

  // countdown
  nextPuzzleIn: "Next puzzle in",

  // result panel
  gaveUpHeadline: "You gave up on today's puzzle.",
  gaveUpSubhead: "Come back tomorrow for a new one.",
  optimalHeadline: "Optimal! 🏆",
  optimalSubhead: (par: number) =>
    `You matched par (${par}) — the fewest moves possible.`,
  solvedHeadline: (moves: number) => `Solved in ${moves}`,
  solvedSubhead: (par: number) => `Par is ${par}. Can you match it?`,
  tryAgain: (remaining: number) => `Try again (${remaining})`,
  noResetsLeft: "No resets left",

  // play area
  reset: (remaining: number) => `Reset (${remaining})`,
  giveUp: "I give up",
  controlLabel: (orientation: Orientation, line: number, direction: Direction) => {
    const noun = orientation === "row" ? "row" : "column";
    const way = {
      row: { back: "left", forward: "right" },
      column: { back: "up", forward: "down" },
    }[orientation][direction];
    return `Shift ${noun} ${line} ${way}`;
  },

  // toggles
  muteSound: "Mute sound",
  unmuteSound: "Unmute sound",
  switchToLightTheme: "Switch to light theme",
  switchToDarkTheme: "Switch to dark theme",

  // menu
  menu: "Menu",
  sound: "Sound",
  theme: "Theme",
  language: "Language",

  // install banner
  installPrompt: "Download and play offline",
  install: "Install",
  dismiss: "Dismiss",
};
