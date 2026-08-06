import { readJSON, writeJSON } from "./storage";
import type { Matrix } from "./types";

const KEY = "loop:progress";

const VERSION = 2; // bump this when the Progress interface changes

export interface Progress {
  version: typeof VERSION;
  seed: string;
  moves: number;
  matrix: Matrix;
  gaveUp: boolean;
  bestMoves: number | null; // fewest moves solved today; null = not solved yet
  resets: number; // number of times the puzzle has been reset
}

export function isValidProgress(obj: unknown): obj is Progress {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const progress = obj as Progress;

  return (
    progress.version === VERSION &&
    typeof progress.seed === "string" &&
    typeof progress.moves === "number" &&
    typeof progress.gaveUp === "boolean" &&
    (progress.bestMoves === null || typeof progress.bestMoves === "number") &&
    typeof progress.resets === "number" &&
    Array.isArray(progress.matrix) &&
    progress.matrix.length === 16 &&
    progress.matrix.every((cell) => cell === 0 || cell === 1)
  );
}

export function readProgress(): Progress | null {
  const progress = readJSON(KEY);
  if (isValidProgress(progress)) {
    return progress;
  }
  return null;
}

export function writeProgress(progress: Progress): void {
  writeJSON(KEY, progress);
}
