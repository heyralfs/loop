import type { Direction, Matrix, Operator } from "./types";
import { OPERATORS, DIRECTIONS, move } from "./operators";

type Move = {
  operator: Operator;
  direction: Direction;
};

type Path = Move[];

// The BFS runs on packed integers, not arrays: each of the 16 cells (0/1/2)
// takes 2 bits, so a whole board is one 32-bit number.
export function encode(matrix: Matrix): number {
  let packed = 0;
  for (let cell = 0; cell < 16; cell++) {
    packed |= matrix[cell] << (cell * 2);
  }
  return packed;
}

// Precompute each move as a position permutation: newCell[i] = oldCell[perm[i]].
// Derived by running the real `move` on an identity board, so the packed graph
// is identical to the array one.
const IDENTITY: Matrix = Array.from({ length: 16 }, (_, i) => i) as Matrix;
const MOVES: Move[] = [];
const PERMS: number[][] = [];

for (const operator of OPERATORS) {
  for (const direction of DIRECTIONS) {
    MOVES.push({ operator, direction });
    PERMS.push(move(IDENTITY, operator, direction));
  }
}

// Apply a precomputed move-permutation to a packed board, returning the packed
// board after the shift.
function applyMove(board: number, perm: number[]): number {
  let moved = 0;
  for (let cell = 0; cell < 16; cell++) {
    // packed-integer version of newCell[cell] = oldCell[perm[cell]]
    moved |= ((board >>> (perm[cell] * 2)) & 3) << (cell * 2);
  }
  return moved;
}

export function findShortestPath(start: Matrix, target: Matrix): Path | null {
  const startBoard = encode(start);
  const targetBoard = encode(target);
  if (startBoard === targetBoard) return [];

  const queue: number[] = [startBoard];
  const visited = new Set<number>([startBoard]);
  const cameFrom = new Map<number, { from: number; moveIndex: number }>();

  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];

    for (let moveIndex = 0; moveIndex < PERMS.length; moveIndex++) {
      const neighbor = applyMove(current, PERMS[moveIndex]);
      if (visited.has(neighbor)) continue;

      visited.add(neighbor);
      cameFrom.set(neighbor, { from: current, moveIndex });

      if (neighbor === targetBoard) {
        const path: Path = [];
        let board = neighbor;
        while (board !== startBoard) {
          const step = cameFrom.get(board);
          if (!step) break;
          path.push(MOVES[step.moveIndex]);
          board = step.from;
        }
        return path.reverse();
      }

      queue.push(neighbor);
    }
  }

  return null; // No solution found
}

// One BFS from `source` giving the shortest-move distance (in moves) to every
// reachable board, keyed by its packed encoding.
export function distancesFrom(source: Matrix): Map<number, number> {
  const startBoard = encode(source);
  const distances = new Map<number, number>([[startBoard, 0]]);
  const queue: number[] = [startBoard];
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    const neighborDistance = distances.get(current)! + 1;

    for (let moveIndex = 0; moveIndex < PERMS.length; moveIndex++) {
      const neighbor = applyMove(current, PERMS[moveIndex]);
      if (!distances.has(neighbor)) {
        distances.set(neighbor, neighborDistance);
        queue.push(neighbor);
      }
    }
  }

  return distances;
}
