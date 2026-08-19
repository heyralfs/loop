import type { ReactNode } from "react";
import styles from "./index.module.css";
import Menu from "../menu";
import InstallBanner from "../install-banner";

interface Props {
  children: ReactNode;
  puzzleNumber: number;
  openGuide: () => void;
}

function Layout({ children, puzzleNumber, openGuide }: Props) {
  return (
    <>
      <InstallBanner />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>Loop #{puzzleNumber}</h1>

          <Menu openGuide={openGuide} />
        </header>
        <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;
