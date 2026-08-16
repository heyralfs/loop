import { move, OPERATORS, DIRECTIONS } from "./operators";
import { findShortestPath } from "./path";
import type { Direction, Matrix, Operator } from "./types";

const SCRAMBLE_STEPS = 20;

const MIN_DISTANCE = 5;

// How many boards to draw while looking for one at least MIN_DISTANCE away.
const MAX_ATTEMPTS = 20;

// Build one scrambled board from SCRAMBLE_STEPS random moves, never immediately
// undoing the previous move.
function scrambleOnce(initial: Matrix, random: () => number): Matrix {
  let matrix = initial;
  let lastMove: [op: Operator, dir: Direction] | null = null;

  for (let i = 0; i < SCRAMBLE_STEPS; i++) {
    const operator = OPERATORS[Math.floor(random() * OPERATORS.length)];
    const direction = DIRECTIONS[Math.floor(random() * DIRECTIONS.length)];

    if (lastMove && lastMove[0] === operator && lastMove[1] !== direction) {
      // Same operator, opposite direction — it would undo the last move. Redraw.
      i--;
      continue;
    }

    lastMove = [operator, direction];
    matrix = move(matrix, operator, direction);
  }

  return matrix;
}

export function scramble(initial: Matrix, random: () => number): Matrix {
  let best = initial;
  let bestDistance = -1;

  // Prefer a board at least MIN_DISTANCE from the target. If none of the
  // attempts clears that bar, fall back to the hardest one drawn — so this
  // always terminates and always returns a valid board.
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const matrix = scrambleOnce(initial, random);
    const distance = findShortestPath(matrix, initial)?.length ?? 0;

    if (distance >= MIN_DISTANCE) {
      return matrix;
    }

    if (distance > bestDistance) {
      best = matrix;
      bestDistance = distance;
    }
  }

  return best;
}
