import { useRef, useState } from "react";
import type { BoardHandle } from "../../components/board";
import type { Direction, Matrix, Operator } from "../../game/types";
import { move } from "../../game/operators";
import { findShortestPath } from "../../game/path";
import { equals } from "../../game/equals";
import { readProgress, writeProgress } from "../../game/progress";
import { seed, target, initial, par } from "./puzzle";
import {
  readStats,
  recordWin,
  recordPlayed,
  writeStats,
  hasActiveStreak,
  type Stats,
} from "../../game/stats";
import { play } from "../../audio/sounds";
import { track } from "../../analytics";

// Read once at load — resume only if the saved progress is for today's puzzle.
const progress = readProgress();
const saved = progress?.seed === seed ? progress : null;

const stats = readStats();
const active = hasActiveStreak(stats, seed);

const MAXIMUM_RESETS = import.meta.env.DEV ? Infinity : 3;

// Activation: fire the "first-move" event at most once per page load,
// so a Reset (which sends moves back to 0) doesn't re-count it.
let firstMoveSent = false;

export function useGame() {
  const boardRef = useRef<BoardHandle>(null);
  const animatingRef = useRef(false);

  const [currentStats, setCurrentStats] = useState<Stats>(
    active ? stats : { ...stats, currentStreak: 0 },
  );

  const [matrix, setMatrix] = useState<Matrix>(saved?.matrix ?? initial);
  const [moves, setMoves] = useState<number>(saved?.moves ?? 0);
  const [resets, setResets] = useState<number>(saved?.resets ?? 0);
  const [gaveUp, setGaveUp] = useState<boolean>(saved?.gaveUp ?? false);
  const [bestMoves, setBestMoves] = useState<number | null>(
    saved?.bestMoves ?? null,
  );

  const solved = equals(matrix, target);

  // Highlights a button during the "I give up" replay.
  const [activeMove, setActiveMove] = useState<{
    operator: Operator;
    direction: Direction;
  } | null>(null);

  // Update state and persist it in lock-step, so storage never drifts.
  const commit = (update: {
    matrix: Matrix;
    moves: number;
    gaveUp: boolean;
    bestMoves: number | null;
    resets: number;
  }) => {
    setMatrix(update.matrix);
    setMoves(update.moves);
    setGaveUp(update.gaveUp);
    setBestMoves(update.bestMoves);
    setResets(update.resets);
    writeProgress({ seed, ...update });
  };

  const handleMove = async (operator: Operator, direction: Direction) => {
    if (gaveUp || animatingRef.current) return;

    const next = move(matrix, operator, direction);
    const nextMoves = moves + 1;
    const solved = equals(next, target);
    const nextBest = solved
      ? Math.min(bestMoves ?? Infinity, nextMoves)
      : bestMoves;

    if (nextMoves === 1 && !firstMoveSent) {
      firstMoveSent = true;
      track("first-move", "Started playing");
      // Count this day as an attempt (once per day, guarded by lastPlayedSeed).
      const played = recordPlayed(currentStats, seed);
      writeStats(played);
      setCurrentStats(played);
    }

    animatingRef.current = true;
    await boardRef.current?.animateMove(operator, direction, () => {
      commit({
        matrix: next,
        moves: nextMoves,
        gaveUp: false,
        bestMoves: nextBest,
        resets,
      });
    });
    animatingRef.current = false;

    if (solved) {
      const winStats = recordWin(currentStats, seed, nextMoves - par);
      writeStats(winStats);
      setCurrentStats(winStats);
      track(nextMoves === par ? "solved-optimal" : "solved", "Puzzle solved");
    }
  };

  const handleGiveUp = async () => {
    if (gaveUp || animatingRef.current) return;

    const path = findShortestPath(matrix, target);
    if (!path) return;

    animatingRef.current = true;
    let current = matrix;
    for (const { operator, direction } of path) {
      const next = move(current, operator, direction);
      setActiveMove({ operator, direction });
      play("click");
      await boardRef.current?.animateMove(operator, direction, () => {
        setMatrix(next);
      });
      current = next;
    }
    setActiveMove(null);
    animatingRef.current = false;

    commit({ matrix: target, moves, gaveUp: true, bestMoves, resets });

    if (bestMoves === null) {
      track("gave-up", "Gave up");
    } else {
      track("gave-up-after-solve", "Gave up after solving");
    }
  };

  const handleReset = async () => {
    if (gaveUp || animatingRef.current || resets >= MAXIMUM_RESETS) return;

    animatingRef.current = true;

    const reset = () =>
      commit({
        matrix: initial,
        moves: 0,
        gaveUp: false,
        bestMoves,
        resets: resets + 1,
      });

    // On the result screen the ref-bearing board is unmounted, so there's
    // nothing to flip — just reset. Mid-play, animate the flip as before.
    if (boardRef.current) {
      await boardRef.current.animateFlip(reset);
    } else {
      reset();
    }

    animatingRef.current = false;
  };

  return {
    currentStats,
    boardRef,
    matrix,
    moves,
    remainingResets: MAXIMUM_RESETS - resets,
    gaveUp,
    bestMoves,
    activeMove,
    solved,
    handleMove,
    handleGiveUp,
    handleReset,
  };
}
