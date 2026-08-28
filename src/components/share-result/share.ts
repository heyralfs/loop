import { track } from "../../analytics";
import type { Matrix } from "../../game/types";
import type { Translations } from "../../i18n";

export const URL = "https://playloop.today/";

interface ShareResultParams {
  puzzleNumber: number;
  moves: number;
  par: number;
  streak: number;
  matrix: Matrix;
}

export function buildShareText(
  { puzzleNumber, moves, par, streak, matrix }: ShareResultParams,
  t: Translations,
): string {
  const outcome =
    moves === par ? t.share.optimal(moves) : t.share.solved(moves, par);
  return [
    `Loop #${puzzleNumber}`,
    matrixToEmoji(matrix, moves === par),
    outcome,
    streak > 0 && t.dayStreak(streak),
    `\n${t.share.cta}`,
    URL,
  ]
    .filter(Boolean)
    .join("\n");
}

function matrixToEmoji(matrix: Matrix, atPar: boolean): string {
  return matrix
    .map((cell, index) => {
      const eol = index % 4 === 3 ? "\n" : "";

      switch (cell) {
        case 0:
          return "⬛" + eol;
        case 1:
          return (atPar ? "🟨" : "🟩") + eol;
        case 2:
          return "⭐️" + eol;
        default:
          return "❓" + eol;
      }
    })
    .join("");
}

export async function shareResult(
  text: string,
): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ text });
      track("shared", "Shared result");
      return "shared";
    } catch (err) {
      // Cancelling the sheet is not a failure — bail, don't fall through to copy.
      if (err instanceof DOMException && err.name === "AbortError") {
        return "shared";
      }
      // any other error: fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    track("shared", "Copied result to clipboard");
    return "copied";
  } catch (err) {
    console.error("Failed to copy result to clipboard", err);
    return "failed";
  }
}
