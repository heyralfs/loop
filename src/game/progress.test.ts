import { describe, it, expect } from "vitest";
import { isValidProgress } from "./progress";

const valid = {
  version: 2,
  seed: "2026-07-11",
  moves: 3,
  matrix: new Array(16).fill(0),
  gaveUp: false,
  bestMoves: null,
  resets: 0,
};

describe("isValidProgress", () => {
  it("accepts a well-formed progress object", () => {
    expect(isValidProgress(valid)).toBe(true);
  });

  it("accepts a numeric bestMoves", () => {
    expect(isValidProgress({ ...valid, bestMoves: 7 })).toBe(true);
  });

  it("rejects non-objects", () => {
    expect(isValidProgress(null)).toBe(false);
    expect(isValidProgress(undefined)).toBe(false);
    expect(isValidProgress("nope")).toBe(false);
    expect(isValidProgress(42)).toBe(false);
  });

  it("rejects an unknown version", () => {
    expect(isValidProgress({ ...valid, version: 1 })).toBe(false);
    expect(isValidProgress({ ...valid, version: undefined })).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(isValidProgress({ ...valid, seed: 123 })).toBe(false);
    expect(isValidProgress({ ...valid, moves: "3" })).toBe(false);
    expect(isValidProgress({ ...valid, gaveUp: "yes" })).toBe(false);
    expect(isValidProgress({ ...valid, bestMoves: "7" })).toBe(false);
    expect(isValidProgress({ ...valid, resets: "0" })).toBe(false);
  });

  it("rejects a malformed matrix", () => {
    expect(isValidProgress({ ...valid, matrix: "nope" })).toBe(false);
    expect(isValidProgress({ ...valid, matrix: new Array(9).fill(0) })).toBe(
      false,
    ); // wrong length
    expect(
      isValidProgress({ ...valid, matrix: [...new Array(15).fill(0), 2] }),
    ).toBe(false); // length 16 but a non-0/1 cell
  });
});
