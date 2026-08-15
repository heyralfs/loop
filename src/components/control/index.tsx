import styles from "./index.module.css";
import type { Direction, Operator, Orientation } from "../../game/types";
import Button from "./button";

const DATA_OPERATOR: Record<Operator, Orientation> = {
  R1: "row",
  R2: "row",
  R3: "row",
  R4: "row",
  C1: "column",
  C2: "column",
  C3: "column",
  C4: "column",
};

const OPERATOR_LABEL: Record<Operator, string> = {
  R1: "row 1",
  R2: "row 2",
  R3: "row 3",
  R4: "row 4",
  C1: "column 1",
  C2: "column 2",
  C3: "column 3",
  C4: "column 4",
};

const DIRECTION_WORD: Record<Orientation, Record<Direction, string>> = {
  row: { back: "left", forward: "right" },
  column: { back: "up", forward: "down" },
};

interface ControlProps {
  operator: Operator;
  onMove: (operator: Operator, direction: Direction) => void;
  activeMove?: { operator: Operator; direction: Direction } | null;
}

function Control({ operator, onMove, activeMove }: ControlProps) {
  const orientation = DATA_OPERATOR[operator];

  const label = (direction: Direction) =>
    `Shift ${OPERATOR_LABEL[operator]} ${DIRECTION_WORD[orientation][direction]}`;

  const isPressed = (direction: Direction) =>
    activeMove?.operator === operator && activeMove.direction === direction;

  return (
    <div
      className={styles.control}
      data-orientation={orientation}
      role="group"
      aria-label={`${OPERATOR_LABEL[operator]} controls`}
    >
      <Button
        orientation={orientation}
        direction="back"
        label={label("back")}
        onClick={() => onMove(operator, "back")}
        pressed={isPressed("back")}
      />
      <Button
        orientation={orientation}
        direction="forward"
        label={label("forward")}
        onClick={() => onMove(operator, "forward")}
        pressed={isPressed("forward")}
      />
    </div>
  );
}

export default Control;
