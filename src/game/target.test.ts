import { describe, it, expect } from "vitest";
import { createTarget } from "./target";
import { createRandom } from "./random";
import type { Matrix } from "./types";

// A fake RNG that yields the given values in order — lets us drive createTarget
// deterministically without depending on the PRNG's exact stream.
function sequence(values: number[]): () => number {
  let i = 0;
  return () => values[i++];
}

const countFilled = (board: Matrix) =>
  board.reduce<number>((total, cell) => total + cell, 0);

describe("createTarget", () => {
  it("assigns cells by rank parity (ascending values → alternating from 0)", () => {
    const random = sequence([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    // prettier-ignore
    expect(createTarget(random)).toEqual([
      0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1,
      0, 1, 0, 1,
    ]);
  });

  it("always produces exactly 8 filled cells (balanced)", () => {
    for (const seed of ["2026-07-04", "a", "hello", "42", "x"]) {
      expect(countFilled(createTarget(createRandom(seed)))).toBe(8);
    }
  });

  it("stays balanced even when random values collide (ranks by index, not value)", () => {
    const allEqual = sequence(new Array(16).fill(0.5));
    expect(countFilled(createTarget(allEqual))).toBe(8);
  });

  it("only contains 0s and 1s, length 16", () => {
    const target = createTarget(createRandom("2026-07-04"));
    expect(target).toHaveLength(16);
    expect(target.every((cell) => cell === 0 || cell === 1)).toBe(true);
  });

  it("is deterministic: the same seed yields the same target", () => {
    expect(createTarget(createRandom("2026-07-04"))).toEqual(
      createTarget(createRandom("2026-07-04")),
    );
  });

  it("stays simple (and draws no extra random) when complexity is off", () => {
    // Probability 0 must reproduce the plain simple target exactly — it may not
    // consume a random draw, or historical puzzles would shift.
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    expect(createTarget(sequence(values), 0)).toEqual(
      createTarget(sequence(values)),
    );
  });

  it("can place a 2 among the filled cells when complexity is on", () => {
    const target = createTarget(createRandom("2026-07-04"), 1); // always complex
    const twos = target.filter((cell) => cell === 2).length;
    const filled = target.filter((cell) => cell !== 0).length;
    expect(twos).toBe(1);
    expect(filled).toBe(8); // still 8 filled cells — one of them the 2
    expect(target).toHaveLength(16);
  });
});
