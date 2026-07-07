import { move, OPERATORS, DIRECTIONS } from "./operators";
import { findShortestPath } from "./path";
import type { Direction, Matrix, Operator } from "./types";

const SCRAMBLE_STEPS = 15;

const MIN_DISTANCE = 4;

export function scramble(initial: Matrix, random: () => number): Matrix {
  let matrix = initial;

  let lastMove: [op: Operator, dir: Direction] | null = null;

  for (let i = 0; i < SCRAMBLE_STEPS; i++) {
    const operatorIdx = Math.floor(random() * OPERATORS.length);
    const directionIdx = Math.floor(random() * DIRECTIONS.length);

    const operator = OPERATORS[operatorIdx];
    const direction = DIRECTIONS[directionIdx];

    if (lastMove && lastMove[0] === operator && lastMove[1] !== direction) {
      // If the last move was the same operator but opposite direction, skip this move
      i--;
      continue;
    }

    lastMove = [operator, direction];

    matrix = move(matrix, operator, direction);
  }

  const distance = findShortestPath(matrix, initial)?.length ?? 0;
  if (distance < MIN_DISTANCE) {
    // Too easy (or back at the solved state): draw again from the same stream.
    return scramble(initial, random);
  }

  return matrix;
}
