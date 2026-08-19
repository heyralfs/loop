import { useEffect, useRef, useState } from "react";
import IconButton from "../icon-button";
import MuteToggle from "../mute-toggle";
import ThemeToggle from "../theme-toggle";
import LanguageSwitcher from "../language-switcher";
import { useTranslations } from "../../i18n";
import styles from "./index.module.css";

interface Props {
  openGuide: () => void;
}

function Menu({ openGuide }: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on Escape or a click/tap outside the menu.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.menu} ref={ref}>
      <IconButton
        label={t.menu}
        pressed={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </IconButton>

      {open && (
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              setOpen(false);
              openGuide();
            }}
          >
            {t.howToPlay.heading}
            <svg
              className={styles.chevron}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>

          <div className={styles.divider} />

          <div className={styles.row}>
            <span>{t.sound}</span>
            <MuteToggle />
          </div>
          <div className={styles.row}>
            <span>{t.theme}</span>
            <ThemeToggle />
          </div>
          <div className={styles.row}>
            <span>{t.language}</span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
