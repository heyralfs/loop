import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

export type Status = "PLAYING" | "SOLVED" | "OPTIMAL" | "GAVE_UP";

interface Props {
  status: Status;
}

function StatusChip({ status }: Props) {
  const t = useTranslations();

  return (
    <span className={styles.chip} data-status={status}>
      {t.status[status]}
    </span>
  );
}

export default StatusChip;
