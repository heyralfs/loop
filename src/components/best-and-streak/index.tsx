import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

interface Props {
  best?: number | null;
  streak: number;
}

function BestAndStreak({ best, streak }: Props) {
  const t = useTranslations();

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
