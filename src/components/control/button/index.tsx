import styles from "./index.module.css";
import type { Direction, Orientation } from "../../../game/types";

// Geometric arrows (not emoji) so they respect `color` — rows point
// left/right, columns up/down.
const ARROW: Record<Orientation, Record<Direction, string>> = {
  row: { back: "◀", forward: "▶" },
  column: { back: "▼", forward: "▲" },
};

interface ButtonProps {
  orientation: Orientation;
  direction: Direction;
  label: string;
  onClick: () => void;
}

function Button({ orientation, direction, label, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-orientation={orientation}
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{ARROW[orientation][direction]}</span>
    </button>
  );
}

export default Button;
