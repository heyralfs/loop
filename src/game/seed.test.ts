import { describe, it, expect } from "vitest";
import { dateToSeed } from "./seed";

describe("dateToSeed", () => {
  it("formats as YYYY-MM-DD with a 1-indexed month", () => {
    expect(dateToSeed(new Date(2026, 6, 4))).toBe("2026-07-04"); // July 4
  });

  it("zero-pads single-digit months and days", () => {
    expect(dateToSeed(new Date(2026, 0, 9))).toBe("2026-01-09"); // Jan 9
  });

  it("handles two-digit months and days", () => {
    expect(dateToSeed(new Date(2026, 11, 25))).toBe("2026-12-25"); // Dec 25
  });
});
