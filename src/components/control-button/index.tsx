import Button from "../button";
import styles from "./index.module.css";
import type { Direction, Orientation } from "../../game/types";

const ARROW: Record<Orientation, Record<Direction, string>> = {
  row: { back: "◀", forward: "▶" },
  column: { back: "▲", forward: "▼" },
};

interface Props {
  orientation: Orientation;
  direction: Direction;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}

function ControlButton({
  orientation,
  direction,
  label,
  onClick,
  pressed,
  disabled,
}: Props) {
  return (
    <Button
      className={styles.button}
      data-orientation={orientation}
      aria-label={label}
      onClick={onClick}
      pressed={pressed}
      disabled={disabled}
      variant="TONAL"
    >
      <span aria-hidden="true">{ARROW[orientation][direction]}</span>
    </Button>
  );
}

export default ControlButton;
