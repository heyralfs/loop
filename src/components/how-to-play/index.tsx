import type { ReactNode } from "react";
import Button from "../button";
import Modal from "../modal";
import styles from "./index.module.css";
import { useTranslations } from "../../i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Splits a step body on the {optimal} placeholder and drops in the (gold-styled)
// "Optimal" word from the shared status dictionary, so it stays in sync.
function renderBody(body: string, optimal: string): ReactNode {
  const [before, after] = body.split("{optimal}");
  if (after === undefined) return body;
  return (
    <>
      {before}
      <span>{optimal}</span>
      {after}
    </>
  );
}

function HowToPlay({ open, onClose }: Props) {
  const t = useTranslations();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t.howToPlay.heading}</h2>
        <ol className={styles.list}>
          {t.howToPlay.steps.map((step, i) => (
            <li className={styles.item} key={step.title}>
              <span className={styles.num}>{i + 1}</span>
              <p>
                <b>{step.title}</b> {renderBody(step.body, t.optimal)}
              </p>
            </li>
          ))}
        </ol>
        <Button className={styles.play} onClick={onClose}>
          {t.howToPlay.cta}
        </Button>
      </div>
    </Modal>
  );
}

export default HowToPlay;
