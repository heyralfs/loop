import styles from "./index.module.css";
import { translations as t } from "../../i18n";

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
        <span>{t.bestToday(best)}</span>
      )}
      {streak > 0 && <span>{t.dayStreak(streak)}</span>}
    </span>
  );
}

export default BestAndStreak;
