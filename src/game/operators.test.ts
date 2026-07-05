import { describe, it, expect } from "vitest";
import { move, OPERATORS, DIRECTIONS } from "./operators";
import type { Matrix, Operator, Direction } from "./types";

// Identity input: each slot holds its own index, so move()'s output literally
// spells out the permutation it applies. Not a valid binary board (values > 1),
// but move() only reorders values, so it's the clearest way to pin the exact
// index mapping.
const IDENTITY = Array.from(
  { length: 16 },
  (_, index) => index,
) as unknown as Matrix;

const IDENTITY_SHIFTED: Record<Operator, Record<Direction, number[]>> = {
  R12: {
    back: [1, 2, 3, 0, 5, 6, 7, 4, 8, 9, 10, 11, 12, 13, 14, 15],
    forward: [3, 0, 1, 2, 7, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  R34: {
    back: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8, 13, 14, 15, 12],
    forward: [0, 1, 2, 3, 4, 5, 6, 7, 11, 8, 9, 10, 15, 12, 13, 14],
  },
  C12: {
    back: [4, 5, 2, 3, 8, 9, 6, 7, 12, 13, 10, 11, 0, 1, 14, 15],
    forward: [12, 13, 2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15],
  },
  C34: {
    back: [0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13, 2, 3],
    forward: [0, 1, 14, 15, 4, 5, 2, 3, 8, 9, 6, 7, 12, 13, 10, 11],
  },
};

describe("move — exact permutations (characterization)", () => {
  for (const operator of OPERATORS) {
    for (const direction of DIRECTIONS) {
      it(`${operator} ${direction} applies its exact index mapping`, () => {
        expect(move(IDENTITY, operator, direction)).toStrictEqual(
          IDENTITY_SHIFTED[operator][direction],
        );
      });
    }
  }
});

const START: Matrix = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

const countFilled = (board: Matrix) =>
  board.reduce<number>((total, cell) => total + cell, 0);

// a board with a single filled cell at the given index
const filledAt = (index: number): Matrix =>
  Array.from({ length: 16 }, (_, position) => (position === index ? 1 : 0));

describe("move — invariants", () => {
  it("applying any operator+direction 4× returns to the start (order 4)", () => {
    for (const operator of OPERATORS) {
      for (const direction of DIRECTIONS) {
        let board: Matrix = START;
        for (let turn = 0; turn < 4; turn++) {
          board = move(board, operator, direction);
        }
        expect(board).toStrictEqual(START);
      }
    }
  });

  it("forward and back are inverses", () => {
    for (const operator of OPERATORS) {
      expect(
        move(move(START, operator, "forward"), operator, "back"),
      ).toStrictEqual(START);
      expect(
        move(move(START, operator, "back"), operator, "forward"),
      ).toStrictEqual(START);
    }
  });

  it("preserves the number of filled cells", () => {
    for (const operator of OPERATORS) {
      for (const direction of DIRECTIONS) {
        expect(countFilled(move(START, operator, direction))).toBe(
          countFilled(START),
        );
      }
    }
  });

  it("does not mutate its input", () => {
    const before = [...START];
    move(START, "R12", "forward");
    expect(START).toStrictEqual(before);
  });

  it("moves in the direction the arrows point", () => {
    // rows: forward = right, back = left (±1 within the row)
    expect(move(filledAt(0), "R12", "forward").indexOf(1)).toBe(1);
    expect(move(filledAt(1), "R12", "back").indexOf(1)).toBe(0);
    expect(move(filledAt(8), "R34", "forward").indexOf(1)).toBe(9);
    expect(move(filledAt(9), "R34", "back").indexOf(1)).toBe(8);

    // columns: forward = down, back = up (±4 within the column)
    expect(move(filledAt(0), "C12", "forward").indexOf(1)).toBe(4);
    expect(move(filledAt(4), "C12", "back").indexOf(1)).toBe(0);
    expect(move(filledAt(2), "C34", "forward").indexOf(1)).toBe(6);
    expect(move(filledAt(6), "C34", "back").indexOf(1)).toBe(2);
  });
});
