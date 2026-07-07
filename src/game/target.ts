import type { Matrix } from "./types";

// Creates a new target board, with exactly 8 filled cells (1s) and 8 empty cells (0s).
export function createTarget(random: () => number): Matrix {
  const refs: number[] = [];

  for (let i = 0; i < 16; i++) {
    refs.push(random());
  }

  const order = [...Array(16).keys()].sort((a, b) => refs[a] - refs[b]);
  const target: Matrix = new Array(16);

  order.forEach((cell, rank) => {
    target[cell] = (rank % 2) as 0 | 1;
  });

  return target;
}
