import type { Ref } from "react";
import styles from "./index.module.css";
import type { Cell } from "../../game/types";

interface Props {
  value: Cell;
  ref?: Ref<HTMLDivElement>;
}

const Tile = ({ value, ref }: Props) => {
  return <div className={styles.tile} data-value={value} ref={ref} />;
};

export default Tile;
