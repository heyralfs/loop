import styles from "./index.module.css";

interface Props {
  best?: number | null;
  streak: number;
}

function BestAndStreak({ best, streak }: Props) {
  if (streak <= 0 && !best) {
    return null;
  }

  return (
    <span className={styles.streak}>
      {typeof best === "number" && best > 0 && (
        <span>
          Best today <strong>{best}</strong>
        </span>
      )}
      {streak > 0 && (
        <span>
          🔥 <strong>{streak}</strong>-day streak
        </span>
      )}
    </span>
  );
}

export default BestAndStreak;
