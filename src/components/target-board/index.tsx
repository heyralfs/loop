import type { Matrix } from "../../game/types";
import Board from "../board";
import styles from "./index.module.css";

interface Props {
  matrix: Matrix;
}

function TargetBoard({ matrix }: Props) {
  return (
    <div className={styles.target}>
      <Board matrix={matrix} label="Target" />
    </div>
  );
}

export default TargetBoard;
