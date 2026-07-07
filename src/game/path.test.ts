import { describe, it, expect } from "vitest";
import { findShortestPath } from "./path";
import { move } from "./operators";
import type { Matrix, Operator, Direction } from "./types";

type Move = { operator: Operator; direction: Direction };

// Apply a whole path to a board, in order.
const replay = (start: Matrix, path: Move[]): Matrix =>
  path.reduce(
    (board, { operator, direction }) => move(board, operator, direction),
    start,
  );

// An arbitrary balanced board to solve toward.
const TARGET: Matrix = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0];

describe("findShortestPath", () => {
  it("returns an empty path when start already equals target", () => {
    expect(findShortestPath(TARGET, TARGET)).toEqual([]);
  });

  it("finds the single move for a board one step from the target", () => {
    const start = move(TARGET, "R12", "forward");
    const path = findShortestPath(start, TARGET);

    expect(path).not.toBeNull();
    if (!path) return; // narrows for TS; the assertion above already failed if null

    expect(path).toHaveLength(1);
    expect(replay(start, path)).toEqual(TARGET);
  });

  it("round-trips: replaying the found path reaches the target", () => {
    const scrambleMoves: Move[] = [
      { operator: "C34", direction: "back" },
      { operator: "R34", direction: "forward" },
      { operator: "C12", direction: "forward" },
    ];
    const start = replay(TARGET, scrambleMoves);
    expect(start).not.toEqual(TARGET); // sanity: the scramble actually moved it

    const path = findShortestPath(start, TARGET);
    expect(path).not.toBeNull();
    if (!path) return;

    expect(replay(start, path)).toEqual(TARGET); // the round-trip
    expect(path.length).toBeGreaterThan(0);
    expect(path.length).toBeLessThanOrEqual(scrambleMoves.length); // optimal ≤ applied
  });

  it("returns null when the target is unreachable (different cell counts)", () => {
    const allZeros: Matrix = new Array(16).fill(0);
    const oneCell: Matrix = new Array(16).fill(0);
    oneCell[0] = 1;
    expect(findShortestPath(allZeros, oneCell)).toBeNull();
  });
});
