import { describe, it, expect } from "vitest";
import { buildShareText, URL } from "./share";
import { en } from "../../i18n/en";
import { pt } from "../../i18n/pt";

describe("buildShareText", () => {
  it("uses the optimal line when moves equal par", () => {
    const text = buildShareText(
      { puzzleNumber: 1, moves: 6, par: 6, streak: 4 },
      en,
    );
    expect(text).toContain("Loop #1");
    expect(text).toContain(en.share.optimal);
    expect(text).not.toContain(en.share.solved(6, 6));
    expect(text).toContain(en.dayStreak(4));

    expect(text).toContain(URL);
  });

  it("uses the solved line with the over-par delta when above par", () => {
    const text = buildShareText(
      { puzzleNumber: 2, moves: 9, par: 6, streak: 3 },
      en,
    );
    expect(text).toContain(en.share.solved(9, 6)); // "…par 6 (+3)"
    expect(text).not.toContain(en.share.optimal);
  });

  it("omits the streak line when the streak is 0", () => {
    const text = buildShareText(
      { puzzleNumber: 3, moves: 8, par: 6, streak: 0 },
      en,
    );
    expect(text).not.toContain("streak");
  });

  it("localizes every part to the active dictionary", () => {
    const text = buildShareText(
      { puzzleNumber: 5, moves: 6, par: 6, streak: 2 },
      pt,
    );
    expect(text).toContain(pt.share.optimal);
    expect(text).toContain(pt.dayStreak(2));
  });
});
