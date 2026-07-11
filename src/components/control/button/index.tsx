import styles from "./index.module.css";
import type { Direction, Orientation } from "../../../game/types";

const ARROW: Record<Orientation, Record<Direction, string>> = {
  row: { back: "◀", forward: "▶" },
  column: { back: "▲", forward: "▼" },
};

interface ButtonProps {
  orientation: Orientation;
  direction: Direction;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}

function Button({
  orientation,
  direction,
  label,
  onClick,
  pressed,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-orientation={orientation}
      data-pressed={pressed}
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{ARROW[orientation][direction]}</span>
    </button>
  );
}

export default Button;
