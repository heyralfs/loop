import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "../../i18n";
import styles from "./index.module.css";

interface Props {
  distribution: number[];
}

function Stats({ distribution }: Props) {
  const t = useTranslations();
  const max = Math.max(1, ...distribution); // avoid divide-by-zero on a fresh player

  const label = (bucket: number) => {
    if (bucket === 0) return t.optimal;
    if (bucket === distribution.length - 1) return `+${bucket} ${t.orMore}`;
    return `+${bucket}`;
  };

  return (
    <div className={styles.container}>
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
