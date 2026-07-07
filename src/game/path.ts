import type { Direction, Matrix, Operator } from "./types";
import { OPERATORS, DIRECTIONS, move } from "./operators";

type Move = {
  operator: Operator;
  direction: Direction;
};

type Path = Move[];

type QueueItem = {
  matrix: Matrix;
  matrixKey: string;
};

function generateMatrixKey(matrix: Matrix): string {
  return matrix.join("");
}

export function findShortestPath(start: Matrix, target: Matrix): Path | null {
  const startKey = generateMatrixKey(start);
  const targetKey = generateMatrixKey(target);

  const queue: QueueItem[] = [{ matrix: start, matrixKey: startKey }];
  const visited = new Set<string>();
  const parentMap = new Map<string, { fromKey: string; move: Move }>();

  visited.add(startKey);

  while (queue.length > 0) {
    const node = queue.shift();

    if (!node) continue;

    const { matrix, matrixKey } = node;

    if (matrixKey === targetKey) {
      const path: Path = [];
      let currentKey = matrixKey;

      while (currentKey !== startKey) {
        const parentInfo = parentMap.get(currentKey);

        if (!parentInfo) break;

        path.push(parentInfo.move);
        currentKey = parentInfo.fromKey;
      }

      return path.reverse();
    }

    for (const operator of OPERATORS) {
      for (const direction of DIRECTIONS) {
        const neighbor = move(matrix, operator, direction);
        const neighborKey = generateMatrixKey(neighbor);

        if (visited.has(neighborKey)) {
          continue;
        }

        visited.add(neighborKey);
        parentMap.set(neighborKey, {
          fromKey: matrixKey,
          move: { operator, direction },
        });
        queue.push({
          matrix: neighbor,
          matrixKey: neighborKey,
        });
      }
    }
  }

  return null; // No solution found
}
