import { describe, it, expect } from "vitest";
import { recordWin, activeStreak, isValidStats, type Stats } from "./stats";

const mockStats = (over: Partial<Stats> = {}): Stats => ({
  version: 1,
  currentStreak: 0,
  bestStreak: 0,
  lastWinSeed: null,
  ...over,
});

describe("recordWin", () => {
  it("starts a streak on the first win", () => {
    expect(recordWin(mockStats(), "2026-07-11")).toEqual(
      mockStats({ currentStreak: 1, bestStreak: 1, lastWinSeed: "2026-07-11" }),
    );
  });

  it("increments on a consecutive day", () => {
    const prev = mockStats({
      currentStreak: 3,
      bestStreak: 3,
      lastWinSeed: "2026-07-11",
    });
    expect(recordWin(prev, "2026-07-12")).toEqual(
      mockStats({ currentStreak: 4, bestStreak: 4, lastWinSeed: "2026-07-12" }),
    );
  });

  it("resets to 1 after a missed day, keeping the best", () => {
    const prev = mockStats({
      currentStreak: 5,
      bestStreak: 5,
      lastWinSeed: "2026-07-11",
    });
    expect(recordWin(prev, "2026-07-13")).toEqual(
      mockStats({ currentStreak: 1, bestStreak: 5, lastWinSeed: "2026-07-13" }),
    );
  });

  it("is idempotent for another win on the same day", () => {
    const prev = mockStats({
      currentStreak: 2,
      bestStreak: 4,
      lastWinSeed: "2026-07-11",
    });
    expect(recordWin(prev, "2026-07-11")).toBe(prev);
  });
});

describe("activeStreak", () => {
  it("is false when there has never been a win", () => {
    expect(activeStreak(mockStats(), "2026-07-11")).toBe(false);
  });

  it("is true when the last win was today", () => {
    expect(
      activeStreak(mockStats({ lastWinSeed: "2026-07-11" }), "2026-07-11"),
    ).toBe(true);
  });

  it("is true when the last win was yesterday (alive, at risk)", () => {
    expect(
      activeStreak(mockStats({ lastWinSeed: "2026-07-10" }), "2026-07-11"),
    ).toBe(true);
  });

  it("is false when the last win was two or more days ago", () => {
    expect(
      activeStreak(mockStats({ lastWinSeed: "2026-07-09" }), "2026-07-11"),
    ).toBe(false);
  });
});

describe("isValidStats", () => {
  const valid = mockStats({
    currentStreak: 2,
    bestStreak: 5,
    lastWinSeed: "2026-07-11",
  });

  it("accepts well-formed stats (including null lastWinSeed)", () => {
    expect(isValidStats(valid)).toBe(true);
    expect(isValidStats(mockStats())).toBe(true);
  });

  it("rejects non-objects", () => {
    expect(isValidStats(null)).toBe(false);
    expect(isValidStats(undefined)).toBe(false);
    expect(isValidStats("nope")).toBe(false);
  });

  it("rejects an unknown version", () => {
    expect(isValidStats({ ...valid, version: 2 })).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(isValidStats({ ...valid, currentStreak: "1" })).toBe(false);
    expect(isValidStats({ ...valid, bestStreak: null })).toBe(false);
    expect(isValidStats({ ...valid, lastWinSeed: 123 })).toBe(false);
  });
});
