import type { Matrix } from "./types";

const CELL_LABELS = ["empty", "filled", "filled with star"];

// A spoken description of the board for screen readers, e.g.
// "4 by 4 grid. Row 1: filled, empty, filled, empty. Row 2: …".
export function describeBoard(matrix: Matrix): string {
  const size = Math.sqrt(matrix.length);
  const rows: string[] = [];
  for (let row = 0; row < size; row++) {
    const cells: string[] = [];
    for (let col = 0; col < size; col++) {
      cells.push(CELL_LABELS[matrix[row * size + col]]);
    }
    rows.push(`Row ${row + 1}: ${cells.join(", ")}`);
  }
  return `${size} by ${size} grid. ${rows.join(". ")}.`;
}
