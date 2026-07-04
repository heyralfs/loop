// A single cell of the board.
export type Cell = 0 | 1;

// The board, flattened row-major: index = 4 * row + col (length 16).
export type Matrix = Cell[];

// Operators act on a *pair* of rows or columns.
// The digits name the pair: R12 = rows 1–2, R34 = rows 3–4,
// C12 = cols 1–2, C34 = cols 3–4.
export type Operator = "R12" | "R34" | "C12" | "C34";

// Whether an operator moves rows (left/right) or columns (up/down).
export type Orientation = "row" | "column";

// Both directions are allowed (a shift and its inverse).
export type Direction = "forward" | "back";
