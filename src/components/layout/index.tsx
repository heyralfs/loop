import type { ReactNode } from "react";
import styles from "./index.module.css";
import StatusChip, { type Status } from "../status-chip";
import Menu from "../menu";
import InstallBanner from "../install-banner";

interface Props {
  children: ReactNode;
  puzzleNumber: number;
  status: Status;
}

function Layout({ children, puzzleNumber, status }: Props) {
  return (
    <>
      <InstallBanner />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>
            Loop #{puzzleNumber} <span className={styles.beta}>beta</span>
          </h1>

          <div className={styles.actions}>
            <StatusChip status={status} />
            <Menu />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;
