// A single cell of the board.
export type Cell = 0 | 1;

// The board, flattened row-major: index = 4 * row + col (length 16).
export type Matrix = Cell[];

// Operators act on a row or column.
// The digits name the row or column: R{n} = row {n}, C{n} = column {n}.
// The numbers are 1-based, not 0-based.
export type Operator = "R1" | "R2" | "R3" | "R4" | "C1" | "C2" | "C3" | "C4";

// Whether an operator moves rows (left/right) or columns (up/down).
export type Orientation = "row" | "column";

// Both directions are allowed (a shift and its inverse).
export type Direction = "forward" | "back";
