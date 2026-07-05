import { describe, it, expect } from "vitest";
import { describeBoard } from "./describe";
import type { Matrix } from "./types";

describe("describeBoard", () => {
  it("describes a 4×4 board row by row with filled/empty wording", () => {
    // prettier-ignore
    const board: Matrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
    expect(describeBoard(board)).toBe(
      "4 by 4 grid. " +
        "Row 1: filled, empty, empty, empty. " +
        "Row 2: empty, filled, empty, empty. " +
        "Row 3: empty, empty, filled, empty. " +
        "Row 4: empty, empty, empty, filled.",
    );
  });

  it("derives the grid size from the matrix length", () => {
    const board: Matrix = [1, 0, 0, 1];
    expect(describeBoard(board)).toBe(
      "2 by 2 grid. Row 1: filled, empty. Row 2: empty, filled.",
    );
  });
});
