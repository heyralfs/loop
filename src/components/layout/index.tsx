import type { ReactNode } from "react";
import styles from "./index.module.css";
import Menu from "../menu";
import InstallBanner from "../install-banner";
import { useTranslations } from "../../i18n";

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
            {t.madeBy}{" "}
            <a
              href="https://github.com/heyralfs"
              target="_blank"
              rel="noopener noreferrer"
            >
              heyralfs
            </a>
          </footer>
        )}
      </div>
    </>
  );
}

export default Layout;
