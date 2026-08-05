import type { ReactNode } from "react";
import styles from "./index.module.css";
import StatusChip, { type Status } from "../status-chip";

interface Props {
  children: ReactNode;
  puzzleNumber: number;
  status: Status;
}

function Layout({
  children,
  // puzzleNumber,
  status,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        {/* <h1>Loop #{puzzleNumber}</h1> */}
        <h1>
          Loop{" "}
          <span
            style={{
              fontSize: "0.8em",
              fontWeight: "normal",
              fontStyle: "italic",
              color: "var(--ink-soft)",
            }}
          >
            beta
          </span>
        </h1>
        <StatusChip status={status} />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
