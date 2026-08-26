import { describe, it, expect } from "vitest";
import { resolveSwipe } from "./resolve-swipe";

const THRESHOLD = 20;
const at = (dx: number, dy: number, startRow = 0, startCol = 0) =>
  resolveSwipe({ startRow, startCol, dx, dy }, { threshold: THRESHOLD });

describe("resolveSwipe", () => {
  it("returns null when neither axis clears the threshold", () => {
    expect(at(0, 0)).toBeNull();
    expect(at(19, -19)).toBeNull(); // both just under
  });

  it("resolves a horizontal swipe to the started row", () => {
    expect(at(50, 0, 2, 1)).toEqual({ operator: "R3", direction: "forward" }); // right
    expect(at(-50, 0, 2, 1)).toEqual({ operator: "R3", direction: "back" }); // left
  });

  it("resolves a vertical swipe to the started column", () => {
    expect(at(0, 50, 2, 1)).toEqual({ operator: "C2", direction: "forward" }); // down
    expect(at(0, -50, 2, 1)).toEqual({ operator: "C2", direction: "back" }); // up
  });

  it("locks to the dominant axis on a diagonal swipe", () => {
    // mostly horizontal → row shift, ignores the small vertical drift
    expect(at(60, 15, 3, 0)).toEqual({ operator: "R4", direction: "forward" });
    // mostly vertical → column shift
    expect(at(15, -60, 0, 3)).toEqual({ operator: "C4", direction: "back" });
  });

  it("breaks an exact diagonal tie toward the vertical axis", () => {
    // |dx| === |dy| → isMovingHorizontally is false → column
    expect(at(40, 40, 1, 1)).toEqual({ operator: "C2", direction: "forward" });
  });

  it("counts a swipe once an axis reaches the threshold", () => {
    // exactly at threshold is not "< threshold", so it registers
    expect(at(THRESHOLD, 0, 0, 0)).toEqual({
      operator: "R1",
      direction: "forward",
    });
  });
});
