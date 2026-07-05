import { describe, it, expect } from "vitest";
import { scramble } from "./scramble";
import { createRandom } from "./random";
import { TARGET } from "./target";
import type { Matrix } from "./types";

const countFilled = (board: Matrix) =>
  board.reduce<number>((total, cell) => total + cell, 0);

describe("scramble", () => {
  it("is deterministic: the same seed produces the same board", () => {
    const a = scramble(TARGET, createRandom("2026-07-04"));
    const b = scramble(TARGET, createRandom("2026-07-04"));
    expect(a).toEqual(b);
  });

  it("different seeds produce different boards", () => {
    const a = scramble(TARGET, createRandom("2026-07-04"));
    const b = scramble(TARGET, createRandom("2026-07-05"));
    expect(a).not.toEqual(b);
  });

  it("preserves the number of filled cells, so it stays solvable", () => {
    const result = scramble(TARGET, createRandom("2026-07-04"));
    expect(countFilled(result)).toBe(countFilled(TARGET));
  });

  it("does not mutate the input board", () => {
    const before = [...TARGET];
    scramble(TARGET, createRandom("2026-07-04"));
    expect(TARGET).toEqual(before);
  });
});
