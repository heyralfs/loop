import styles from "./index.module.css";
import { translations as t } from "../../i18n";

interface Props {
  moves: number;
  par: number;
}

function MoveCounter({ moves, par }: Props) {
  return (
    <div className={styles.wrapper}>
      <div aria-live="polite" aria-atomic="true">
        <span className={styles.label}>{t.moves}</span>
        <span className={styles.value}>{moves}</span>
      </div>
      <div>
        <span className={styles.label}>{t.par}</span>
        <span className={styles.value}>{par}</span>
      </div>
    </div>
  );
}

export default MoveCounter;
