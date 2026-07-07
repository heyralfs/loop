import styles from "./index.module.css";

interface Props {
  moves: number;
  par: number;
}

function MoveCounter({ moves, par }: Props) {
  return (
    <div className={styles.wrapper}>
      <div>
        <span>{`Par: ${par}`}</span>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <span>{`Moves: ${moves}`}</span>
      </div>
    </div>
  );
}

export default MoveCounter;
