import type { ReactNode } from "react";
import styles from "./index.module.css";
import Menu from "../menu";
import InstallBanner from "../install-banner";
import { useTranslations } from "../../i18n";
import SupportTheGame from "../support-the-game";

interface Props {
  children: ReactNode;
  puzzleNumber: number;
  openGuide: () => void;
  showFooter?: boolean;
}

function Layout({ children, puzzleNumber, openGuide, showFooter }: Props) {
  const t = useTranslations();

  return (
    <>
      <InstallBanner />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1>Loop #{puzzleNumber}</h1>

          <Menu openGuide={openGuide} />
        </header>
        <main>{children}</main>
        {showFooter && (
          <footer className={styles.footer}>
            <span className={styles.madeBy}>
              {t.madeBy}{" "}
              <a
                className={styles.githubLink}
                href="https://github.com/heyralfs"
                target="_blank"
                rel="noopener noreferrer"
              >
                heyralfs
              </a>
            </span>
            <SupportTheGame />
          </footer>
        )}
      </div>
    </>
  );
}

export default Layout;
