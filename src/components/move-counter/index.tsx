import styles from "./index.module.css";

interface Props {
  moves: number;
}

function MoveCounter({ moves }: Props) {
  return (
    <div className={styles.wrapper} aria-live="polite" aria-atomic="true">
      <span>Moves:</span>
      <span>{moves}</span>
    </div>
  );
}

export default MoveCounter;
