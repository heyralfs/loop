import styles from "./index.module.css";
import type { Cell } from "../../game/types";

interface Props {
  value: Cell;
}

function Tile({ value }: Props) {
  return <div className={styles.tile} data-value={value} />;
}

export default Tile;
