import type { RefObject } from "react";
import type { Direction, Matrix, Operator } from "../../game/types";
import Board, { type BoardHandle } from "../board";
import Control from "../control";
import styles from "./index.module.css";
import MoveCounter from "../move-counter";
import Button from "../button";
import Streak from "../best-and-streak";

interface Props {
  boardRef: RefObject<BoardHandle | null>;
  matrix: Matrix;
  activeMove: {
    operator: Operator;
    direction: Direction;
  } | null;
  moves: number;
  remainingResets: number;
  par: number;
  currentStreak: number;
  bestMoves: number | null;
  handleMove: (operator: Operator, direction: Direction) => Promise<void>;
  handleReset: () => void;
  handleGiveUp: () => void;
}

function PlayArea({
  boardRef,
  matrix,
  activeMove,
  moves,
  remainingResets,
  par,
  currentStreak,
  bestMoves,
  handleMove,
  handleReset,
  handleGiveUp,
}: Props) {
  return (
    <>
      <MoveCounter moves={moves} par={par} />

      {currentStreak > 0 && <Streak streak={currentStreak} />}

      <div className={styles.grid}>
        <div className={styles.board}>
          <Board ref={boardRef} matrix={matrix} label="Your board" />
        </div>
        <div className={styles.rowControls}>
          <Control operator="R12" onMove={handleMove} activeMove={activeMove} />
          <Control operator="R34" onMove={handleMove} activeMove={activeMove} />
        </div>
        <div className={styles.colControls}>
          <Control operator="C12" onMove={handleMove} activeMove={activeMove} />
          <Control operator="C34" onMove={handleMove} activeMove={activeMove} />
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          className={styles.actionButton}
          onClick={handleReset}
          variant="OUTLINED"
          disabled={remainingResets <= 0}
        >
          Reset ({remainingResets})
        </Button>
        <Button
          className={styles.actionButton}
          onClick={handleGiveUp}
          disabled={bestMoves !== null}
          variant="OUTLINED"
        >
          I give up
        </Button>
      </div>
    </>
  );
}
export default PlayArea;
