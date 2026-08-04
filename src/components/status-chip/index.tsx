import styles from "./index.module.css";

export type Status = "PLAYING" | "SOLVED" | "OPTIMAL" | "GAVE_UP";

interface Props {
  status: Status;
}

function StatusChip({ status }: Props) {
  return (
    <span className={styles.chip} data-status={status}>
      {status.replace("_", " ")}
    </span>
  );
}

export default StatusChip;
