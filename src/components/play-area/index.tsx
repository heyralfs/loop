import type { RefObject } from "react";
import type {
  Direction,
  Matrix,
  Operator,
  Orientation,
} from "../../game/types";
import Board, { type BoardHandle } from "../board";
import styles from "./index.module.css";
import MoveCounter from "../move-counter";
import Button from "../button";
import BestAndStreak from "../best-and-streak";
import ControlButton from "../control-button";
import { useTranslations } from "../../i18n";

type ActiveMove = { operator: Operator; direction: Direction } | null;

const ROW_OPERATORS: Operator[] = ["R1", "R2", "R3", "R4"];
const COL_OPERATORS: Operator[] = ["C1", "C2", "C3", "C4"];

interface Props {
  boardRef: RefObject<BoardHandle | null>;
  matrix: Matrix;
  activeMove: ActiveMove;
  moves: number;
  remainingResets: number;
  par: number;
  currentStreak: number;
  bestMoves: number | null;
  handleMove: (operator: Operator, direction: Direction) => Promise<void>;
  handleReset: () => void;
  handleGiveUp: () => void;
}

// One edge of arrows: every line of a given orientation, one direction.
function ControlStrip({
  className,
  operators,
  orientation,
  direction,
  activeMove,
  onMove,
}: {
  className: string;
  operators: Operator[];
  orientation: Orientation;
  direction: Direction;
  activeMove: ActiveMove;
  onMove: (operator: Operator, direction: Direction) => void;
}) {
  const t = useTranslations();

  return (
    <div className={className}>
      {operators.map((operator) => (
        <ControlButton
          key={operator}
          orientation={orientation}
          direction={direction}
          label={t.controlLabel(
            orientation,
            Number(operator.slice(1)),
            direction,
          )}
          onClick={() => onMove(operator, direction)}
          pressed={
            activeMove?.operator === operator &&
            activeMove?.direction === direction
          }
        />
      ))}
    </div>
  );
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
  const t = useTranslations();

  return (
    <>
      <MoveCounter moves={moves} par={par} />

      {currentStreak > 0 && (
        <BestAndStreak best={bestMoves} streak={currentStreak} />
      )}

      <div className={styles.grid}>
        <div className={styles.corner} />
        <ControlStrip
          className={styles.colControls}
          operators={COL_OPERATORS}
          orientation="column"
          direction="back"
          activeMove={activeMove}
          onMove={handleMove}
        />
        <div className={styles.corner} />
        <ControlStrip
          className={styles.rowControls}
          operators={ROW_OPERATORS}
          orientation="row"
          direction="back"
          activeMove={activeMove}
          onMove={handleMove}
        />
        <Board ref={boardRef} matrix={matrix} label={t.yourBoard} />
        <ControlStrip
          className={styles.rowControls}
          operators={ROW_OPERATORS}
          orientation="row"
          direction="forward"
          activeMove={activeMove}
          onMove={handleMove}
        />
        <div className={styles.corner} />
        <ControlStrip
          className={styles.colControls}
          operators={COL_OPERATORS}
          orientation="column"
          direction="forward"
          activeMove={activeMove}
          onMove={handleMove}
        />
        <div className={styles.corner} />
      </div>

      <div className={styles.actions}>
        <Button
          className={styles.actionButton}
          onClick={handleReset}
          variant="OUTLINED"
          disabled={remainingResets <= 0}
        >
          {t.reset(remainingResets)}
        </Button>
        <Button
          className={styles.actionButton}
          onClick={handleGiveUp}
          disabled={bestMoves !== null}
          variant="OUTLINED"
        >
          {t.giveUp}
        </Button>
      </div>
    </>
  );
}

export default PlayArea;
