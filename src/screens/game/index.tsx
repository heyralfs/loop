import styles from "./index.module.css";
import Board from "../../components/board";
import Control from "../../components/control";
import MoveCounter from "../../components/move-counter";
import TargetBoard from "../../components/target-board";
import Button from "../../components/button";
import { puzzleNumber, target, par } from "./puzzle";
import { useGame } from "./use-game";

function GameScreen() {
  const {
    boardRef,
    matrix,
    moves,
    gaveUp,
    bestMoves,
    activeMove,
    currentStats,
    handleMove,
    handleGiveUp,
    handleReset,
  } = useGame();

  return (
    <main className={styles.wrapper}>
      <h1>Loop #{puzzleNumber}</h1>
      {currentStats.bestStreak > 0 && (
        <p>
          Current streak: {currentStats.currentStreak} / Best streak:{" "}
          {currentStats.bestStreak}
        </p>
      )}
      {bestMoves !== null && <p>Your best today: {bestMoves}</p>}
      <TargetBoard matrix={target} />
      {gaveUp ? (
        <p>
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
          disabled={gaveUp || bestMoves !== null}
        >
          I give up
        </Button>
      </div>
    </main>
  );
}

export default GameScreen;
