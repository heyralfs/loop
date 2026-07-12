import { useRef, useState } from "react";
import type { BoardHandle } from "../../components/board";
import type { Direction, Matrix, Operator } from "../../game/types";
import { move } from "../../game/operators";
import { findShortestPath } from "../../game/path";
import { equals } from "../../game/equals";
import { readProgress, writeProgress } from "../../game/progress";
import { seed, target, initial } from "./puzzle";

// Read once at load — resume only if the saved progress is for today's puzzle.
const progress = readProgress();
const saved = progress?.seed === seed ? progress : null;

export function useGame() {
  const boardRef = useRef<BoardHandle>(null);
  const animatingRef = useRef(false);

  const [matrix, setMatrix] = useState<Matrix>(saved?.matrix ?? initial);
  const [moves, setMoves] = useState<number>(saved?.moves ?? 0);
  const [gaveUp, setGaveUp] = useState<boolean>(saved?.gaveUp ?? false);
  const [bestMoves, setBestMoves] = useState<number | null>(
    saved?.bestMoves ?? null,
  );

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
  }) => {
    setMatrix(update.matrix);
    setMoves(update.moves);
    setGaveUp(update.gaveUp);
    setBestMoves(update.bestMoves);
    writeProgress({ version: 1, seed, ...update });
  };

  const handleMove = async (operator: Operator, direction: Direction) => {
    if (gaveUp || animatingRef.current) return;

    const next = move(matrix, operator, direction);
    const nextMoves = moves + 1;
    const solved = equals(next, target);
    const nextBest = solved
      ? Math.min(bestMoves ?? Infinity, nextMoves)
      : bestMoves;

    animatingRef.current = true;
    await boardRef.current?.animateMove(operator, direction, () => {
      commit({
        matrix: next,
        moves: nextMoves,
        gaveUp: false,
        bestMoves: nextBest,
      });
    });
    animatingRef.current = false;

    if (solved) {
      // handle solved
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
      await boardRef.current?.animateMove(operator, direction, () => {
        setMatrix(next);
      });
      current = next;
    }
    setActiveMove(null);
    animatingRef.current = false;

    commit({ matrix: target, moves, gaveUp: true, bestMoves });
  };

  const handleReset = async () => {
    if (gaveUp || animatingRef.current) return;

    animatingRef.current = true;
    await boardRef.current?.animateFlip(() => {
      commit({ matrix: initial, moves: 0, gaveUp: false, bestMoves });
    });
    animatingRef.current = false;
  };

  return {
    boardRef,
    matrix,
    moves,
    gaveUp,
    bestMoves,
    activeMove,
    handleMove,
    handleGiveUp,
    handleReset,
  };
}
