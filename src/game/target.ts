import type { Matrix } from "./types";

// The solved / target arrangement the player is trying to reach.
//
// Kept as a 4×4 grid so the target is readable/editable by shape.
// prettier-ignore
export const TARGET: Matrix = [
  0, 1, 0, 1,
  1, 0, 1, 0,
  0, 1, 0, 1,
  1, 0, 1, 0,
];
