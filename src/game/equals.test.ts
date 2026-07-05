import { describe, it, expect } from "vitest";
import { equals } from "./equals";
import type { Matrix } from "./types";

describe("equals", () => {
  it("returns true when every cell matches", () => {
    const a: Matrix = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0];
    const b: Matrix = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0];
    expect(equals(a, b)).toBe(true);
  });

  it("returns false when any single cell differs", () => {
    const a: Matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const b: Matrix = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(equals(a, b)).toBe(false);
  });
});
