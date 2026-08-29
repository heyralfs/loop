import { useState } from "react";
import Modal from "../modal";
import Button from "../button";
import { track } from "../../analytics";
import { useTranslations } from "../../i18n";
import styles from "./index.module.css";

const PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX01363f9ddaa7-b25b-488c-aaf9-fb8808a31b705204000053039865802BR5922Ralf Oliveira Ferreira6009SAO PAULO62140510IUWvw7Umfh63043F5E";

const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/heyralfs";

function SupportTheGame() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    track("support-opened", "Opened support modal");
    setOpen(true);
  };

  const handleCopyPix = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      track("support-pix-copied", "Copied PIX code");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the QR code is still there as a fallback.
    }
  };

  return (
    <>
      <span className={styles.prompt}>
        ☕️ {t.support.prompt}{" "}
        <button
          className={styles.trigger}
          onClick={handleOpen}
          aria-label={t.support.heading}
        >
          {t.support.cta}
        </button>
        .
      </span>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t.support.heading}</h2>

          <section className={styles.method}>
            <span className={styles.label}>🇧🇷 {t.support.withPix}</span>
            <img
              className={styles.pixImg}
              src="/pix.png"
              alt={t.support.pixQrAlt}
            />
            <Button
              variant="OUTLINED"
              onClick={handleCopyPix}
              className={styles.copy}
            >
              <span className={copied ? styles.copyLabelHidden : undefined}>
                {t.support.copyPix}
              </span>
              <span
                className={styles.copyFeedback}
                data-show={copied}
                aria-hidden="true"
              >
                {t.support.copied}
              </span>
            </Button>
            <span className={styles.srOnly} aria-live="polite">
              {copied ? t.support.copied : ""}
            </span>
          </section>

          <div className={styles.divider}>{t.support.or}</div>

          <a
            className={styles.coffee}
            href={BUY_ME_A_COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("support-coffee-clicked", "Clicked Buy Me a Coffee")}
          >
            🌎 {t.support.buyMeACoffee}
            <svg
              className={styles.externalIcon}
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 3h7v7" />
              <path d="M10 14 21 3" />
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
            </svg>
          </a>
        </div>
      </Modal>
    </>
  );
}

export default SupportTheGame;
