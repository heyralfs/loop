import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "../../i18n";
import { winCount } from "../../game/stats";
import styles from "./index.module.css";

interface Props {
  distribution: number[];
  played: number;
}

function Stats({ distribution, played }: Props) {
  const t = useTranslations();
  const max = Math.max(1, ...distribution); // avoid divide-by-zero on a fresh player

  const wins = winCount(distribution);
  const dnf = Math.max(0, played - wins);
  const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;

  const label = (bucket: number) => {
    if (bucket === 0) return t.optimal;
    if (bucket === distribution.length - 1) return `+${bucket} ${t.orMore}`;
    return `+${bucket}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{played}</span>
          <span className={styles.statLabel}>{t.played}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{winRate}%</span>
          <span className={styles.statLabel}>{t.winRate}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{dnf}</span>
          <span className={styles.statLabel}>{t.dnf}</span>
        </div>
      </div>

      <span className={styles.title}>{t.winDistribution}</span>
      <div className={styles.stats}>
        {distribution.map((count, bucket) => (
          <Fragment key={bucket}>
            <span className={styles.label}>{label(bucket)}</span>
            <div
              className={styles.bar}
              data-optimal={bucket === 0}
              style={{ width: `${(count / max) * 100}%` }}
            >
              <span className={styles.count}>{count}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Stats;
