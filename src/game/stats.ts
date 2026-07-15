import { daysBetween } from "./days-between";
import { readJSON, writeJSON } from "./storage";

const KEY = "loop:stats";

const VERSION = 1; // bump this when the Stats interface changes

export interface Stats {
  version: typeof VERSION;
  currentStreak: number;
  bestStreak: number;
  lastWinSeed: string | null; // the day of the last win — drives continuity
}

const DEFAULT_STATS: Stats = {
  version: VERSION,
  currentStreak: 0,
  bestStreak: 0,
  lastWinSeed: null,
};

export function isValidStats(obj: unknown): obj is Stats {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const stats = obj as Stats;

  return (
    stats.version === VERSION &&
    typeof stats.currentStreak === "number" &&
    typeof stats.bestStreak === "number" &&
    (stats.lastWinSeed === null || typeof stats.lastWinSeed === "string")
  );
}

export function readStats(): Stats {
  const stats = readJSON(KEY);
  if (isValidStats(stats)) {
    return stats;
  }
  return DEFAULT_STATS;
}

export function writeStats(stats: Stats): void {
  writeJSON(KEY, stats);
}

export function recordWin(stats: Stats, winSeed: string): Stats {
  if (stats.lastWinSeed === winSeed) {
    // already counted today (retries don't re-count)
    return stats;
  }

  const continues =
    stats.lastWinSeed !== null && daysBetween(stats.lastWinSeed, winSeed) === 1;

  const currentStreak = continues ? stats.currentStreak + 1 : 1;

  return {
    ...stats,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    lastWinSeed: winSeed,
  };
}

export function activeStreak(stats: Stats, todaySeed: string): boolean {
  if (stats.lastWinSeed === null) {
    return false;
  }

  const daysSinceLastWin = daysBetween(stats.lastWinSeed, todaySeed);

  return daysSinceLastWin === 0 || daysSinceLastWin === 1;
}
