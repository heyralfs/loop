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

const random = createRandom(todaySeed());
const target = createTarget(random);
const initial = scramble(target, random);
const par = findShortestPath(initial, target)?.length ?? 0;

function GameScreen() {
  const boardRef = useRef<BoardHandle>(null);
  const animatingRef = useRef(false);

  const [matrix, setMatrix] = useState<Matrix>(initial);
  const [moves, setMoves] = useState<number>(0);

  const handleMove = async (operator: Operator, direction: Direction) => {
    if (animatingRef.current) return;

    animatingRef.current = true;
    await boardRef.current?.animateMove(operator, direction);
    animatingRef.current = false;

    setMatrix((prev) => move(prev, operator, direction));
    setMoves((prev) => prev + 1);
  };

  return (
    <main className={styles.wrapper}>
      <h1 className="sr-only">Loop</h1>
      <TargetBoard matrix={target} />
      <MoveCounter moves={moves} par={par} />
      <div className={styles.game}>
        <div className={styles.rowControls}>
          <Control operator="R12" onMove={handleMove} />
          <Control operator="R34" onMove={handleMove} />
        </div>
        <div className={styles.board}>
          <Board ref={boardRef} matrix={matrix} label="Your board" />
        </div>
        <div className={styles.colControls}>
          <Control operator="C12" onMove={handleMove} />
          <Control operator="C34" onMove={handleMove} />
        </div>
      </div>
    </main>
  );
}

export default GameScreen;
