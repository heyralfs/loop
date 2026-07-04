import styles from "./index.module.css";
import type { Direction, Operator, Orientation } from "../../game/types";
import Button from "./button";

const DATA_OPERATOR: Record<Operator, Orientation> = {
  R12: "row",
  R34: "row",
  C12: "column",
  C34: "column",
};

const OPERATOR_LABEL: Record<Operator, string> = {
  R12: "rows 1 and 2",
  R34: "rows 3 and 4",
  C12: "columns 1 and 2",
  C34: "columns 3 and 4",
};

const DIRECTION_WORD: Record<Orientation, Record<Direction, string>> = {
  row: { back: "left", forward: "right" },
  column: { back: "up", forward: "down" },
};

interface ControlProps {
  operator: Operator;
}

function Control({ operator }: ControlProps) {
  const orientation = DATA_OPERATOR[operator];
  const label = (direction: Direction) =>
    `Shift ${OPERATOR_LABEL[operator]} ${DIRECTION_WORD[orientation][direction]}`;

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
      />
      <Button
        orientation={orientation}
        direction="forward"
        label={label("forward")}
      />
    </div>
  );
}

export default Control;
