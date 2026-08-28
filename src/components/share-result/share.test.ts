import { describe, it, expect } from "vitest";
import { buildShareText, URL } from "./share";
import { en } from "../../i18n/en";
import { pt } from "../../i18n/pt";
import type { Matrix } from "../../game/types";

// 8 empty, 7 ones, 1 two — exercises every emoji in the grid.
// prettier-ignore
const MATRIX: Matrix = [
  0, 1, 0, 1,
  1, 0, 2, 0,
  0, 1, 0, 1,
  1, 0, 1, 0,
];

describe("buildShareText", () => {
  it("uses the optimal line when moves equal par", () => {
    const text = buildShareText(
      { puzzleNumber: 1, moves: 6, par: 6, streak: 4, matrix: MATRIX },
      en,
    );
    expect(text).toContain("Loop #1");
    expect(text).toContain(en.share.optimal(6));
    expect(text).not.toContain(en.share.solved(6, 6));
    expect(text).toContain(en.dayStreak(4));
    expect(text).toContain(en.share.cta);
    expect(text).toContain(URL);
  });

  it("uses the solved line with the over-par delta when above par", () => {
    const text = buildShareText(
      { puzzleNumber: 2, moves: 9, par: 6, streak: 3, matrix: MATRIX },
      en,
    );
    expect(text).toContain(en.share.solved(9, 6)); // "…par 6 (+3)"
    expect(text).not.toContain(en.share.optimal(9));
  });

  it("omits the streak line when the streak is 0", () => {
    const text = buildShareText(
      { puzzleNumber: 3, moves: 8, par: 6, streak: 0, matrix: MATRIX },
      en,
    );
    expect(text).not.toContain("streak");
  });

  it("localizes every part to the active dictionary", () => {
    const text = buildShareText(
      { puzzleNumber: 5, moves: 6, par: 6, streak: 2, matrix: MATRIX },
      pt,
    );
    expect(text).toContain(pt.share.optimal(6));
    expect(text).toContain(pt.dayStreak(2));
    expect(text).toContain(pt.share.cta);
    expect(text).not.toContain(en.share.cta);
  });

  it("renders an emoji grid: gold filled + star for a 2 when optimal", () => {
    const text = buildShareText(
      { puzzleNumber: 1, moves: 6, par: 6, streak: 0, matrix: MATRIX },
      en,
    );
    expect(text).toContain("⬛"); // empty
    expect(text).toContain("🟨"); // filled, coloured gold on an optimal solve
    expect(text).toContain("⭐"); // the 2
    expect(text).not.toContain("🟩"); // not the over-par green
  });

  it("renders filled cells green when the solve is over par", () => {
    const text = buildShareText(
      { puzzleNumber: 1, moves: 9, par: 6, streak: 0, matrix: MATRIX },
      en,
    );
    expect(text).toContain("🟩"); // filled, green
    expect(text).not.toContain("🟨"); // gold only when optimal
  });
});
