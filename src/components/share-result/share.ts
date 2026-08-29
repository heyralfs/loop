import { track } from "../../analytics";
import type { Translations } from "../../i18n";

export const URL = "playloop.today";

interface ShareResultParams {
  puzzleNumber: number;
  moves: number;
  par: number;
  streak: number;
}

export function buildShareText(
  { puzzleNumber, moves, par, streak }: ShareResultParams,
  t: Translations,
): string {
  const result = moves === par ? t.share.optimal : t.share.solved(moves, par);
  return [
    `Loop #${puzzleNumber} • ${URL}`,
    result,
    streak > 0 && t.dayStreak(streak),
  ]
    .filter(Boolean)
    .join("\n");
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
