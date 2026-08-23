import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

interface Props {
  best?: number | null;
  streak: number;
  bestStreak?: number;
}

function BestAndStreak({ best, streak, bestStreak }: Props) {
  const t = useTranslations();

  if (streak <= 0 && !best && !bestStreak) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.streak}>
        {typeof best === "number" && best > 0 && (
          <span>{t.bestToday(best)}</span>
        )}
        {streak > 0 && <span>{t.dayStreak(streak)}</span>}
      </span>
      {bestStreak && <span>{t.bestStreak(bestStreak)}</span>}
    </div>
  );
}

export default BestAndStreak;
