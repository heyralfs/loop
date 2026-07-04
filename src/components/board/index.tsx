import Tile from "../tile";
import styles from "./index.module.css";
import type { Matrix } from "../../game/types";

interface Props {
  matrix: Matrix;
}

function Board({ matrix }: Props) {
  return (
    <div className={styles.board}>
      {matrix.map((value, index) => (
        <Tile key={index} value={value} />
      ))}
    </div>
  );
}

export default Board;
