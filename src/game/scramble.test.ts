import { describe, it, expect } from "vitest";
import { scramble } from "./scramble";
import { createRandom } from "./random";
import type { Matrix } from "./types";

// prettier-ignore
const mockTarget: Matrix = [
  0, 1, 0, 1,
  1, 0, 1, 0,
  0, 1, 0, 1,
  1, 0, 1, 0,
];

const countFilled = (board: Matrix) =>
  board.reduce<number>((total, cell) => total + cell, 0);

describe("scramble", () => {
  it("is deterministic: the same seed produces the same board", () => {
    const a = scramble(mockTarget, createRandom("2026-07-04"));
    const b = scramble(mockTarget, createRandom("2026-07-04"));
    expect(a).toEqual(b);
  });

  it("different seeds produce different boards", () => {
    const a = scramble(mockTarget, createRandom("2026-07-04"));
    const b = scramble(mockTarget, createRandom("2026-07-05"));
    expect(a).not.toEqual(b);
  });

  it("preserves the number of filled cells, so it stays solvable", () => {
    const result = scramble(mockTarget, createRandom("2026-07-04"));
    expect(countFilled(result)).toBe(countFilled(mockTarget));
  });

  it("does not mutate the input board", () => {
    const before = [...mockTarget];
    scramble(mockTarget, createRandom("2026-07-04"));
    expect(mockTarget).toEqual(before);
  });
});
