import { daysBetween } from "./days-between";
import { readJSON, writeJSON } from "./storage";

const KEY = "loop:stats";

const VERSION = 3;

// Solves are bucketed by how far over par they landed. Four slots:
// [optimal, +1, +2, +3 or more].
const BUCKETS = 4;

export interface Stats {
  version: typeof VERSION;
  currentStreak: number;
  bestStreak: number;
  lastWinSeed: string | null; // the day of the last win — drives continuity
  lastWinBucket: number | null; // today's best bucket — lets a retry improve it
  distribution: number[]; // length BUCKETS; index = moves over par (capped at 3)
  played: number; // days a first move was made — attempts, wins and losses alike
  lastPlayedSeed: string | null; // guards `played` from double-counting a day
}

const DEFAULT_STATS: Stats = {
  version: VERSION,
  currentStreak: 0,
  bestStreak: 0,
  lastWinSeed: null,
  lastWinBucket: null,
  distribution: [0, 0, 0, 0],
  played: 0,
  lastPlayedSeed: null,
};

// Which distribution slot a solve falls into: 0 = optimal … 3 = three-or-more over.
export function overParBucket(over: number): number {
  return Math.min(Math.max(over, 0), BUCKETS - 1);
}

// Wins are the sum of the distribution; a "did not finish" is a played day with
// no win, so both are derived from `played` + `distribution` — nothing extra to store.
export function winCount(distribution: number[]): number {
  return distribution.reduce((sum, count) => sum + count, 0);
}

export function isValidStats(obj: unknown): obj is Stats {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const stats = obj as Stats;

  return (
    stats.version === VERSION &&
    typeof stats.currentStreak === "number" &&
    typeof stats.bestStreak === "number" &&
    (stats.lastWinSeed === null || typeof stats.lastWinSeed === "string") &&
    (stats.lastWinBucket === null || typeof stats.lastWinBucket === "number") &&
    Array.isArray(stats.distribution) &&
    stats.distribution.length === BUCKETS &&
    stats.distribution.every((count) => typeof count === "number") &&
    typeof stats.played === "number" &&
    (stats.lastPlayedSeed === null || typeof stats.lastPlayedSeed === "string")
  );
}

// v2 had no attempt tracking. People are already playing, so we must not wipe
// their streaks/distribution — backfill `played` from the win count (assume each
// recorded win was one played day) rather than resetting.
interface StatsV2 {
  version: 2;
  currentStreak: number;
  bestStreak: number;
  lastWinSeed: string | null;
  lastWinBucket: number | null;
  distribution: number[];
}

function isStatsV2(obj: unknown): obj is StatsV2 {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const stats = obj as StatsV2;

  return (
    stats.version === 2 &&
    typeof stats.currentStreak === "number" &&
    typeof stats.bestStreak === "number" &&
    (stats.lastWinSeed === null || typeof stats.lastWinSeed === "string") &&
    (stats.lastWinBucket === null || typeof stats.lastWinBucket === "number") &&
    Array.isArray(stats.distribution) &&
    stats.distribution.length === BUCKETS &&
    stats.distribution.every((count) => typeof count === "number")
  );
}

// Turn whatever is stored into valid current-version stats
export function migrateStats(stored: unknown): Stats {
  if (isValidStats(stored)) {
    return stored;
  }
  if (isStatsV2(stored)) {
    const played = winCount(stored.distribution);
    return {
      ...stored,
      version: VERSION,
      played,
      lastPlayedSeed: stored.lastWinSeed,
    };
  }
  return DEFAULT_STATS;
}

export function readStats(): Stats {
  return migrateStats(readJSON(KEY));
}

export function writeStats(stats: Stats): void {
  writeJSON(KEY, stats);
}

// Count one attempt per day, the first time a move is made. Guarded by
// `lastPlayedSeed` so a reload or reset never recounts the same day.
export function recordPlayed(stats: Stats, seed: string): Stats {
  if (stats.lastPlayedSeed === seed) {
    return stats;
  }
  return { ...stats, played: stats.played + 1, lastPlayedSeed: seed };
}

// `over` is how many moves above par this solve was (0 = optimal).
export function recordWin(stats: Stats, winSeed: string, over: number): Stats {
  const bucket = overParBucket(over);

  if (stats.lastWinSeed === winSeed) {
    // Already counted today. A retry only matters if it beat the day's best —
    // then move the tally from the old bucket to the better one.
    if (stats.lastWinBucket === null || bucket >= stats.lastWinBucket) {
      return stats;
    }

    const distribution = [...stats.distribution];
    distribution[stats.lastWinBucket] -= 1;
    distribution[bucket] += 1;

    return { ...stats, distribution, lastWinBucket: bucket };
  }

  const continues =
    stats.lastWinSeed !== null && daysBetween(stats.lastWinSeed, winSeed) === 1;

  const currentStreak = continues ? stats.currentStreak + 1 : 1;

  const distribution = [...stats.distribution];
  distribution[bucket] += 1;

  return {
    ...stats,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    lastWinSeed: winSeed,
    lastWinBucket: bucket,
    distribution,
  };
}

export function hasActiveStreak(stats: Stats, todaySeed: string): boolean {
  if (stats.lastWinSeed === null) {
    return false;
  }

  const daysSinceLastWin = daysBetween(stats.lastWinSeed, todaySeed);

  return daysSinceLastWin === 0 || daysSinceLastWin === 1;
}
