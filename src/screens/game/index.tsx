import styles from "./index.module.css";
import Board from "../../components/board";
import Control from "../../components/control";
import type { Direction, Matrix, Operator } from "../../game/types";
import { useState } from "react";
import { move } from "../../game/operators";

// Placeholder board until game state is wired up (flat, row-major).
const PLACEHOLDER: Matrix = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

function GameScreen() {
  const [matrix, setMatrix] = useState<Matrix>(PLACEHOLDER);

  const handleMove = (operator: Operator, direction: Direction) => {
    setMatrix((prev) => move(prev, operator, direction));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.rowControls}>
        <Control operator="R12" onMove={handleMove} />
        <Control operator="R34" onMove={handleMove} />
      </div>
      <div className={styles.board}>
        <Board matrix={matrix} />
      </div>
      <div className={styles.colControls}>
        <Control operator="C12" onMove={handleMove} />
        <Control operator="C34" onMove={handleMove} />
      </div>
    </div>
  );
}

export default GameScreen;
