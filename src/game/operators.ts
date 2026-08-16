import type { Direction, Matrix, Operator } from "./types";

// The full move vocabulary — every operator and every direction.
export const OPERATORS: Operator[] = [
  "R1",
  "R2",
  "R3",
  "R4",
  "C1",
  "C2",
  "C3",
  "C4",
];
export const DIRECTIONS: Direction[] = ["forward", "back"];

// Each operator's FORWARD shift as a [destinations, sources] pair: for every i,
// the cell at destinations[i] takes the value currently at sources[i]. "back" is
// the inverse — the very same pair applied with the two arrays swapped.
export const SHIFTS: Record<Operator, [number[], number[]]> = {
  R1: [
    [0, 1, 2, 3],
    [3, 0, 1, 2],
  ],
  R2: [
    [4, 5, 6, 7],
    [7, 4, 5, 6],
  ],
  R3: [
    [8, 9, 10, 11],
    [11, 8, 9, 10],
  ],
  R4: [
    [12, 13, 14, 15],
    [15, 12, 13, 14],
  ],
  C1: [
    [0, 4, 8, 12],
    [12, 0, 4, 8],
  ],
  C2: [
    [1, 5, 9, 13],
    [13, 1, 5, 9],
  ],
  C3: [
    [2, 6, 10, 14],
    [14, 2, 6, 10],
  ],
  C4: [
    [3, 7, 11, 15],
    [15, 3, 7, 11],
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
