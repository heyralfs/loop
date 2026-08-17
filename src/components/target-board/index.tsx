import type { Matrix } from "../../game/types";
import Board from "../board";
import styles from "./index.module.css";
import { translations as t } from "../../i18n";

interface Props {
  matrix: Matrix;
}

function TargetBoard({ matrix }: Props) {
  return (
    <div className={styles.target}>
      <span className={styles.label}>{t.target}</span>
      <Board matrix={matrix} label={t.target} />
    </div>
  );
}

export default TargetBoard;
