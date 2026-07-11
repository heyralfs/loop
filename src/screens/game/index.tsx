import styles from "./index.module.css";
import Board, { type BoardHandle } from "../../components/board";
import Control from "../../components/control";
import type { Direction, Matrix, Operator } from "../../game/types";
import { useRef, useState } from "react";
import { move } from "../../game/operators";
import MoveCounter from "../../components/move-counter";
import TargetBoard from "../../components/target-board";
import { createTarget } from "../../game/target";
import { scramble } from "../../game/scramble";
import { createRandom } from "../../game/random";
import { todaySeed } from "../../game/seed";
import { findShortestPath } from "../../game/path";
import { equals } from "../../game/equals";

const random = createRandom(todaySeed());
const target = createTarget(random);
const initial = scramble(target, random);
const par = findShortestPath(initial, target)?.length ?? 0;

function GameScreen() {
  const boardRef = useRef<BoardHandle>(null);
  const animatingRef = useRef(false);

  const [matrix, setMatrix] = useState<Matrix>(initial);
  const [moves, setMoves] = useState<number>(0);

  // Used to highlight the buttons during the "i give up" animation
  const [activeMove, setActiveMove] = useState<{
    operator: Operator;
    direction: Direction;
  } | null>(null);

  const handleMove = async (operator: Operator, direction: Direction) => {
    if (animatingRef.current) return;

    const next = move(matrix, operator, direction);

    animatingRef.current = true;
    await boardRef.current?.animateMove(operator, direction, () => {
      setMatrix(next);
      setMoves((prev) => prev + 1);
    });
    animatingRef.current = false;

    if (equals(next, target)) {
      // Handle the case when the player has solved the puzzle
    }
  };

  const handleGiveUp = async () => {
    if (animatingRef.current) return;

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
  };

  const handleReset = async () => {
    if (animatingRef.current) return;

    animatingRef.current = true;
    await boardRef.current?.animateFlip(() => {
      setMatrix(initial);
    });
    animatingRef.current = false;
    setMoves(0);
  };

  return (
    <main className={styles.wrapper}>
      <h1 className="sr-only">Loop</h1>
      <TargetBoard matrix={target} />
      <MoveCounter moves={moves} par={par} />
      <div className={styles.game}>
        <div className={styles.rowControls}>
          <Control operator="R12" onMove={handleMove} activeMove={activeMove} />
          <Control operator="R34" onMove={handleMove} activeMove={activeMove} />
        </div>
        <div className={styles.board}>
          <Board ref={boardRef} matrix={matrix} label="Your board" />
        </div>
        <div className={styles.colControls}>
          <Control operator="C12" onMove={handleMove} activeMove={activeMove} />
          <Control operator="C34" onMove={handleMove} activeMove={activeMove} />
        </div>
      </div>
      <div>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleGiveUp}>I give up</button>
      </div>
    </main>
  );
}

export default GameScreen;
