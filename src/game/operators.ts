import type { Direction, Matrix, Operator } from "./types";

// Each operator's FORWARD shift as a [destinations, sources] pair: for every i,
// the cell at destinations[i] takes the value currently at sources[i]. "back" is
// the inverse — the very same pair applied with the two arrays swapped.
const SHIFTS: Record<Operator, [number[], number[]]> = {
  R12: [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [3, 0, 1, 2, 7, 4, 5, 6],
  ],
  R34: [
    [8, 9, 10, 11, 12, 13, 14, 15],
    [11, 8, 9, 10, 15, 12, 13, 14],
  ],
  C12: [
    [0, 1, 4, 5, 8, 9, 12, 13],
    [12, 13, 0, 1, 4, 5, 8, 9],
  ],
  C34: [
    [2, 3, 6, 7, 10, 11, 14, 15],
    [14, 15, 2, 3, 6, 7, 10, 11],
  ],
};

export function move(
  matrix: Matrix,
  operator: Operator,
  direction: Direction,
): Matrix {
  const next = [...matrix];

  let from: number[], to: number[];

  if (direction === "forward") {
    [to, from] = SHIFTS[operator];
  } else {
    [from, to] = SHIFTS[operator];
  }

  for (let i = 0; i < from.length; i++) {
    next[to[i]] = matrix[from[i]];
  }

  return next;
}
