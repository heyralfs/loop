import type { Matrix } from "./types";

export function equals(matrixA: Matrix, matrixB: Matrix): boolean {
  return matrixA.every((cell, i) => cell === matrixB[i]);
}
