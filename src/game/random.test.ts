import { describe, it, expect } from "vitest";
import { createRandom } from "./random";

const take = (fn: () => number, n: number) =>
  Array.from({ length: n }, () => fn());

describe("createRandom", () => {
  it("is deterministic: the same seed yields the same sequence", () => {
    expect(take(createRandom("2026-07-04"), 5)).toEqual(
      take(createRandom("2026-07-04"), 5),
    );
  });

  it("different seeds yield different sequences", () => {
    expect(take(createRandom("2026-07-04"), 5)).not.toEqual(
      take(createRandom("2026-07-05"), 5),
    );
  });

  it("produces numbers in [0, 1)", () => {
    const random = createRandom("seed");
    for (const value of take(random, 100)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
