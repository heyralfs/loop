import type { Direction, Orientation } from "../game/types";

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
  bestStreak: (days: number) => `🏆 Best streak: ${days}`,

  optimal: "Optimal",

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
  parWasNoResets: (par: number) => `Par was ${par}. No resets left.`,
  tryAgain: (remaining: number) => `Try again (${remaining})`,

  // play area
  reset: (remaining: number) => `Reset (${remaining})`,
  giveUp: "I give up",
  doneForToday: "Done for today",
  controlLabel: (
    orientation: Orientation,
    line: number,
    direction: Direction,
  ) => {
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

  // stats
  winDistribution: "Win distribution",
  orMore: "or more",
  played: "Played",
  winRate: "Win rate",
  dnf: "DNF",

  // footer
  madeBy: "Made by",

  // how to play
  howToPlay: {
    heading: "How to play",
    cta: "Got it — play",
    steps: [
      {
        title: "Match the target.",
        body: "Rearrange your board until it matches today's target pattern.",
      },
      {
        title: "Shift rows & columns.",
        body: "The arrows slide a single row (◀ ▶) or column (▲ ▼). Whatever tile falls off one edge reappears on the opposite side.",
      },
      {
        title: "Mind the star.",
        body: "Some days a marked tile (★) joins in — slide it onto its spot on the target too, just like the others.",
      },
      {
        title: "Match par.",
        body: "Par is the fewest moves possible. Match it for an {optimal} solve.",
      },
      {
        title: "Keep your streak.",
        body: "Solve a puzzle every day to keep your streak going.",
      },
    ],
  },

  // share (button labels + the shared/copied text; "Loop #n" and the URL
  // aren't translated). Reuses dayStreak for the streak line.
  share: {
    button: "Share result",
    copied: "Result copied",
    optimal: (moves: number) => `🏆 Solved in ${moves} — Optimal result!`,
    solved: (moves: number, par: number) =>
      `✅ Solved in ${moves} · par ${par} (+${moves - par})`,
    cta: "Can you match par?",
  },
};
