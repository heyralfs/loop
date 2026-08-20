import { track } from "../../analytics";
import type { Translations } from "../../i18n";

const URL = "https://heyralfs.github.io/loop/";

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
  const outcome =
    moves === par ? t.share.optimal(moves) : t.share.solved(moves, par);
  return [
    `Loop #${puzzleNumber}\n`,
    outcome,
    streak > 0 && t.dayStreak(streak),
    `\n${t.share.cta}`,
    URL,
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
