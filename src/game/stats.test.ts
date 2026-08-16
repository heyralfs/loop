import { describe, it, expect } from "vitest";
import {
  recordWin,
  hasActiveStreak,
  isValidStats,
  overParBucket,
  type Stats,
} from "./stats";

const mockStats = (over: Partial<Stats> = {}): Stats => ({
  version: 2,
  currentStreak: 0,
  bestStreak: 0,
  lastWinSeed: null,
  lastWinBucket: null,
  distribution: [0, 0, 0, 0],
  ...over,
});

describe("overParBucket", () => {
  it("maps over-par to a slot, capping at 3", () => {
    expect(overParBucket(0)).toBe(0); // optimal
    expect(overParBucket(1)).toBe(1);
    expect(overParBucket(2)).toBe(2);
    expect(overParBucket(3)).toBe(3);
    expect(overParBucket(9)).toBe(3); // +3 or more
    expect(overParBucket(-1)).toBe(0); // defensive
  });
});

describe("recordWin", () => {
  it("starts a streak and records the bucket on the first win", () => {
    expect(recordWin(mockStats(), "2026-07-11", 0)).toEqual(
      mockStats({
        currentStreak: 1,
        bestStreak: 1,
        lastWinSeed: "2026-07-11",
        lastWinBucket: 0,
        distribution: [1, 0, 0, 0],
      }),
    );
  });

  it("buckets a non-optimal solve by its over-par amount", () => {
    expect(recordWin(mockStats(), "2026-07-11", 2)).toEqual(
      mockStats({
        currentStreak: 1,
        bestStreak: 1,
        lastWinSeed: "2026-07-11",
        lastWinBucket: 2,
        distribution: [0, 0, 1, 0],
      }),
    );
  });

  it("caps far-over-par solves in the last bucket", () => {
    expect(recordWin(mockStats(), "2026-07-11", 7).distribution).toEqual([
      0, 0, 0, 1,
    ]);
  });

  it("increments the streak and tally on a consecutive day", () => {
    const prev = mockStats({
      currentStreak: 3,
      bestStreak: 3,
      lastWinSeed: "2026-07-11",
      lastWinBucket: 0,
      distribution: [1, 0, 0, 0],
    });
    expect(recordWin(prev, "2026-07-12", 2)).toEqual(
      mockStats({
        currentStreak: 4,
        bestStreak: 4,
        lastWinSeed: "2026-07-12",
        lastWinBucket: 2,
        distribution: [1, 0, 1, 0],
      }),
    );
  });

  it("resets to 1 after a missed day, keeping the best and tally", () => {
    const prev = mockStats({
      currentStreak: 5,
      bestStreak: 5,
      lastWinSeed: "2026-07-11",
      lastWinBucket: 0,
      distribution: [2, 1, 0, 0],
    });
    expect(recordWin(prev, "2026-07-13", 1)).toEqual(
      mockStats({
        currentStreak: 1,
        bestStreak: 5,
        lastWinSeed: "2026-07-13",
        lastWinBucket: 1,
        distribution: [2, 2, 0, 0],
      }),
    );
  });

  it("leaves a same-day retry that did not beat the best unchanged", () => {
    const prev = mockStats({
      currentStreak: 2,
      bestStreak: 4,
      lastWinSeed: "2026-07-11",
      lastWinBucket: 0,
      distribution: [1, 0, 0, 0],
    });
    // Already optimal today; a +2 retry can't improve it.
    expect(recordWin(prev, "2026-07-11", 2)).toBe(prev);
  });

  it("moves the tally when a same-day retry beats the best", () => {
    const prev = mockStats({
      currentStreak: 2,
      bestStreak: 4,
      lastWinSeed: "2026-07-11",
      lastWinBucket: 2,
      distribution: [0, 0, 1, 0],
    });
    // Solved again, this time optimal — streak untouched, tally moves to slot 0.
    expect(recordWin(prev, "2026-07-11", 0)).toEqual(
      mockStats({
        currentStreak: 2,
        bestStreak: 4,
        lastWinSeed: "2026-07-11",
        lastWinBucket: 0,
        distribution: [1, 0, 0, 0],
      }),
    );
  });
});

describe("hasActiveStreak", () => {
  it("is false when there has never been a win", () => {
    expect(hasActiveStreak(mockStats(), "2026-07-11")).toBe(false);
  });

  it("is true when the last win was today", () => {
    expect(
      hasActiveStreak(mockStats({ lastWinSeed: "2026-07-11" }), "2026-07-11"),
    ).toBe(true);
  });

  it("is true when the last win was yesterday (alive, at risk)", () => {
    expect(
      hasActiveStreak(mockStats({ lastWinSeed: "2026-07-10" }), "2026-07-11"),
    ).toBe(true);
  });

  it("is false when the last win was two or more days ago", () => {
    expect(
      hasActiveStreak(mockStats({ lastWinSeed: "2026-07-09" }), "2026-07-11"),
    ).toBe(false);
  });
});

describe("isValidStats", () => {
  const valid = mockStats({
    currentStreak: 2,
    bestStreak: 5,
    lastWinSeed: "2026-07-11",
    lastWinBucket: 1,
    distribution: [3, 2, 1, 0],
  });

  it("accepts well-formed stats", () => {
    expect(isValidStats(valid)).toBe(true);
    expect(isValidStats(mockStats())).toBe(true);
  });

  it("rejects non-objects", () => {
    expect(isValidStats(null)).toBe(false);
    expect(isValidStats(undefined)).toBe(false);
    expect(isValidStats("nope")).toBe(false);
  });

  it("rejects an unknown version", () => {
    expect(isValidStats({ ...valid, version: 3 })).toBe(false);
    expect(isValidStats({ ...valid, version: 1 })).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(isValidStats({ ...valid, currentStreak: "1" })).toBe(false);
    expect(isValidStats({ ...valid, bestStreak: null })).toBe(false);
    expect(isValidStats({ ...valid, lastWinSeed: 123 })).toBe(false);
    expect(isValidStats({ ...valid, lastWinBucket: "0" })).toBe(false);
  });

  it("rejects a malformed distribution", () => {
    expect(isValidStats({ ...valid, distribution: "nope" })).toBe(false);
    expect(isValidStats({ ...valid, distribution: [1, 2, 3] })).toBe(false); // wrong length
    expect(isValidStats({ ...valid, distribution: [1, 2, 3, "4"] })).toBe(false);
  });
});
