import type { Direction, Matrix, Operator } from "./types";

export function move(
  matrix: Matrix,
  operator: Operator,
  direction: Direction,
): Matrix {
  const next = [...matrix];

  if (operator === "R12") {
    if (direction === "forward") {
      // first row
      next[1] = matrix[0];
      next[2] = matrix[1];
      next[3] = matrix[2];
      next[0] = matrix[3];
      // second row
      next[5] = matrix[4];
      next[6] = matrix[5];
      next[7] = matrix[6];
      next[4] = matrix[7];
    } else {
      // first row
      next[3] = matrix[0];
      next[0] = matrix[1];
      next[1] = matrix[2];
      next[2] = matrix[3];
      // second row
      next[7] = matrix[4];
      next[4] = matrix[5];
      next[5] = matrix[6];
      next[6] = matrix[7];
    }
  } else if (operator === "R34") {
    if (direction === "forward") {
      // third row
      next[9] = matrix[8];
      next[10] = matrix[9];
      next[11] = matrix[10];
      next[8] = matrix[11];
      // fourth row
      next[13] = matrix[12];
      next[14] = matrix[13];
      next[15] = matrix[14];
      next[12] = matrix[15];
    } else {
      // third row
      next[11] = matrix[8];
      next[8] = matrix[9];
      next[9] = matrix[10];
      next[10] = matrix[11];
      // fourth row
      next[15] = matrix[12];
      next[12] = matrix[13];
      next[13] = matrix[14];
      next[14] = matrix[15];
    }
  } else if (operator === "C12") {
    if (direction === "forward") {
      // first column
      next[0] = matrix[4];
      next[4] = matrix[8];
      next[8] = matrix[12];
      next[12] = matrix[0];
      // second column
      next[1] = matrix[5];
      next[5] = matrix[9];
      next[9] = matrix[13];
      next[13] = matrix[1];
    } else {
      // first column
      next[0] = matrix[12];
      next[12] = matrix[8];
      next[8] = matrix[4];
      next[4] = matrix[0];
      // second column
      next[13] = matrix[9];
      next[9] = matrix[5];
      next[5] = matrix[1];
      next[1] = matrix[13];
    }
  } else if (operator === "C34") {
    if (direction === "forward") {
      // third column
      next[2] = matrix[6];
      next[6] = matrix[10];
      next[10] = matrix[14];
      next[14] = matrix[2];
      // fourth column
      next[3] = matrix[7];
      next[7] = matrix[11];
      next[11] = matrix[15];
      next[15] = matrix[3];
    } else {
      // third column
      next[2] = matrix[14];
      next[14] = matrix[10];
      next[10] = matrix[6];
      next[6] = matrix[2];
      // fourth column
      next[3] = matrix[15];
      next[15] = matrix[11];
      next[11] = matrix[7];
      next[7] = matrix[3];
    }
  } else {
    throw new Error(`Unknown operator: ${operator}`);
  }

  return next;
}
