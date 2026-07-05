import { equals } from "./equals";
import { move, OPERATORS, DIRECTIONS } from "./operators";
import type { Direction, Matrix, Operator } from "./types";

const SCRAMBLE_STEPS = 15;

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

  if (equals(matrix, initial)) {
    // If the scrambled matrix is the same as the initial matrix, scramble again
    return scramble(initial, random);
  }

  return matrix;
}
