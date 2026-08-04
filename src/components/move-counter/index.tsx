import styles from "./index.module.css";

interface Props {
  moves: number;
  par: number;
}

function MoveCounter({ moves, par }: Props) {
  return (
    <div className={styles.wrapper}>
      <div aria-live="polite" aria-atomic="true">
        <span className={styles.label}>Moves</span>
        <span className={styles.value}>{moves}</span>
      </div>
      <div>
        <span className={styles.label}>Par</span>
        <span className={styles.value}>{par}</span>
      </div>
    </div>
  );
}

export default MoveCounter;
