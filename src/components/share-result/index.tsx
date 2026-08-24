import Button, { type ButtonVariant } from "../button";
import { buildShareText, shareResult } from "./share";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useTranslations } from "../../i18n";
import type { Matrix } from "../../game/types";

interface Props {
  moves: number;
  par: number;
  puzzleNumber: number;
  streak: number;
  variant?: ButtonVariant;
  matrix: Matrix;
}

function ShareResult({
  moves,
  par,
  puzzleNumber,
  streak,
  variant,
  matrix,
}: Props) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (copied) return;
    const text = buildShareText(
      { moves, par, puzzleNumber, streak, matrix },
      t,
    );
    const result = await shareResult(text);
    if (result === "copied") {
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <>
      <Button variant={variant} className={styles.share} onClick={handleClick}>
        <span className={copied ? styles.hidden : undefined}>
          {t.share.button}
        </span>
        <span className={styles.copied} aria-hidden="true" data-show={copied}>
          {t.share.copied}
        </span>
      </Button>
      {copied && (
        <span className={styles.srOnly} aria-live="polite">
          {t.share.copied}
        </span>
      )}
    </>
  );
}

export default ShareResult;
