import styles from "./index.module.css";
import Board from "../../components/board";
import Control from "../../components/control";
import type { Matrix } from "../../game/types";

// Placeholder board until game state is wired up (flat, row-major).
const PLACEHOLDER: Matrix = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1];

function GameScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rowControls}>
        <Control operator="R12" />
        <Control operator="R34" />
      </div>
      <div className={styles.board}>
        <Board matrix={PLACEHOLDER} />
      </div>
      <div className={styles.colControls}>
        <Control operator="C12" />
        <Control operator="C34" />
      </div>
    </div>
  );
}

export default GameScreen;
