import { describe, it, expect } from "vitest";
import { daysBetween } from "./days-between";

describe("daysBetween", () => {
  it("is 0 for the same date", () => {
    expect(daysBetween("2026-07-11", "2026-07-11")).toBe(0);
  });

  it("counts a single day", () => {
    expect(daysBetween("2026-07-11", "2026-07-12")).toBe(1);
  });

  it("counts a multi-day span", () => {
    expect(daysBetween("2026-07-11", "2026-07-21")).toBe(10);
  });

  it("counts across a month boundary", () => {
    expect(daysBetween("2026-07-31", "2026-08-01")).toBe(1);
  });

  it("counts across a year boundary", () => {
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("counts across a leap day", () => {
    // 2028 is a leap year, so Feb 29 exists: 28 → 29 → Mar 1 = 2 days.
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
  });

  it("is negative when the second date is earlier", () => {
    expect(daysBetween("2026-07-12", "2026-07-11")).toBe(-1);
  });
});
