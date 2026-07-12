import { useRef, useState } from "react";
import styles from "./index.module.css";
import Board, { type BoardHandle } from "../../components/board";
import Control from "../../components/control";
import type { Direction, Matrix, Operator } from "../../game/types";
import { move } from "../../game/operators";
import MoveCounter from "../../components/move-counter";
import TargetBoard from "../../components/target-board";
import { createTarget } from "../../game/target";
import { scramble } from "../../game/scramble";
import { createRandom } from "../../game/random";
import { todaySeed } from "../../game/seed";
import { findShortestPath } from "../../game/path";
import { equals } from "../../game/equals";
import { daysBetween } from "../../game/days-between";
import Button from "../../components/button";
import { readProgress, writeProgress } from "../../game/progress";

const seed = todaySeed();
const DAY_ONE = "2026-07-11";
const puzzleNumber = daysBetween(DAY_ONE, seed) + 1;

const random = createRandom(seed);
const target = createTarget(random);
const initial = scramble(target, random);
const par = findShortestPath(initial, target)?.length ?? 0;

const progress = readProgress();

function GameScreen() {
  const boardRef = useRef<BoardHandle>(null);
  const animatingRef = useRef(false);

  // Resume only if the saved progress is for today's puzzle.
  const saved = progress?.seed === seed ? progress : null;

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

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Loop #{puzzleNumber}</h1>
      {bestMoves !== null && (
        <p className={styles.text}>Your best today: {bestMoves}</p>
      )}
      <TargetBoard matrix={target} />
      {gaveUp ? (
        <p className={styles.text}>
          You've given up for today.
          <br />
          Come back tomorrow for a new puzzle.
        </p>
      ) : (
        <MoveCounter moves={moves} par={par} />
      )}
      <div className={styles.game}>
        <div className={styles.rowControls}>
          <Control
            operator="R12"
            onMove={handleMove}
            activeMove={activeMove}
            disabled={gaveUp}
          />
          <Control
            operator="R34"
            onMove={handleMove}
            activeMove={activeMove}
            disabled={gaveUp}
          />
        </div>
        <div className={styles.board}>
          <Board ref={boardRef} matrix={matrix} label="Your board" />
        </div>
        <div className={styles.colControls}>
          <Control
            operator="C12"
            onMove={handleMove}
            activeMove={activeMove}
            disabled={gaveUp}
          />
          <Control
            operator="C34"
            onMove={handleMove}
            activeMove={activeMove}
            disabled={gaveUp}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.actionButton}
          onClick={handleReset}
          disabled={gaveUp}
        >
          Reset
        </Button>
        <Button
          className={styles.actionButton}
          onClick={handleGiveUp}
          disabled={gaveUp}
        >
          I give up
        </Button>
      </div>
    </main>
  );
}

export default GameScreen;
