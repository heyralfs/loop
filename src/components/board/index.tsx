import Tile from "../tile";
import styles from "./index.module.css";
import type { Matrix } from "../../game/types";
import { describeBoard } from "../../game/describe";

interface Props {
  matrix: Matrix;
  label: string;
}

function Board({ matrix, label }: Props) {
  return (
    <div
      className={styles.board}
      role="img"
      aria-label={`${label}. ${describeBoard(matrix)}`}
    >
      {matrix.map((value, index) => (
        <Tile key={index} value={value} />
      ))}
    </div>
  );
}

export default Board;
